
import React, { ReactElement } from 'react';
import defaults from 'lodash/defaults';
import { FieldSet, LegacyForms } from '@grafana/ui';
import { EditorProps, defaultEditor } from './types';
import { useChangeOptions, useChangeSecureOptions, useResetSecureOptions } from './hooks';

const { SecretFormField, FormField } = LegacyForms;

export function ConfigEditor(props: EditorProps): ReactElement {
  const { jsonData, secureJsonData, secureJsonFields } = props.options;
  defaults(jsonData, defaultEditor);

  const onUrlFieldChange = useChangeOptions(props, 'url');
  const onPersonalTokenChange = useChangeSecureOptions(props, 'httpHeaderValue1', 'Token ');
  const onResetPersonalToken = useResetSecureOptions(props, 'httpHeaderValue1');
  return (
    <>
      <FieldSet label="General Settings">
      <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
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
            isConfigured={Boolean(secureJsonFields.httpHeaderValue1)}
            value={secureJsonData?.httpHeaderValue1 || ''}
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
