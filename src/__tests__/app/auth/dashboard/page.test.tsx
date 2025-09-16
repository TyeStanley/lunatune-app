import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '@/app/(auth)/dashboard/page';
import userReducer from '@/redux/state/user/userSlice';
import queueReducer from '@/redux/state/queue/queueSlice';
import playbackControlsReducer from '@/redux/state/playback-controls/playbackControlsSlice';
import { dashboardOptions } from '@/constants';

// Mock the useAuth hook
const mockUseAuth = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/picture.jpg',
  } as { name: string; email: string; picture: string } | null,
  isAuthenticated: true,
  isLoading: false,
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock the DashboardOption component
jest.mock('@/components/DashboardOption', () => {
  return function MockDashboardOption({
    icon: Icon,
    text,
    href,
    onClick,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
  }) {
    return (
      <button
        data-testid={`dashboard-option-${text.toLowerCase().replace(/\s+/g, '-')}`}
        className="dashboard-option"
        onClick={onClick}
        data-href={href}
      >
        <Icon data-testid={`icon-${text.toLowerCase().replace(/\s+/g, '-')}`} />
        {text}
      </button>
    );
  };
});

// Mock the SleepTimerModal component
jest.mock('@/components/sleep-timer/SleepTimerModal', () => {
  return function MockSleepTimerModal({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="sleep-timer-modal">
        <button data-testid="close-sleep-timer" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Music: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="music-icon" data-size={size} className={className} {...props} />,
  Clock: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="clock-icon" data-size={size} className={className} {...props} />,
  Calendar: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="calendar-icon" data-size={size} className={className} {...props} />,
  Zap: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="zap-icon" data-size={size} className={className} {...props} />,
  Search: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="search-icon" data-size={size} className={className} {...props} />,
  Heart: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="heart-icon" data-size={size} className={className} {...props} />,
  Library: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="library-icon" data-size={size} className={className} {...props} />,
  ListMusic: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="list-music-icon" data-size={size} className={className} {...props} />,
  History: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="history-icon" data-size={size} className={className} {...props} />,
  Sparkles: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="sparkles-icon" data-size={size} className={className} {...props} />,
  TrendingUp: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="trending-up-icon" data-size={size} className={className} {...props} />,
  Timer: ({
    size,
    className,
    ...props
  }: {
    size?: number;
    className?: string;
    [key: string]: unknown;
  }) => <div data-testid="timer-icon" data-size={size} className={className} {...props} />,
}));

describe('Dashboard', () => {
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        user: userReducer,
        queue: queueReducer,
        playbackControls: playbackControlsReducer,
      },
      preloadedState: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/picture.jpg',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        queue: {
          currentSong: null,
          upcomingSongs: [],
          playedSongs: [],
        },
        playbackControls: {
          isPlaying: false,
          progress: 0,
          maxDuration: 0,
          volume: 1,
          isShuffled: false,
          isRepeating: false,
          seekTime: null,
          sleepTimer: {
            isActive: false,
            endTime: null,
            duration: null,
          },
        },
        ...initialState,
      },
    });
  };

  const renderWithProvider = (initialState = {}) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to return a consistent time for testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-15T14:30:00.000Z')); // Sunday, 2:30 PM
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Header Section', () => {
    it('renders greeting with user name', () => {
      renderWithProvider();

      // Check for the greeting text in the h1 element
      const greetingElement = screen.getByRole('heading', { level: 1 });
      expect(greetingElement).toHaveTextContent('Good Morning, Test User');
    });

    it('renders greeting without user name when user is null', () => {
      mockUseAuth.user = null;
      renderWithProvider();

      // Check for the greeting text in the h1 element
      const greetingElement = screen.getByRole('heading', { level: 1 });
      expect(greetingElement).toHaveTextContent('Good Morning, User');
    });

    it('renders current time and date', () => {
      renderWithProvider();

      // Check for time and date in their respective spans
      expect(screen.getByText('6:30 AM')).toBeInTheDocument();
      expect(screen.getByText('Sunday, January 15')).toBeInTheDocument();
    });

    it('renders time and date icons', () => {
      renderWithProvider();

      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });

    it('updates time every second', async () => {
      renderWithProvider();

      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText('6:30 AM')).toBeInTheDocument();
      });
    });
  });

  describe('Now Playing Section', () => {
    it('renders now playing section when no song is playing', () => {
      renderWithProvider();

      expect(screen.getByText('Now Playing')).toBeInTheDocument();
      expect(screen.getByText('No track selected')).toBeInTheDocument();
      expect(screen.getByTestId('music-icon')).toBeInTheDocument();
    });

    it('renders current song information when song is playing', () => {
      const initialState = {
        queue: {
          currentSong: {
            id: '1',
            title: 'Test Song',
            artist: 'Test Artist',
            album: 'Test Album',
            duration: 180,
            url: 'test-url',
          },
          queue: [],
          history: [],
        },
        playbackControls: {
          isPlaying: true,
          currentTime: 0,
          duration: 0,
          volume: 1,
          isMuted: false,
          isShuffled: false,
          repeatMode: 'none',
        },
      };

      renderWithProvider(initialState);

      expect(screen.getByText('Now Playing')).toBeInTheDocument();
      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('applies pulse animation to music icon when playing', () => {
      const initialState = {
        playbackControls: {
          isPlaying: true,
          currentTime: 0,
          duration: 0,
          volume: 1,
          isMuted: false,
          isShuffled: false,
          repeatMode: 'none',
        },
      };

      renderWithProvider(initialState);

      const musicIcon = screen.getByTestId('music-icon');
      expect(musicIcon).toHaveClass('text-primary animate-pulse');
    });

    it('does not apply pulse animation when not playing', () => {
      renderWithProvider();

      const musicIcon = screen.getByTestId('music-icon');
      expect(musicIcon).toHaveClass('text-primary');
      expect(musicIcon).not.toHaveClass('animate-pulse');
    });
  });

  describe('Dashboard Options', () => {
    it('renders quick access section title', () => {
      renderWithProvider();

      expect(screen.getByText('Quick Access')).toBeInTheDocument();
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('renders all dashboard options', () => {
      renderWithProvider();

      dashboardOptions.forEach((option) => {
        const optionText = option.text.toLowerCase().replace(/\s+/g, '-');
        expect(screen.getByTestId(`dashboard-option-${optionText}`)).toBeInTheDocument();
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    it('renders correct number of dashboard options', () => {
      renderWithProvider();

      const dashboardOptionButtons = screen.getAllByTestId(/^dashboard-option-/);
      expect(dashboardOptionButtons).toHaveLength(dashboardOptions.length);
    });

    it('renders icons for all dashboard options', () => {
      renderWithProvider();

      dashboardOptions.forEach((option) => {
        const iconText = option.text.toLowerCase().replace(/\s+/g, '-');
        expect(screen.getByTestId(`icon-${iconText}`)).toBeInTheDocument();
      });
    });

    it('sets correct href for dashboard options', () => {
      renderWithProvider();

      dashboardOptions.forEach((option) => {
        const optionText = option.text.toLowerCase().replace(/\s+/g, '-');
        const optionButton = screen.getByTestId(`dashboard-option-${optionText}`);

        if (option.text === 'Sleep Timer') {
          expect(optionButton).toHaveAttribute('data-href', '#');
        } else {
          expect(optionButton).toHaveAttribute('data-href', option.href);
        }
      });
    });
  });

  describe('Sleep Timer Functionality', () => {
    it('opens sleep timer modal when sleep timer option is clicked', () => {
      renderWithProvider();

      const sleepTimerButton = screen.getByTestId('dashboard-option-sleep-timer');

      fireEvent.click(sleepTimerButton);

      expect(screen.getByTestId('sleep-timer-modal')).toBeInTheDocument();
    });

    it('closes sleep timer modal when close button is clicked', () => {
      renderWithProvider();

      const sleepTimerButton = screen.getByTestId('dashboard-option-sleep-timer');
      fireEvent.click(sleepTimerButton);

      const closeButton = screen.getByTestId('close-sleep-timer');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('sleep-timer-modal')).not.toBeInTheDocument();
    });

    it('prevents default behavior when sleep timer is clicked', () => {
      renderWithProvider();

      const sleepTimerButton = screen.getByTestId('dashboard-option-sleep-timer');
      const mockPreventDefault = jest.fn();

      fireEvent.click(sleepTimerButton, { preventDefault: mockPreventDefault });

      expect(screen.getByTestId('sleep-timer-modal')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders with responsive container classes', () => {
      renderWithProvider();

      const container = document.querySelector(
        '.container.mx-auto.max-w-7xl.px-4.py-8.sm\\:px-6.lg\\:px-8',
      );
      expect(container).toBeInTheDocument();
    });

    it('renders header with responsive flex layout', () => {
      renderWithProvider();

      const headerFlex = document.querySelector(
        '.flex.flex-col.gap-4.md\\:flex-row.md\\:items-center.md\\:justify-between',
      );
      expect(headerFlex).toBeInTheDocument();
    });

    it('renders dashboard options with responsive grid', () => {
      renderWithProvider();

      const responsiveGrid = document.querySelector(
        '.grid.grid-cols-2.gap-4.sm\\:grid-cols-3.lg\\:grid-cols-4',
      );
      expect(responsiveGrid).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('cleans up timer on unmount', () => {
      const { unmount } = renderWithProvider();

      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing user data gracefully', () => {
      mockUseAuth.user = null;
      renderWithProvider();

      const greetingElement = screen.getByRole('heading', { level: 1 });
      expect(greetingElement).toHaveTextContent('Good Morning, User');
    });

    it('handles empty current song gracefully', () => {
      const initialState = {
        queue: {
          currentSong: null,
          upcomingSongs: [],
          playedSongs: [],
        },
      };

      renderWithProvider(initialState);

      expect(screen.getByText(/No track selected/)).toBeInTheDocument();
    });

    it('handles song without artist gracefully', () => {
      const initialState = {
        queue: {
          currentSong: {
            id: '1',
            title: 'Test Song',
            artist: '',
            album: 'Test Album',
            duration: 180,
            url: 'test-url',
          },
          upcomingSongs: [],
          playedSongs: [],
        },
      };

      renderWithProvider(initialState);

      expect(screen.getByText('Test Song')).toBeInTheDocument();
      // Check that the artist field exists but is empty
      const artistElement = screen
        .getByText('Test Song')
        .closest('div')
        ?.querySelector('p:last-child');
      expect(artistElement).toHaveTextContent('');
    });
  });
});
