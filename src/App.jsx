import React, { useState, useEffect } from 'react';
import { itemService, clienteService, pedidoService, pagamentoService } from './dataService';
import './App.css';
import BackofficeRouter from './pages/backoffice/BackofficeRouter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [currentStep, setCurrentStep] = useState('cliente'); // cliente, menu, pedido, pagamento
  const [cliente, setCliente] = useState(null);
  const [itens, setItens] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar itens do menu
  useEffect(() => {
    const carregarItens = async () => {
      try {
        setLoading(true);
        const response = await itemService.listarItens();
        setItens(response.itens || []);
      } catch (err) {
        setError('Erro ao carregar itens do menu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarItens();
  }, []);

  // Carregar pedido ativo quando cliente é definido
  useEffect(() => {
    if (cliente) {
      carregarPedidoAtivo();
    }
  }, [cliente]);

  const carregarPedidoAtivo = async () => {
    try {
      const response = await pedidoService.obterPedidoAtivoCliente(cliente.cliente_id);
      if (response.pedido) {
        setPedidoAtivo(response.pedido);
        // NÃO carregar itens do pedido no carrinho - apenas mostrar como histórico
        setCarrinho([]); // Sempre começar com carrinho vazio
      }
    } catch (err) {
      // Se não há pedido ativo, não é erro
      console.log('Nenhum pedido ativo encontrado');
    }
  };

  // Criar cliente
  const criarCliente = async (nome, mesa) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await clienteService.criarCliente(nome, mesa);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setCliente(response.cliente);
      setCurrentStep('menu');
    } catch (err) {
      setError('Erro ao criar cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar item ao carrinho
  const adicionarAoCarrinho = (item) => {
    const itemExistente = carrinho.find(c => c.item_id === item.item_id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(c => 
        c.item_id === item.item_id 
          ? { ...c, quantidade: c.quantidade + 1 }
          : c
      ));
    } else {
      setCarrinho([...carrinho, { ...item, quantidade: 1 }]);
    }
  };

  // Remover item do carrinho
  const removerDoCarrinho = (itemId) => {
    setCarrinho(carrinho.filter(item => item.item_id !== itemId));
  };

  // Atualizar quantidade
  const atualizarQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(itemId);
    } else {
      setCarrinho(carrinho.map(item => 
        item.item_id === itemId 
          ? { ...item, quantidade: novaQuantidade }
          : item
      ));
    }
  };

  // Calcular total do carrinho
  const totalCarrinho = carrinho.reduce((total, item) => 
    total + (item.preco * item.quantidade), 0
  );

  // Enviar pedido para cozinha
  const enviarPedido = async () => {
    if (carrinho.length === 0) {
      setError('Adicione itens ao carrinho');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const itensPedido = carrinho.map(item => ({
        item_id: item.item_id,
        quantidade: item.quantidade
      }));
      
      const response = await pedidoService.criarPedido(cliente.cliente_id, itensPedido);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setPedidoAtivo(response.pedido);
      setCarrinho([]); // Limpar carrinho após enviar
      setCurrentStep('pedido');
    } catch (err) {
      setError('Erro ao enviar pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Voltar ao menu para pedir mais
  const voltarAoMenu = () => {
    setCurrentStep('menu');
    // Recarregar pedido ativo para mostrar itens já pedidos
    carregarPedidoAtivo();
  };

  // Fechar conta
  const fecharConta = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pedidoService.fecharPedido(pedidoAtivo.pedido_id);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setPedidoAtivo(response.pedido);
      setCurrentStep('pagamento');
    } catch (err) {
      setError('Erro ao fechar conta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fazer pagamento
  const fazerPagamento = async (metodo, valorPago) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pagamentoService.criarPagamento(
        pedidoAtivo.pedido_id, 
        metodo, 
        valorPago
      );
      if (response.error) {
        setError(response.error);
        return;
      }
      // Reiniciar o app após pagamento
      reiniciar();
    } catch (err) {
      setError('Erro ao processar pagamento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar
  const reiniciar = () => {
    setCliente(null);
    setCarrinho([]);
    setPedidoAtivo(null);
    setError(null);
    setCurrentStep('cliente');
  };

  // Renderizar passo atual
  const renderStep = () => {
    switch (currentStep) {
      case 'cliente':
        return <TelaCliente onSubmit={criarCliente} loading={loading} error={error} />;
      
      case 'menu':
        return (
          <TelaMenu 
            itens={itens}
            carrinho={carrinho}
            pedidoAtivo={pedidoAtivo}
            onAdicionar={adicionarAoCarrinho}
            onRemover={removerDoCarrinho}
            onAtualizarQuantidade={atualizarQuantidade}
            onEnviarPedido={enviarPedido}
            total={totalCarrinho}
            loading={loading}
            error={error}
          />
        );
      
      case 'pedido':
        return (
          <TelaPedido 
            pedido={pedidoAtivo}
            onVoltarAoMenu={voltarAoMenu}
            onFecharConta={fecharConta}
            loading={loading}
            error={error}
          />
        );
      
      case 'pagamento':
        return (
          <TelaPagamento 
            pedido={pedidoAtivo}
            onFazerPagamento={fazerPagamento}
            loading={loading}
            error={error}
          />
        );
      
      case 'finalizado':
        return <TelaFinalizado onReiniciar={reiniciar} />;
      
      default:
        return <TelaCliente onSubmit={criarCliente} loading={loading} error={error} />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Rotas do app principal */}
        <Route path="/" element={
          <div className="App">
            <header className="bg-blue-600 text-white p-4">
              <h1 className="text-2xl font-bold text-center">
                Sistema de Comandas Online
              </h1>
            </header>
            
            <main className="container mx-auto p-4">
              {renderStep()}
            </main>
          </div>
        } />
        {/* Rotas do backoffice */}
        <Route path="/backoffice/*" element={<BackofficeRouter />} />
      </Routes>
    </Router>
  );
}

// Componente Tela Cliente
function TelaCliente({ onSubmit, loading, error }) {
  const [nome, setNome] = useState('');
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [mesasDisponiveis, setMesasDisponiveis] = useState([]);
  const [carregandoMesas, setCarregandoMesas] = useState(true);

  // Carregar mesas disponíveis
  useEffect(() => {
    const carregarMesas = async () => {
      try {
        setCarregandoMesas(true);
        const response = await clienteService.listarMesasDisponiveis();
        // Novo formato: lista de objetos
        setMesasDisponiveis(response.mesas_disponiveis || []);
      } catch (err) {
        console.error('Erro ao carregar mesas:', err);
      } finally {
        setCarregandoMesas(false);
      }
    };
    carregarMesas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim() && mesaSelecionada) {
      onSubmit(nome.trim(), mesaSelecionada.numero); // Passa o número da mesa
    }
  };

  const selecionarMesa = (mesa) => {
    setMesaSelecionada(mesa);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Identificação do Cliente</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite seu nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3">Selecione uma mesa disponível:</label>
          {carregandoMesas ? (
            <div className="text-center py-8">
              <div className="spinner rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando mesas...</p>
            </div>
          ) : mesasDisponiveis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Todas as mesas estão ocupadas no momento.</p>
              <p className="text-sm text-gray-500 mt-1">Aguarde uma mesa ficar disponível.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {mesasDisponiveis.map(mesa => (
                <button
                  key={mesa.mesa_id || mesa.numero}
                  type="button"
                  onClick={() => selecionarMesa(mesa)}
                  className={
                    `mesa-button p-4 rounded-lg border-2 transition-all duration-200 font-semibold ` +
                    (mesaSelecionada && mesaSelecionada.mesa_id === mesa.mesa_id
                      ? 'selected border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50')
                  }
                >
                  Mesa {mesa.numero || mesa.mesa_id}
                </button>
              ))}
            </div>
          )}
          {mesaSelecionada && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              ✓ Mesa {mesaSelecionada.numero} selecionada
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !nome.trim() || !mesaSelecionada}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {loading ? 'Carregando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
}

// Componente Tela Menu
function TelaMenu({ itens, carrinho, pedidoAtivo, onAdicionar, onRemover, onAtualizarQuantidade, onEnviarPedido, total, loading, error }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cardápio</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Itens */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itens.map(item => (
              <div key={item.item_id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{item.nome}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.descricao}</p>
                <p className="text-lg font-bold text-green-600">
                  R$ {item.preco.toFixed(2)}
                </p>
                <button
                  onClick={() => onAdicionar(item)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carrinho */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Seu Pedido</h3>
          
          {pedidoAtivo && pedidoAtivo.itens && pedidoAtivo.itens.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                Itens já pedidos:
              </h4>
              <div className="space-y-2 text-sm">
                {pedidoAtivo.itens.map((item, index) => (
                  <div key={index} className="flex justify-between text-blue-700 bg-blue-100 p-2 rounded">
                    <span>{item.item.nome} x{item.quantidade}</span>
                    <span>R$ {(item.item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-blue-200 mt-3 pt-3">
                <div className="flex justify-between font-medium text-blue-800">
                  <span>Total já pedido:</span>
                  <span>R$ {pedidoAtivo.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {carrinho.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Nenhum item novo no carrinho</p>
              <p className="text-sm text-gray-400">Adicione itens do cardápio para fazer um novo pedido</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <span className="mr-2">🛒</span>
                  Novos itens para pedir:
                </h4>
                {carrinho.map(item => (
                  <div key={item.item_id} className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-gray-600">
                        R$ {item.preco.toFixed(2)} x {item.quantidade}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAtualizarQuantidade(item.item_id, item.quantidade - 1)}
                        className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        -
                      </button>
                      <span className="font-medium">{item.quantidade}</span>
                      <button
                        onClick={() => onAtualizarQuantidade(item.item_id, item.quantidade + 1)}
                        className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-green-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total novos itens:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={onEnviarPedido}
                  disabled={loading || carrinho.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Processando...' : 'Enviar Novo Pedido'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Tela Pedido
function TelaPedido({ pedido, onVoltarAoMenu, onFecharConta, loading, error }) {
  if (!pedido) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pedido Enviado</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Pedido #{pedido.pedido_id}</h3>
          <p className="text-gray-600">Status: {pedido.status}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Itens do pedido:</h4>
          <div className="space-y-2">
            {pedido.itens.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.item.nome} x{item.quantidade}</span>
                <span>R$ {(item.item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">O que você gostaria de fazer?</h4>
          <button
            onClick={onVoltarAoMenu}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
          >
            Pedir Mais Itens
          </button>
          <button
            onClick={onFecharConta}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 font-medium"
          >
            Fechar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Tela Pagamento
function TelaPagamento({ pedido, onFazerPagamento, loading, error }) {
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [mostrarCampoDinheiro, setMostrarCampoDinheiro] = useState(false);
  const [mostrarCamposCartao, setMostrarCamposCartao] = useState(false);
  
  // Campos do cartão
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [cvv, setCvv] = useState('');

  if (!pedido) return null;

  const handleMetodoChange = (metodo) => {
    setMetodoPagamento(metodo);
    if (metodo === 'Dinheiro') {
      setMostrarCampoDinheiro(true);
      setMostrarCamposCartao(false);
      setValorPago('');
    } else if (metodo === 'Cartão de Crédito' || metodo === 'Cartão de Débito') {
      setMostrarCampoDinheiro(false);
      setMostrarCamposCartao(true);
      setValorPago('');
    } else {
      setMostrarCampoDinheiro(false);
      setMostrarCamposCartao(false);
      setValorPago('');
    }
  };

  const calcularTroco = () => {
    if (!valorPago || !pedido.total) return 0;
    const valorPagoNum = parseFloat(valorPago);
    const totalNum = parseFloat(pedido.total);
    return valorPagoNum - totalNum;
  };

  const troco = calcularTroco();
  const valorValido = valorPago && parseFloat(valorPago) >= pedido.total;

  const handleFazerPagamento = () => {
    if (metodoPagamento === 'Dinheiro' && !valorValido) {
      return; // Não permite pagamento se valor for insuficiente
    }
    
    if ((metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && 
        (!numeroCartao || !nomeTitular || !dataValidade || !cvv)) {
      return; // Não permite pagamento se campos do cartão estiverem vazios
    }
    
    const valorFinal = metodoPagamento === 'Dinheiro' ? parseFloat(valorPago) : pedido.total;
    onFazerPagamento(metodoPagamento, valorFinal);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Pedido #{pedido.pedido_id}</h3>
          <p className="text-gray-600">Status: {pedido.status}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Itens do pedido:</h4>
          <div className="space-y-2">
            {pedido.itens.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.item.nome} x{item.quantidade}</span>
                <span>R$ {(item.item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total a pagar:</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Escolha a forma de pagamento:</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleMetodoChange('Dinheiro')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                metodoPagamento === 'Dinheiro' 
                  ? 'border-green-600 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              💰 Dinheiro
            </button>
            <button
              onClick={() => handleMetodoChange('Cartão de Crédito')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                metodoPagamento === 'Cartão de Crédito' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              💳 Cartão de Crédito
            </button>
            <button
              onClick={() => handleMetodoChange('Cartão de Débito')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                metodoPagamento === 'Cartão de Débito' 
                  ? 'border-purple-600 bg-purple-50 text-purple-700' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              💳 Cartão de Débito
            </button>
            <button
              onClick={() => handleMetodoChange('PIX')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                metodoPagamento === 'PIX' 
                  ? 'border-yellow-600 bg-yellow-50 text-yellow-700' 
                  : 'border-gray-300 hover:border-yellow-400'
              }`}
            >
              📱 PIX
            </button>
          </div>
          
          {mostrarCampoDinheiro && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 mb-3">Pagamento em Dinheiro</h5>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Valor que você vai pagar:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={pedido.total}
                    value={valorPago}
                    onChange={(e) => setValorPago(e.target.value)}
                    placeholder={`Mínimo: R$ ${pedido.total.toFixed(2)}`}
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                {valorPago && (
                  <div className="bg-white p-3 rounded border">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total do pedido:</span>
                      <span>R$ {pedido.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Valor pago:</span>
                      <span>R$ {parseFloat(valorPago || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-1 mt-1">
                      <div className={`flex justify-between font-bold ${
                        troco >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{troco >= 0 ? 'Troco:' : 'Valor insuficiente:'}</span>
                        <span>R$ {Math.abs(troco).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {mostrarCamposCartao && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-800 mb-3 flex items-center">
                <span className="mr-2">💳</span>
                Dados do Cartão
              </h5>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Número do Cartão:
                  </label>
                  <input
                    type="text"
                    value={numeroCartao}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setNumeroCartao(value.replace(/(\d{4})/g, '$1 ').trim());
                    }}
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    autoComplete="cc-number"
                    className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Nome do Titular:
                  </label>
                  <input
                    type="text"
                    value={nomeTitular}
                    onChange={(e) => setNomeTitular(e.target.value.toUpperCase())}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    autoComplete="cc-name"
                    className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Validade:
                    </label>
                    <input
                      type="text"
                      value={dataValidade}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (value.length >= 2) {
                          setDataValidade(value.slice(0, 2) + '/' + value.slice(2));
                        } else {
                          setDataValidade(value);
                        }
                      }}
                      placeholder="MM/AA"
                      maxLength="5"
                      autoComplete="cc-exp"
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      CVV:
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength="4"
                      autoComplete="cc-csc"
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between text-sm">
                    <span>Total a pagar:</span>
                    <span className="font-bold">R$ {pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleFazerPagamento}
            disabled={
              loading || 
              !metodoPagamento || 
              (metodoPagamento === 'Dinheiro' && !valorValido) ||
              ((metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && 
               (!numeroCartao || !nomeTitular || !dataValidade || !cvv))
            }
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
              (metodoPagamento === 'Dinheiro' && !valorValido) ||
              ((metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && 
               (!numeroCartao || !nomeTitular || !dataValidade || !cvv))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
            }`}
          >
            {loading ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
          
          {metodoPagamento === 'Dinheiro' && !valorValido && valorPago && (
            <p className="text-red-600 text-sm text-center">
              O valor pago deve ser maior ou igual ao total do pedido.
            </p>
          )}
          
          {(metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && 
           (!numeroCartao || !nomeTitular || !dataValidade || !cvv) && (
            <p className="text-red-600 text-sm text-center">
              Preencha todos os dados do cartão para continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Tela Finalizado
function TelaFinalizado({ onReiniciar }) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Pedido Finalizado!</h2>
        <p>Obrigado por utilizar nosso sistema.</p>
      </div>
      
      <button
        onClick={onReiniciar}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Novo Pedido
      </button>
    </div>
  );
}

export default App; 