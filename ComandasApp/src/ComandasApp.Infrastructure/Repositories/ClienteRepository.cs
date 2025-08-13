using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<Cliente?> GetByMesaAsync(int mesa)
    {
        return await _dbSet
            .Include(c => c.Pedidos)
            .FirstOrDefaultAsync(c => c.Mesa == mesa);
    }

    public async Task<IEnumerable<Cliente>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Include(c => c.Pedidos)
            .Where(c => c.Pedidos.Any(p => p.Status == status))
            .ToListAsync();
    }

    public async Task<bool> MesaOcupadaAsync(int mesa)
    {
        return await _dbSet.AnyAsync(c => c.Mesa == mesa);
    }

    public override async Task<Cliente?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Pedidos)
                .ThenInclude(p => p.Itens)
                    .ThenInclude(pi => pi.Item)
            .FirstOrDefaultAsync(c => c.ClienteId == id);
    }
}
