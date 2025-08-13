using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IMesaRepository _mesaRepository;

    public ClientesController(IClienteRepository clienteRepository, IMesaRepository mesaRepository)
    {
        _clienteRepository = clienteRepository;
        _mesaRepository = mesaRepository;
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CriarCliente([FromBody] CriarClienteDto dto)
    {
        try
        {
            // Verificar se a mesa está disponível
            var mesaDisponivel = await _mesaRepository.GetByNumeroAsync(dto.Mesa);
            if (mesaDisponivel == null)
            {
                return BadRequest(new { error = "Mesa não encontrada" });
            }

            if (mesaDisponivel.Status != "livre")
            {
                return BadRequest(new { error = "Mesa não está disponível" });
            }

            // Verificar se já existe cliente na mesa
            var clienteExistente = await _clienteRepository.GetByMesaAsync(dto.Mesa);
            if (clienteExistente != null)
            {
                return BadRequest(new { error = "Mesa já está ocupada" });
            }

            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Mesa = dto.Mesa
            };

            var clienteCriado = await _clienteRepository.AddAsync(cliente);

            // Atualizar status da mesa
            await _mesaRepository.UpdateStatusAsync(mesaDisponivel.MesaId, "ocupada");

            return CreatedAtAction(nameof(ObterCliente), new { id = clienteCriado.ClienteId }, new ClienteDto
            {
                ClienteId = clienteCriado.ClienteId,
                Nome = clienteCriado.Nome,
                Mesa = clienteCriado.Mesa
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> ObterCliente(int id)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
        {
            return NotFound(new { error = "Cliente não encontrado" });
        }

        return Ok(new ClienteDto
        {
            ClienteId = cliente.ClienteId,
            Nome = cliente.Nome,
            Mesa = cliente.Mesa
        });
    }

    [HttpGet("mesa/{mesa}")]
    public async Task<ActionResult<ClienteDto>> ObterClientePorMesa(int mesa)
    {
        var cliente = await _clienteRepository.GetByMesaAsync(mesa);
        if (cliente == null)
        {
            return NotFound(new { error = "Cliente não encontrado" });
        }

        return Ok(new ClienteDto
        {
            ClienteId = cliente.ClienteId,
            Nome = cliente.Nome,
            Mesa = cliente.Mesa
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> RemoverCliente(int id)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id);
        if (cliente == null)
        {
            return NotFound(new { error = "Cliente não encontrado" });
        }

        // Verificar se o cliente tem pedidos
        if (cliente.Pedidos.Any())
        {
            return BadRequest(new { error = "Não é possível remover cliente com pedidos" });
        }

        await _clienteRepository.DeleteAsync(cliente);

        // Liberar a mesa
        var mesa = await _mesaRepository.GetByNumeroAsync(cliente.Mesa);
        if (mesa != null)
        {
            await _mesaRepository.UpdateStatusAsync(mesa.MesaId, "livre");
        }

        return NoContent();
    }
}
