using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class MesaRepository : Repository<Mesa>, IMesaRepository
{
    public MesaRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Mesa>> GetDisponiveisAsync()
    {
        return await _dbSet
            .Where(m => m.Status == "livre")
            .OrderBy(m => m.Numero)
            .ToListAsync();
    }

    public async Task<Mesa?> GetByNumeroAsync(int numero)
    {
        return await _dbSet.FirstOrDefaultAsync(m => m.Numero == numero);
    }

    public async Task UpdateStatusAsync(int mesaId, string status)
    {
        var mesa = await _dbSet.FindAsync(mesaId);
        if (mesa != null)
        {
            mesa.Status = status;
            await _context.SaveChangesAsync();
        }
    }
}
