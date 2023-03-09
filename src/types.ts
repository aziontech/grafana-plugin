import { DataQuery, SelectableValue, VariableModel } from '@grafana/data';
import { SelectValue } from '@grafana/ui';

export type QueryDataSources = 'metrics' | 'events';

export interface SelectDataSource {
  dataSource: SelectValue<String>;
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
  queryText: `query {
      data:submissions(user:"$user"){
          Time:submitTime
          idle running completed
      }
  }`,
  dataSource: 'metrics',
  dataPath: 'data',
  optionsDataSource: [
    { value: 'metrics', label: 'Metrics' },
    { value: 'events', label: 'Events' },
  ],
  timePath: 'Time',
  endTimePath: 'endTime',
  timeFormat: '',
  groupBy: '', // `identifier`
  aliasBy: '', // 'Server [[tag_identifier]]`
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
