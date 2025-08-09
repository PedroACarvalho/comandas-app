import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import socket from '../../lib/socket';
import { Notification } from '../../components/ui/Notification';

const notificationSound = new Audio('/notification.mp3');

// Status das colunas do kanban
const COLUMNS = {
  NOVOS_PEDIDOS: {
    id: 'novos-pedidos',
    title: '📥 Novos Pedidos',
    status: 'Cozinha',
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-800'
  },
  EM_PREPARO: {
    id: 'em-preparo',
    title: '👨‍🍳 Em Preparo',
    status: 'Em Preparo',
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-800'
  },
  PRONTO: {
    id: 'pronto',
    title: '⏳ Aguardando Entrega',
    status: 'Pronto',
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-800'
  },
  ENTREGUE: {
    id: 'entregue',
    title: '✅ Entregue',
    status: 'Entregue',
    color: 'bg-purple-100 border-purple-300',
    textColor: 'text-purple-800'
  },
  PAGAMENTO_INICIADO: {
    id: 'pagamento-iniciado',
    title: '💰 Aguardando Pagamento',
    status: 'Pagamento Iniciado',
    color: 'bg-orange-100 border-orange-300',
    textColor: 'text-orange-800'
  },
  AGUARDANDO_CONFIRMACAO: {
    id: 'aguardando-confirmacao',
    title: '💵 Aguardando Confirmação',
    status: 'Aguardando Confirmação',
    color: 'bg-red-100 border-red-300',
    textColor: 'text-red-800'
  },
  FINALIZADO: {
    id: 'finalizado',
    title: '🎉 Finalizado',
    status: 'Pago',
    color: 'bg-gray-100 border-gray-300',
    textColor: 'text-gray-800'
  }
};

// Componente para o card do pedido
const PedidoCard = ({ pedido, onConfirmPayment }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `pedido-${pedido.pedido_id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeElapsed = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diff = now - created;
    const minutes = Math.floor(diff / 60000);
    return `${minutes}min`;
  };

  const isUrgent = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diff = now - created;
    const minutes = Math.floor(diff / 60000);
    return minutes > 15; // Urgente após 15 minutos
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 md:p-4 mb-3 rounded-lg border-2 cursor-move hover:shadow-md transition-all ${
        isUrgent(pedido.data_hora) ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-base md:text-lg">#{pedido.pedido_id}</h3>
        <div className="text-xs md:text-sm text-gray-600">
          {formatTime(pedido.data_hora)}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="font-semibold text-sm">
          Mesa {pedido.cliente?.mesa} - {pedido.cliente?.nome}
        </div>
        <div className="text-xs text-gray-500">
          {getTimeElapsed(pedido.data_hora)} • {pedido.itens?.length || 0} itens
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {pedido.itens?.map((item, index) => (
          <div key={index} className="text-xs md:text-sm flex justify-between">
            <span className="truncate mr-2">{item.quantidade}x {item.item?.nome}</span>
            <span className="text-gray-600 flex-shrink-0">R$ {(item.item?.preco * item.quantidade).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">
          R$ {pedido.total?.toFixed(2) || '0.00'}
        </div>
        
        {pedido.status === 'Aguardando Confirmação' && (
          <button
            onClick={() => onConfirmPayment(pedido.pedido_id)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            Confirmar Pagamento
          </button>
        )}
      </div>
    </div>
  );
};

// Componente para a coluna do kanban
const KanbanColumn = ({ column, pedidos, onConfirmPayment }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="w-full">
      <div className={`p-4 rounded-t-lg border-2 ${column.color}`}>
        <h2 className={`font-bold text-lg ${column.textColor}`}>
          {column.title}
        </h2>
        <div className="text-sm text-gray-600 mt-1">
          {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className="p-4 bg-gray-50 min-h-96 rounded-b-lg border-2 border-dashed border-gray-300"
      >
        <SortableContext items={pedidos.map(p => `pedido-${p.pedido_id}`)}>
          {pedidos.map((pedido) => (
            <PedidoCard 
              key={pedido.pedido_id} 
              pedido={pedido}
              onConfirmPayment={onConfirmPayment}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

/**
 * KitchenBoard: Quadro kanban para gestão de pedidos na cozinha
 */
const KitchenBoard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Carregar pedidos
  const fetchPedidos = async () => {
    try {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      setPedidos(data.pedidos || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido
  const updatePedidoStatus = async (pedidoId, newStatus) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await fetchPedidos(); // Recarregar pedidos
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Confirmar pagamento em dinheiro
  const confirmPayment = async (pedidoId) => {
    try {
      // Primeiro, buscar o pagamento do pedido
      const pagamentoResponse = await fetch(`/api/pagamentos/pedido/${pedidoId}`);
      const pagamentoData = await pagamentoResponse.json();
      
      if (pagamentoData.pagamento) {
        const confirmResponse = await fetch(`/api/pagamentos/${pagamentoData.pagamento.pagamento_id}/confirmar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (confirmResponse.ok) {
          setNotification({ 
            message: 'Pagamento confirmado com sucesso!', 
            type: 'success' 
          });
          await fetchPedidos();
        }
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      setNotification({ 
        message: 'Erro ao confirmar pagamento', 
        type: 'error' 
      });
    }
  };

  // WebSocket para atualizações em tempo real
  useEffect(() => {
    const handleNovoPedido = (pedido) => {
      setPedidos(prev => {
        // Verificar se o pedido já existe
        const exists = prev.find(p => p.pedido_id === pedido.pedido_id);
        if (!exists) {
          setNotification({ 
            message: `Novo pedido #${pedido.pedido_id} recebido!`, 
            type: 'success' 
          });
          notificationSound.play();
          return [...prev, pedido];
        }
        return prev;
      });
    };

    const handlePedidoAtualizado = (pedido) => {
      setPedidos(prev => 
        prev.map(p => p.pedido_id === pedido.pedido_id ? pedido : p)
      );
    };

    socket.on('pedido_novo', handleNovoPedido);
    socket.on('pedido_atualizado', handlePedidoAtualizado);

    return () => {
      socket.off('pedido_novo', handleNovoPedido);
      socket.off('pedido_atualizado', handlePedidoAtualizado);
    };
  }, []);

  // Carregar pedidos iniciais
  useEffect(() => {
    fetchPedidos();
  }, []);

  // Gerenciar notificações
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Função para lidar com drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const pedidoId = active.id.replace('pedido-', '');
      
      // Encontrar a coluna de destino
      let targetColumnId = over.id;
      
      // Se o over.id não for uma coluna, pode ser um pedido
      // Nesse caso, precisamos encontrar a coluna pai
      if (!targetColumnId.startsWith('novos-pedidos') && 
          !targetColumnId.startsWith('em-preparo') && 
          !targetColumnId.startsWith('pronto') && 
          !targetColumnId.startsWith('entregue') && 
          !targetColumnId.startsWith('pagamento-iniciado') && 
          !targetColumnId.startsWith('aguardando-confirmacao') && 
          !targetColumnId.startsWith('finalizado')) {
        // Se não for uma coluna, não fazer nada
        return;
      }
      
      const targetColumn = Object.values(COLUMNS).find(col => col.id === targetColumnId);
      
      if (targetColumn) {
        console.log(`Movendo pedido ${pedidoId} para ${targetColumn.status}`);
        updatePedidoStatus(pedidoId, targetColumn.status);
      }
    }
  };

  // Organizar pedidos por coluna
  const getPedidosByColumn = (columnStatus) => {
    return pedidos.filter(pedido => pedido.status === columnStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          🍽️ Quadro da Cozinha
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Gerencie os pedidos arrastando entre as colunas
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
          <KanbanColumn 
            column={COLUMNS.NOVOS_PEDIDOS}
            pedidos={getPedidosByColumn(COLUMNS.NOVOS_PEDIDOS.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.EM_PREPARO}
            pedidos={getPedidosByColumn(COLUMNS.EM_PREPARO.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.PRONTO}
            pedidos={getPedidosByColumn(COLUMNS.PRONTO.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.ENTREGUE}
            pedidos={getPedidosByColumn(COLUMNS.ENTREGUE.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.PAGAMENTO_INICIADO}
            pedidos={getPedidosByColumn(COLUMNS.PAGAMENTO_INICIADO.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.AGUARDANDO_CONFIRMACAO}
            pedidos={getPedidosByColumn(COLUMNS.AGUARDANDO_CONFIRMACAO.status)}
            onConfirmPayment={confirmPayment}
          />
          
          <KanbanColumn 
            column={COLUMNS.FINALIZADO}
            pedidos={getPedidosByColumn(COLUMNS.FINALIZADO.status)}
            onConfirmPayment={confirmPayment}
          />
        </div>
      </DndContext>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default KitchenBoard;
