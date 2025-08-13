using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class CategoriaDto
{
    public int CategoriaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public List<ItemDto> Itens { get; set; } = new();
}

public class CriarCategoriaDto
{
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(255)]
    public string? Descricao { get; set; }
}

public class AtualizarCategoriaDto
{
    [StringLength(100)]
    public string? Nome { get; set; }
    
    [StringLength(255)]
    public string? Descricao { get; set; }
}
