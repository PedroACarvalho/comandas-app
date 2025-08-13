using System.ComponentModel.DataAnnotations;

namespace ComandasApp.Core.DTOs;

public class PagamentoDto
{
    public int PagamentoId { get; set; }
    public int PedidoId { get; set; }
    public string Metodo { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal? ValorPago { get; set; }
    public decimal? Troco { get; set; }
    public DateTime DataHora { get; set; }
}

public class CriarPagamentoDto
{
    [Required]
    public int PedidoId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Metodo { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor pago deve ser maior que zero")]
    public decimal? ValorPago { get; set; }
}

public class ConfirmarPagamentoDto
{
    [Required]
    public int PagamentoId { get; set; }
}
