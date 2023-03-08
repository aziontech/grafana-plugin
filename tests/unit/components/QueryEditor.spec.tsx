import { render, fireEvent, React, userEvent } from '../../../tests';
import { QueryEditor } from '../../../src/components/QueryEditor/QueryEditor';

const defaultQuery = {
    queryText: 'Query test',
    dataPath: '',
    timePath: '',
    timeFormat: '',
    groupBy: '',
    aliasBy: '',
};
const onChangeMock = jest.fn();

const makeSut = () => {
    const sut = render(<QueryEditor query={defaultQuery} onChange={onChangeMock} />);

    const inputFieldDataPath = sut.getByTestId('field-data-path');
    const inputFieldTimePath = sut.getByTestId('field-time-path');
    const inputFieldTimeFormat = sut.getByTestId('field-time-format');
    const inputFieldGroupBy = sut.getByTestId('field-group-by');
    const inputFieldAliasBy = sut.getByTestId('field-alias-by');
    const elementQuery = sut.getByTestId('query-field');
    const inputQuery = elementQuery.querySelector('div [contenteditable=true]') as HTMLDivElement;

    return {
        inputQuery,
        inputFieldDataPath,
        inputFieldTimePath,
        inputFieldTimeFormat,
        inputFieldGroupBy,
        inputFieldAliasBy,
        ...sut,
    };
};

describe('QueryEditor', () => {
    it('should render all fields', () => {
        const { inputFieldDataPath,
            inputFieldTimePath,
            inputFieldTimeFormat,
            inputFieldGroupBy,
            inputFieldAliasBy } = makeSut();

        expect(inputFieldDataPath).toBeInTheDocument();
        expect(inputFieldTimePath).toBeInTheDocument();
        expect(inputFieldTimeFormat).toBeInTheDocument();
        expect(inputFieldGroupBy).toBeInTheDocument();
        expect(inputFieldAliasBy).toBeInTheDocument();
    });

    it('should call onChangeQuery when QueryField changes', async () => {
        const { inputQuery } = makeSut();
        const newQuery = 'new query';        
        await userEvent.click(inputQuery);
        fireEvent.blur(inputQuery, { target: { innerHTML: newQuery } });
        expect(inputQuery.textContent).toBe(newQuery);
    });

    it('should call onDataPathTextChange when Data Path input changes', () => {
        const { inputFieldDataPath } = makeSut();
        const dataPath = 'test';
        fireEvent.change(inputFieldDataPath, { target: { value: dataPath } });
        expect(onChangeMock).toHaveBeenCalledWith({ ...defaultQuery, dataPath });
    });

    it('should call onTimePathTextChange when Time Path input changes', () => {
        const { inputFieldTimePath } = makeSut();
        const timePath = 'test';
        fireEvent.change(inputFieldTimePath, { target: { value: timePath } });
        expect(onChangeMock).toHaveBeenCalledWith({ ...defaultQuery, timePath });
    });

    it('should call onTimeFormatTextChange when Time Format input changes', () => {
        const { inputFieldTimeFormat } = makeSut();
        const timeFormat = 'test';
        fireEvent.change(inputFieldTimeFormat, { target: { value: timeFormat } });
        expect(onChangeMock).toHaveBeenCalledWith({ ...defaultQuery, timeFormat });
    });

    it('should call onGroupByTextChange when Group By input changes', () => {
        const { inputFieldGroupBy } = makeSut();
        const groupBy = 'test';
        fireEvent.change(inputFieldGroupBy, { target: { value: groupBy } });
        expect(onChangeMock).toHaveBeenCalledWith({ ...defaultQuery, groupBy });
    });
    
    it('should call onAliasByTextChange when Alias By input changes', () => {
        const { inputFieldAliasBy } = makeSut();
        const aliasBy = 'test';
        fireEvent.change(inputFieldAliasBy, { target: { value: aliasBy } });
        expect(onChangeMock).toHaveBeenCalledWith({ ...defaultQuery, aliasBy });
    });
});
