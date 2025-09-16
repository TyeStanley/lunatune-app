// Define types for auth user
interface AuthUser {
  email?: string;
  name?: string;
  picture?: string;
}

// Define types for current user
interface CurrentUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Mock variables
let mockConfigureTokenApi: jest.Mock;
let mockUseAuth: {
  getAccessTokenSilently: jest.Mock;
  isAuthenticated: boolean;
  user: AuthUser | null;
};
let mockCreateUser: jest.Mock;
let mockGetCurrentUserQuery: {
  data: CurrentUser | null;
  isLoading: boolean;
  error: FetchBaseQueryError | null;
};
let mockDispatch: jest.Mock;

jest.mock('../../redux/api/baseApi', () => ({
  configureTokenApi: (fn: (token: string) => Promise<string>) => mockConfigureTokenApi(fn),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

jest.mock('../../redux/api/userApi', () => ({
  useCreateUserMutation: () => [mockCreateUser],
  useGetCurrentUserQuery: () => mockGetCurrentUserQuery,
}));

jest.mock('../../redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act } from 'react';
import UserManager from '../../components/UserManager';
import userReducer from '../../redux/state/user/userSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

describe('UserManager', () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          id: null,
          email: null,
          name: null,
          picture: null,
          createdAt: null,
          updatedAt: null,
        },
      },
    });
  };

  const renderWithProvider = () => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <UserManager />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Initialize mock variables
    mockConfigureTokenApi = jest.fn();
    mockUseAuth = {
      getAccessTokenSilently: jest.fn().mockResolvedValue('mock-token'),
      isAuthenticated: false,
      user: null,
    };
    mockCreateUser = jest.fn().mockResolvedValue({ data: {} });
    mockGetCurrentUserQuery = {
      data: null,
      isLoading: false,
      error: null,
    };
    mockDispatch = jest.fn();
  });

  it('renders nothing (returns null)', () => {
    const { container } = renderWithProvider();
    expect(container.firstChild).toBeNull();
  });

  it('configures token API on mount', () => {
    renderWithProvider();

    expect(mockConfigureTokenApi).toHaveBeenCalledWith(mockUseAuth.getAccessTokenSilently);
  });

  it('configures token API when getAccessTokenSilently changes', () => {
    const { rerender } = renderWithProvider();

    // Change the mock function
    const newTokenFunction = jest.fn();
    mockUseAuth.getAccessTokenSilently = newTokenFunction;

    rerender(
      <Provider store={createMockStore()}>
        <UserManager />
      </Provider>,
    );

    expect(mockConfigureTokenApi).toHaveBeenCalledWith(newTokenFunction);
  });

  it('clears user when not authenticated', async () => {
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.user = null;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/clearUser'),
      }),
    );
  });

  it('does not create user when authenticated but user exists', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock current user exists
    mockGetCurrentUserQuery.data = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('creates user when authenticated, user exists, but current user not found (404 error)', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock 404 error for current user query
    const error404: FetchBaseQueryError = {
      status: 404,
      data: 'Not found',
    };
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = error404;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    });
  });

  it('does not create user when error is not 404', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock 500 error for current user query
    const error500: FetchBaseQueryError = {
      status: 500,
      data: 'Internal server error',
    };
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = error500;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('does not create user when still loading', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock loading state
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = true;
    mockGetCurrentUserQuery.error = null;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('does not create user when no auth user exists', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = null;

    // Mock 404 error for current user query
    const error404: FetchBaseQueryError = {
      status: 404,
      data: 'Not found',
    };
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = error404;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('updates user in Redux when current user exists', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    const currentUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    mockGetCurrentUserQuery.data = currentUser;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = null;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/updateUser'),
        payload: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/picture.jpg',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      }),
    );
  });

  it('handles user creation error gracefully', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock 404 error for current user query
    const error404: FetchBaseQueryError = {
      status: 404,
      data: 'Not found',
    };
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = error404;

    // Mock createUser to throw an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreateUser.mockRejectedValue(new Error('Creation failed'));

    await act(async () => {
      renderWithProvider();
    });

    expect(consoleSpy).toHaveBeenCalledWith('UserManager: Error creating user:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('handles user with missing name and picture', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: undefined,
      picture: undefined,
    };

    // Mock 404 error for current user query
    const error404: FetchBaseQueryError = {
      status: 404,
      data: 'Not found',
    };
    mockGetCurrentUserQuery.data = null;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = error404;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: undefined,
      picture: undefined,
    });
  });

  it('handles current user with partial data', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    const currentUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      picture: null,
      createdAt: null,
      updatedAt: null,
    };

    mockGetCurrentUserQuery.data = currentUser;
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = null;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/updateUser'),
        payload: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          picture: null,
          createdAt: null,
          updatedAt: null,
        },
      }),
    );
  });

  it('skips user creation when current user already exists', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    // Mock current user exists
    mockGetCurrentUserQuery.data = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    mockGetCurrentUserQuery.isLoading = false;
    mockGetCurrentUserQuery.error = null;

    await act(async () => {
      renderWithProvider();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/updateUser'),
      }),
    );
  });

  it('handles authentication state changes', async () => {
    // Start with not authenticated
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.user = null;

    const { rerender } = renderWithProvider();

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/clearUser'),
      }),
    );

    // Change to authenticated
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
    };

    mockGetCurrentUserQuery.data = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    await act(async () => {
      rerender(
        <Provider store={createMockStore()}>
          <UserManager />
        </Provider>,
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('user/updateUser'),
      }),
    );
  });
});
