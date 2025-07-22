import { io } from 'socket.io-client';

/**
 * socket: Instância global do socket.io-client conectada ao backend para eventos em tempo real.
 */
const socket = io('http://localhost:5001', {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket; 