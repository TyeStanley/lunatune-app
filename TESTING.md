# Testing Guide

This project uses Jest and React Testing Library for testing.

## Setup

The testing setup includes:

- **Jest** - Testing framework
- **React Testing Library** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **@testing-library/user-event** - User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test File Structure

Tests are organized in the `src/__tests__` directory, mirroring the source code structure:

```
src/
├── __tests__/
│   ├── components/          # Component tests
│   ├── lib/utils/          # Utility function tests
│   └── redux/              # Redux slice tests
```

## Writing Tests

### Component Tests

```tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Utility Function Tests

```tsx
import { myUtilityFunction } from '@/lib/utils/myUtility';

describe('myUtilityFunction', () => {
  it('returns expected result', () => {
    const result = myUtilityFunction('input');
    expect(result).toBe('expected output');
  });

  it('handles edge cases', () => {
    const result = myUtilityFunction('');
    expect(result).toBe('');
  });
});
```

### Redux Slice Tests

```tsx
import { mySlice, myAction } from '@/redux/state/mySlice';

describe('mySlice', () => {
  it('handles actions correctly', () => {
    const initialState = { value: 0 };
    const newState = mySlice.reducer(initialState, myAction(5));
    expect(newState.value).toBe(5);
  });
});
```

## Testing Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
3. **Write accessible tests** - If your tests are accessible, your app will be too
4. **Test user interactions** - Use `userEvent` to simulate real user behavior
5. **Keep tests simple** - Each test should have a single responsibility

## Available Matchers

Thanks to `@testing-library/jest-dom`, you have access to custom matchers:

- `toBeInTheDocument()` - Check if element is in the DOM
- `toHaveClass()` - Check if element has specific CSS class
- `toHaveAttribute()` - Check if element has specific attribute
- `toBeVisible()` - Check if element is visible
- `toBeDisabled()` - Check if element is disabled
- `toHaveValue()` - Check input value
- And many more...

## Mocking

The setup includes mocks for:

- Next.js router (`next/router` and `next/navigation`)
- Tauri API (`@tauri-apps/api`)

Add additional mocks in `jest.setup.js` as needed.

## Coverage

Run `npm run test:coverage` to generate a coverage report. The configuration excludes:

- TypeScript declaration files (`.d.ts`)
- Story files (`.stories.*`)
- Build directories (`.next`, `node_modules`, `src-tauri`)
