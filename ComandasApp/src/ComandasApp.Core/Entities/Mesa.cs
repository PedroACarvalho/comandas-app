using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.Entities;

public class Mesa
{
    [Key]
    public int MesaId { get; set; }
    
    [Required]
    public int Numero { get; set; }
    
    [Required]
    public int Capacidade { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "livre";
    
    public override string ToString()
    {
        return $"Mesa {Numero}";
    }
}
