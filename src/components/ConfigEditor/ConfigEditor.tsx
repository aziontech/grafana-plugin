
import React, { ReactElement } from 'react';
import { FieldSet, LegacyForms } from '@grafana/ui';
import { EditorProps } from './types';
import { useChangeSecureOptions, useResetSecureOptions } from './hooks';

const { SecretFormField } = LegacyForms;

export function ConfigEditor(props: EditorProps): ReactElement {
  const { secureJsonData, secureJsonFields } = props.options;

  const onPersonalTokenChange = useChangeSecureOptions(props);
  const onResetPersonalToken = useResetSecureOptions(props);

  return (
    <>
      <FieldSet label="General Settings">
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              data-testid="input-form-secret-field"
              isConfigured={Boolean(secureJsonFields.token)}
              value={secureJsonData?.token || ''}
              label="Personal Token"
              // tooltip="Not used yet"
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
