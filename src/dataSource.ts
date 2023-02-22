import defaults from 'lodash/defaults';

import {
  AnnotationEvent,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  MetricFindValue,
  DataSourceInstanceSettings,
  ScopedVars,
  TimeRange,
  dateTime,
  MutableDataFrame,
  FieldType,
  DataFrame,
} from '@grafana/data';

import {
  MyQuery,
  BasicDataSourceOptions,
  defaultQuery,
  MyVariableQuery,
  MultiValueVariable,
  DataSourceVariable,
  AnnotationQueryProps,
} from './types';
import { getTemplateSrv, getBackendSrv } from '@grafana/runtime';

import _ from 'lodash';
import {
  flatten,
  isRFC3339_ISO6801,
} from './util';

export class DataSource extends DataSourceApi<MyQuery, BasicDataSourceOptions> {
  url: string | undefined;

  constructor(instanceSettings: DataSourceInstanceSettings<BasicDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  private request(data: string) {
    const options: any = {
      url: this.url,
      method: 'POST',
      data: {
        query: data,
      },
    };
    return getBackendSrv().datasourceRequest(options);
  }

  private postQuery(query: Partial<MyQuery>, payload: string) {
    return this.request(payload)
      .then((results: any) => {
        return { query, results };
      })
      .catch((err: any) => {
        if (err.data && err.data.error) {
          throw {
            message: 'GraphQL error: ' + err.data.message,
            error: err.data.error,
            statusText: err.statusText,
            status: err.status,
          };
        }

        throw err;
      });
  }

  private createQuery(query: MyQuery, range: TimeRange | undefined, scopedVars: ScopedVars | undefined = undefined) {
    let payload = getTemplateSrv().replace(query.queryText, {
      ...scopedVars,
      timeFrom: { text: 'from', value: range?.from.valueOf() },
      timeTo: { text: 'to', value: range?.to.valueOf() },
    });

    return this.postQuery(query, payload);
  }

  private formatFieldTitle(
    aliasBy: string, 
    generalReplaceObject: {}, 
    fieldName: string, 
    options: DataQueryRequest<MyQuery>
  ): string {
    let title: string = aliasBy;
    const replaceObject: any = { ...generalReplaceObject };
    replaceObject['fieldName'] = fieldName;

    for (const replaceKey in replaceObject) {
      const replaceValue: string = replaceObject[replaceKey];
      const regex = new RegExp('\\$' + replaceKey, 'g');
      title = title.replace(regex, replaceValue);
    }

    return getTemplateSrv().replace(title, options.scopedVars);
  }

  private setFieldType(fieldName: string, timePath: string, doc: any): FieldType {
    if (fieldName === timePath || isRFC3339_ISO6801(String(doc[fieldName]))) {
      return FieldType.time;
    }
    
    if (_.isNumber(doc[fieldName])) {
      return FieldType.number;
    }

    return FieldType.string;
  }

  private formatGroupByList(groupBy: string): string[] {
    const splitGrouping: string[] = groupBy.split(',');

    return splitGrouping.filter((grouping) => grouping.trim());
  } 

  private formatIdentifiers(formattedGroupBy: string[], doc: any): string[] {
    return formattedGroupBy.map((groupByElement) => doc[groupByElement]);
  }

  private setValuesToGeneralReplacementObject(doc: any): {} {
    const generalReplaceObject: any = {};

    for (const fieldName in doc) {
      generalReplaceObject['field_' + fieldName] = doc[fieldName];
    }

    return generalReplaceObject;
  }

  private setFieldTitle(
    formattedIdentifiers: string[],
    identifiersString: string, 
    fieldName: string, 
    aliasBy: string,
    generalReplaceObject: {},
    options: DataQueryRequest<MyQuery>
    ): string {
    let title: string;

    if (formattedIdentifiers.length) {
      title = identifiersString + '_' + fieldName;
    } else {
      title = fieldName;
    }

    if (aliasBy) {
      title = this.formatFieldTitle(aliasBy, generalReplaceObject, fieldName, options);
    }

    return title;
  }

  private addFieldsToMutableDataFrame(
    doc: any,
    timePath: string,
    formattedIdentifiers: string[],
    identifiersString: string, 
    aliasBy: string,
    options: DataQueryRequest<MyQuery>
    ): MutableDataFrame {
    const mutableDataFrame = new MutableDataFrame({ fields: [] });
    const generalReplaceObject = this.setValuesToGeneralReplacementObject(doc);

    for (const fieldName in doc) {
      const fieldType: FieldType = this.setFieldType(fieldName, timePath, doc);
      const fieldTitle: string = this.setFieldTitle(
        formattedIdentifiers, 
        identifiersString, 
        fieldName, 
        aliasBy, 
        generalReplaceObject, 
        options
      );
     
      mutableDataFrame.addField({
        name: fieldName,
        type: fieldType,
        config: { displayName: fieldTitle },
      });
    }

    return mutableDataFrame;
  }

  private addDataFramesToDataFrameMapValues(
    dataFrameMap: Map<string, MutableDataFrame<any>>,
    dataFrameArray: DataFrame[]
  ): void {
    for (const dataFrame of dataFrameMap.values()) {
      dataFrameArray.push(dataFrame);
    }
  }

  private addDocToDataFrame(
    docs: any[], 
    dataFrameMap: Map<string, MutableDataFrame<any>>, 
    timePath: string, 
    timeFormat: string,
    formattedGroupBy: string[],
    aliasBy: string,
    options: DataQueryRequest<MyQuery>
  ): void {
    for (const doc of docs) {
      if (timePath in doc) {
        doc[timePath] = dateTime(doc[timePath], timeFormat);
      }

      const formattedIdentifiers = this.formatIdentifiers(formattedGroupBy, doc);
      const identifiersString = formattedIdentifiers.toString();

      let dataFrame = dataFrameMap.get(identifiersString);

      if (!dataFrame) {
        // we haven't initialized the dataFrame for this specific identifier that we group by yet
        dataFrame = this.addFieldsToMutableDataFrame(
          doc, timePath, formattedIdentifiers, identifiersString, aliasBy, options
        );
        
        dataFrameMap.set(identifiersString, dataFrame);
      }

      dataFrame.add(doc);
    }
  }

  private getPopulatedDataFrameArray(results: any, options: any): DataFrame[] {
    const dataFrameArray: DataFrame[] = [];

    for (let res of results) {
      const dataPathArray: string[] = DataSource.getDataPathArray(res.query.dataPath);
      const { timePath, timeFormat, groupBy, aliasBy } = res.query;
      
      const formattedGroupBy = this.formatGroupByList(groupBy);
      
      for (const dataPath of dataPathArray) {
        const docs: any[] = DataSource.getDocs(res.results.data, dataPath);

        const dataFrameMap = new Map<string, MutableDataFrame>();

        this.addDocToDataFrame(
          docs, 
          dataFrameMap, 
          timePath, 
          timeFormat, 
          formattedGroupBy, 
          aliasBy, 
          options
        );

        this.addDataFramesToDataFrameMapValues(dataFrameMap, dataFrameArray);
      }
    }

    return dataFrameArray;
  }

  private static getDataPathArray(dataPathString: string): string[] {
    const dataPathArray: string[] = [];
    for (const dataPath of dataPathString.split(',')) {
      const trimmed = dataPath.trim();
      if (trimmed) {
        dataPathArray.push(trimmed);
      }
    }
    if (!dataPathArray) {
      throw new Error('data path is empty!');
    }
    return dataPathArray;
  }

  private static getDocs(resultsData: any, dataPath: string): any[] {
    if (!resultsData) {
      throw new Error('resultsData was null or undefined');
    }
    let data = dataPath.split('.').reduce((d: any, p: any) => {
      if (!d) {
        return null;
      }
      return d[p];
    }, resultsData.data);
    if (!data) {
      const errors: any[] = resultsData.errors;
      if (errors && errors.length !== 0) {
        throw errors[0];
      }
      throw new Error('Your data path did not exist! dataPath: ' + dataPath);
    }
    if (resultsData.errors) {
      // There can still be errors even if there is data
      console.error('Got GraphQL errors:');
      console.error(resultsData.errors);
    }
    const docs: any[] = [];
    let pushDoc = (originalDoc: object) => {
      docs.push(flatten(originalDoc));
    };
    if (Array.isArray(data)) {
      for (const element of data) {
        pushDoc(element);
      }
    } else {
      pushDoc(data);
    }
    return docs;
  }

  private getPopulatedMetricFindValuesArray(docs: any[]): MetricFindValue[] {
    const metricFindValues: MetricFindValue[] = [];

    for (const doc of docs) {
      if ('__text' in doc && '__value' in doc) {
        metricFindValues.push({ text: doc['__text'], value: doc['__value'] });
      } else {
        for (const fieldName in doc) {
          metricFindValues.push({ text: doc[fieldName] });
        }
      }
    }

    return metricFindValues;
  }

  private hasSupportedVariableType(variableType: string): boolean {
    const supportedVariableTypes: string[] = ['constant', 'custom', 'query', 'textbox'];
    const hasSupportedType: boolean = supportedVariableTypes.includes(variableType);
    
    if (!hasSupportedType) {
      console.warn(`Variable of type "${variableType}" is not supported`);
    }

    return hasSupportedType;
  }

  private formatDataSourceVariableValue(supportedVariable: MultiValueVariable): any {
    let variableValue: any = supportedVariable.current.value;

    if (variableValue === '$__all' || _.isEqual(variableValue, ['$__all'])) {
      if (!!supportedVariable.allValue) {
        variableValue = supportedVariable.options.slice(1).map((textValuePair) => textValuePair.value);
      } else {
        variableValue = supportedVariable.allValue;
      }
    }

    return variableValue;
  }

  private formatAnnotationQueryProps(query: any, doc: any): AnnotationQueryProps {
    let title = query.annotationTitle;
    let text = query.annotationText;
    let tags = query.annotationTags;

    for (const fieldName in doc) {  
      const fieldValue = doc[fieldName];
      const replaceKey = 'field_' + fieldName;
      const regex = new RegExp('\\$' + replaceKey, 'g');
      title = title.replace(regex, fieldValue);
      text = text.replace(regex, fieldValue);
      tags = tags.replace(regex, fieldValue);
    }

    return {
      title,
      text,
      tags
    };
  }

  private formatAnnotationTags(tags: string): string[] {
    const splitTags: string[] = tags.split(',');

    return splitTags.filter((tag) => tag.trim());
  } 

  private populateAnnotationEventList(
    docs: any[],
    result: any,
    query: any,
    annotationEventList: AnnotationEvent[]
    ): void {
    const { timePath, endTimePath, timeFormat } = result.query;

    for (const doc of docs) {
      const annotation: AnnotationEvent = {};
      if (timePath in doc) {
        annotation.time = dateTime(doc[timePath], timeFormat).valueOf();
      }
      if (endTimePath in doc) {
        annotation.isRegion = true;
        annotation.timeEnd = dateTime(doc[endTimePath], timeFormat).valueOf();
      }

      const {title, text, tags } = this.formatAnnotationQueryProps(query, doc);

      annotation.title = title;
      annotation.text = text;
      annotation.tags = this.formatAnnotationTags(tags);

      annotationEventList.push(annotation);
    }
  }

  private getPopulatedAnnotationEventList(query: any, results: any): AnnotationEvent[] {
    const annotationEventList: AnnotationEvent[] = [];

    for (const result of results) {
      const { data } = result.results
      const { dataPath: dataPathFromQuery } = result.query;
      const dataPathArray: string[] = DataSource.getDataPathArray(dataPathFromQuery);
      
      for (const dataPath of dataPathArray) {
        const docs: any[] = DataSource.getDocs(data, dataPath);
        this.populateAnnotationEventList(docs, result, query, annotationEventList)
      }
    }

    return annotationEventList;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    return Promise.all(
      options.targets.map((target) => {
        return this.createQuery(defaults(target, defaultQuery), options.range, options.scopedVars);
      })
    ).then((results: any) => {
      const dataFrameArray: DataFrame[] = this.getPopulatedDataFrameArray(results, options);
      return { data: dataFrameArray };
    });
  }

  testDatasource() {
    const q = `{
      __schema{
        queryType{name}
      }
    }`;
    return this.postQuery(defaultQuery, q).then(
      (res: any) => {
        if (res.errors) {
          return {
            status: 'error',
            message: 'GraphQL Error: ' + res.errors[0].message,
          };
        }
        return {
          status: 'success',
          message: 'Success',
        };
      },
      (err: any) => {
        return {
          status: 'error',
          message: 'HTTP Response ' + err.status + ': ' + err.statusText,
        };
      }
    );
  }

  async metricFindQuery(query: MyVariableQuery): Promise<MetricFindValue[]> {
    query = defaults(query, defaultQuery);

    let payload = query.queryText;
    payload = getTemplateSrv().replace(payload, { ...this.getVariables });

    const response = await this.postQuery(query, payload);

    const docs: any[] = DataSource.getDocs(response.results.data, query.dataPath);

    return this.getPopulatedMetricFindValuesArray(docs);
  }

  async annotationQuery(options: any): Promise<AnnotationEvent[]> {
    const query = defaults(options.annotation, defaultQuery);
    return Promise.all([this.createQuery(query, options.range)]).then((results: any) => {
      return this.getPopulatedAnnotationEventList(query, results);
    });
  }

  getVariables(): DataSourceVariable {
    const variables: DataSourceVariable = {};
    
    Object.values(getTemplateSrv().getVariables()).forEach((variable) => {
      if (!this.hasSupportedVariableType(variable.type)) { return; }

      const supportedVariable = variable as MultiValueVariable;
      const formattedVariableValue = this.formatDataSourceVariableValue(supportedVariable);

      variables[supportedVariable.id] = {
        text: supportedVariable.current.text,
        value: formattedVariableValue,
      };
    });

    return variables;
  }
}
  





