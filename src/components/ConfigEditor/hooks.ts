import { ChangeEvent, useCallback } from 'react';
import type { EditorProps } from './types';

type OnChangeTypeEditor = (event: ChangeEvent<HTMLInputElement>) => void;

export function useChangeSecureOptions(props: EditorProps): OnChangeTypeEditor {
    const { onOptionsChange, options } = props;

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({
                ...options,
                secureJsonData: {
                    ...options.secureJsonData,
                    token: event.target.value,
                },
            });
        },
        [onOptionsChange, options]
    );
}

export function useResetSecureOptions(props: EditorProps): () => void {
    const { onOptionsChange, options } = props;

    return useCallback(() => {
        onOptionsChange({
            ...options,
            secureJsonFields: {
                ...options.secureJsonFields,
                token: false,
            },
            secureJsonData: {
                ...options.secureJsonData,
                token: '',
            },
        });
    }, [onOptionsChange, options]);
}
