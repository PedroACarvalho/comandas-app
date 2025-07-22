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
import { mockCategories, mockMenuItems, formatPrice } from '../data/mockData';

/**
 * Menu: Página de gestão do cardápio (CRUD de itens, categorias, filtros e estatísticas).
 * Sugestão: extrair modal de edição para componente separado se crescer.
 */
const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setCategories(mockCategories);
    setMenuItems(mockMenuItems);
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === parseInt(selectedCategory));

  const handleAddItem = () => {
    const newItem = {
      id: menuItems.length + 1,
      name: 'Novo Item',
      description: 'Descrição do item',
      price: 0,
      image: '/images/placeholder.jpg',
      category_id: 1,
      is_available: true
    };
    setMenuItems([...menuItems, newItem]);
    setSelectedItem(newItem);
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  const handleSaveItem = (updatedItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
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

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                size="sm"
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
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {formatPrice(item.price)}
                    </span>
                    <Badge 
                      variant={item.is_available ? 'default' : 'secondary'}
                    >
                      {item.is_available ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Categoria: {categories.find(c => c.id === item.category_id)?.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows="3"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem,
                    description: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedItem.price}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem,
                    price: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedItem.category_id}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem,
                    category_id: parseInt(e.target.value)
                  })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={selectedItem.is_available}
                  onChange={(e) => setSelectedItem({
                    ...selectedItem,
                    is_available: e.target.checked
                  })}
                />
                <label htmlFor="available" className="text-sm font-medium">
                  Disponível
                </label>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleSaveItem(selectedItem)}
                >
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Menu; 