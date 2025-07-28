import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BackofficeLogin from './Login';
import BackofficeDashboard from './Dashboard';
import BackofficeOrders from './Orders';
import BackofficeTables from './Tables';
import BackofficePayments from './Payments';
import BackofficeSettings from './Settings';
import BackofficeReports from './Reports';
import BackofficeLayout from './BackofficeLayout';
import Menu from '../Menu';

/**
 * BackofficeRouter: Define as rotas do painel do estabelecimento, incluindo layout e páginas internas.
 */
const BackofficeRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<BackofficeLogin />} />
      <Route path="/" element={<BackofficeLayout />}>
        <Route path="dashboard" element={<BackofficeDashboard />} />
        <Route path="orders" element={<BackofficeOrders />} />
        <Route path="tables" element={<BackofficeTables />} />
        <Route path="payments" element={<BackofficePayments />} />
        <Route path="settings" element={<BackofficeSettings />} />
        <Route path="reports" element={<BackofficeReports />} />
        <Route path="menu" element={<Menu />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BackofficeRouter; 