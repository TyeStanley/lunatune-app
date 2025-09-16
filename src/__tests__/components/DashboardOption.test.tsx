import { render, screen, fireEvent } from '@testing-library/react';
import DashboardOption from '../../components/DashboardOption';
import { Music, Heart, Clock, Search } from 'lucide-react';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  };
});

describe('DashboardOption', () => {
  const defaultProps = {
    icon: Music,
    text: 'Library',
    href: '/library',
  };

  it('renders with default props', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/library');
  });

  it('renders with custom icon', () => {
    render(<DashboardOption {...defaultProps} icon={Heart} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<DashboardOption {...defaultProps} text="Liked Songs" />);

    const link = screen.getByRole('link', { name: /liked songs/i });
    expect(link).toBeInTheDocument();
  });

  it('renders with custom href', () => {
    render(<DashboardOption {...defaultProps} href="/liked" />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toHaveAttribute('href', '/liked');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<DashboardOption {...defaultProps} onClick={handleClick} />);

    const link = screen.getByRole('link', { name: /library/i });
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without onClick handler', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toBeInTheDocument();

    // Should not throw when clicked without onClick handler
    expect(() => {
      fireEvent.click(link);
    }).not.toThrow();
  });

  it('renders with different icons', () => {
    const { rerender } = render(<DashboardOption {...defaultProps} icon={Music} />);
    expect(screen.getByRole('link', { name: /library/i })).toBeInTheDocument();

    rerender(<DashboardOption {...defaultProps} icon={Heart} text="Liked" />);
    expect(screen.getByRole('link', { name: /liked/i })).toBeInTheDocument();

    rerender(<DashboardOption {...defaultProps} icon={Clock} text="Recent" />);
    expect(screen.getByRole('link', { name: /recent/i })).toBeInTheDocument();

    rerender(<DashboardOption {...defaultProps} icon={Search} text="Search" />);
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
  });

  it('renders with long text', () => {
    const longText = 'This is a very long dashboard option text that might wrap';
    render(<DashboardOption {...defaultProps} text={longText} />);

    const link = screen.getByRole('link', { name: new RegExp(longText, 'i') });
    expect(link).toBeInTheDocument();
  });

  it('renders with special characters in text', () => {
    const specialText = 'Library & Playlists 🎵';
    render(<DashboardOption {...defaultProps} text={specialText} />);

    const link = screen.getByRole('link', { name: new RegExp(specialText, 'i') });
    expect(link).toBeInTheDocument();
  });

  it('renders with complex href paths', () => {
    const complexHref = '/dashboard/library/playlists?filter=recent&sort=name';
    render(<DashboardOption {...defaultProps} href={complexHref} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toHaveAttribute('href', complexHref);
  });

  it('has correct CSS classes for styling', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toHaveClass(
      'group hover:bg-background-light/40 bg-background-lighter/30 flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10',
    );
  });

  it('has correct icon container styling', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    const iconContainer = link.querySelector('div');

    expect(iconContainer).toHaveClass(
      'bg-background-light/40 flex h-16 w-16 items-center justify-center rounded-full border border-white/5 backdrop-blur-sm sm:h-20 sm:w-20 lg:h-24 lg:w-24',
    );
  });

  it('has correct text styling', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    const textElement = link.querySelector('p');

    expect(textElement).toHaveClass(
      'group-hover:text-primary text-base font-medium whitespace-nowrap text-gray-200 sm:text-lg lg:text-xl',
    );
  });

  it('renders icon with correct size classes', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    const icon = link.querySelector('svg');

    expect(icon).toHaveClass('text-primary sm:h-8 sm:w-8 lg:h-10 lg:w-10');
  });

  it('handles multiple clicks correctly', () => {
    const handleClick = jest.fn();
    render(<DashboardOption {...defaultProps} onClick={handleClick} />);

    const link = screen.getByRole('link', { name: /library/i });

    fireEvent.click(link);
    fireEvent.click(link);
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('passes event object to onClick handler', () => {
    const handleClick = jest.fn();
    render(<DashboardOption {...defaultProps} onClick={handleClick} />);

    const link = screen.getByRole('link', { name: /library/i });
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    const event = handleClick.mock.calls[0][0];
    expect(event).toBeInstanceOf(Object);
  });

  it('renders with empty text', () => {
    render(<DashboardOption {...defaultProps} text="" />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/library');
  });

  it('renders with root href', () => {
    render(<DashboardOption {...defaultProps} href="/" />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders with external href', () => {
    render(<DashboardOption {...defaultProps} href="https://example.com" />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('maintains accessibility with proper link structure', () => {
    render(<DashboardOption {...defaultProps} />);

    const link = screen.getByRole('link', { name: /library/i });
    expect(link).toBeInTheDocument();

    // Should have proper text content for screen readers
    expect(link).toHaveTextContent('Library');
  });

  it('renders with different combinations of props', () => {
    const { rerender } = render(<DashboardOption icon={Heart} text="Liked" href="/liked" />);
    expect(screen.getByRole('link', { name: /liked/i })).toHaveAttribute('href', '/liked');

    rerender(<DashboardOption icon={Clock} text="Recent" href="/recent" onClick={jest.fn()} />);
    expect(screen.getByRole('link', { name: /recent/i })).toHaveAttribute('href', '/recent');

    rerender(<DashboardOption icon={Search} text="Search" href="/search" />);
    expect(screen.getByRole('link', { name: /search/i })).toHaveAttribute('href', '/search');
  });
});
