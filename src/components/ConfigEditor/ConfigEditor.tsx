
import React, { ReactElement } from 'react';
import defaults from 'lodash/defaults';
import { FieldSet, LegacyForms } from '@grafana/ui';
import { EditorProps, defaultEditor } from './types';
import { useChangeOptions, useChangeSecureOptions, useResetSecureOptions } from './hooks';

const { SecretFormField, FormField } = LegacyForms;

export function ConfigEditor(props: EditorProps): ReactElement {
  const { jsonData, secureJsonData, secureJsonFields } = props.options;
  defaults(jsonData, defaultEditor);

  const onUrlFieldChange = useChangeOptions(props);
  const onPersonalTokenChange = useChangeSecureOptions(props);
  const onResetPersonalToken = useResetSecureOptions(props);

  return (
    <>
      <FieldSet label="General Settings">
      <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
              data-testid="input-form-field"
              label="API"
              labelWidth={8}
              inputWidth={20}            
              onChange={onUrlFieldChange}
              placeholder="https:\\localhost:9090"
              value={jsonData?.url ?? ''}
            />
          </div>
      </div>
      
      <div className="gf-form-inline">
        <div className="gf-form">
          <SecretFormField
            data-testid="input-form-secret-field"
            isConfigured={Boolean(secureJsonFields.httpHeaderValue1)}
            value={secureJsonData?.token || ''}
            label="Personal Token"
            placeholder="Personal Token"
            labelWidth={8}
            inputWidth={20}
            onReset={onResetPersonalToken}
            onChange={onPersonalTokenChange}
          />
        </div>  
      </div>
      </FieldSet>
    </>
  );
}
