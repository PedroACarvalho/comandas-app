using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface ICategoriaRepository : IRepository<Categoria>
{
    Task<Categoria?> GetByNomeAsync(string nome);
    Task<IEnumerable<Categoria>> GetAtivasAsync();
}
