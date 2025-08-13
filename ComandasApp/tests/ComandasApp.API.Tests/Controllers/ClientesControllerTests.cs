using ComandasApp.API.Controllers;
using ComandasApp.Core.DTOs;
using ComandasApp.Core.Entities;
using ComandasApp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace ComandasApp.API.Tests.Controllers;

public class ClientesControllerTests
{
    private readonly Mock<IClienteRepository> _mockClienteRepository;
    private readonly Mock<IMesaRepository> _mockMesaRepository;
    private readonly ClientesController _controller;

    public ClientesControllerTests()
    {
        _mockClienteRepository = new Mock<IClienteRepository>();
        _mockMesaRepository = new Mock<IMesaRepository>();
        _controller = new ClientesController(_mockClienteRepository.Object, _mockMesaRepository.Object);
    }

    [Fact]
    public async Task CriarCliente_ComDadosValidos_RetornaCreated()
    {
        // Arrange
        var dto = new CriarClienteDto { Nome = "João Silva", Mesa = 1 };
        var cliente = new Cliente { ClienteId = 1, Nome = "João Silva", Mesa = 1 };
        var mesa = new Mesa { MesaId = 1, Numero = 1, Status = "livre" };

        _mockMesaRepository.Setup(x => x.GetByNumeroAsync(1)).ReturnsAsync(mesa);
        _mockClienteRepository.Setup(x => x.GetByMesaAsync(1)).ReturnsAsync((Cliente?)null);
        _mockClienteRepository.Setup(x => x.AddAsync(It.IsAny<Cliente>())).ReturnsAsync(cliente);

        // Act
        var result = await _controller.CriarCliente(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedCliente = Assert.IsType<ClienteDto>(createdResult.Value);
        Assert.Equal("João Silva", returnedCliente.Nome);
        Assert.Equal(1, returnedCliente.Mesa);
    }

    [Fact]
    public async Task CriarCliente_MesaOcupada_RetornaBadRequest()
    {
        // Arrange
        var dto = new CriarClienteDto { Nome = "João Silva", Mesa = 1 };
        var clienteExistente = new Cliente { ClienteId = 1, Nome = "Maria", Mesa = 1 };

        _mockClienteRepository.Setup(x => x.GetByMesaAsync(1)).ReturnsAsync(clienteExistente);

        // Act
        var result = await _controller.CriarCliente(dto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Mesa não encontrada", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task ObterCliente_ClienteExiste_RetornaOk()
    {
        // Arrange
        var cliente = new Cliente { ClienteId = 1, Nome = "João Silva", Mesa = 1 };
        _mockClienteRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(cliente);

        // Act
        var result = await _controller.ObterCliente(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedCliente = Assert.IsType<ClienteDto>(okResult.Value);
        Assert.Equal("João Silva", returnedCliente.Nome);
    }

    [Fact]
    public async Task ObterCliente_ClienteNaoExiste_RetornaNotFound()
    {
        // Arrange
        _mockClienteRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync((Cliente?)null);

        // Act
        var result = await _controller.ObterCliente(1);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task RemoverCliente_ClienteComPedidos_RetornaBadRequest()
    {
        // Arrange
        var cliente = new Cliente { ClienteId = 1, Nome = "João Silva", Mesa = 1 };
        cliente.Pedidos.Add(new Pedido { PedidoId = 1 });

        _mockClienteRepository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(cliente);

        // Act
        var result = await _controller.RemoverCliente(1);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Não é possível remover cliente com pedidos", badRequestResult.Value?.ToString());
    }
}
