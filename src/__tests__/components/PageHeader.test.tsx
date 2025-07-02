import { render, screen } from '@testing-library/react';
import { PageHeader } from '../../components/PageHeader';
import { Music, Heart, Clock, Search, Play, User } from 'lucide-react';

describe('PageHeader', () => {
  const defaultProps = {
    icon: Music,
    title: 'Library',
  };

  it('renders with default props', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Library');
  });

  it('renders with custom icon', () => {
    render(<PageHeader {...defaultProps} icon={Heart} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Library');
  });

  it('renders with custom title', () => {
    render(<PageHeader {...defaultProps} title="Liked Songs" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Liked Songs');
  });

  it('renders with different icons', () => {
    const { rerender } = render(<PageHeader {...defaultProps} icon={Music} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Library');

    rerender(<PageHeader {...defaultProps} icon={Heart} title="Liked" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Liked');

    rerender(<PageHeader {...defaultProps} icon={Clock} title="Recent" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Recent');

    rerender(<PageHeader {...defaultProps} icon={Search} title="Search" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search');

    rerender(<PageHeader {...defaultProps} icon={Play} title="Now Playing" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Now Playing');

    rerender(<PageHeader {...defaultProps} icon={User} title="Profile" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile');
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long page header title that might wrap to multiple lines';
    render(<PageHeader {...defaultProps} title={longTitle} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(longTitle);
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Library & Playlists 🎵 - My Collection';
    render(<PageHeader {...defaultProps} title={specialTitle} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(specialTitle);
  });

  it('renders with empty title', () => {
    render(<PageHeader {...defaultProps} title="" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  it('renders with numbers in title', () => {
    render(<PageHeader {...defaultProps} title="Playlist #123" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Playlist #123');
  });

  it('renders with uppercase title', () => {
    render(<PageHeader {...defaultProps} title="MY LIBRARY" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('MY LIBRARY');
  });

  it('renders with lowercase title', () => {
    render(<PageHeader {...defaultProps} title="my library" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('my library');
  });

  it('has correct main container styling', () => {
    render(<PageHeader {...defaultProps} />);

    const mainContainer = screen.getByRole('heading', { level: 1 }).closest('div')
      ?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('mb-12');
  });

  it('has correct background container styling', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    const backgroundContainer = heading.closest('div')?.parentElement;

    expect(backgroundContainer).toHaveClass(
      'bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md',
    );
  });

  it('has correct content container styling', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    const contentContainer = heading.parentElement;

    expect(contentContainer).toHaveClass('flex items-center gap-4');
  });

  it('has correct heading styling', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-2xl font-semibold text-gray-200');
  });

  it('renders icon with correct styling', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    const icon = heading.parentElement?.querySelector('svg');

    expect(icon).toHaveClass('text-primary');
  });

  it('renders icon with correct size', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    const icon = heading.parentElement?.querySelector('svg');

    expect(icon).toBeInTheDocument();
    // The icon should have size={28} which translates to width and height attributes
    expect(icon).toHaveAttribute('width', '28');
    expect(icon).toHaveAttribute('height', '28');
  });

  it('maintains proper heading hierarchy', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders icon before title', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    const contentContainer = heading.parentElement;
    const icon = contentContainer?.querySelector('svg');
    const title = contentContainer?.querySelector('h1');

    expect(icon).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    // Icon should come before the title in the DOM
    expect(contentContainer?.children[0]).toBe(icon);
    expect(contentContainer?.children[1]).toBe(title);
  });

  it('renders with different combinations of props', () => {
    const { rerender } = render(<PageHeader icon={Heart} title="Liked Songs" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Liked Songs');

    rerender(<PageHeader icon={Clock} title="Recent Activity" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Recent Activity');

    rerender(<PageHeader icon={Search} title="Search Results" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search Results');
  });

  it('renders with single character title', () => {
    render(<PageHeader {...defaultProps} title="A" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('A');
  });

  it('renders with very long single word title', () => {
    const longWord = 'Supercalifragilisticexpialidocious';
    render(<PageHeader {...defaultProps} title={longWord} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(longWord);
  });

  it('renders with title containing HTML entities', () => {
    render(<PageHeader {...defaultProps} title="Library & Playlists" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Library & Playlists');
  });

  it('renders with title containing line breaks', () => {
    render(<PageHeader {...defaultProps} title="Library Playlists" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Library Playlists');
  });

  it('maintains accessibility with proper heading structure', () => {
    render(<PageHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Should have proper text content for screen readers
    expect(heading).toHaveTextContent('Library');
  });

  it('renders with title containing unicode characters', () => {
    const unicodeTitle = 'Bibliothèque 🎵 音乐库';
    render(<PageHeader {...defaultProps} title={unicodeTitle} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(unicodeTitle);
  });
});
