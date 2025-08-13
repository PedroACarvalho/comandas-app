using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class PedidoDto
{
    public int PedidoId { get; set; }
    public int ClienteId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DataHora { get; set; }
    public decimal Total { get; set; }
    public bool Fechado { get; set; }
    public ClienteDto? Cliente { get; set; }
    public List<PedidoItemDto> Itens { get; set; } = new();
    public PagamentoDto? Pagamento { get; set; }
}

public class CriarPedidoDto
{
    [Required]
    public int ClienteId { get; set; }

    [Required]
    public List<CriarPedidoItemDto> Itens { get; set; } = new();
}

public class CriarPedidoItemDto
{
    [Required]
    public int ItemId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantidade { get; set; }

    [StringLength(500)]
    public string? Observacao { get; set; }
}

public class PedidoItemDto
{
    public int ItemId { get; set; }
    public int Quantidade { get; set; }
    public string? Observacao { get; set; }
    public ItemDto? Item { get; set; }
}

public class AtualizarStatusPedidoDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
