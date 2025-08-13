using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItensController : ControllerBase
{
    private readonly IItemRepository _itemRepository;

    public ItensController(IItemRepository itemRepository)
    {
        _itemRepository = itemRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> ListarItens()
    {
        try
        {
            var itens = await _itemRepository.GetAtivosAsync();
            
            var result = itens.Select(i => new ItemDto
            {
                ItemId = i.ItemId,
                Nome = i.Nome,
                Descricao = i.Descricao,
                Preco = i.Preco
            });

            return Ok(new { itens = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> ObterItem(int id)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound(new { error = "Item não encontrado" });
        }

        return Ok(new ItemDto
        {
            ItemId = item.ItemId,
            Nome = item.Nome,
            Descricao = item.Descricao,
            Preco = item.Preco
        });
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> CriarItem([FromBody] CriarItemDto dto)
    {
        try
        {
            var item = new Item
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Preco = dto.Preco
            };

            var itemCriado = await _itemRepository.AddAsync(item);

            return CreatedAtAction(nameof(ObterItem), new { id = itemCriado.ItemId }, new ItemDto
            {
                ItemId = itemCriado.ItemId,
                Nome = itemCriado.Nome,
                Descricao = itemCriado.Descricao,
                Preco = itemCriado.Preco
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ItemDto>> AtualizarItem(int id, [FromBody] AtualizarItemDto dto)
    {
        try
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Item não encontrado" });
            }

            if (!string.IsNullOrEmpty(dto.Nome))
                item.Nome = dto.Nome;
            
            if (dto.Descricao != null)
                item.Descricao = dto.Descricao;
            
            if (dto.Preco.HasValue)
                item.Preco = dto.Preco.Value;

            await _itemRepository.UpdateAsync(item);

            return Ok(new ItemDto
            {
                ItemId = item.ItemId,
                Nome = item.Nome,
                Descricao = item.Descricao,
                Preco = item.Preco
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> RemoverItem(int id)
    {
        try
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Item não encontrado" });
            }

            await _itemRepository.DeleteAsync(item);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }
}
