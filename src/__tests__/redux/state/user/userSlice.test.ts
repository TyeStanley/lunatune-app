import { userSlice, updateUser, clearUser } from '@/redux/state/user/userSlice';

const initialState = {
  id: null,
  email: null,
  name: null,
  picture: null,
  createdAt: null,
  updatedAt: null,
};

describe('userSlice', () => {
  it('should return the initial state', () => {
    expect(userSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle updateUser', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.jpg',
    };

    const actual = userSlice.reducer(initialState, updateUser(mockUser));
    expect(actual.id).toBe(mockUser.id);
    expect(actual.name).toBe(mockUser.name);
    expect(actual.email).toBe(mockUser.email);
    expect(actual.picture).toBe(mockUser.picture);
  });

  it('should handle partial updateUser', () => {
    const stateWithUser = {
      ...initialState,
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    const actual = userSlice.reducer(stateWithUser, updateUser({ name: 'Updated Name' }));
    expect(actual.name).toBe('Updated Name');
    expect(actual.id).toBe('1'); // Should remain unchanged
    expect(actual.email).toBe('test@example.com'); // Should remain unchanged
  });

  it('should handle clearUser', () => {
    const stateWithUser = {
      ...initialState,
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.jpg',
    };

    const actual = userSlice.reducer(stateWithUser, clearUser());
    expect(actual).toEqual(initialState);
  });
});
