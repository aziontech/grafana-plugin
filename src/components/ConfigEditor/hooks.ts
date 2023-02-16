import { ChangeEvent, useCallback } from 'react';
import type { BasicDataSourceOptions, BasicSecureJsonData } from '../../types';
import type { EditorProps } from './types';

type OnChangeTypeEditor = (event: ChangeEvent<HTMLInputElement>) => void;

export function useChangeOptions(props: EditorProps, propertyName: keyof BasicDataSourceOptions): OnChangeTypeEditor {
    const { onOptionsChange, options } = props;

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onOptionsChange({
                ...options,
                [propertyName]: event.target.value,
                jsonData: {
                    ...options.jsonData,
                    [propertyName]: event.target.value,
                },
            });
        },
        [onOptionsChange, options, propertyName]
    );
}

export function useChangeSecureOptions(props: EditorProps, propertyName: keyof BasicSecureJsonData, startValue: string): OnChangeTypeEditor {
    const { onOptionsChange, options } = props;

    return useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            event.target.value = event.target.value.replace(startValue, '')
            onOptionsChange({
                ...options,
                secureJsonData: {
                    ...options.secureJsonData,
                    [propertyName]: startValue + event.target.value,
                },
            });
        },
        [onOptionsChange, options, propertyName, startValue]
    );
}

export function useResetSecureOptions(props: EditorProps, propertyName: keyof BasicSecureJsonData): () => void {
    const { onOptionsChange, options } = props;

    return useCallback(() => {
        onOptionsChange({
            ...options,
            secureJsonFields: {
                ...options.secureJsonFields,
                [propertyName]: false,
            },
            secureJsonData: {
                ...options.secureJsonData,
                [propertyName]: '',
            },
        });
    }, [onOptionsChange, options, propertyName]);
}
