using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface IItemRepository : IRepository<Item>
{
    Task<IEnumerable<Item>> GetByCategoriaAsync(string categoria);
    Task<IEnumerable<Item>> GetAtivosAsync();
}
