using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class PedidoRepository : Repository<Pedido>, IPedidoRepository
{
    public PedidoRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Pedido>> GetByClienteAsync(int clienteId)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(pi => pi.Item)
            .Where(p => p.ClienteId == clienteId)
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pedido>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(pi => pi.Item)
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }

    public async Task<Pedido?> GetAtivoByClienteAsync(int clienteId)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(pi => pi.Item)
            .FirstOrDefaultAsync(p => p.ClienteId == clienteId && !p.Fechado);
    }

    public async Task UpdateStatusAsync(int pedidoId, string status)
    {
        var pedido = await _dbSet.FindAsync(pedidoId);
        if (pedido != null)
        {
            pedido.Status = status;
            await _context.SaveChangesAsync();
        }
    }

    public async Task FecharPedidoAsync(int pedidoId)
    {
        var pedido = await _dbSet.FindAsync(pedidoId);
        if (pedido != null)
        {
            pedido.Fechado = true;
            await _context.SaveChangesAsync();
        }
    }

    public override async Task<Pedido?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(pi => pi.Item)
            .Include(p => p.Pagamento)
            .FirstOrDefaultAsync(p => p.PedidoId == id);
    }

    public override async Task<IEnumerable<Pedido>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(pi => pi.Item)
            .Include(p => p.Pagamento)
            .OrderByDescending(p => p.DataHora)
            .ToListAsync();
    }

    public async Task<Pedido> AddPedidoWithItemsAsync(Pedido pedido, List<PedidoItem> itens)
    {
        await _dbSet.AddAsync(pedido);
        await _context.SaveChangesAsync(); // Salva o pedido primeiro para obter o ID

        // Adiciona os itens ao pedido
        foreach (var item in itens)
        {
            item.PedidoId = pedido.PedidoId;
            _context.PedidoItens.Add(item);
        }

        await _context.SaveChangesAsync();
        return pedido;
    }
}
