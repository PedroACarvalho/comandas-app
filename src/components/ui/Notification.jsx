import React from 'react';

/**
 * Notification: Exibe uma notificação fixa no topo direito da tela.
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo visual (info, success, error)
 */
export function Notification({ message, type = 'info' }) {
  const color = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold ${color}`}>
      {message}
    </div>
  );
} 