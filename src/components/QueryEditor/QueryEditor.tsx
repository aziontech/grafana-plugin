import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import { LegacyForms, QueryField, Icon, InlineLabel } from '@grafana/ui';
import { defaultQuery, QueryDataSources } from '../../types';
import type { EditorProps } from './types';
import { SelectableValue } from '@grafana/data';

interface State { }
export class QueryEditor extends PureComponent<EditorProps, State> {
  onComponentDidMount() { }

  onChangeQuery = (value: string, override?: boolean) => {
    const { onChange, query } = this.props;
    if (onChange) {
      onChange({ ...query, queryText: value });
    }
  };

  onDataPathTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, dataPath: event.target.value });
  };

  onTimePathTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, timePath: event.target.value });
  };

  onTimeFormatTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, timeFormat: event.target.value });
  };

  onGroupByTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, groupBy: event.target.value });
  };

  onAliasByTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, aliasBy: event.target.value });
  };

  onSourceSelector = (dataSourceSelect: SelectableValue<QueryDataSources>) => {
    const { onChange, query, onRunQuery} = this.props;
    onChange({ ...query, dataSourceSelect });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText, dataSourceSelect, optionsDataSource, dataPath, timePath, timeFormat, groupBy, aliasBy } = query;    
        
    return (
      <>
        <div className="gf-form"
          data-testid="query-field">
          <QueryField
            query={queryText || ''}
            onChange={this.onChangeQuery}
            portalOrigin="graphQL"
          />
        </div>

        <div className="gf-form">
          <InlineLabel 
            width={16}
            tooltip="dot-delimited for the data source to use"
          >          
            Data source
          </InlineLabel>
          <LegacyForms.Select
            data-testid="select-datasource"
            isSearchable={false}
            tabSelectsValue={true}
            width={24}
            menuShouldPortal={true}
            value={dataSourceSelect}
            options={optionsDataSource}
            onChange={this.onSourceSelector}
          />
        </div>

        <div className="gf-form">
          <LegacyForms.FormField
            labelWidth={8}
            data-testid="field-data-path"
            inputWidth={24}
            value={dataPath || ''}
            onChange={this.onDataPathTextChange}
            label="Data path"
            tooltip="dot-delimited path to data in response. Separate with commas to use multiple data paths"
          />
        </div>

        <div className="gf-form">
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            data-testid="field-time-path"
            value={timePath || ''}
            onChange={this.onTimePathTextChange}
            label="Time path"
            tooltip="dot-delimited path to time under data path"
          />
        </div>

        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            data-testid="field-time-format"
            value={timeFormat || ''}
            onChange={this.onTimeFormatTextChange}
            label="Time format"
            tooltip={
              <a href="https://momentjs.com/docs/#/parsing/string-format/" title="Formatting help">
                Optional time format in moment.js format.&nbsp;
                <Icon name="external-link-alt" />
              </a>
            }
          />
        </div>

        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={groupBy || ''}
            data-testid="field-group-by"
            onChange={this.onGroupByTextChange}
            label="Group by"
            tooltip="dot-delimited path for the key to use. Separate with commas to use multiple fields to group by"
          />
        </div>
        
        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={aliasBy || ''}
            onChange={this.onAliasByTextChange}
            data-testid="field-alias-by"
            label="Alias by"
            tooltip="The formattable text to alias by. Use $field_<field name> to replace with the value of a field, or $fieldName to replace with the name of the field"
          />
        </div>
      </>
    );
  }
}
