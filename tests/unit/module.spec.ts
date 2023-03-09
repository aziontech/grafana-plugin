import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor, QueryEditor } from '../../src/components';
import { GraphQLAnnotationsQueryCtrl } from '../../src/GraphQLAnnotationsQueryCtrl';
import { VariableQueryEditor } from '../../src/VariableQueryEditor';
import { MyQuery, BasicDataSourceOptions } from '../../src/types';
import { DataSource } from '../../src/dataSource';

describe('plugin', () => {
  it('should instantiate a DataSourcePlugin with the correct components', () => {
    const plugin = new DataSourcePlugin<DataSource, MyQuery, BasicDataSourceOptions>(DataSource)
      .setConfigEditor(ConfigEditor)
      .setAnnotationQueryCtrl(GraphQLAnnotationsQueryCtrl)
      .setQueryEditor(QueryEditor)
      .setVariableQueryEditor(VariableQueryEditor);

    expect(plugin.components.ConfigEditor).toBe(ConfigEditor);
    expect(plugin.components.QueryEditor).toBe(QueryEditor);
    expect(plugin.components.VariableQueryEditor).toBe(VariableQueryEditor);
  });
});
