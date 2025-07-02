import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '../../../components/ui/SearchInput';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: ({ className, size }: { className?: string; size?: number }) => (
    <div data-testid="search-icon" className={className} data-size={size}>
      Search
    </div>
  ),
}));

describe('SearchInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput value="" onChange={mockOnChange} placeholder="Custom placeholder" />);

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('displays the search icon', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchInput value="test search" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(mockOnChange).toHaveBeenCalledWith('new search');
  });

  it('calls onChange with empty string when input is cleared', () => {
    render(<SearchInput value="existing value" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('existing value');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('has proper input type', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('has proper CSS classes', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const container = screen.getByPlaceholderText('Search songs, artists').closest('div');
    expect(container?.className).toContain('bg-background-lighter');
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('items-center');
    expect(container?.className).toContain('gap-3');
    expect(container?.className).toContain('rounded-lg');
    expect(container?.className).toContain('px-4');
    expect(container?.className).toContain('py-2');

    const input = screen.getByPlaceholderText('Search songs, artists');
    expect(input.className).toContain('bg-background-lighter');
    expect(input.className).toContain('flex-1');
    expect(input.className).toContain('text-gray-200');
    expect(input.className).toContain('placeholder-gray-400');
    expect(input.className).toContain('focus:outline-none');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('handles special characters in input', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    const specialValue = 'test@#$%^&*()_+-=[]{}|;:,.<>?';
    fireEvent.change(input, { target: { value: specialValue } });

    expect(mockOnChange).toHaveBeenCalledWith(specialValue);
  });

  it('handles long input values', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    const longValue = 'a'.repeat(1000);
    fireEvent.change(input, { target: { value: longValue } });

    expect(mockOnChange).toHaveBeenCalledWith(longValue);
  });

  it('maintains focus after value change', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search songs, artists');
    input.focus();
    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveFocus();
  });

  it('renders with different initial values', () => {
    const { rerender } = render(<SearchInput value="initial" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

    rerender(<SearchInput value="updated" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<SearchInput value="" onChange={mockOnChange} />);

    const outerContainer = screen
      .getByPlaceholderText('Search songs, artists')
      .closest('.max-w-md');
    expect(outerContainer).toBeInTheDocument();
    expect(outerContainer?.className).toContain('max-w-md');
    expect(outerContainer?.className).toContain('flex-1');
  });
});
