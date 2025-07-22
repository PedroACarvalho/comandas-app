import { useState, useCallback } from 'react';

/**
 * useLoading: Hook para controlar estado de loading em componentes.
 * @returns {[boolean, function, function]} [loading, startLoading, stopLoading]
 */
export function useLoading() {
  const [loading, setLoading] = useState(false);
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  return [loading, startLoading, stopLoading];
} 