import { render, fireEvent, userEvent, React } from '../index';
import { MyQuery } from '../../src/types';
import { VariableQueryEditor } from '../../src/VariableQueryEditor';

const query: MyQuery = {  
  refId: '',
  queryText: 'query {    data:submissions(user:"$user"){        Time:submitTime        idle running completed    }  }',
  dataPath: 'data',
  timePath: 'Time',
  endTimePath: 'endTime',
  timeFormat: null,
  groupBy: '', // `identifier`
  aliasBy: '', // 'Server [[tag_identifier]]`
  annotationTitle: '',
  annotationText: '',
  annotationTags: '',
};

const onChangeMock = jest.fn();
const defaultProps = { query, onChange: onChangeMock };

const makeSut = () => {
  const { getByTestId } = render(<VariableQueryEditor {...defaultProps} />);

  const elementDataPath = getByTestId('input-data-path');
  const elementQuery = getByTestId('input-query');

  const inputQuery = elementQuery.querySelector('.slate-query-field [contenteditable=true]') as HTMLDivElement;
  const labelQuery = elementQuery.querySelector('span') as HTMLSpanElement;

  const inputDataPath = elementDataPath.querySelector('input') as HTMLInputElement;
  const labelDataPath = elementDataPath.querySelector('span') as HTMLSpanElement;

  return {
    elementDataPath,
    inputDataPath,
    labelDataPath,
    elementQuery,
    inputQuery,
    labelQuery,
  };
};


describe('VariableQueryEditor', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', async () => {
    const { elementDataPath, elementQuery, labelDataPath, labelQuery, inputDataPath, inputQuery } = makeSut();

    expect(elementDataPath).toBeInTheDocument();
    expect(elementQuery).toBeInTheDocument();

    expect(labelDataPath).toHaveTextContent('Data Path');
    expect(inputDataPath).toHaveValue(query.dataPath);

    expect(labelQuery).toHaveTextContent('Query');
    expect(inputQuery.textContent).toBe(query.queryText);
  });

  it('should call #saveQuery when input field loses focus', () => {

    const { inputDataPath } = makeSut();
    const textDataPath = 'test';
    fireEvent.change(inputDataPath, { target: { value: textDataPath } });
    fireEvent.blur(inputDataPath);

    expect(onChangeMock).toHaveBeenCalledWith(
      { ...query, dataPath: textDataPath },
      `${query.queryText} (${textDataPath})`
    );
  });

  it('should update state when input field value changes', () => {
    const { inputDataPath } = makeSut();
    const newText = 'test.data.path'
    fireEvent.change(inputDataPath, { target: { name: 'dataPath', value: newText } });

    expect(inputDataPath.value).toBe(newText);
  });

  it('should call @onChange when the Query input changes and @onBlur is triggered', async () => {

    const { inputQuery } = makeSut();
    const newText = 'new text';
    await userEvent.click(inputQuery);
    fireEvent.blur(inputQuery, { target: { innerHTML: newText } });
    expect(inputQuery.textContent).toBe(newText);
  });
});
