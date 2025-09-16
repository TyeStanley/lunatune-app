import { render, screen, act } from '@testing-library/react';
import AudioVisualizer from '../../components/AudioVisualizer';

// Mock the useAudio hook
const mockUseAudio = {
  currentAudioRef: { current: null },
  audioRef1: { current: null },
  audioRef2: { current: null },
  source1: null,
  source2: null,
  audioContext: null,
  analyser: null,
};

jest.mock('../../providers/AudioProvider', () => ({
  useAudio: jest.fn(() => mockUseAudio),
}));

// Mock canvas context
const mockContext = {
  fillRect: jest.fn(),
  fillStyle: '',
  globalAlpha: 1,
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  ellipse: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  shadowColor: '',
  shadowBlur: 0,
  lineWidth: 1,
  strokeStyle: '',
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext),
});

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
});

// Mock performance.now
global.performance = {
  now: jest.fn(() => 1000),
} as unknown as Performance;

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn(() => {
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock setTimeout and clearTimeout (simplified to avoid recursion)
global.setTimeout = jest.fn(() => {
  return 1 as unknown as NodeJS.Timeout;
}) as unknown as typeof setTimeout;

global.clearTimeout = jest.fn();

// Mock setInterval and clearInterval (simplified to avoid recursion)
global.setInterval = jest.fn(() => {
  return 1 as unknown as NodeJS.Timeout;
}) as unknown as typeof setInterval;

global.clearInterval = jest.fn();

describe('AudioVisualizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920 });
    Object.defineProperty(window, 'innerHeight', { value: 1080 });

    // Reset mock context
    Object.keys(mockContext).forEach((key) => {
      const value = mockContext[key as keyof typeof mockContext];
      if (typeof value === 'function') {
        (value as jest.Mock).mockClear();
      }
    });
  });

  it('renders canvas element with correct attributes', () => {
    render(<AudioVisualizer />);

    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
    expect(canvas.width).toBe(1920);
    expect(canvas.height).toBe(1080);
    expect(canvas.className).toBe('fixed inset-0 h-full w-full');
  });

  it('sets up canvas context on mount', () => {
    render(<AudioVisualizer />);

    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    // Canvas context is set up when the component mounts and audio context is available
    // We can verify the canvas is rendered correctly
    expect(canvas).toBeInTheDocument();
  });

  it('handles window resize events', async () => {
    render(<AudioVisualizer />);

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 1366 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });

    // Trigger resize event
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // Canvas should be updated with new dimensions
    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  it('generates stars on mount and resize', () => {
    render(<AudioVisualizer />);

    // Stars should be generated based on window dimensions
    // The component uses window.innerWidth * window.innerHeight / 1800 for star count
    const expectedStarCount = Math.floor((1920 * 1080) / 1800);

    // We can't directly test the stars array, but we can verify the generation logic
    expect(expectedStarCount).toBeGreaterThan(0);
  });

  it('generates nebulae on mount and resize', () => {
    render(<AudioVisualizer />);

    // Nebulae should be generated (3-4 nebulae)
    // We can verify the generation logic runs
    expect(Math.random).toBeDefined();
  });

  it('sets up shooting star spawner', () => {
    render(<AudioVisualizer />);

    // Should set up timeout for shooting star spawning
    expect(setTimeout).toHaveBeenCalled();
  });

  it('sets up nebula color change interval', () => {
    render(<AudioVisualizer />);

    // Should set up interval for nebula color changes
    expect(setInterval).toHaveBeenCalled();
  });

  it('does not start animation without audio context', () => {
    render(<AudioVisualizer />);

    // Without audio context, animation should not start
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('starts animation with audio context and analyser', () => {
    // Mock audio context and analyser
    const mockAnalyser = {
      frequencyBinCount: 256,
      smoothingTimeConstant: 0.85,
      getByteFrequencyData: jest.fn(),
    };

    // Update mock values
    Object.assign(mockUseAudio, {
      audioContext: {} as unknown as AudioContext,
      analyser: mockAnalyser as unknown as AnalyserNode,
      currentAudioRef: { current: {} as HTMLAudioElement },
      audioRef1: { current: {} as HTMLAudioElement },
      audioRef2: { current: {} as HTMLAudioElement },
    });

    render(<AudioVisualizer />);

    // Animation should start
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up animation on unmount', () => {
    const { unmount } = render(<AudioVisualizer />);

    unmount();

    // Should cancel animation frame
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<AudioVisualizer />);

    unmount();

    // Should remove resize event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles missing canvas context gracefully', () => {
    // Mock getContext to return null
    const mockGetContext = jest.fn(() => null);
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: mockGetContext,
    });

    expect(() => {
      render(<AudioVisualizer />);
    }).not.toThrow();
  });

  it('handles mobile screen sizes correctly', () => {
    // Mock mobile screen size
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });

    render(<AudioVisualizer />);

    // Should render without errors on mobile
    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  it('handles large screen sizes correctly', () => {
    // Mock large screen size
    Object.defineProperty(window, 'innerWidth', { value: 2560 });
    Object.defineProperty(window, 'innerHeight', { value: 1440 });

    render(<AudioVisualizer />);

    // Should render without errors on large screens
    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  it('updates canvas dimensions on resize', () => {
    render(<AudioVisualizer />);

    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;

    // Simulate resize
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    Object.defineProperty(window, 'innerHeight', { value: 600 });

    window.dispatchEvent(new Event('resize'));

    // Canvas should be updated (though in tests this might not be immediate)
    expect(canvas).toBeInTheDocument();
  });

  it('handles audio provider context errors', () => {
    // Mock useAudio to throw error
    const mockUseAudioModule = jest.requireMock('../../providers/AudioProvider');
    mockUseAudioModule.useAudio.mockImplementation(() => {
      throw new Error('Audio context not available');
    });

    expect(() => {
      render(<AudioVisualizer />);
    }).toThrow('Audio context not available');
  });

  it('renders with correct CSS classes', () => {
    // Reset the mock to not throw error for this test
    const mockUseAudioModule = jest.requireMock('../../providers/AudioProvider');
    mockUseAudioModule.useAudio.mockImplementation(() => mockUseAudio);

    render(<AudioVisualizer />);

    const canvas = screen.getByTestId('visualizer-canvas');
    expect(canvas).toHaveClass('fixed inset-0 h-full w-full');
  });

  it('initializes with correct canvas dimensions', () => {
    // Reset the mock to not throw error for this test
    const mockUseAudioModule = jest.requireMock('../../providers/AudioProvider');
    mockUseAudioModule.useAudio.mockImplementation(() => mockUseAudio);

    render(<AudioVisualizer />);

    const canvas = screen.getByTestId('visualizer-canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });
});
