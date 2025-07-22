import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  QrCode, 
  Users, 
  Edit,
  Trash2
} from 'lucide-react';
import { mockTables } from '../data/mockData';

/**
 * Tables: Página de gestão de mesas (CRUD, estatísticas, modal de edição).
 * Sugestão: extrair modal de edição para componente separado se crescer.
 */
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    setTables(mockTables);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800';
      case 'Ocupada':
        return 'bg-red-100 text-red-800';
      case 'Reservada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Limpeza':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTable = () => {
    const newTable = {
      id: tables.length + 1,
      number: tables.length + 1,
      capacity: 4,
      status: 'Disponível',
      qr_code: `table-${tables.length + 1}-qr`
    };
    setTables([...tables, newTable]);
  };

  const handleDeleteTable = (tableId) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Mesas</h1>
        <Button onClick={handleAddTable}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Mesa
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mesas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.filter(t => t.status === 'Disponível').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.filter(t => t.status === 'Ocupada').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservadas</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.filter(t => t.status === 'Reservada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Mesas */}
      <Card>
        <CardHeader>
          <CardTitle>Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card key={table.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTable(table)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Capacidade:</span>
                    <span className="font-medium">{table.capacity} pessoas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge className={getStatusColor(table.status)}>
                      {table.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">QR Code:</span>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição (simplificado) */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Editar Mesa {selectedTable.number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Capacidade</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedTable.capacity}
                  onChange={(e) => setSelectedTable({
                    ...selectedTable,
                    capacity: parseInt(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedTable.status}
                  onChange={(e) => setSelectedTable({
                    ...selectedTable,
                    status: e.target.value
                  })}
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Ocupada">Ocupada</option>
                  <option value="Reservada">Reservada</option>
                  <option value="Limpeza">Limpeza</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setTables(tables.map(t => 
                      t.id === selectedTable.id ? selectedTable : t
                    ));
                    setSelectedTable(null);
                  }}
                >
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedTable(null)}
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

export default Tables; 