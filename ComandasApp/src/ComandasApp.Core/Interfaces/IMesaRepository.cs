using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface IMesaRepository : IRepository<Mesa>
{
    Task<IEnumerable<Mesa>> GetDisponiveisAsync();
    Task<Mesa?> GetByNumeroAsync(int numero);
    Task UpdateStatusAsync(int mesaId, string status);
}
