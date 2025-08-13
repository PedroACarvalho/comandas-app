using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class CategoriaRepository : Repository<Categoria>, ICategoriaRepository
{
    public CategoriaRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<Categoria?> GetByNomeAsync(string nome)
    {
        return await _dbSet
            .Include(c => c.Itens)
            .FirstOrDefaultAsync(c => c.Nome.ToLower() == nome.ToLower());
    }

    public async Task<IEnumerable<Categoria>> GetAtivasAsync()
    {
        return await _dbSet
            .Include(c => c.Itens)
            .OrderBy(c => c.Nome)
            .ToListAsync();
    }

    public override async Task<Categoria?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Itens)
            .FirstOrDefaultAsync(c => c.CategoriaId == id);
    }

    public override async Task<IEnumerable<Categoria>> GetAllAsync()
    {
        return await _dbSet
            .Include(c => c.Itens)
            .OrderBy(c => c.Nome)
            .ToListAsync();
    }
}
