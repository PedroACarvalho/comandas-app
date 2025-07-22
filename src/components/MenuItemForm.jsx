import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function MenuItemForm({ item, categories, onChange, onSave, onCancel }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{item.id ? 'Editar Item' : 'Novo Item'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={item.name}
              onChange={e => onChange({ ...item, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              rows="3"
              value={item.description}
              onChange={e => onChange({ ...item, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Preço</label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 p-2 border rounded-md"
              value={item.price}
              onChange={e => onChange({ ...item, price: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <select
              className="w-full mt-1 p-2 border rounded-md"
              value={item.category_id}
              onChange={e => onChange({ ...item, category_id: parseInt(e.target.value) })}
            >
              {categories.map(category => (
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
              checked={item.is_available}
              onChange={e => onChange({ ...item, is_available: e.target.checked })}
            />
            <label htmlFor="available" className="text-sm font-medium">
              Disponível
            </label>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => onSave(item)}>
              Salvar
            </Button>
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 