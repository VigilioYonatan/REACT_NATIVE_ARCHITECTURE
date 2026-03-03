import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with given label', () => {
    const { getByText } = render(<Button label="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('handles onPress event', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders loading state correctly', () => {
    const { getByTestId, queryByText } = render(<Button label="Click Me" isLoading={true} testID="button" />);
    
    // Check that label is not shown
    expect(queryByText('Click Me')).toBeNull();
    
    // Check that Button wrapper exists and handles disabled state implicitly
    const button = getByTestId('button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });
});
