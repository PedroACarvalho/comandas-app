using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComandasApp.Core.Entities;

public class Pedido
{
    [Key]
    public int PedidoId { get; set; }
    
    [Required]
    public int ClienteId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Aguardando Seleção";
    
    [Required]
    public DateTime DataHora { get; set; } = DateTime.UtcNow;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; } = 0;
    
    [Required]
    public bool Fechado { get; set; } = false;
    
    // Relacionamentos
    [ForeignKey("ClienteId")]
    public virtual Cliente Cliente { get; set; } = null!;
    
    public virtual ICollection<PedidoItem> Itens { get; set; } = new List<PedidoItem>();
    
    public virtual Pagamento? Pagamento { get; set; }
    
    public override string ToString()
    {
        return $"Pedido {PedidoId}";
    }
}
