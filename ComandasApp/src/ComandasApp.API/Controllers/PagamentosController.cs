using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagamentosController : ControllerBase
{
    private readonly IPagamentoRepository _pagamentoRepository;
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IMesaRepository _mesaRepository;
    private readonly INotificationService _notificationService;

    public PagamentosController(
        IPagamentoRepository pagamentoRepository,
        IPedidoRepository pedidoRepository,
        IClienteRepository clienteRepository,
        IMesaRepository mesaRepository,
        INotificationService notificationService)
    {
        _pagamentoRepository = pagamentoRepository;
        _pedidoRepository = pedidoRepository;
        _clienteRepository = clienteRepository;
        _mesaRepository = mesaRepository;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<ActionResult<PagamentoDto>> CriarPagamento([FromBody] CriarPagamentoDto dto)
    {
        try
        {
            // Verificar se o pedido existe e está fechado
            var pedido = await _pedidoRepository.GetByIdAsync(dto.PedidoId);
            if (pedido == null)
            {
                return NotFound(new { error = "Pedido não encontrado" });
            }

            if (!pedido.Fechado)
            {
                return BadRequest(new { error = "Pedido deve estar fechado para pagamento" });
            }

            // Verificar se já existe pagamento para este pedido
            var pagamentoExistente = await _pagamentoRepository.GetByPedidoAsync(dto.PedidoId);
            if (pagamentoExistente != null)
            {
                return BadRequest(new { error = "Já existe pagamento para este pedido" });
            }

            // Criar o pagamento
            var pagamento = new Pagamento
            {
                PedidoId = dto.PedidoId,
                Metodo = dto.Metodo,
                Valor = dto.Valor,
                ValorPago = dto.ValorPago ?? dto.Valor,
                DataHora = DateTime.UtcNow
            };

            // Calcular troco se necessário
            if (dto.ValorPago.HasValue && dto.ValorPago.Value > dto.Valor)
            {
                pagamento.Troco = dto.ValorPago.Value - dto.Valor;
            }

            var pagamentoCriado = await _pagamentoRepository.AddAsync(pagamento);

            // Criar DTO para notificação
            var pagamentoDto = new PagamentoDto
            {
                PagamentoId = pagamentoCriado.PagamentoId,
                PedidoId = pagamentoCriado.PedidoId,
                Metodo = pagamentoCriado.Metodo,
                Valor = pagamentoCriado.Valor,
                ValorPago = pagamentoCriado.ValorPago,
                Troco = pagamentoCriado.Troco,
                DataHora = pagamentoCriado.DataHora
            };

            // Se for dinheiro, aguardar confirmação
            if (dto.Metodo.ToLower() == "dinheiro")
            {
                await _pedidoRepository.UpdateStatusAsync(dto.PedidoId, "Aguardando Confirmação");
                
                // Emitir notificação de pagamento recebido
                await _notificationService.EmitirPagamentoRecebidoAsync(pagamentoDto);
                
                return CreatedAtAction(nameof(ObterPagamento), new { id = pagamentoCriado.PagamentoId }, pagamentoDto);
            }
            else
            {
                // Cartão/PIX - confirmar automaticamente
                await _pedidoRepository.UpdateStatusAsync(dto.PedidoId, "Pago");
                
                // Liberar a mesa
                if (pedido.Cliente != null)
                {
                    var mesa = await _mesaRepository.GetByNumeroAsync(pedido.Cliente.Mesa);
                    if (mesa != null)
                    {
                        await _mesaRepository.UpdateStatusAsync(mesa.MesaId, "livre");
                        // Emitir notificação de mudança de status da mesa
                        await _notificationService.EmitirMesaStatusAsync(mesa.MesaId, "livre");
                    }
                }

                // Emitir notificação de pagamento recebido
                await _notificationService.EmitirPagamentoRecebidoAsync(pagamentoDto);

                return CreatedAtAction(nameof(ObterPagamento), new { id = pagamentoCriado.PagamentoId }, pagamentoDto);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PagamentoDto>> ObterPagamento(int id)
    {
        var pagamento = await _pagamentoRepository.GetByIdAsync(id);
        if (pagamento == null)
        {
            return NotFound(new { error = "Pagamento não encontrado" });
        }

        return Ok(new PagamentoDto
        {
            PagamentoId = pagamento.PagamentoId,
            PedidoId = pagamento.PedidoId,
            Metodo = pagamento.Metodo,
            Valor = pagamento.Valor,
            ValorPago = pagamento.ValorPago,
            Troco = pagamento.Troco,
            DataHora = pagamento.DataHora
        });
    }

    [HttpGet("pedido/{pedidoId}")]
    public async Task<ActionResult<PagamentoDto>> ObterPagamentoPorPedido(int pedidoId)
    {
        var pagamento = await _pagamentoRepository.GetByPedidoAsync(pedidoId);
        if (pagamento == null)
        {
            return NotFound(new { error = "Pagamento não encontrado" });
        }

        return Ok(new PagamentoDto
        {
            PagamentoId = pagamento.PagamentoId,
            PedidoId = pagamento.PedidoId,
            Metodo = pagamento.Metodo,
            Valor = pagamento.Valor,
            ValorPago = pagamento.ValorPago,
            Troco = pagamento.Troco,
            DataHora = pagamento.DataHora
        });
    }

    [HttpPost("{id}/confirmar")]
    public async Task<ActionResult> ConfirmarPagamento(int id, [FromBody] ConfirmarPagamentoDto dto)
    {
        try
        {
            var pagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound(new { error = "Pagamento não encontrado" });
            }

            if (pagamento.Metodo.ToLower() != "dinheiro")
            {
                return BadRequest(new { error = "Apenas pagamentos em dinheiro podem ser confirmados" });
            }

            // Confirmar pagamento
            await _pedidoRepository.UpdateStatusAsync(pagamento.PedidoId, "Pago");

            // Liberar a mesa
            var pedido = await _pedidoRepository.GetByIdAsync(pagamento.PedidoId);
            if (pedido?.Cliente != null)
            {
                var mesa = await _mesaRepository.GetByNumeroAsync(pedido.Cliente.Mesa);
                if (mesa != null)
                {
                    await _mesaRepository.UpdateStatusAsync(mesa.MesaId, "livre");
                }
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PagamentoDto>>> ListarPagamentos()
    {
        var pagamentos = await _pagamentoRepository.GetAllAsync();
        var result = pagamentos.Select(p => new PagamentoDto
        {
            PagamentoId = p.PagamentoId,
            PedidoId = p.PedidoId,
            Metodo = p.Metodo,
            Valor = p.Valor,
            ValorPago = p.ValorPago,
            Troco = p.Troco,
            DataHora = p.DataHora
        });

        return Ok(result);
    }
}
