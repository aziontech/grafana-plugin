import type { QueryEditorProps } from '@grafana/data';
import type { DataSource } from '../../dataSource';
import type { BasicDataSourceOptions, MyQuery } from '../../types';

export type EditorProps = QueryEditorProps<DataSource, MyQuery, BasicDataSourceOptions>;


