using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestPlatform.CrossPlatEngine;
using MinimalApi.Dominio.Entidades;
using MinimalApi.Dominio.Servicos;
using MinimalApi.Infraestrutura.Db;

namespace Test;

[TestClass]
public sealed class VeiculoServicoTest
{

    private DbContexto CriarContextoDeTeste()
    {

        var assemblyPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        var path = Path.GetFullPath(Path.Combine(assemblyPath ?? "", "..", "..", ".."));

        var builder = new ConfigurationBuilder()
        .SetBasePath(path ?? Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddEnvironmentVariables();

        var configuration = builder.Build();


        return new DbContexto(configuration);
    }



    [TestMethod]
    public void TentandoSalvarVeiculo()
    {
        //Arrange
        var context = CriarContextoDeTeste();
        context.Database.ExecuteSqlRaw("TRUNCATE TABLE Veiculos");



        var veiculo = new Veiculo();
        veiculo.Id = 1;
        veiculo.Nome = "Purosangue";
        veiculo.Marca = "Ferrari";
        veiculo.Ano = 2024;

        var veiculoServico = new VeiculoServico(context);


        //Act
        veiculoServico.Incluir(veiculo);
        var veiculo1 = veiculoServico.BuscaPorId(veiculo.Id);

        //Assert
        Assert.AreEqual(1, veiculoServico.Todos(1).Count());
        Assert.IsNotNull(veiculo1);
        Assert.AreEqual(1, veiculo1.Id);

    }
}

