using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComandasApp.Core.Entities;

public class Item
{
    [Key]
    public int ItemId { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Nome { get; set; } = string.Empty;
    
    public string? Descricao { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Preco { get; set; }
    
    public int? CategoriaId { get; set; }
    
    // Relacionamentos
    [ForeignKey("CategoriaId")]
    public virtual Categoria? Categoria { get; set; }
    
    public virtual ICollection<PedidoItem> PedidoItens { get; set; } = new List<PedidoItem>();
    
    public override string ToString()
    {
        return $"Item {Nome}";
    }
}
