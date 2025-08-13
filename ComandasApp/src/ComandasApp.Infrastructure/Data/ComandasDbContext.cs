using ComandasApp.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ComandasApp.Infrastructure.Data;

public class ComandasDbContext : DbContext
{
    public ComandasDbContext(DbContextOptions<ComandasDbContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Mesa> Mesas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Item> Itens { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<PedidoItem> PedidoItens { get; set; }
    public DbSet<Pagamento> Pagamentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração das tabelas
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("cliente");
            entity.HasKey(e => e.ClienteId);
            entity.Property(e => e.ClienteId).HasColumnName("cliente_id");
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Mesa).HasColumnName("mesa").IsRequired();
        });

        modelBuilder.Entity<Mesa>(entity =>
        {
            entity.ToTable("mesa");
            entity.HasKey(e => e.MesaId);
            entity.Property(e => e.MesaId).HasColumnName("mesa_id");
            entity.Property(e => e.Numero).HasColumnName("numero").IsRequired();
            entity.Property(e => e.Capacidade).HasColumnName("capacidade").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Numero).IsUnique();
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("categoria");
            entity.HasKey(e => e.CategoriaId);
            entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasMaxLength(255);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("item");
            entity.HasKey(e => e.ItemId);
            entity.Property(e => e.ItemId).HasColumnName("item_id");
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao");
            entity.Property(e => e.Preco).HasColumnName("preco").HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");

            entity.HasOne(e => e.Categoria)
                .WithMany(c => c.Itens)
                .HasForeignKey(e => e.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.ToTable("pedido");
            entity.HasKey(e => e.PedidoId);
            entity.Property(e => e.PedidoId).HasColumnName("pedido_id");
            entity.Property(e => e.ClienteId).HasColumnName("cliente_id").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
            entity.Property(e => e.DataHora).HasColumnName("data_hora").IsRequired();
            entity.Property(e => e.Total).HasColumnName("total").HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.Fechado).HasColumnName("fechado").IsRequired();

            entity.HasOne(e => e.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PedidoItem>(entity =>
        {
            entity.ToTable("pedido_item");
            entity.HasKey(e => new { e.PedidoId, e.ItemId });
            entity.Property(e => e.PedidoId).HasColumnName("pedido_id");
            entity.Property(e => e.ItemId).HasColumnName("item_id");
            entity.Property(e => e.Quantidade).HasColumnName("quantidade").IsRequired();

            entity.HasOne(e => e.Pedido)
                .WithMany(p => p.Itens)
                .HasForeignKey(e => e.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Item)
                .WithMany(i => i.PedidoItens)
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Pagamento>(entity =>
        {
            entity.ToTable("pagamento");
            entity.HasKey(e => e.PagamentoId);
            entity.Property(e => e.PagamentoId).HasColumnName("pagamento_id");
            entity.Property(e => e.PedidoId).HasColumnName("pedido_id").IsRequired();
            entity.Property(e => e.Metodo).HasColumnName("metodo").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Valor).HasColumnName("valor").HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.ValorPago).HasColumnName("valor_pago").HasColumnType("decimal(10,2)");
            entity.Property(e => e.Troco).HasColumnName("troco").HasColumnType("decimal(10,2)");
            entity.Property(e => e.DataHora).HasColumnName("data_hora").IsRequired();

            entity.HasOne(e => e.Pedido)
                .WithOne(p => p.Pagamento)
                .HasForeignKey<Pagamento>(e => e.PedidoId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
