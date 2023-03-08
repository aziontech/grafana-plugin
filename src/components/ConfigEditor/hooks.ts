import { ChangeEvent, useCallback } from 'react';
import type { EditorProps } from './types';

type OnChangeTypeEditor = (event: ChangeEvent<HTMLInputElement>) => void;

export function useChangeOptions(props: EditorProps): OnChangeTypeEditor {
    const { onOptionsChange, options } = props;

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({
                ...options,
                url: event.target.value,
                jsonData: {
                    
                    ...options.jsonData,
                    url: event.target.value,
                },
            });
        },
        [onOptionsChange, options]
    );
}

export function useChangeSecureOptions(props: EditorProps): OnChangeTypeEditor {
    const { onOptionsChange, options } = props;

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({
                ...options,
                secureJsonData: {
                    ...options.secureJsonData,
                    httpHeaderValue1: 'Token ' + event.target.value,
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
                httpHeaderValue1: false,
            },
            secureJsonData: {
                ...options.secureJsonData,
                httpHeaderValue1: '',
                token: '',
            },
        });
    }, [onOptionsChange, options]);
}
