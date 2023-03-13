import { render, fireEvent, React } from '../../../tests';
import { ConfigEditor } from '../../../src/components/ConfigEditor/ConfigEditor';

const mockOnChangeOptions = jest.fn();

const defaultProps = {
    options: {
        secureJsonFields: {
            token: true,
        },
        secureJsonData: {
            token: 'my-token',
        },
    },
    onOptionsChange: mockOnChangeOptions,
};

const makeSut = () => {
    const sut = render(<ConfigEditor {...defaultProps} />);
    const inputPersonalToken = sut.getByTestId('input-form-secret-field');

    return {
        inputPersonalToken,
        ...sut,
    };
};

describe('ConfigEditor', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should renders the general settings form fields', () => {
        const { getByText, inputPersonalToken } = makeSut();
        
        const personalTokenField = getByText('Personal Token');
        expect(personalTokenField).toBeInTheDocument();        
        expect(inputPersonalToken).toBeInTheDocument();
    });

    it('should call @onSecureOptionsChange when the personal token field value changes', () => {

        const { getByTestId } = render(<ConfigEditor {...defaultProps} />);
        const personalTokenField = getByTestId('input-form-secret-field');
        const newValue = 'new-token'
        fireEvent.change(personalTokenField, { target: { value: newValue } });
        expect(mockOnChangeOptions).toHaveBeenCalledWith({
            ...defaultProps.options,
            secureJsonData: {
                token: newValue
            },
        });
    });

    it('should call @onResetSecureOptions when the reset button is clicked', async () => {

        const { getByRole, getByTestId } = render(<ConfigEditor {...defaultProps} />);

        const newText = 'new-token';
        const personalTokenField = getByTestId('input-form-secret-field');
        fireEvent.change(personalTokenField, { target: { value: newText } });

        const resetButton = getByRole('button');
        await fireEvent.click(resetButton);

        const mockNewText = {
            ...defaultProps.options,
            secureJsonData: { token: newText },
        };

        const mockReset = {
            ...defaultProps.options,
            secureJsonData: { token: '' },
            secureJsonFields: { token: false }
        };

        expect(mockOnChangeOptions).toHaveBeenCalledTimes(2);
        expect(mockOnChangeOptions).toHaveBeenCalledWith({ ...mockNewText, ...mockReset });

    });

});
