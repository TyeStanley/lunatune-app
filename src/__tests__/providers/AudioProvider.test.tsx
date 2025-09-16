import { render, screen } from '@testing-library/react';
import AudioProvider, { useAudio } from '@/providers/AudioProvider';

const mockAudioRef = { current: null };
const mockSource = {} as MediaElementAudioSourceNode;
const mockAudioContext = {} as AudioContext;
const mockAnalyser = {} as AnalyserNode;

function TestComponent() {
  const audio = useAudio();
  return (
    <div>
      <span data-testid="has-current-ref">{audio.currentAudioRef ? 'yes' : 'no'}</span>
      <span data-testid="has-audio-context">{audio.audioContext ? 'yes' : 'no'}</span>
      <span data-testid="has-analyser">{audio.analyser ? 'yes' : 'no'}</span>
    </div>
  );
}

describe('AudioProvider', () => {
  it('renders children and provides audio context', () => {
    render(
      <AudioProvider
        currentAudioRef={mockAudioRef}
        audioRef1={mockAudioRef}
        audioRef2={mockAudioRef}
        source1={mockSource}
        source2={mockSource}
        audioContext={mockAudioContext}
        analyser={mockAnalyser}
      >
        <TestComponent />
      </AudioProvider>,
    );

    expect(screen.getByTestId('has-current-ref')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-audio-context')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-analyser')).toHaveTextContent('yes');
  });

  it('renders children without audio context when values are null', () => {
    render(
      <AudioProvider
        currentAudioRef={mockAudioRef}
        audioRef1={mockAudioRef}
        audioRef2={mockAudioRef}
        source1={null}
        source2={null}
        audioContext={null}
        analyser={null}
      >
        <TestComponent />
      </AudioProvider>,
    );

    expect(screen.getByTestId('has-current-ref')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-audio-context')).toHaveTextContent('no');
    expect(screen.getByTestId('has-analyser')).toHaveTextContent('no');
  });
});

describe('useAudio hook', () => {
  it('throws error when used outside AudioProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAudio must be used within an AudioProvider');

    consoleSpy.mockRestore();
  });
});
