import { renderHook } from '@testing-library/react';
import { useSocket } from '../lib/useSocket';

jest.mock('../lib/socket', () => {
  const listeners = {};
  return {
    on: (event, cb) => { listeners[event] = cb; },
    off: (event, cb) => { if (listeners[event] === cb) delete listeners[event]; },
    emit: (event, data) => { if (listeners[event]) listeners[event](data); },
  };
});

const socket = require('../lib/socket');

test('useSocket executa callback ao receber evento', () => {
  const callback = jest.fn();
  renderHook(() => useSocket('pedido_novo', callback));
  socket.emit('pedido_novo', { id: 1 });
  expect(callback).toHaveBeenCalledWith({ id: 1 });
}); 