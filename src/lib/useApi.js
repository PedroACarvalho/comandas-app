import { useState, useEffect, useCallback } from 'react';

/**
 * useApi: Hook para requisições assíncronas (GET, POST, etc.) com loading, erro, dados e refetch.
 * Atualizado para trabalhar com a API .NET.
 * @param {function} apiFn - Função que retorna uma Promise (ex: () => apiService.getTables())
 * @param {array} deps - Dependências para disparar a requisição automaticamente
 * @param {object} options - Opções adicionais
 * @returns {object} { data, loading, error, refetch }
 */
export function useApi(apiFn, deps = [], options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { 
    autoFetch = true, 
    onSuccess, 
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const fetchData = useCallback(async (retryAttempt = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFn();
      
      // Processar resposta da API .NET
      let processedData = result;
      
      // Se a resposta tem propriedades específicas da API .NET, extrair dados
      if (result && typeof result === 'object') {
        // Para endpoints que retornam arrays diretamente
        if (Array.isArray(result)) {
          processedData = result;
        }
        // Para endpoints que retornam objetos com propriedades específicas
        else if (result.mesas_disponiveis) {
          processedData = result.mesas_disponiveis;
        }
        else if (result.pedidos) {
          processedData = result.pedidos;
        }
        else if (result.itens) {
          processedData = result.itens;
        }
        else if (result.categorias) {
          processedData = result.categorias;
        }
        else if (result.clientes) {
          processedData = result.clientes;
        }
        else if (result.pagamentos) {
          processedData = result.pagamentos;
        }
      }
      
      setData(processedData);
      
      if (onSuccess) {
        onSuccess(processedData);
      }
      
    } catch (e) {
      console.error('API Error:', e);
      
      // Tentar novamente se configurado
      if (retryAttempt < retryCount) {
        setTimeout(() => {
          fetchData(retryAttempt + 1);
        }, retryDelay);
        return;
      }
      
      setError(e);
      
      if (onError) {
        onError(e);
      }
    } finally {
      setLoading(false);
    }
  }, [...deps, onSuccess, onError, retryCount, retryDelay]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { 
    data, 
    loading, 
    error, 
    refetch: () => fetchData(0),
    setData // Permitir atualização manual dos dados
  };
} 