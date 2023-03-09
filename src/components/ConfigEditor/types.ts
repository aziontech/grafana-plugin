import { DataSourcePluginOptionsEditorProps, DataSourceJsonData  } from '@grafana/data';
import type { BasicSecureJsonData } from '../../types';

export type EditorProps = DataSourcePluginOptionsEditorProps<DataSourceJsonData, BasicSecureJsonData>;
