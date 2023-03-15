import { DataQuery, SelectableValue, VariableModel } from '@grafana/data';

export type QueryDataSources = 'metrics' | 'events';

export interface SelectDataSource {  
  dataSourceSelect: SelectableValue<QueryDataSources>;
  optionsDataSource: Array<SelectableValue<QueryDataSources>>;
}

export interface MyQuery extends DataQuery, SelectDataSource {
  queryText: string;
  dataPath: string;
  timePath: string;
  endTimePath: string | null;
  timeFormat: string | null;
  groupBy: string;
  aliasBy: string;
  annotationTitle: string;
  annotationText: string;
  annotationTags: string;
}

export const defaultQuery: Partial<MyQuery> = {
  queryText: `query MetricsQuery {
    httpMetrics(
      limit: 1,
      filter: {
        tsRange: {begin:"2022-04-27T10:10:10", end:"2022-11-07T21:10:10"}
      },
      aggregate: {sum: bytesSent}
      groupBy: [ts]
      orderBy: [ts_ASC, sum_DESC]
      )
    {
      ts
      sum
    }
  }`,
  dataSourceSelect: { value: 'metrics', label: 'Metrics' },
  dataPath: 'httpMetrics',
  optionsDataSource: [
    { value: 'metrics', label: 'Metrics' },
    { value: 'events', label: 'Events' },
  ],
  timePath: 'Time',
  endTimePath: 'endTime',
  timeFormat: '',
  groupBy: '',
  aliasBy: '',
  annotationTitle: '',
  annotationText: '',
  annotationTags: '',
};

export interface BasicSecureJsonData {
  token?: string;
}

export interface MyVariableQuery extends DataQuery {
  dataPath: string;
  queryText: string;
}

interface TextValuePair {
  text: string;
  value: any;
}

export interface MultiValueVariable extends VariableModel {
  allValue: string | null;
  id: string;
  current: TextValuePair;
  options: TextValuePair[];
}

export interface DataSourceVariable {
  [id: string]: TextValuePair
}

export interface AnnotationQueryProps {
  title: string;
  text: string;
  tags: string;
}
