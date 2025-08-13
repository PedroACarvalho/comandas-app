using Microsoft.AspNetCore.SignalR;

namespace ComandasApp.API.Hubs;

public class ComandasHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Cliente conectado: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Cliente desconectado: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    // Métodos que podem ser chamados pelos clientes
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        Console.WriteLine($"Cliente {Context.ConnectionId} entrou no grupo: {groupName}");
    }

    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        Console.WriteLine($"Cliente {Context.ConnectionId} saiu do grupo: {groupName}");
    }
}
