import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './dataSource';
import { ConfigEditor, QueryEditor } from './components';
import { MyQuery, BasicDataSourceOptions } from './types';
import { GraphQLAnnotationsQueryCtrl } from './GraphQLAnnotationsQueryCtrl';
import { VariableQueryEditor } from './VariableQueryEditor';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, BasicDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setAnnotationQueryCtrl(GraphQLAnnotationsQueryCtrl)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);
  
