import { useState, useEffect, useCallback } from 'react';
import { listarMesas, criarMesa, editarMesa, deletarMesa } from '../dataService';

export function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarMesas();
      setTables(data.mesas || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const addTable = async (tableData) => {
    setLoading(true);
    setError(null);
    try {
      const newTable = await criarMesa(tableData);
      setTables((prev) => [...prev, newTable]);
      return newTable;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTable = async (id, tableData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await editarMesa(id, tableData);
      setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTable = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deletarMesa(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tables,
    loading,
    error,
    fetchTables,
    addTable,
    editTable,
    removeTable,
  };
} 