import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar conexões SignalR com a API .NET
 */
export const useSignalR = (hubUrl = 'http://localhost:5001/comandasHub') => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const connectionRef = useRef(null);
  const listenersRef = useRef(new Map());

  // Função para conectar ao SignalR Hub
  const connect = useCallback(async () => {
    try {
      // Importar SignalR dinamicamente (se disponível)
      let signalR;
      try {
        signalR = await import('@microsoft/signalr');
      } catch (error) {
        console.warn('SignalR não disponível, usando fallback WebSocket');
        // Fallback para WebSocket básico se SignalR não estiver disponível
        return createWebSocketFallback();
      }

      // Criar conexão SignalR
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      // Configurar handlers de conexão
      connection.onclose((error) => {
        console.log('SignalR connection closed:', error);
        setIsConnected(false);
        setConnectionError(error);
      });

      connection.onreconnecting((error) => {
        console.log('SignalR reconnecting:', error);
        setIsConnected(false);
      });

      connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected:', connectionId);
        setIsConnected(true);
        setConnectionError(null);
      });

      // Iniciar conexão
      await connection.start();
      console.log('SignalR connected successfully');
      
      setIsConnected(true);
      setConnectionError(null);
      connectionRef.current = connection;

      return connection;
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      setConnectionError(error);
      setIsConnected(false);
      throw error;
    }
  }, [hubUrl]);

  // Função para desconectar
  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
        setIsConnected(false);
        connectionRef.current = null;
      } catch (error) {
        console.error('Error disconnecting from SignalR:', error);
      }
    }
  }, []);

  // Função para adicionar listeners de eventos
  const on = useCallback((eventName, callback) => {
    if (!connectionRef.current) {
      console.warn('SignalR not connected, cannot add listener');
      return;
    }

    // Remover listener anterior se existir
    if (listenersRef.current.has(eventName)) {
      connectionRef.current.off(eventName, listenersRef.current.get(eventName));
    }

    // Adicionar novo listener
    connectionRef.current.on(eventName, callback);
    listenersRef.current.set(eventName, callback);
  }, []);

  // Função para remover listeners
  const off = useCallback((eventName) => {
    if (connectionRef.current && listenersRef.current.has(eventName)) {
      connectionRef.current.off(eventName, listenersRef.current.get(eventName));
      listenersRef.current.delete(eventName);
    }
  }, []);

  // Função para enviar mensagens
  const send = useCallback(async (methodName, ...args) => {
    if (!connectionRef.current) {
      throw new Error('SignalR not connected');
    }

    try {
      await connectionRef.current.invoke(methodName, ...args);
    } catch (error) {
      console.error('Error sending SignalR message:', error);
      throw error;
    }
  }, []);

  // Fallback WebSocket para quando SignalR não estiver disponível
  const createWebSocketFallback = () => {
    const wsUrl = hubUrl.replace('/comandasHub', '/ws');
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected (fallback)');
      setIsConnected(true);
      setConnectionError(null);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionError(error);
      setIsConnected(false);
    };

    connectionRef.current = ws;
    return ws;
  };

  // Conectar automaticamente quando o hook é montado
  useEffect(() => {
    connect();

    // Cleanup na desmontagem
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    on,
    off,
    send
  };
};

/**
 * Hook específico para eventos de comandas
 */
export const useComandasSignalR = () => {
  const signalR = useSignalR();

  // Configurar listeners específicos para comandas
  useEffect(() => {
    if (signalR.isConnected) {
      // Listener para novos pedidos
      signalR.on('pedido_novo', (pedido) => {
        console.log('Novo pedido recebido:', pedido);
        // Aqui você pode disparar eventos customizados ou atualizar estado
      });

      // Listener para atualizações de pedidos
      signalR.on('pedido_atualizado', (pedido) => {
        console.log('Pedido atualizado:', pedido);
      });

      // Listener para pagamentos recebidos
      signalR.on('pagamento_recebido', (pagamento) => {
        console.log('Pagamento recebido:', pagamento);
      });

      // Listener para mudanças de status de mesa
      signalR.on('mesa_status', (mesa) => {
        console.log('Status da mesa alterado:', mesa);
      });
    }
  }, [signalR.isConnected]);

  return signalR;
};
