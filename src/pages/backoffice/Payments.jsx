import React, { useEffect, useState } from 'react';
import socket from '../../lib/socket';
import Notification from '../../components/ui/Notification';

const notificationSound = new Audio('/notification.mp3');

/**
 * BackofficePayments: Página de acompanhamento de pagamentos em tempo real no backoffice (WebSocket, feedback visual).
 */
const BackofficePayments = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handlePagamento = (pagamento) => {
      setPagamentos((prev) => [...prev, pagamento]);
      setNotification({ message: `Novo pagamento para o pedido #${pagamento.pedido_id}`, type: 'success' });
      notificationSound.play();
    };
    socket.on('pagamento_recebido', handlePagamento);
    return () => {
      socket.off('pagamento_recebido', handlePagamento);
    };
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestão de Pagamentos</h1>
      <p>Acompanhe e gerencie todos os pagamentos realizados no estabelecimento.</p>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <ul className="mt-6 space-y-2 max-w-2xl mx-auto">
        {pagamentos.map((pagamento, idx) => (
          <li key={pagamento.pagamento_id || idx} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
            <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1">
              <div><b>ID:</b> {pagamento.pagamento_id}</div>
              <div><b>Pedido:</b> {pagamento.pedido_id}</div>
              <div><b>Método:</b> {pagamento.metodo}</div>
              <div><b>Valor:</b> R$ {pagamento.valor}</div>
              <div><b>Status:</b> {pagamento.gateway_status || 'N/A'}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BackofficePayments; 