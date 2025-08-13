using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComandasApp.Core.Entities;

public class Pagamento
{
    [Key]
    public int PagamentoId { get; set; }
    
    [Required]
    public int PedidoId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Metodo { get; set; } = string.Empty;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Valor { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? ValorPago { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Troco { get; set; }
    
    [Required]
    public DateTime DataHora { get; set; } = DateTime.UtcNow;
    
    // Relacionamentos
    [ForeignKey("PedidoId")]
    public virtual Pedido Pedido { get; set; } = null!;
    
    public override string ToString()
    {
        return $"Pagamento {PagamentoId}";
    }
}
