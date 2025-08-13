using ComandasApp.API.Controllers;
using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace ComandasApp.API.Tests.Controllers;

public class PagamentosControllerTests
{
    private readonly Mock<IPagamentoRepository> _mockPagamentoRepository;
    private readonly Mock<IPedidoRepository> _mockPedidoRepository;
    private readonly Mock<IClienteRepository> _mockClienteRepository;
    private readonly Mock<IMesaRepository> _mockMesaRepository;
    private readonly Mock<INotificationService> _mockNotificationService;
    private readonly PagamentosController _controller;

    public PagamentosControllerTests()
    {
        _mockPagamentoRepository = new Mock<IPagamentoRepository>();
        _mockPedidoRepository = new Mock<IPedidoRepository>();
        _mockClienteRepository = new Mock<IClienteRepository>();
        _mockMesaRepository = new Mock<IMesaRepository>();
        _mockNotificationService = new Mock<INotificationService>();
        _controller = new PagamentosController(
            _mockPagamentoRepository.Object,
            _mockPedidoRepository.Object,
            _mockClienteRepository.Object,
            _mockMesaRepository.Object,
            _mockNotificationService.Object);
    }

    [Fact]
    public async Task CriarPagamento_ComDadosValidos_RetornaCreated()
    {
        // Arrange
        var dto = new CriarPagamentoDto
        {
            PedidoId = 1,
            Metodo = "Cartão",
            Valor = 50.0m
        };

        var pedido = new Pedido 
        { 
            PedidoId = 1, 
            Fechado = true,
            Cliente = new Cliente { ClienteId = 1, Mesa = 1 }
        };

        var pagamento = new Pagamento
        {
            PagamentoId = 1,
            PedidoId = 1,
            Metodo = "Cartão",
            Valor = 50.0m,
            ValorPago = 50.0m,
            DataHora = DateTime.UtcNow
        };

        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);
        _mockPagamentoRepository.Setup(x => x.GetByPedidoAsync(1)).ReturnsAsync((Pagamento?)null);
        _mockPagamentoRepository.Setup(x => x.AddAsync(It.IsAny<Pagamento>())).ReturnsAsync(pagamento);
        _mockPedidoRepository.Setup(x => x.UpdateStatusAsync(1, "Pago")).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.CriarPagamento(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedPagamento = Assert.IsType<PagamentoDto>(createdResult.Value);
        Assert.Equal(1, returnedPagamento.PagamentoId);
        Assert.Equal("Cartão", returnedPagamento.Metodo);
        Assert.Equal(50.0m, returnedPagamento.Valor);
    }

    [Fact]
    public async Task CriarPagamento_PedidoNaoFechado_RetornaBadRequest()
    {
        // Arrange
        var dto = new CriarPagamentoDto { PedidoId = 1, Metodo = "Cartão", Valor = 50.0m };
        var pedido = new Pedido { PedidoId = 1, Fechado = false };

        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);

        // Act
        var result = await _controller.CriarPagamento(dto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Pedido deve estar fechado", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task CriarPagamento_PagamentoJaExiste_RetornaBadRequest()
    {
        // Arrange
        var dto = new CriarPagamentoDto { PedidoId = 1, Metodo = "Cartão", Valor = 50.0m };
        var pedido = new Pedido { PedidoId = 1, Fechado = true };
        var pagamentoExistente = new Pagamento { PagamentoId = 1, PedidoId = 1 };

        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);
        _mockPagamentoRepository.Setup(x => x.GetByPedidoAsync(1)).ReturnsAsync(pagamentoExistente);

        // Act
        var result = await _controller.CriarPagamento(dto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Já existe pagamento", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task ConfirmarPagamento_PagamentoDinheiro_RetornaNoContent()
    {
        // Arrange
        var pagamento = new Pagamento { PagamentoId = 1, PedidoId = 1, Metodo = "dinheiro" };
        var pedido = new Pedido { PedidoId = 1, Cliente = new Cliente { ClienteId = 1, Mesa = 1 } };
        var mesa = new Mesa { MesaId = 1, Numero = 1 };

        _mockPagamentoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pagamento);
        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);
        _mockMesaRepository.Setup(x => x.GetByNumeroAsync(1)).ReturnsAsync(mesa);
        _mockPedidoRepository.Setup(x => x.UpdateStatusAsync(1, "Pago")).Returns(Task.CompletedTask);
        _mockMesaRepository.Setup(x => x.UpdateStatusAsync(1, "livre")).Returns(Task.CompletedTask);

        var dto = new ConfirmarPagamentoDto();

        // Act
        var result = await _controller.ConfirmarPagamento(1, dto);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _mockPedidoRepository.Verify(x => x.UpdateStatusAsync(1, "Pago"), Times.Once);
        _mockMesaRepository.Verify(x => x.UpdateStatusAsync(1, "livre"), Times.Once);
    }

    [Fact]
    public async Task ObterPagamento_PagamentoExiste_RetornaOk()
    {
        // Arrange
        var pagamento = new Pagamento
        {
            PagamentoId = 1,
            PedidoId = 1,
            Metodo = "Cartão",
            Valor = 50.0m,
            ValorPago = 50.0m,
            DataHora = DateTime.UtcNow
        };

        _mockPagamentoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pagamento);

        // Act
        var result = await _controller.ObterPagamento(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPagamento = Assert.IsType<PagamentoDto>(okResult.Value);
        Assert.Equal(1, returnedPagamento.PagamentoId);
        Assert.Equal("Cartão", returnedPagamento.Metodo);
    }

    [Fact]
    public async Task ListarPagamentos_RetornaOk()
    {
        // Arrange
        var pagamentos = new List<Pagamento>
        {
            new() { PagamentoId = 1, Metodo = "Cartão", Valor = 50.0m },
            new() { PagamentoId = 2, Metodo = "Dinheiro", Valor = 30.0m }
        };

        _mockPagamentoRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(pagamentos);

        // Act
        var result = await _controller.ListarPagamentos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPagamentos = Assert.IsAssignableFrom<IEnumerable<PagamentoDto>>(okResult.Value);
        Assert.Equal(2, returnedPagamentos.Count());
    }
}
