import { render, screen } from '@testing-library/react';
import AuthProvider from '@/providers/AuthProvider';

jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({
    children,
    domain,
    clientId,
    authorizationParams,
    cacheLocation,
  }: {
    children: React.ReactNode;
    domain: string;
    clientId: string;
    authorizationParams: { redirect_uri: string; audience?: string };
    cacheLocation: string;
  }) => (
    <div data-testid="auth0-provider">
      <span data-testid="domain">{domain}</span>
      <span data-testid="client-id">{clientId}</span>
      <span data-testid="redirect-uri">{authorizationParams.redirect_uri}</span>
      <span data-testid="audience">{authorizationParams.audience}</span>
      <span data-testid="cache-location">{cacheLocation}</span>
      {children}
    </div>
  ),
}));

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('AuthProvider', () => {
  it('renders Auth0Provider with correct configuration', () => {
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'test-domain.auth0.com';
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'test-client-id';
    process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL = 'http://localhost:3000/callback';
    process.env.NEXT_PUBLIC_AUTH0_AUDIENCE = 'test-audience';

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth0-provider')).toBeInTheDocument();
    expect(screen.getByTestId('domain')).toHaveTextContent('test-domain.auth0.com');
    expect(screen.getByTestId('client-id')).toHaveTextContent('test-client-id');
    expect(screen.getByTestId('redirect-uri')).toHaveTextContent('http://localhost:3000/callback');
    expect(screen.getByTestId('audience')).toHaveTextContent('test-audience');
    expect(screen.getByTestId('cache-location')).toHaveTextContent('localstorage');
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders null when required environment variables are missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Missing required Auth0 configuration');

    consoleSpy.mockRestore();
  });

  it('renders null when domain is missing', () => {
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'test-client-id';
    process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL = 'http://localhost:3000/callback';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Missing required Auth0 configuration');

    consoleSpy.mockRestore();
  });

  it('renders null when clientId is missing', () => {
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'test-domain.auth0.com';
    process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL = 'http://localhost:3000/callback';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Missing required Auth0 configuration');

    consoleSpy.mockRestore();
  });

  it('renders null when callbackUrl is missing', () => {
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'test-domain.auth0.com';
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'test-client-id';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Missing required Auth0 configuration');

    consoleSpy.mockRestore();
  });
});
