import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/backoffice/dashboard' },
  { label: 'Pedidos', path: '/backoffice/orders' },
  { label: 'Mesas', path: '/backoffice/tables' },
  { label: 'Pagamentos', path: '/backoffice/payments' },
  { label: 'Relatórios', path: '/backoffice/reports' },
  { label: 'Configurações', path: '/backoffice/settings' },
];

/**
 * BackofficeLayout: Layout principal do painel do estabelecimento (sidebar, header, Outlet).
 */
const BackofficeLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar responsivo */}
      <aside className={`fixed z-40 inset-y-0 left-0 w-60 bg-white shadow-md flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 font-bold text-xl border-b flex items-center justify-between md:block">
          PDV
          <button className="md:hidden ml-4" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded mb-2 font-medium transition-colors ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Overlay para mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow p-4 font-semibold text-lg flex items-center justify-between">
          <button className="md:hidden mr-4 text-2xl" onClick={() => setSidebarOpen(true)}>&#9776;</button>
          <span>Painel do Estabelecimento</span>
        </header>
        <main className="flex-1 p-2 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout; 