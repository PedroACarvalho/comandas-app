using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using ComandasApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Repositories;

public class ItemRepository : Repository<Item>, IItemRepository
{
    public ItemRepository(ComandasDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Item>> GetByCategoriaAsync(string categoria)
    {
        return await _dbSet
            .Include(i => i.Categoria)
            .Where(i => i.Categoria != null && i.Categoria.Nome == categoria)
            .OrderBy(i => i.Nome)
            .ToListAsync();
    }

    public async Task<IEnumerable<Item>> GetAtivosAsync()
    {
        return await _dbSet
            .OrderBy(i => i.Nome)
            .ToListAsync();
    }
}
