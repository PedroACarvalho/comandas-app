using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class MesaDto
{
    public int MesaId { get; set; }
    public int Numero { get; set; }
    public int Capacidade { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CriarMesaDto
{
    [Required]
    public int Numero { get; set; }
    
    [Required]
    public int Capacidade { get; set; }
}

public class MesaDisponivelDto
{
    public int MesaId { get; set; }
    public int Numero { get; set; }
    public int Capacidade { get; set; }
}
