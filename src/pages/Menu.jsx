import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2,
  Package,
  Tag
} from 'lucide-react';
import { useMenuItems } from '../lib/useMenuItems';
import { MenuItemForm } from '../components/MenuItemForm';

// Função para formatar preços
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Menu: Página de gestão do cardápio (CRUD de itens, categorias, filtros e estatísticas).
 * Sugestão: extrair modal de edição para componente separado se crescer.
 */
const Menu = () => {
  const [categories, setCategories] = useState([]); // Mantém mock para categorias por enquanto
  const { items: menuItems, loading, error, addItem, editItem, removeItem, fetchItems } = useMenuItems();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // TODO: Integrar categorias reais se necessário
    setCategories([{ id: 1, name: 'Padrão' }]);
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === parseInt(selectedCategory));

  const handleAddItem = () => {
    setSelectedItem({
      name: '',
      description: '',
      price: 0,
      image: '/images/placeholder.jpg',
      category_id: categories[0]?.id || 1,
      is_available: true
    });
  };

  const handleDeleteItem = async (itemId) => {
    await removeItem(itemId);
  };

  const handleSaveItem = async (item) => {
    if (item.id) {
      await editItem(item.id, item);
    } else {
      await addItem(item);
    }
    setSelectedItem(null);
  };

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
            <div className="text-2xl font-bold">
              {menuItems.filter(item => item.is_available).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indisponíveis</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter(item => !item.is_available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
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
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Cardápio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                      <Badge variant={item.is_available ? 'default' : 'secondary'}>
                        {item.is_available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {selectedItem && (
        <MenuItemForm
          item={selectedItem}
          onSave={handleSaveItem}
          onCancel={() => setSelectedItem(null)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Menu; 