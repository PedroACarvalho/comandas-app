import React, { useEffect, useState } from 'react';
import socket from '../../lib/socket';
import Notification from '../../components/ui/Notification';

const notificationSound = new Audio('/notification.mp3');

const statusOptions = [
  'Todos',
  'Cozinha',
  'Preparando',
  'Pronto',
  'Entregue',
];
const statusOptionsCard = [
  'Cozinha',
  'Preparando',
  'Pronto',
  'Entregue',
];

const fetchPedidos = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/pedidos');
    const data = await res.json();
    return data.pedidos || [];
  } catch {
    return [];
  }
};

const updatePedidoStatus = async (pedido_id, status) => {
  await fetch(`http://localhost:5001/api/pedidos/${pedido_id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

function getComandaStatus(pedido) {
  if (pedido.status === 'Pago') return { label: 'Paga', color: 'bg-green-500' };
  if (pedido.fechado) return { label: 'Em Fechamento', color: 'bg-yellow-400 text-black' };
  return { label: 'Aberta', color: 'bg-blue-500' };
}

/**
 * BackofficeOrders: Página de gestão de pedidos em tempo real no backoffice (WebSocket, filtros, busca, feedback visual).
 */
const BackofficeOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [notification, setNotification] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchPedidos().then(setPedidos);
    const handleNovo = (pedido) => {
      setPedidos((prev) => {
        const idx = prev.findIndex(p => p.pedido_id === pedido.pedido_id);
        if (idx !== -1) {
          // Atualiza pedido existente
          const updated = [...prev];
          updated[idx] = pedido;
          return updated;
        } else {
          // Adiciona novo pedido no início
          return [pedido, ...prev];
        }
      });
      setNotification({ message: `Novo pedido #${pedido.pedido_id}`, type: 'info' });
      notificationSound.play();
    };
    const handleAtualizado = (pedido) => {
      setPedidos((prev) => prev.map(p => p.pedido_id === pedido.pedido_id ? pedido : p));
      setNotification({ message: `Pedido #${pedido.pedido_id} atualizado: ${pedido.status}`, type: 'success' });
      notificationSound.play();
    };
    const handlePagamento = (pagamento) => {
      setPedidos((prev) => prev.map(p =>
        p.pedido_id === pagamento.pedido_id ? { ...p, status: 'Pago' } : p
      ));
      setNotification({ message: `Pagamento confirmado para o pedido #${pagamento.pedido_id}`, type: 'success' });
      notificationSound.play();
    };
    socket.on('pedido_novo', handleNovo);
    socket.on('pedido_atualizado', handleAtualizado);
    socket.on('pagamento_recebido', handlePagamento);
    return () => {
      socket.off('pedido_novo', handleNovo);
      socket.off('pedido_atualizado', handleAtualizado);
      socket.off('pagamento_recebido', handlePagamento);
    };
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleStatusChange = (pedido_id, status) => {
    // Atualização otimista
    setPedidos(prev => prev.map(p => p.pedido_id === pedido_id ? { ...p, status } : p));
    setUpdating(prev => ({ ...prev, [pedido_id]: true }));
    updatePedidoStatus(pedido_id, status).finally(() => {
      setUpdating(prev => ({ ...prev, [pedido_id]: false }));
    });
  };

  const pedidosFiltrados = (statusFiltro === 'Todos' ? pedidos : pedidos.filter(p => p.status === statusFiltro))
    .filter(p => {
      const termo = busca.toLowerCase();
      return (
        String(p.pedido_id).includes(termo) ||
        (p.cliente?.nome && p.cliente.nome.toLowerCase().includes(termo)) ||
        (p.cliente?.mesa && String(p.cliente.mesa).includes(termo))
      );
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestão de Pedidos</h1>
      <p>Visualize e gerencie todos os pedidos do estabelecimento em tempo real.</p>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div>
          <label className="mr-2 font-medium">Filtrar por status:</label>
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar por pedido, cliente ou mesa"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="border rounded px-2 py-1 w-64"
          />
        </div>
      </div>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <ul className="mt-6 space-y-2 max-w-2xl mx-auto">
        {pedidosFiltrados.map((pedido) => (
          <li key={pedido.pedido_id} className="bg-white rounded shadow p-4 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm items-center">
                <div><b>ID:</b> {pedido.pedido_id}</div>
                <div><b>Status:</b> {pedido.status}</div>
                <div><b>Mesa:</b> {pedido.cliente?.mesa ?? '-'}</div>
                <div><b>Cliente:</b> {pedido.cliente?.nome ?? '-'}</div>
                <div><b>Total:</b> R$ {pedido.total}</div>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold text-white ${getComandaStatus(pedido).color}`}>{getComandaStatus(pedido).label}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {statusOptionsCard.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleStatusChange(pedido.pedido_id, opt)}
                    className={`px-3 py-1 rounded font-medium border transition-colors ${pedido.status === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'} ${updating[pedido.pedido_id] ? 'opacity-60 cursor-wait' : ''}`}
                    disabled={pedido.status === opt || updating[pedido.pedido_id]}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {pedido.itens && pedido.itens.length > 0 && (
                <div className="mt-4">
                  <b>Itens do pedido:</b>
                  <ul className="ml-4 list-disc max-h-32 overflow-y-auto pr-2">
                    {pedido.itens.map((item, idx) => (
                      <li key={idx}>
                        {item.quantidade}x {item.item?.nome} {item.observacao ? `- ${item.observacao}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BackofficeOrders; 