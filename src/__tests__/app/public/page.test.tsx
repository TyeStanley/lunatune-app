import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Home from '../../../app/(public)/page';

// Mock the useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  isLoading: false,
};

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock the useRouter hook
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock the AuthButton component
jest.mock('../../../components/auth/AuthButton', () => {
  return function MockAuthButton({
    btnText,
    className,
    ...props
  }: {
    btnText: string;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      <button
        data-testid="auth-button"
        className={className}
        onClick={props.onClick as () => void}
        {...props}
      >
        {btnText}
      </button>
    );
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Play: ({
    size,
    className,
    ...props
  }: {
    size: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="play-icon" data-size={size} className={className} {...props} />,
  Moon: ({
    size,
    className,
    ...props
  }: {
    size: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="moon-icon" data-size={size} className={className} {...props} />,
}));

describe('Home (Public Page)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.isLoading = false;
  });

  describe('Authentication State Handling', () => {
    it('redirects to dashboard when authenticated', async () => {
      mockUseAuth.isAuthenticated = true;

      await act(async () => {
        render(<Home />);
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('shows loading state when auth is loading', () => {
      mockUseAuth.isLoading = true;

      render(<Home />);

      expect(screen.getByText('Just a moment...')).toBeInTheDocument();
      expect(screen.getByText("We're getting things ready")).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('shows loading state when authenticated and loading', () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.isLoading = true;

      render(<Home />);

      expect(screen.getByText('Just a moment...')).toBeInTheDocument();
      expect(screen.getByText("We're getting things ready")).toBeInTheDocument();
    });
  });

  describe('Main Content Rendering', () => {
    it('renders main content when not authenticated and not loading', () => {
      render(<Home />);

      expect(screen.getByText('Music that feels right')).toBeInTheDocument();
      expect(
        screen.getByText('Your personal soundtrack, curated just for you'),
      ).toBeInTheDocument();
    });

    it('renders the main logo with correct styling', () => {
      render(<Home />);

      // Find the logo container by looking for the div that contains the moon icon
      const moonIcon = screen.getByTestId('moon-icon');
      const logoContainer = moonIcon.parentElement;

      expect(logoContainer).toHaveClass(
        'bg-background-lighter border-background-lighter hover:border-primary/50 group mx-auto mb-4 flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border transition-all duration-300',
      );
    });

    it('renders auth buttons with correct text and styling', () => {
      render(<Home />);

      const authButtons = screen.getAllByTestId('auth-button');
      expect(authButtons).toHaveLength(2);

      // First auth button (Get Started)
      expect(authButtons[0]).toHaveTextContent('Get Started');
      expect(authButtons[0]).toHaveClass(
        'bg-primary hover:bg-primary/90 text-background-lighter rounded-lg px-5 py-2 font-semibold transition-colors duration-300',
      );

      // Second auth button (Start Listening Now)
      expect(authButtons[1]).toHaveTextContent('Start Listening Now');
      expect(authButtons[1]).toHaveClass(
        'bg-primary hover:bg-primary/90 text-background-lighter rounded-lg px-8 py-3 font-semibold transition-colors duration-300',
      );
    });
  });

  describe('Trending Section', () => {
    it('renders trending section with correct title', () => {
      render(<Home />);

      expect(screen.getByText('TRENDING THIS WEEK')).toBeInTheDocument();
    });

    it('renders 4 trending cards', () => {
      render(<Home />);

      const trendingCards = screen.getAllByText(/Song \d/);
      expect(trendingCards).toHaveLength(4);
    });

    it('renders trending cards with correct content', () => {
      render(<Home />);

      expect(screen.getByText('Song 1')).toBeInTheDocument();
      expect(screen.getByText('Song 2')).toBeInTheDocument();
      expect(screen.getByText('Song 3')).toBeInTheDocument();
      expect(screen.getByText('Song 4')).toBeInTheDocument();

      // Check for artist text
      const artistTexts = screen.getAllByText('Artist');
      expect(artistTexts).toHaveLength(4);
    });

    it('renders trending cards with correct styling', () => {
      render(<Home />);

      // Find the card container by looking for the div that contains the song text
      const songText = screen.getByText('Song 1');
      const cardContainer = songText.closest('div[class*="bg-background-lighter/80"]');

      expect(cardContainer).toHaveClass(
        'group bg-background-lighter/80 border-background-lighter hover:border-primary/50 cursor-pointer rounded-lg border p-4 backdrop-blur-sm transition-all duration-300',
      );
    });

    it('renders play icons in trending cards', () => {
      render(<Home />);

      const playIcons = screen.getAllByTestId('play-icon');
      expect(playIcons).toHaveLength(4);

      // Check that play icons have correct size
      playIcons.forEach((icon) => {
        expect(icon).toHaveAttribute('data-size', '40');
      });
    });

    it('renders album art placeholders in trending cards', () => {
      render(<Home />);

      // The album art containers should have the gradient background
      const albumArtContainers = document.querySelectorAll('[class*="from-primary/20"]');
      expect(albumArtContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Why Music App Section', () => {
    it('renders section title', () => {
      render(<Home />);

      expect(screen.getByText('WHY MUSIC APP?')).toBeInTheDocument();
    });

    it('renders all feature items', () => {
      render(<Home />);

      expect(screen.getByText('Discover new music daily')).toBeInTheDocument();
      expect(screen.getByText('Lightning-fast playback')).toBeInTheDocument();
      expect(screen.getByText('Save favorites forever')).toBeInTheDocument();
    });

    it('renders feature items with emojis', () => {
      render(<Home />);

      expect(screen.getByText('🔍')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('renders feature items with correct styling', () => {
      render(<Home />);

      const featureItems = document.querySelectorAll('.flex.items-center.gap-3');
      expect(featureItems).toHaveLength(3);

      featureItems.forEach((item) => {
        expect(item).toHaveClass(
          'transition-transform duration-300 hover:translate-x-2 hover:transform',
        );
      });
    });
  });

  describe('Layout and Structure', () => {
    it('renders with correct main container structure', () => {
      render(<Home />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('relative min-h-screen');
    });

    it('renders with correct content wrapper', () => {
      render(<Home />);

      const contentWrapper = document.querySelector('.mx-auto.max-w-7xl.px-4.py-12');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('renders with gradient overlay', () => {
      render(<Home />);

      const gradientOverlay = document.querySelector('[class*="from-background-lighter/5"]');
      expect(gradientOverlay).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders trending grid with responsive classes', () => {
      render(<Home />);

      const trendingGrid = document.querySelector('.grid.grid-cols-1.gap-6.md\\:grid-cols-4');
      expect(trendingGrid).toBeInTheDocument();
    });

    it('renders content with responsive padding', () => {
      render(<Home />);

      const contentContainer = document.querySelector(
        '.mx-auto.max-w-7xl.px-4.py-12.sm\\:px-6.lg\\:px-8',
      );
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Animation Classes', () => {
    it('renders elements with animation classes', () => {
      render(<Home />);

      const animatedElements = document.querySelectorAll('.animate-fadeIn');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('renders logo with hover animation classes', () => {
      render(<Home />);

      const logoContainer = screen.getByTestId('moon-icon').closest('div');
      expect(logoContainer).toHaveClass('group-hover:scale-110 group-hover:rotate-12');
    });
  });

  describe('Accessibility', () => {
    it('renders with semantic HTML structure', () => {
      render(<Home />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    });

    it('renders interactive elements as buttons', () => {
      render(<Home />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('State Changes', () => {
    it('updates when authentication state changes', async () => {
      const { rerender } = render(<Home />);

      // Initially not authenticated
      expect(screen.getByText('Music that feels right')).toBeInTheDocument();

      // Change to authenticated
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.isLoading = false;

      await act(async () => {
        rerender(<Home />);
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('updates when loading state changes', () => {
      const { rerender } = render(<Home />);

      // Initially not loading
      expect(screen.getByText('Music that feels right')).toBeInTheDocument();

      // Change to loading
      mockUseAuth.isLoading = true;

      rerender(<Home />);

      expect(screen.getByText('Just a moment...')).toBeInTheDocument();
    });
  });
});
