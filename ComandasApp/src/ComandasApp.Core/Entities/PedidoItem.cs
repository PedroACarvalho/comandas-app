using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComandasApp.Core.Entities;

public class PedidoItem
{
    [Key]
    [Column(Order = 0)]
    public int PedidoId { get; set; }
    
    [Key]
    [Column(Order = 1)]
    public int ItemId { get; set; }
    
    [Required]
    public int Quantidade { get; set; }
    
    // Relacionamentos
    [ForeignKey("PedidoId")]
    public virtual Pedido Pedido { get; set; } = null!;
    
    [ForeignKey("ItemId")]
    public virtual Item Item { get; set; } = null!;
    
    public override string ToString()
    {
        return $"PedidoItem {PedidoId}-{ItemId}";
    }
}
