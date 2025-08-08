import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2,
  Package,
  Tag,
  Filter,
  Search
} from 'lucide-react';
import { useMenuItems } from '../lib/useMenuItems';
import { MenuItemForm } from '../components/MenuItemForm';

// Função para formatar preços
const formatPrice = (price) => {
  // Garante que o preço seja um número
  const numericPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericPrice);
};

/**
 * Menu: Página de gestão do cardápio (CRUD de itens, categorias, filtros e estatísticas).
 * Agora com integração real de categorias e melhor UX.
 */
const Menu = () => {
  const [categories, setCategories] = useState([]);
  const { items: menuItems, loading, error, addItem, editItem, removeItem, fetchItems } = useMenuItems();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Buscar categorias da API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categorias || []);
        } else {
          // Fallback para categorias padrão se a API não estiver disponível
          setCategories([
            { id: 1, nome: 'Entradas' },
            { id: 2, nome: 'Pratos Principais' },
            { id: 3, nome: 'Sobremesas' },
            { id: 4, nome: 'Bebidas' },
            { id: 5, nome: 'Acompanhamentos' }
          ]);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        // Fallback para categorias padrão
        setCategories([
          { id: 1, nome: 'Entradas' },
          { id: 2, nome: 'Pratos Principais' },
          { id: 3, nome: 'Sobremesas' },
          { id: 4, nome: 'Bebidas' },
          { id: 5, nome: 'Acompanhamentos' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Filtrar itens por categoria e busca
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.categoria_id === parseInt(selectedCategory);
    const matchesSearch = (item.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.descricao?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = () => {
    setSelectedItem({
      nome: '',
      descricao: '',
      preco: 0,
      imagem: '/images/placeholder.svg',
      categoria_id: categories[0]?.id || 1,
      disponivel: true
    });
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      await removeItem(itemId);
    }
  };

  const handleSaveItem = async (item) => {
    if (item.id) {
      await editItem(item.id, item);
    } else {
      await addItem(item);
    }
    setSelectedItem(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.nome : 'Sem categoria';
  };

  const getAvailabilityStats = () => {
    const available = menuItems.filter(item => item.disponivel).length;
    const unavailable = menuItems.filter(item => !item.disponivel).length;
    return { available, unavailable };
  };

  const stats = getAvailabilityStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão do Cardápio</h1>
        <Button onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indisponíveis</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unavailable}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros e Busca</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    {category.nome}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lista de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>
            Itens do Cardápio ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando itens...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Erro ao carregar itens: {error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Nenhum item encontrado com os filtros aplicados'
                  : 'Nenhum item cadastrado ainda'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.nome}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{item.descricao}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={item.disponivel ? 'default' : 'secondary'}>
                        {item.disponivel ? 'Disponível' : 'Indisponível'}
                      </Badge>
                      <span className="font-bold text-lg">
                        {formatPrice(item.preco)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Categoria: {getCategoryName(item.categoria_id)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição/Criação */}
      {selectedItem && (
        <MenuItemForm
          item={selectedItem}
          categories={categories}
          onSave={handleSaveItem}
          onCancel={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Menu; 