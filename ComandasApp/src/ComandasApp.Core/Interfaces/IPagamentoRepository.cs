using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface IPagamentoRepository : IRepository<Pagamento>
{
    Task<Pagamento?> GetByPedidoAsync(int pedidoId);
    Task<IEnumerable<Pagamento>> GetByMetodoAsync(string metodo);
    Task<IEnumerable<Pagamento>> GetByPeriodoAsync(DateTime inicio, DateTime fim);
}
