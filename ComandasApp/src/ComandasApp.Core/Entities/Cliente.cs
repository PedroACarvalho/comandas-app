using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.Entities;

public class Cliente
{
    [Key]
    public int ClienteId { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Nome { get; set; } = string.Empty;
    
    [Required]
    public int Mesa { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    
    public override string ToString()
    {
        return $"Cliente {Nome}";
    }
}
