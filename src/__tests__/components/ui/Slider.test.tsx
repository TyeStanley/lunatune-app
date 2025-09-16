import { render, screen } from '@testing-library/react';
import Slider from '../../../components/ui/Slider';

describe('Slider', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: 50,
    max: 100,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<Slider {...defaultProps} />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with labels when showLabels is true', () => {
    const formatLabel = (value: number) => `${value}s`;
    render(<Slider {...defaultProps} showLabels formatLabel={formatLabel} />);

    expect(screen.getByText('50s')).toBeInTheDocument();
    expect(screen.getByText('100s')).toBeInTheDocument();
  });

  it('does not render labels when showLabels is false', () => {
    const formatLabel = (value: number) => `${value}s`;
    render(<Slider {...defaultProps} showLabels={false} formatLabel={formatLabel} />);

    expect(screen.queryByText('50s')).not.toBeInTheDocument();
    expect(screen.queryByText('100s')).not.toBeInTheDocument();
  });

  it('updates local value when prop value changes', () => {
    const { rerender } = render(<Slider {...defaultProps} />);

    rerender(<Slider {...defaultProps} value={75} />);

    // The local value should update to match the prop
    const progressBar = screen.getByTestId('progress-bar');
    const progressFill = progressBar.querySelector('div[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '75%' });
  });

  it('handles zero max value', () => {
    render(<Slider value={0} max={0} onChange={mockOnChange} />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  it('handles negative values', () => {
    render(<Slider value={-10} max={100} onChange={mockOnChange} />);

    const progressBar = screen.getByTestId('progress-bar');
    const progressFill = progressBar.querySelector('div[style*="width"]');
    expect(progressFill).toBeNull();
  });

  it('handles values greater than max', () => {
    render(<Slider value={150} max={100} onChange={mockOnChange} />);

    const progressBar = screen.getByTestId('progress-bar');
    const progressFill = progressBar.querySelector('div[style*="width"]');
    expect(progressFill).toBeInTheDocument();
    expect(progressFill).toHaveStyle({ width: '150%' });
  });

  it('has proper CSS classes', () => {
    render(<Slider {...defaultProps} />);

    const container = screen.getByTestId('progress-bar').parentElement;
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('w-full');
    expect(container?.className).toContain('items-center');
    expect(container?.className).toContain('gap-2');

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar.className).toContain('bg-background-lighter');
    expect(progressBar.className).toContain('group');
    expect(progressBar.className).toContain('relative');
    expect(progressBar.className).toContain('h-1');
    expect(progressBar.className).toContain('w-full');
    expect(progressBar.className).toContain('cursor-pointer');
    expect(progressBar.className).toContain('rounded-full');
  });

  it('renders progress fill with correct width', () => {
    render(<Slider {...defaultProps} value={30} />);

    const progressBar = screen.getByTestId('progress-bar');
    const progressFill = progressBar.querySelector('div[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '30%' });
  });

  it('handles formatLabel function', () => {
    const formatLabel = jest.fn((value: number) => `${value} seconds`);
    render(<Slider {...defaultProps} showLabels formatLabel={formatLabel} />);

    expect(formatLabel).toHaveBeenCalledWith(50);
    expect(formatLabel).toHaveBeenCalledWith(100);
    expect(screen.getByText('50 seconds')).toBeInTheDocument();
    expect(screen.getByText('100 seconds')).toBeInTheDocument();
  });

  it('handles rapid value changes', () => {
    const { rerender } = render(<Slider {...defaultProps} />);

    // Rapidly change the value prop
    rerender(<Slider {...defaultProps} value={25} />);
    rerender(<Slider {...defaultProps} value={75} />);
    rerender(<Slider {...defaultProps} value={50} />);

    const progressBar = screen.getByTestId('progress-bar');
    const progressFill = progressBar.querySelector('div[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('renders with different initial values', () => {
    const { rerender } = render(<Slider {...defaultProps} value={25} />);

    let progressFill = screen.getByTestId('progress-bar').querySelector('div[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '25%' });

    rerender(<Slider {...defaultProps} value={75} />);
    progressFill = screen.getByTestId('progress-bar').querySelector('div[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '75%' });
  });
});
