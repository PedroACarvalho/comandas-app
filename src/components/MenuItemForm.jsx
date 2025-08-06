import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function MenuItemForm({ item, categories, onChange, onSave, onCancel }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(item?.image || '');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
    onChange({ ...item, image: '' }); // Limpa a URL até upload
  };

  async function uploadToCloudinary(file) {
    const url = 'https://api.cloudinary.com/v1_1/dnoeptnkc/image/upload';
    const preset = 'pdvoaktech';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    const res = await fetch(url, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url;
  }

  const handleSave = async () => {
    let imageUrl = itemWithDefaults.image;
    if (imageFile) {
      setUploading(true);
      imageUrl = await uploadToCloudinary(imageFile);
      setUploading(false);
    }
    onSave({ ...itemWithDefaults, image: imageUrl });
  };

  if (!item) return null;
  
  // Garantir que o item tenha valores padrão
  const itemWithDefaults = {
    name: item.name || '',
    description: item.description || '',
    price: item.price || 0,
    category_id: item.category_id || 1,
    is_available: item.is_available !== undefined ? item.is_available : true,
    image: item.image || '',
    ...item
  };
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
              value={itemWithDefaults.name}
              onChange={e => onChange({ ...itemWithDefaults, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              rows="3"
              value={itemWithDefaults.description}
              onChange={e => onChange({ ...itemWithDefaults, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Preço</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="w-full mt-1 p-2 pl-8 border rounded-md"
                value={itemWithDefaults.price || ''}
                              onChange={e => {
                const value = parseFloat(e.target.value);
                // Permite valores vazios durante digitação
                if (e.target.value === '') {
                  onChange({ ...itemWithDefaults, price: 0 });
                } else {
                  onChange({ ...itemWithDefaults, price: isNaN(value) ? 0 : value });
                }
              }}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <select
              className="w-full mt-1 p-2 border rounded-md"
              value={itemWithDefaults.category_id}
              onChange={e => onChange({ ...itemWithDefaults, category_id: parseInt(e.target.value) })}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: 120, marginTop: 8 }} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={itemWithDefaults.is_available}
              onChange={e => onChange({ ...itemWithDefaults, is_available: e.target.checked })}
            />
            <label htmlFor="available" className="text-sm font-medium">
              Disponível
            </label>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleSave} disabled={uploading}>
              {uploading ? 'Enviando...' : 'Salvar'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onCancel} disabled={uploading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 