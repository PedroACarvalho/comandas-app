using ComandasApp.Core.DTOs;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.SignalR;
using ComandasApp.API.Hubs;

namespace ComandasApp.API.Services;

public class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<ComandasHub> _hubContext;

    public SignalRNotificationService(IHubContext<ComandasHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task EmitirPedidoNovoAsync(PedidoDto pedido)
    {
        await _hubContext.Clients.All.SendAsync("pedido_novo", pedido);
        Console.WriteLine($"Evento 'pedido_novo' emitido para pedido {pedido.PedidoId}");
    }

    public async Task EmitirPedidoAtualizadoAsync(PedidoDto pedido)
    {
        await _hubContext.Clients.All.SendAsync("pedido_atualizado", pedido);
        Console.WriteLine($"Evento 'pedido_atualizado' emitido para pedido {pedido.PedidoId}");
    }

    public async Task EmitirPagamentoRecebidoAsync(PagamentoDto pagamento)
    {
        await _hubContext.Clients.All.SendAsync("pagamento_recebido", pagamento);
        Console.WriteLine($"Evento 'pagamento_recebido' emitido para pagamento {pagamento.PagamentoId}");
    }

    public async Task EmitirMesaStatusAsync(int mesaId, string status)
    {
        await _hubContext.Clients.All.SendAsync("mesa_status", new { mesaId, status });
        Console.WriteLine($"Evento 'mesa_status' emitido para mesa {mesaId}: {status}");
    }
}
