using Microsoft.VisualStudio.TestPlatform.CrossPlatEngine;
using MinimalApi.Dominio.Entidades;

namespace Test;

[TestClass]
public sealed class VeiculoTest
{
    [TestMethod]
    public void TestarGetSetPropriedade()
    {
        //Arrange
        var veiculo = new Veiculo();

        //Act
        veiculo.Id = 1;
        veiculo.Nome = "Purosangue";
        veiculo.Marca = "Ferrari";
        veiculo.Ano = 2024;

        //Assert
        Assert.AreEqual(1, veiculo.Id);
        Assert.AreEqual("Purosangue", veiculo.Nome);
        Assert.AreEqual("Ferrari", veiculo.Marca);
        Assert.AreEqual(2024, veiculo.Ano);

    }
}

