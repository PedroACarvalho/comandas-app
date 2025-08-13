import React, { useState } from 'react';
import { useApi } from '../lib/useApi';
import { apiService } from '../config/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Testar conexão com mesas
  const { data: mesas, loading: mesasLoading, error: mesasError, refetch: refetchMesas } = useApi(
    () => apiService.getTables(),
    [],
    { retryCount: 2 }
  );
  
  const runApiTests = async () => {
    setLoading(true);
    setTestResult(null);
    
    const results = [];
    
    try {
      // Teste 1: Listar mesas
      console.log('Teste 1: Listando mesas...');
      const mesas = await apiService.getTables();
      results.push({
        test: 'Listar Mesas',
        success: true,
        data: mesas,
        message: `Encontradas ${Array.isArray(mesas) ? mesas.length : 0} mesas`
      });
      
      // Teste 2: Criar mesa
      console.log('Teste 2: Criando mesa...');
      const novaMesa = await apiService.createTable({
        numero: 999,
        capacidade: 4
      });
      results.push({
        test: 'Criar Mesa',
        success: true,
        data: novaMesa,
        message: `Mesa ${novaMesa.numero} criada com sucesso`
      });
      
    } catch (error) {
      results.push({
        test: 'Erro Geral',
        success: false,
        error: error.message,
        message: 'Falha na execução dos testes'
      });
    }
    
    setTestResult(results);
    setLoading(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Teste de Integração com API .NET</h1>
      
      {/* Status da API */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Status da API</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="font-medium">API .NET:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${mesasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {mesasError ? '❌ Erro' : '✅ Conectado'}
            </span>
          </div>
        </div>
        
        {mesasError && (
          <div className="mt-2 text-red-600 text-sm">
            Erro: {mesasError.message}
          </div>
        )}
      </div>
      
      {/* Botões de teste */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={runApiTests}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? '🔄 Executando...' : '🚀 Executar Testes'}
        </button>
        
        <button
          onClick={refetchMesas}
          disabled={mesasLoading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          🔄 Atualizar Mesas
        </button>
      </div>
      
      {/* Resultados dos testes */}
      {testResult && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">📊 Resultados dos Testes</h2>
          <div className="space-y-3">
            {testResult.map((result, index) => (
              <div key={index} className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.test}</span>
                  <span className={`px-2 py-1 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.success ? '✅ Sucesso' : '❌ Falha'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {result.message}
                </div>
                {result.error && (
                  <div className="text-sm text-red-600 mt-1">
                    Erro: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Dados das mesas */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">📋 Mesas ({mesasLoading ? 'Carregando...' : Array.isArray(mesas) ? mesas.length : 0})</h2>
        
        {mesasLoading ? (
          <div className="text-gray-500">Carregando mesas...</div>
        ) : mesasError ? (
          <div className="text-red-500">Erro ao carregar mesas: {mesasError.message}</div>
        ) : Array.isArray(mesas) && mesas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesas.map((mesa) => (
              <div key={mesa.mesaId} className="border rounded p-3">
                <div className="font-medium">Mesa {mesa.numero}</div>
                <div className="text-sm text-gray-600">
                  Capacidade: {mesa.capacidade} pessoas
                </div>
                <div className={`text-sm mt-1 px-2 py-1 rounded inline-block ${
                  mesa.status === 'livre' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {mesa.status === 'livre' ? '🟢 Livre' : '🔴 Ocupada'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Nenhuma mesa encontrada</div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
