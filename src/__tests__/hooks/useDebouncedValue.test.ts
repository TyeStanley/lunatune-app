import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 1000));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 1000 },
    });

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'changed', delay: 1000 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('changed'); // Now should be changed
  });

  it('handles multiple rapid changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 1000 },
    });

    expect(result.current).toBe('initial');

    // Multiple rapid changes
    rerender({ value: 'change1', delay: 1000 });
    act(() => {
      jest.advanceTimersByTime(500); // Half way through delay
    });

    rerender({ value: 'change2', delay: 1000 });
    act(() => {
      jest.advanceTimersByTime(500); // Still half way through new delay
    });

    expect(result.current).toBe('initial'); // Should still be initial

    // Complete the delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('change2'); // Should be the last value
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'changed', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(250); // Half way through 500ms delay
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250); // Complete the delay
    });
    expect(result.current).toBe('changed');
  });

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 0 },
    });

    rerender({ value: 'changed', delay: 0 });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe('changed');
  });

  it('handles number values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 0, delay: 1000 },
    });

    rerender({ value: 42, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(42);
  });

  it('handles boolean values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: false, delay: 1000 },
    });

    rerender({ value: true, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });
});
