using ComandasApp.Core.DTOs;

namespace ComandasApp.Core.Interfaces;

public interface INotificationService
{
    Task EmitirPedidoNovoAsync(PedidoDto pedido);
    Task EmitirPedidoAtualizadoAsync(PedidoDto pedido);
    Task EmitirPagamentoRecebidoAsync(PagamentoDto pagamento);
    Task EmitirMesaStatusAsync(int mesaId, string status);
}
