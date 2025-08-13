using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class ItemDto
{
    public int ItemId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
}

public class CriarItemDto
{
    [Required]
    [StringLength(255)]
    public string Nome { get; set; } = string.Empty;
    
    public string? Descricao { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal Preco { get; set; }
}

public class AtualizarItemDto
{
    [StringLength(255)]
    public string? Nome { get; set; }
    
    public string? Descricao { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal? Preco { get; set; }
}
