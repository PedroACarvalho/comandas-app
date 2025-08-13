using ComandasApp.API.Controllers;
using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace ComandasApp.API.Tests.Controllers;

public class PedidosControllerTests
{
    private readonly Mock<IPedidoRepository> _mockPedidoRepository;
    private readonly Mock<IClienteRepository> _mockClienteRepository;
    private readonly Mock<IItemRepository> _mockItemRepository;
    private readonly Mock<INotificationService> _mockNotificationService;
    private readonly PedidosController _controller;

    public PedidosControllerTests()
    {
        _mockPedidoRepository = new Mock<IPedidoRepository>();
        _mockClienteRepository = new Mock<IClienteRepository>();
        _mockItemRepository = new Mock<IItemRepository>();
        _mockNotificationService = new Mock<INotificationService>();
        _controller = new PedidosController(
            _mockPedidoRepository.Object, 
            _mockClienteRepository.Object, 
            _mockItemRepository.Object,
            _mockNotificationService.Object);
    }

    [Fact]
    public async Task CriarPedido_ComDadosValidos_RetornaCreated()
    {
        // Arrange
        var dto = new CriarPedidoDto
        {
            ClienteId = 1,
            Itens = new List<CriarPedidoItemDto>
            {
                new() { ItemId = 1, Quantidade = 2 }
            }
        };

        var cliente = new Cliente { ClienteId = 1, Nome = "João Silva", Mesa = 1 };
        var item = new Item { ItemId = 1, Nome = "Hambúrguer", Preco = 25.0m };
        var pedido = new Pedido { PedidoId = 1, ClienteId = 1, Status = "Pendente" };

        _mockClienteRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(cliente);
        _mockItemRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(item);
        _mockPedidoRepository.Setup(x => x.AddPedidoWithItemsAsync(It.IsAny<Pedido>(), It.IsAny<List<PedidoItem>>()))
            .ReturnsAsync(pedido);
        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);

        // Act
        var result = await _controller.CriarPedido(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedPedido = Assert.IsType<PedidoDto>(createdResult.Value);
        Assert.Equal(1, returnedPedido.PedidoId);
        Assert.Equal("Pendente", returnedPedido.Status);
    }

    [Fact]
    public async Task CriarPedido_ClienteNaoExiste_RetornaNotFound()
    {
        // Arrange
        var dto = new CriarPedidoDto { ClienteId = 999 };
        _mockClienteRepository.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Cliente?)null);

        // Act
        var result = await _controller.CriarPedido(dto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task AtualizarStatusPedido_StatusValido_RetornaNoContent()
    {
        // Arrange
        var pedido = new Pedido { PedidoId = 1, Status = "Pendente" };
        var dto = new AtualizarStatusPedidoDto { Status = "Em Preparo" };

        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);
        _mockPedidoRepository.Setup(x => x.UpdateStatusAsync(1, "Em Preparo")).Returns(Task.CompletedTask);
        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);

        // Act
        var result = await _controller.AtualizarStatusPedido(1, dto);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _mockNotificationService.Verify(x => x.EmitirPedidoAtualizadoAsync(It.IsAny<PedidoDto>()), Times.Once);
    }

    [Fact]
    public async Task ObterPedido_PedidoExiste_RetornaOk()
    {
        // Arrange
        var pedido = new Pedido 
        { 
            PedidoId = 1, 
            ClienteId = 1, 
            Status = "Pendente",
            Cliente = new Cliente { ClienteId = 1, Nome = "João Silva" }
        };

        _mockPedidoRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(pedido);

        // Act
        var result = await _controller.ObterPedido(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPedido = Assert.IsType<PedidoDto>(okResult.Value);
        Assert.Equal(1, returnedPedido.PedidoId);
        Assert.Equal("Pendente", returnedPedido.Status);
    }

    [Fact]
    public async Task ListarPedidos_RetornaOk()
    {
        // Arrange
        var pedidos = new List<Pedido>
        {
            new() { PedidoId = 1, Status = "Pendente" },
            new() { PedidoId = 2, Status = "Em Preparo" }
        };

        _mockPedidoRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(pedidos);

        // Act
        var result = await _controller.ListarPedidos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedPedidos = Assert.IsAssignableFrom<IEnumerable<PedidoDto>>(okResult.Value);
        Assert.Equal(2, returnedPedidos.Count());
    }
}
