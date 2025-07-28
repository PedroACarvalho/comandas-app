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
    let imageUrl = item.image;
    if (imageFile) {
      setUploading(true);
      imageUrl = await uploadToCloudinary(imageFile);
      setUploading(false);
    }
    onSave({ ...item, image: imageUrl });
  };

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
              type="text"
              inputMode="decimal"
              step="0.01"
              className="w-full mt-1 p-2 border rounded-md"
              value={isNaN(item.price) || item.price === undefined ? '' : item.price}
              onChange={e => {
                // Aceita vírgula ou ponto como separador decimal
                const value = e.target.value.replace(',', '.');
                const parsed = parseFloat(value);
                onChange({ ...item, price: isNaN(parsed) ? '' : parsed });
              }}
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
              checked={item.is_available}
              onChange={e => onChange({ ...item, is_available: e.target.checked })}
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