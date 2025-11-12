using System.Net;
using System.Text;
using System.Text.Json;
using MinimalApi.Dominio.Entidades;
using MinimalApi.Dominio.ModelViews;
using MinimalApi.DTOs;
using Test.Helpers;

namespace Test.Requests;

[TestClass]
public class VeiculoRequestTest
{
    [ClassInitialize]
    public static void ClassInit(TestContext testContext)
    {
        Setup.ClassInit(testContext);
    }

    [ClassCleanup]
    public static void ClassCleanup()
    {
        Setup.ClassCleanup();
    }

    [TestMethod]
    public async Task TestarGetVeiculos()
    {
        // Arrange
        var loginDTO = new LoginDTO
        {
            Email = "adm@teste.com",
            Senha = "123456"
        };

        var loginContent = new StringContent(JsonSerializer.Serialize(loginDTO), Encoding.UTF8, "Application/json");
        var loginResponse = await Setup.client.PostAsync("/administradores/login", loginContent);
        var loginResult = await loginResponse.Content.ReadAsStringAsync();
        var admLogado = JsonSerializer.Deserialize<AdministradorLogado>(loginResult, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        var clientWithAuth = Setup.http.CreateClient();
        clientWithAuth.DefaultRequestHeaders.Add("Authorization", $"Bearer {admLogado?.Token}");

        // Act
        var response = await clientWithAuth.GetAsync("/veiculos");

        // Assert
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadAsStringAsync();
        var veiculos = JsonSerializer.Deserialize<List<Veiculo>>(result, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.IsNotNull(veiculos);
        Assert.IsTrue(veiculos!.Count > 0);
    }
}

