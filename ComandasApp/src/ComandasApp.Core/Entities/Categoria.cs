using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.Entities;

public class Categoria
{
    [Key]
    public int CategoriaId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(255)]
    public string? Descricao { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Item> Itens { get; set; } = new List<Item>();
    
    public override string ToString()
    {
        return $"Categoria {Nome}";
    }
}
