import { ChangeEvent } from 'react';
import type { MyQuery } from 'types';
import type { EditorProps } from './types';

type OnChangeTypeEditor = (event: ChangeEvent<HTMLInputElement>) => void;

export function onChangeDefault(props: EditorProps, propertyName: keyof MyQuery): OnChangeTypeEditor {
    
    const { onChange, query } = props;
    return (event: ChangeEvent<HTMLInputElement>) => {
        console.log(query)
        onChange({
            ...query,
            [propertyName]: event.target.value,
        });
    };
}
