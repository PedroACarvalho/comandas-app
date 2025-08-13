using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ComandasApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaRepository _categoriaRepository;

    public CategoriasController(ICategoriaRepository categoriaRepository)
    {
        _categoriaRepository = categoriaRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaDto>>> ListarCategorias()
    {
        try
        {
            var categorias = await _categoriaRepository.GetAtivasAsync();
            
            var result = categorias.Select(c => new CategoriaDto
            {
                CategoriaId = c.CategoriaId,
                Nome = c.Nome,
                Descricao = c.Descricao,
                Itens = c.Itens.Select(i => new ItemDto
                {
                    ItemId = i.ItemId,
                    Nome = i.Nome,
                    Descricao = i.Descricao,
                    Preco = i.Preco
                }).ToList()
            });

            return Ok(new { categorias = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaDto>> CriarCategoria([FromBody] CriarCategoriaDto dto)
    {
        try
        {
            // Verificar se já existe categoria com este nome
            var categoriaExistente = await _categoriaRepository.GetByNomeAsync(dto.Nome);
            if (categoriaExistente != null)
            {
                return BadRequest(new { error = "Já existe uma categoria com este nome" });
            }

            var categoria = new Categoria
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao
            };

            var categoriaCriada = await _categoriaRepository.AddAsync(categoria);

            return CreatedAtAction(nameof(ObterCategoria), new { id = categoriaCriada.CategoriaId }, new CategoriaDto
            {
                CategoriaId = categoriaCriada.CategoriaId,
                Nome = categoriaCriada.Nome,
                Descricao = categoriaCriada.Descricao,
                Itens = new List<ItemDto>()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoriaDto>> ObterCategoria(int id)
    {
        var categoria = await _categoriaRepository.GetByIdAsync(id);
        if (categoria == null)
        {
            return NotFound(new { error = "Categoria não encontrada" });
        }

        return Ok(new CategoriaDto
        {
            CategoriaId = categoria.CategoriaId,
            Nome = categoria.Nome,
            Descricao = categoria.Descricao,
            Itens = categoria.Itens.Select(i => new ItemDto
            {
                ItemId = i.ItemId,
                Nome = i.Nome,
                Descricao = i.Descricao,
                Preco = i.Preco
            }).ToList()
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoriaDto>> AtualizarCategoria(int id, [FromBody] AtualizarCategoriaDto dto)
    {
        try
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null)
            {
                return NotFound(new { error = "Categoria não encontrada" });
            }

            if (!string.IsNullOrEmpty(dto.Nome))
            {
                // Verificar se o novo nome já existe em outra categoria
                var categoriaExistente = await _categoriaRepository.GetByNomeAsync(dto.Nome);
                if (categoriaExistente != null && categoriaExistente.CategoriaId != id)
                {
                    return BadRequest(new { error = "Já existe uma categoria com este nome" });
                }
                categoria.Nome = dto.Nome;
            }
            
            if (dto.Descricao != null)
                categoria.Descricao = dto.Descricao;

            await _categoriaRepository.UpdateAsync(categoria);

            return Ok(new CategoriaDto
            {
                CategoriaId = categoria.CategoriaId,
                Nome = categoria.Nome,
                Descricao = categoria.Descricao,
                Itens = categoria.Itens.Select(i => new ItemDto
                {
                    ItemId = i.ItemId,
                    Nome = i.Nome,
                    Descricao = i.Descricao,
                    Preco = i.Preco
                }).ToList()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> RemoverCategoria(int id)
    {
        try
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null)
            {
                return NotFound(new { error = "Categoria não encontrada" });
            }

            // Verificar se a categoria tem itens
            if (categoria.Itens.Any())
            {
                return BadRequest(new { error = "Não é possível remover categoria com itens" });
            }

            await _categoriaRepository.DeleteAsync(categoria);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor", details = ex.Message });
        }
    }
}
