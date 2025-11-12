using MinimalApi.Dominio.Entidades;
using MinimalApi.Dominio.Interfaces;

namespace Test.Mocks;

public class VeiculoServicoMock : IVeiculoServico
{
    private static List<Veiculo> veiculos = new List<Veiculo>(){
        new Veiculo{
            Id = 1,
            Nome = "Purosangue",
            Marca = "Ferrari",
            Ano = 2024
        },
        new Veiculo{
            Id = 2,
            Nome = "Civic",
            Marca = "Honda",
            Ano = 2023
        }
    };

    public Veiculo? BuscaPorId(int id)
    {
        return veiculos.Find(v => v.Id == id);
    }

    public void Incluir(Veiculo veiculo)
    {
        veiculo.Id = veiculos.Count() + 1;
        veiculos.Add(veiculo);
    }

    public void Atualizar(Veiculo veiculo)
    {
        var index = veiculos.FindIndex(v => v.Id == veiculo.Id);
        if (index >= 0)
        {
            veiculos[index] = veiculo;
        }
    }

    public void Apagar(Veiculo veiculo)
    {
        veiculos.RemoveAll(v => v.Id == veiculo.Id);
    }

    public List<Veiculo> Todos(int? pagina = 1, string? nome = null, string? marca = null)
    {
        return veiculos;
    }
}

