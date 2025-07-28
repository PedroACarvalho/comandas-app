// Serviço centralizado para chamadas de API do cardápio

const API_URL = '/api/itens';

export async function getMenuItems() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Erro ao buscar itens do cardápio');
  const data = await res.json();
  return data.itens;
}

export async function createMenuItem(item) {
  const payload = {
    nome: item.name,
    descricao: item.description,
    preco: item.price
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao criar item');
  const data = await res.json();
  return data.item;
}

export async function updateMenuItem(id, item) {
  const payload = {
    nome: item.name,
    descricao: item.description,
    preco: item.price
  };
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao atualizar item');
  const data = await res.json();
  return data.item;
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao excluir item');
  return true;
} 