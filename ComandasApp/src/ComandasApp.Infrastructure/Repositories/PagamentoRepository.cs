using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class PagamentoRepository : Repository<Pagamento>, IPagamentoRepository
{
    public PagamentoRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<Pagamento?> GetByPedidoAsync(int pedidoId)
    {
        return await _dbSet
            .Include(p => p.Pedido)
                .ThenInclude(p => p!.Cliente)
            .FirstOrDefaultAsync(p => p.PedidoId == pedidoId);
    }

    public async Task<IEnumerable<Pagamento>> GetByMetodoAsync(string metodo)
    {
        return await _dbSet
            .Include(p => p.Pedido)
                .ThenInclude(p => p!.Cliente)
            .Where(p => p.Metodo.ToLower() == metodo.ToLower())
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pagamento>> GetByPeriodoAsync(DateTime inicio, DateTime fim)
    {
        return await _dbSet
            .Include(p => p.Pedido)
                .ThenInclude(p => p!.Cliente)
            .Where(p => p.DataHora >= inicio && p.DataHora <= fim)
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }

    public override async Task<Pagamento?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Pedido)
                .ThenInclude(p => p!.Cliente)
            .FirstOrDefaultAsync(p => p.PagamentoId == id);
    }

    public override async Task<IEnumerable<Pagamento>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Pedido)
                .ThenInclude(p => p!.Cliente)
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }
}
