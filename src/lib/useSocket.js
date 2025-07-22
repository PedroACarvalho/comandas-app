import { useEffect } from 'react';
import socket from './socket';

/**
 * useSocket: Hook para escutar eventos do socket.io e executar callback ao receber evento.
 * @param {string} event - Nome do evento do socket
 * @param {function} callback - Função a ser executada ao receber o evento
 */
export function useSocket(event, callback) {
  useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
} 