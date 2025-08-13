using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class ClienteDto
{
    public int ClienteId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Mesa { get; set; }
}

public class CriarClienteDto
{
    [Required]
    [StringLength(255)]
    public string Nome { get; set; } = string.Empty;
    
    [Required]
    public int Mesa { get; set; }
}

public class ClienteResponseDto
{
    public int ClienteId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Mesa { get; set; }
    public List<PedidoDto> Pedidos { get; set; } = new();
}
