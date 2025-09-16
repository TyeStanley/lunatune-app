import { render, screen } from '@testing-library/react';
import StoreProvider from '@/providers/StoreProvider';

jest.mock('@/redux/store', () => ({
  makeStore: jest.fn(() => ({
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

jest.mock('react-redux', () => ({
  Provider: ({ children, store }: { children: React.ReactNode; store: unknown }) => (
    <div data-testid="redux-provider" data-store={store ? 'present' : 'missing'}>
      {children}
    </div>
  ),
}));

describe('StoreProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Redux Provider with store', () => {
    render(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>,
    );

    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('redux-provider')).toHaveAttribute('data-store', 'present');
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('creates store and provides it to children', async () => {
    const { makeStore } = await import('@/redux/store');

    render(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>,
    );

    expect(makeStore).toHaveBeenCalled();
    expect(screen.getByTestId('redux-provider')).toHaveAttribute('data-store', 'present');
  });

  it('renders children correctly', () => {
    render(
      <StoreProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </StoreProvider>,
    );

    expect(screen.getByTestId('child-1')).toHaveTextContent('Child 1');
    expect(screen.getByTestId('child-2')).toHaveTextContent('Child 2');
  });
});
