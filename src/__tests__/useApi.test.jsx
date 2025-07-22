import { renderHook, act } from '@testing-library/react';
import { useApi } from '../lib/useApi';

test('useApi retorna dados após requisição bem-sucedida', async () => {
  const apiFn = jest.fn().mockResolvedValue('ok');
  const { result } = renderHook(() => useApi(apiFn, []));
  expect(result.current.loading).toBe(true);
  await act(async () => {
    await Promise.resolve(); // aguarda useEffect
  });
  expect(result.current.data).toBe('ok');
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
});

test('useApi retorna erro em caso de falha', async () => {
  const apiFn = jest.fn().mockRejectedValue(new Error('fail'));
  const { result } = renderHook(() => useApi(apiFn, []));
  await act(async () => {
    await Promise.resolve();
  });
  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.data).toBeNull();
}); 