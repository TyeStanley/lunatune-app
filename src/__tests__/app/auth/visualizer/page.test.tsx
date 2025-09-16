import { render, screen } from '@testing-library/react';
import Visualizer from '@/app/(auth)/visualizer/page';

jest.mock('@/components/AudioVisualizer', () => {
  const AudioVisualizerMock = () => (
    <div data-testid="audio-visualizer">Audio Visualizer Component</div>
  );
  AudioVisualizerMock.displayName = 'AudioVisualizerMock';
  return AudioVisualizerMock;
});

describe('Visualizer', () => {
  it('renders the AudioVisualizer component', () => {
    render(<Visualizer />);
    expect(screen.getByTestId('audio-visualizer')).toBeInTheDocument();
    expect(screen.getByText('Audio Visualizer Component')).toBeInTheDocument();
  });

  it('renders the header with title and description', () => {
    render(<Visualizer />);
    expect(screen.getByText('Visualizer')).toBeInTheDocument();
    expect(screen.getByText('Audio visualization in real-time')).toBeInTheDocument();
  });

  it('renders the back button with correct link and styling', () => {
    render(<Visualizer />);
    const backButton = screen.getByText('Back to Dashboard');
    expect(backButton).toBeInTheDocument();

    // Check that it's a link to the dashboard
    const link = backButton.closest('a');
    expect(link).toHaveAttribute('href', '/dashboard');

    // Check that it has the expected styling classes
    expect(link).toHaveClass(
      'bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
    );
  });

  it('renders the arrow left icon in the back button', () => {
    render(<Visualizer />);
    const backButton = screen.getByText('Back to Dashboard');
    const link = backButton.closest('a');

    // Check that the arrow icon is present
    const arrowIcon = link?.querySelector('svg');
    expect(arrowIcon).toBeInTheDocument();
  });

  it('renders the complete page structure', () => {
    render(<Visualizer />);

    // Check that all main elements are present
    expect(screen.getByTestId('audio-visualizer')).toBeInTheDocument();
    expect(screen.getByText('Visualizer')).toBeInTheDocument();
    expect(screen.getByText('Audio visualization in real-time')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});
