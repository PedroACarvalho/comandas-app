using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface IPedidoRepository : IRepository<Pedido>
{
    Task<IEnumerable<Pedido>> GetByClienteAsync(int clienteId);
    Task<IEnumerable<Pedido>> GetByStatusAsync(string status);
    Task<Pedido?> GetAtivoByClienteAsync(int clienteId);
    Task UpdateStatusAsync(int pedidoId, string status);
    Task FecharPedidoAsync(int pedidoId);
    Task<Pedido> AddPedidoWithItemsAsync(Pedido pedido, List<PedidoItem> itens);
}
