using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestPlatform.CrossPlatEngine;
using MinimalApi.Dominio.Entidades;
using MinimalApi.Dominio.Servicos;
using MinimalApi.Infraestrutura.Db;

namespace Test;

[TestClass]
public sealed class AdministradorServicoTest
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
    public void TentandoSalvarAdministrador()
    {
        //Arrange
        var context = CriarContextoDeTeste();
        context.Database.ExecuteSqlRaw("TRUNCATE TABLE Administradores");



        var adm = new Administrador();
        adm.Id = 1;
        adm.Email = "teste@teste.com";
        adm.Senha = "123456";
        adm.Perfil = "Adm";

        var administradorServico = new AdministradorServico(context);


        //Act
        administradorServico.Incluir(adm);
        var adm1 = administradorServico.BuscaPorId(adm.Id);

        //Assert
        Assert.AreEqual(1, administradorServico.Todos(1).Count());
        Assert.IsNotNull(adm1);
        Assert.AreEqual(1, adm1.Id);

    }
}
