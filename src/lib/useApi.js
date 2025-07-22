import { useState, useEffect, useCallback } from 'react';

/**
 * useApi: Hook para requisições assíncronas (GET, POST, etc.) com loading, erro, dados e refetch.
 * @param {function} apiFn - Função que retorna uma Promise (ex: () => apiService.getTables())
 * @param {array} deps - Dependências para disparar a requisição automaticamente
 * @returns {object} { data, loading, error, refetch }
 */
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 