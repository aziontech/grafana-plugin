import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import type { BasicDataSourceOptions, BasicSecureJsonData } from '../../types';

export const defaultEditor: Partial<BasicDataSourceOptions> = {
    httpHeaderName1: 'Authorization'
  };

export type EditorProps = DataSourcePluginOptionsEditorProps<BasicDataSourceOptions, BasicSecureJsonData>;
