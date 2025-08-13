using ComandasApp.Core.Entities;

namespace ComandasApp.Core.Interfaces;

public interface IClienteRepository : IRepository<Cliente>
{
    Task<Cliente?> GetByMesaAsync(int mesa);
    Task<IEnumerable<Cliente>> GetByStatusAsync(string status);
    Task<bool> MesaOcupadaAsync(int mesa);
}
