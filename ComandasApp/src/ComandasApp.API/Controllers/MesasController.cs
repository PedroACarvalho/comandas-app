using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MesasController : ControllerBase
{
    private readonly IMesaRepository _mesaRepository;

    public MesasController(IMesaRepository mesaRepository)
    {
        _mesaRepository = mesaRepository;
    }

    [HttpGet("disponiveis")]
    public async Task<ActionResult<IEnumerable<MesaDisponivelDto>>> GetMesasDisponiveis()
    {
        try
        {
            var mesasDisponiveis = await _mesaRepository.GetDisponiveisAsync();
            
            var result = mesasDisponiveis.Select(m => new MesaDisponivelDto
            {
                MesaId = m.MesaId,
                Numero = m.Numero,
                Capacidade = m.Capacidade
            });

            return Ok(new { mesas_disponiveis = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<MesaDto>> CriarMesa([FromBody] CriarMesaDto dto)
    {
        try
        {
            // Verificar se já existe mesa com este número
            var mesaExistente = await _mesaRepository.GetByNumeroAsync(dto.Numero);
            if (mesaExistente != null)
            {
                return BadRequest(new { error = "Já existe uma mesa com este número" });
            }

            var mesa = new Mesa
            {
                Numero = dto.Numero,
                Capacidade = dto.Capacidade,
                Status = "livre"
            };

            var mesaCriada = await _mesaRepository.AddAsync(mesa);

            return CreatedAtAction(nameof(ObterMesa), new { id = mesaCriada.MesaId }, new MesaDto
            {
                MesaId = mesaCriada.MesaId,
                Numero = mesaCriada.Numero,
                Capacidade = mesaCriada.Capacidade,
                Status = mesaCriada.Status
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MesaDto>> ObterMesa(int id)
    {
        var mesa = await _mesaRepository.GetByIdAsync(id);
        if (mesa == null)
        {
            return NotFound(new { error = "Mesa não encontrada" });
        }

        return Ok(new MesaDto
        {
            MesaId = mesa.MesaId,
            Numero = mesa.Numero,
            Capacidade = mesa.Capacidade,
            Status = mesa.Status
        });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MesaDto>>> ListarMesas()
    {
        var mesas = await _mesaRepository.GetAllAsync();
        
        var result = mesas.Select(m => new MesaDto
        {
            MesaId = m.MesaId,
            Numero = m.Numero,
            Capacidade = m.Capacidade,
            Status = m.Status
        });

        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult> AtualizarStatusMesa(int id, [FromBody] string status)
    {
        try
        {
            var mesa = await _mesaRepository.GetByIdAsync(id);
            if (mesa == null)
            {
                return NotFound(new { error = "Mesa não encontrada" });
            }

            await _mesaRepository.UpdateStatusAsync(id, status);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }
}
