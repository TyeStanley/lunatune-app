import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../../../components/ui/Pagination';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className, size }: { className?: string; size?: number }) => (
    <div data-testid="chevron-left" className={className} data-size={size}>
      Left
    </div>
  ),
  ChevronRight: ({ className, size }: { className?: string; size?: number }) => (
    <div data-testid="chevron-right" className={className} data-size={size}>
      Right
    </div>
  ),
}));

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with current page and total pages', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '2 of 5';
      }),
    ).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
  });

  it('calls onPageChange when previous button is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when next button is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('enables both buttons on middle page', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('applies custom className', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        className="custom-class"
      />,
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Pagination');

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    expect(prevButton).toHaveAttribute('aria-label', 'Previous page');
    expect(nextButton).toHaveAttribute('aria-label', 'Next page');
  });

  it('handles single page', () => {
    render(<Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '1 of 1';
      }),
    ).toBeInTheDocument();

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('handles large page numbers', () => {
    render(<Pagination currentPage={1000} totalPages={9999} onPageChange={mockOnPageChange} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '1000 of 9999';
      }),
    ).toBeInTheDocument();
  });

  it('does not call onPageChange when disabled buttons are clicked', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('renders with different current pages', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />,
    );

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '1 of 5';
      }),
    ).toBeInTheDocument();

    rerender(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '3 of 5';
      }),
    ).toBeInTheDocument();
  });

  it('has proper CSS classes for buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    expect(prevButton.className).toContain('group');
    expect(prevButton.className).toContain('bg-background-lighter');
    expect(prevButton.className).toContain('hover:bg-background');
    expect(prevButton.className).toContain('focus:ring-primary');
    expect(prevButton.className).toContain('rounded-md');
    expect(prevButton.className).toContain('border');
    expect(prevButton.className).toContain('border-transparent');
    expect(prevButton.className).toContain('px-3');
    expect(prevButton.className).toContain('py-2');
    expect(prevButton.className).toContain('text-gray-400');
    expect(prevButton.className).toContain('transition');
    expect(prevButton.className).toContain('focus:ring-2');
    expect(prevButton.className).toContain('focus:outline-none');
    expect(prevButton.className).toContain('disabled:cursor-not-allowed');
    expect(prevButton.className).toContain('disabled:opacity-50');

    expect(nextButton.className).toContain('group');
    expect(nextButton.className).toContain('bg-background-lighter');
    expect(nextButton.className).toContain('hover:bg-background');
    expect(nextButton.className).toContain('focus:ring-primary');
    expect(nextButton.className).toContain('rounded-md');
    expect(nextButton.className).toContain('border');
    expect(nextButton.className).toContain('border-transparent');
    expect(nextButton.className).toContain('px-3');
    expect(nextButton.className).toContain('py-2');
    expect(nextButton.className).toContain('text-gray-400');
    expect(nextButton.className).toContain('transition');
    expect(nextButton.className).toContain('focus:ring-2');
    expect(nextButton.className).toContain('focus:outline-none');
    expect(nextButton.className).toContain('disabled:cursor-not-allowed');
    expect(nextButton.className).toContain('disabled:opacity-50');
  });

  it('has proper CSS classes for page info', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const pageInfo = screen
      .getByText((content, element) => {
        return element?.textContent === '2 of 5';
      })
      .closest('span');
    expect(pageInfo?.className).toContain('bg-background-lighter');
    expect(pageInfo?.className).toContain('rounded-md');
    expect(pageInfo?.className).toContain('border');
    expect(pageInfo?.className).toContain('border-transparent');
    expect(pageInfo?.className).toContain('px-4');
    expect(pageInfo?.className).toContain('py-1.5');
    expect(pageInfo?.className).toContain('text-base');
    expect(pageInfo?.className).toContain('text-gray-200');
  });

  it('handles edge case of current page greater than total pages', () => {
    render(<Pagination currentPage={10} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '10 of 5';
      }),
    ).toBeInTheDocument();

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).not.toBeDisabled();
  });

  it('handles zero total pages', () => {
    render(<Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '1 of 0';
      }),
    ).toBeInTheDocument();

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });
});
