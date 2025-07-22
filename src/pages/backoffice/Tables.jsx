import React, { useEffect, useState } from 'react';
import { listarMesas, criarMesa, editarMesa, deletarMesa } from '../../dataService';
import Notification from '../../components/ui/Notification';

const initialForm = { numero: '', capacidade: '' };

/**
 * BackofficeTables: Página de gestão de mesas no backoffice (CRUD, feedback visual, integração com API).
 */
const BackofficeTables = () => {
  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMesas = async () => {
    setLoading(true);
    try {
      const data = await listarMesas();
      setMesas(data);
    } catch (e) {
      setNotification({ message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMesas(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await editarMesa(editId, form);
        setNotification({ message: 'Mesa editada com sucesso!', type: 'success' });
      } else {
        await criarMesa(form);
        setNotification({ message: 'Mesa criada com sucesso!', type: 'success' });
      }
      setForm(initialForm);
      setEditId(null);
      fetchMesas();
    } catch (e) {
      setNotification({ message: e.message, type: 'error' });
    }
  };

  const handleEdit = mesa => {
    setForm({ numero: mesa.numero, capacidade: mesa.capacidade });
    setEditId(mesa.mesa_id);
  };

  const handleDelete = async mesa_id => {
    if (!window.confirm('Tem certeza que deseja deletar esta mesa?')) return;
    try {
      await deletarMesa(mesa_id);
      setNotification({ message: 'Mesa deletada!', type: 'success' });
      fetchMesas();
    } catch (e) {
      setNotification({ message: e.message, type: 'error' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestão de Mesas</h1>
      <p className="mb-4">Gerencie as mesas do estabelecimento: adicione, edite e remova mesas.</p>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <input name="numero" type="number" min="1" required placeholder="Número da mesa" value={form.numero} onChange={handleChange} className="border p-2 rounded w-32" />
          <input name="capacidade" type="number" min="1" required placeholder="Capacidade" value={form.capacidade} onChange={handleChange} className="border p-2 rounded w-32" />
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? 'Salvar Edição' : 'Adicionar Mesa'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setForm(initialForm); setEditId(null); }} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          )}
        </div>
      </form>
      <ul className="space-y-2">
        {loading ? <li>Carregando...</li> : mesas.map((mesa) => (
          <li key={mesa.mesa_id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
            <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1">
              <div><b>ID:</b> {mesa.mesa_id}</div>
              <div><b>Número:</b> {mesa.numero}</div>
              <div><b>Capacidade:</b> {mesa.capacidade}</div>
              <div><b>Status:</b> {mesa.status}</div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button onClick={() => handleEdit(mesa)} className="bg-yellow-400 px-3 py-1 rounded">Editar</button>
              <button onClick={() => handleDelete(mesa.mesa_id)} className="bg-red-500 text-white px-3 py-1 rounded">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BackofficeTables; 