namespace MinimalApi.DTOs;
using MinimalApi.Dominio.Enuns;
public class AdministradorDTO
{

    public string Email { get; set; } = default!;
    public string Senha { get; set; } = default!;
    public string? Perfil { get; set; } = default!;
    // Mudado de Perfil? (enum) para string? para aceitar strings do frontend
    // A conversão para enum será feita nos endpoints





}