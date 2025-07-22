import { renderHook, act } from '@testing-library/react';
import { useLoading } from '../lib/useLoading';

test('useLoading controla estado de loading', () => {
  const { result } = renderHook(() => useLoading());
  const [loading, startLoading, stopLoading] = result.current;

  expect(loading).toBe(false);

  act(() => { startLoading(); });
  expect(result.current[0]).toBe(true);

  act(() => { stopLoading(); });
  expect(result.current[0]).toBe(false);
}); 