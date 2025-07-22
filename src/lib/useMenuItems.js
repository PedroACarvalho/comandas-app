import { useState, useEffect, useCallback } from 'react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from './menuService';

export function useMenuItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await createMenuItem(item);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editItem = async (id, item) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateMenuItem(id, item);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMenuItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    editItem,
    removeItem,
  };
} 