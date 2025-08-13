using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IItemRepository _itemRepository;
    private readonly INotificationService _notificationService;

    public PedidosController(
        IPedidoRepository pedidoRepository,
        IClienteRepository clienteRepository,
        IItemRepository itemRepository,
        INotificationService notificationService)
    {
        _pedidoRepository = pedidoRepository;
        _clienteRepository = clienteRepository;
        _itemRepository = itemRepository;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoDto>> CriarPedido([FromBody] CriarPedidoDto dto)
    {
        try
        {
            // Verificar se o cliente existe
            var cliente = await _clienteRepository.GetByIdAsync(dto.ClienteId);
            if (cliente == null)
            {
                return BadRequest(new { error = "Cliente não encontrado" });
            }

            // Verificar se o cliente já tem um pedido ativo
            var pedidoAtivo = await _pedidoRepository.GetAtivoByClienteAsync(dto.ClienteId);
            if (pedidoAtivo != null)
            {
                return BadRequest(new { error = "Cliente já possui um pedido ativo" });
            }

            // Verificar se todos os itens existem
            var itensIds = dto.Itens.Select(i => i.ItemId).ToList();
            var itensExistentes = new List<Item>();
            foreach (var itemId in itensIds)
            {
                var item = await _itemRepository.GetByIdAsync(itemId);
                if (item == null)
                {
                    return BadRequest(new { error = $"Item com ID {itemId} não encontrado" });
                }
                itensExistentes.Add(item);
            }

            // Criar o pedido com itens
            var pedido = new Pedido
            {
                ClienteId = dto.ClienteId,
                Status = "Aguardando Seleção",
                DataHora = DateTime.UtcNow,
                Total = 0,
                Fechado = false
            };

            // Preparar itens do pedido
            var pedidoItens = new List<PedidoItem>();
            decimal total = 0;
            foreach (var itemDto in dto.Itens)
            {
                var item = itensExistentes.First(i => i.ItemId == itemDto.ItemId);
                var pedidoItem = new PedidoItem
                {
                    ItemId = itemDto.ItemId,
                    Quantidade = itemDto.Quantidade
                };
                pedidoItens.Add(pedidoItem);
                total += item.Preco * itemDto.Quantidade;
            }

            // Definir total do pedido
            pedido.Total = total;

            // Criar pedido com itens
            var pedidoCriado = await _pedidoRepository.AddPedidoWithItemsAsync(pedido, pedidoItens);

            // Retornar pedido criado
            var pedidoCompleto = await _pedidoRepository.GetByIdAsync(pedidoCriado.PedidoId);
            var pedidoDto = MapToPedidoDto(pedidoCompleto!);
            
            // Emitir notificação de novo pedido
            await _notificationService.EmitirPedidoNovoAsync(pedidoDto);
            
            return CreatedAtAction(nameof(ObterPedido), new { id = pedidoCriado.PedidoId }, pedidoDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PedidoDto>> ObterPedido(int id)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);
        if (pedido == null)
        {
            return NotFound(new { error = "Pedido não encontrado" });
        }

        return Ok(MapToPedidoDto(pedido));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> ListarPedidos()
    {
        var pedidos = await _pedidoRepository.GetAllAsync();
        var result = pedidos.Select(MapToPedidoDto);
        return Ok(result);
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetPedidosByCliente(int clienteId)
    {
        var pedidos = await _pedidoRepository.GetByClienteAsync(clienteId);
        var result = pedidos.Select(MapToPedidoDto);
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult> AtualizarStatusPedido(int id, [FromBody] AtualizarStatusPedidoDto dto)
    {
        try
        {
            var pedido = await _pedidoRepository.GetByIdAsync(id);
            if (pedido == null)
            {
                return NotFound(new { error = "Pedido não encontrado" });
            }

            await _pedidoRepository.UpdateStatusAsync(id, dto.Status);

            // Emitir notificação de pedido atualizado
            var pedidoAtualizado = await _pedidoRepository.GetByIdAsync(id);
            if (pedidoAtualizado != null)
            {
                var pedidoDto = MapToPedidoDto(pedidoAtualizado);
                await _notificationService.EmitirPedidoAtualizadoAsync(pedidoDto);
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpPost("{id}/fechar")]
    public async Task<ActionResult> FecharPedido(int id)
    {
        try
        {
            var pedido = await _pedidoRepository.GetByIdAsync(id);
            if (pedido == null)
            {
                return NotFound(new { error = "Pedido não encontrado" });
            }

            await _pedidoRepository.FecharPedidoAsync(id);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    private static PedidoDto MapToPedidoDto(Pedido pedido)
    {
        return new PedidoDto
        {
            PedidoId = pedido.PedidoId,
            ClienteId = pedido.ClienteId,
            Status = pedido.Status,
            DataHora = pedido.DataHora,
            Total = pedido.Total,
            Fechado = pedido.Fechado,
            Cliente = pedido.Cliente != null ? new ClienteDto
            {
                ClienteId = pedido.Cliente.ClienteId,
                Nome = pedido.Cliente.Nome,
                Mesa = pedido.Cliente.Mesa
            } : null,
            Itens = pedido.Itens.Select(pi => new PedidoItemDto
            {
                ItemId = pi.ItemId,
                Quantidade = pi.Quantidade,
                Item = pi.Item != null ? new ItemDto
                {
                    ItemId = pi.Item.ItemId,
                    Nome = pi.Item.Nome,
                    Descricao = pi.Item.Descricao,
                    Preco = pi.Item.Preco
                } : null
            }).ToList(),
            Pagamento = pedido.Pagamento != null ? new PagamentoDto
            {
                PagamentoId = pedido.Pagamento.PagamentoId,
                PedidoId = pedido.Pagamento.PedidoId,
                Metodo = pedido.Pagamento.Metodo,
                Valor = pedido.Pagamento.Valor,
                ValorPago = pedido.Pagamento.ValorPago,
                Troco = pedido.Pagamento.Troco,
                DataHora = pedido.Pagamento.DataHora
            } : null
        };
    }
}
