import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DropdownMenu } from '../../../components/ui/DropdownMenu';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MoreHorizontal: ({
    className,
    size,
    'aria-label': ariaLabel,
  }: {
    className?: string;
    size?: number;
    'aria-label'?: string;
  }) => (
    <div
      data-testid="more-horizontal"
      className={className}
      data-size={size}
      aria-label={ariaLabel}
    >
      More
    </div>
  ),
  Play: () => <div data-testid="play-icon">Play</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
}));

describe('DropdownMenu', () => {
  const mockItems = [
    {
      label: 'Play',
      icon: <div data-testid="play-icon">Play</div>,
      onClick: jest.fn(),
    },
    {
      label: 'Like',
      icon: <div data-testid="heart-icon">Heart</div>,
      onClick: jest.fn(),
    },
    {
      label: 'Download',
      icon: <div data-testid="download-icon">Download</div>,
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default trigger', () => {
    render(<DropdownMenu items={mockItems} />);

    expect(screen.getByTestId('more-horizontal')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders with custom trigger', () => {
    const customTrigger = <div data-testid="custom-trigger">Custom</div>;
    render(<DropdownMenu trigger={customTrigger} items={mockItems} />);

    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('more-horizontal')).not.toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes dropdown when trigger is clicked again', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onClick when menu item is clicked', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const playButton = screen.getByTestId('play-icon').closest('button');
    fireEvent.click(playButton!);

    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
  });

  it('closes dropdown when menu item is clicked', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const playButton = screen.getByTestId('play-icon').closest('button');
    fireEvent.click(playButton!);

    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders menu items with icons', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
  });

  it('renders menu items without icons', () => {
    const itemsWithoutIcons = [
      { label: 'Play', onClick: jest.fn() },
      { label: 'Like', onClick: jest.fn() },
    ];

    render(<DropdownMenu items={itemsWithoutIcons} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    render(<DropdownMenu items={mockItems} className="custom-class" />);

    const container = screen.getByRole('button').parentElement;
    expect(container?.className).toContain('custom-class');
  });

  it('applies custom className to menu items', () => {
    const itemsWithCustomClass = [
      {
        label: 'Play',
        onClick: jest.fn(),
        className: 'custom-item-class',
      },
    ];

    render(<DropdownMenu items={itemsWithCustomClass} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const menuItem = screen.getByText('Play');
    expect(menuItem).toHaveClass('custom-item-class');
  });

  it('closes dropdown when clicking outside', async () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
    });
  });

  it('prevents event propagation when trigger is clicked', () => {
    const handleParentClick = jest.fn();

    render(
      <div onClick={handleParentClick}>
        <DropdownMenu items={mockItems} />
      </div>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('handles empty items array', () => {
    render(<DropdownMenu items={[]} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    // Should still render the dropdown container but with no items
    const dropdown = document.querySelector('[role="button"] + div');
    expect(dropdown).toBeInTheDocument();
  });

  it('updates aria-expanded attribute correctly', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('has proper accessibility attributes', () => {
    render(<DropdownMenu items={mockItems} />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabIndex', '0');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
  });
});
