import { render, fireEvent, React } from '../../../tests';
import { ConfigEditor } from '../../../src/components/ConfigEditor/ConfigEditor';

const mockOnChangeOptions = jest.fn();

const defaultProps = {
    options: {
        jsonData: {
            httpHeaderName1: "Authorization",
            url: 'https://my-api.com',
        },
        secureJsonFields: {
            httpHeaderValue1: true,
        },
        secureJsonData: {
            token: 'my-token',
        },
    },
    onOptionsChange: mockOnChangeOptions,
};

const makeSut = () => {
    const sut = render(<ConfigEditor {...defaultProps} />);
    const inputUrl = sut.getByTestId('input-form-field');
    const inputPersonalToken = sut.getByTestId('input-form-secret-field');

    return {
        inputPersonalToken,
        inputUrl,
        ...sut,
    };
};

describe('ConfigEditor', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should renders the general settings form fields', () => {
        const { getByText, inputPersonalToken, inputUrl } = makeSut();
        const apiUrlField = getByText('API');
        const personalTokenField = getByText('Personal Token');

        expect(apiUrlField).toBeInTheDocument();
        expect(personalTokenField).toBeInTheDocument();
        expect(inputUrl).toBeInTheDocument();
        expect(inputPersonalToken).toBeInTheDocument();
    });

    it('should call onOptionsChange when the url field value changes', () => {
        const { getByTestId } = render(<ConfigEditor {...defaultProps} />);
        const apiUrlField = getByTestId('input-form-field');
        fireEvent.change(apiUrlField, { target: { value: 'https://new-api.com' } });
        const mock = { ...defaultProps.options };
        mock.jsonData.url = 'https://new-api.com';
        expect(mockOnChangeOptions).toHaveBeenCalledWith({ ...mock, url: 'https://new-api.com' });
    });

    it('should call onSecureOptionsChange when the personal token field value changes', () => {
        const { getByTestId } = render(<ConfigEditor {...defaultProps} />);
        const personalTokenField = getByTestId('input-form-secret-field');
        const newValue = 'new-token'
        fireEvent.change(personalTokenField, { target: { value: newValue } });
        expect(mockOnChangeOptions).toHaveBeenCalledWith({
            ...defaultProps.options,
            secureJsonData: {
                httpHeaderValue1: `Token ${newValue}`,
                token: newValue
            },
        });
    });

    it('should call onResetSecureOptions when the reset button is clicked', async () => {
        const { getByRole, getByTestId } = render(<ConfigEditor {...defaultProps} />);

        const newText = 'new-token';
        const personalTokenField = getByTestId('input-form-secret-field');
        fireEvent.change(personalTokenField, { target: { value: newText } });

        const resetButton = getByRole('button');
        await fireEvent.click(resetButton);

        const mockNewText = {
            ...defaultProps.options,
            secureJsonData: { httpHeaderValue1: `Token ${newText}`, token: newText },
        };

        const mockReset = {
            ...defaultProps.options,
            secureJsonData: { httpHeaderValue1: '', token: '' },
            secureJsonFields: { httpHeaderValue1: false }
        };

        expect(mockOnChangeOptions).toHaveBeenCalledTimes(2);
        expect(mockOnChangeOptions).toHaveBeenCalledWith({ ...mockNewText, ...mockReset });

    });

});
