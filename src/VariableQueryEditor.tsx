import { SelectableValue } from '@grafana/data';
import { QueryField, Select } from '@grafana/ui';
import { defaults } from 'lodash';
import React, { useState } from 'react';
import { MyQuery, QueryDataSources, defaultQuery } from './types';

interface VariableQueryProps {
  query: MyQuery;
  onChange: (query: MyQuery, definition: string) => void;
}

export const VariableQueryEditor: React.FC<VariableQueryProps> = ({ onChange, query }) => {
  const variableQueryDefault = defaults(query, defaultQuery);
  const [state, setState] = useState(variableQueryDefault);

  const saveQuery = () => {
    onChange(state, `${state.queryText} (${state.dataSourceSelect}) (${state.dataPath})`);
  };

  const onChangeQuery = (value: string) =>{
    setState({
      ...state,
      queryText: value,
    });
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  const onSourceSelector = (dataSourceSelect: SelectableValue<QueryDataSources>) => {
    setState({
      ...state,
      dataSourceSelect,
    });
  };
  

  return (
    <>
      <div className="gf-form" data-testid="input-data-source">
      <span className="gf-form-label width-10">Data Source</span>
        <Select
          isSearchable={false}
          tabSelectsValue={true}
          menuShouldPortal={true}
          value={state.dataSourceSelect}
          options={state.optionsDataSource}
          onChange={onSourceSelector}
        />
      </div>
      <div className="gf-form" data-testid="input-data-path">
        <span className="gf-form-label width-10">Data Path</span>
        <input
          name="dataPath"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.dataPath}
        />
      </div>
      <div className="gf-form" data-testid="input-query">
        <span className="gf-form-label width-10">Query</span>
        <QueryField query={state.queryText || ''} onBlur={saveQuery} onChange={onChangeQuery} portalOrigin="graphQL" />
      </div>
    </>
  );
};
