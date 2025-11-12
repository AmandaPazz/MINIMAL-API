using MinimalApi.Infraestrutura.Db;
using MinimalApi.DTOs;
using Microsoft.EntityFrameworkCore;
using MinimalApi.Dominio.Interfaces;
using MinimalApi.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;
using MinimalApi.Dominio.ModelViews;
using MinimalApi.Dominio.Entidades;
using MinimalApi.Dominio.Enuns;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Linq;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
public class Startup {

  public IConfiguration Configuration {
    get;
    set;
  } = default!;
  private string key;
  public Startup(IConfiguration configuration) {
    Configuration = configuration;
    key = Configuration["Jwt"] ?? throw new InvalidOperationException("JWT key not found in configuration");
  }

  public void ConfigureServices(IServiceCollection services) {

    services.AddAuthentication(option => {
      option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(option => {
      option.TokenValidationParameters = new TokenValidationParameters {
        ValidateLifetime = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
          ValidateAudience = false,
          ValidateIssuer = false,

      };
    });

    services.AddAuthorization();

    services.AddScoped < IAdministradorServico, AdministradorServico > ();
    services.AddScoped < IVeiculoServico, VeiculoServico > ();

    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(options => {
      options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Name = "Authorization",
          Type = SecuritySchemeType.Http,
          Scheme = "bearer",
          BearerFormat = "JWT",
          In = ParameterLocation.Header,
          Description = "Insira o token JWT aqui: "
      });

      options.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
          new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
              Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
          },

          new string[] {}
        }
      });

    });

    services.AddDbContext < DbContexto > (options => {
      options.UseMySql(
        Configuration.GetConnectionString("MySql"),
        ServerVersion.AutoDetect(Configuration.GetConnectionString("MySql"))

      );
    });
  }


  public void configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();
    

    app.UseEndpoints(endpoints =>
    {
        # region Home
        endpoints.MapGet("/", () => Results.Json(new Home())).AllowAnonymous().WithTags("Home");
        # endregion 

        # region Administradores

        string GerarTokenJwt(Administrador administrador)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


            var claims = new List<Claim>(){
                new Claim ("Email", administrador.Email),
                new Claim (ClaimTypes.Role, administrador.Perfil),
                new Claim("Perfil", administrador.Perfil)
            };


            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }



        endpoints.MapPost("/administradores/login", ([FromBody] LoginDTO loginDTO, IAdministradorServico administradorServico) =>
        {
            var adm = administradorServico.Login(loginDTO);

            if (adm != null)
            {
                string token = GerarTokenJwt(adm);
                return Results.Ok(new AdministradorLogado
                {
                    Email = adm.Email,
                    Perfil = adm.Perfil,
                    Token = token
                });
            }
            else
            {
                return Results.Unauthorized();
            }
        }).AllowAnonymous().WithTags("Administradores");





        endpoints.MapGet("/administradores", ([FromQuery] int? pagina, IAdministradorServico administradorServico) =>
        {
            var adms = new List<AdministradorModelViews>();
            var administradores = administradorServico.Todos(pagina);

            foreach (var adm in administradores)
            {
                adms.Add(new AdministradorModelViews
                {
                    Id = adm.Id,
                    Email = adm.Email,
                    Perfil = adm.Perfil
                });
            }
            return Results.Ok(adms);
        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm" }).WithTags("Administradores");






        endpoints.MapGet("/administradores/{id}", ([FromRoute] int id, IAdministradorServico administradorServico) =>
        {
            var administrador = administradorServico.BuscaPorId(id);
            if (administrador == null) return Results.NotFound();
            return Results.Ok(new AdministradorModelViews
            {
                Id = administrador.Id,
                Email = administrador.Email,
                Perfil = administrador.Perfil
            });
        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm" }).WithTags("Administradores");



        endpoints.MapPost("/administradores", ([FromBody] AdministradorDTO administradorDTO, IAdministradorServico administradorServico) =>
        {
            if (administradorDTO == null)
            {
                return Results.BadRequest(new { mensagem = "O administrador não pode ser vazio" });
            }

            var validacao = new ErrosDeValidacao
            {
                Mensagens = new List<string>()
            };

            if (string.IsNullOrEmpty(administradorDTO.Email))
            {
                validacao.Mensagens.Add("O email não pode ser vazio");
            }
            if (string.IsNullOrEmpty(administradorDTO.Senha))
            {
                validacao.Mensagens.Add("A senha não pode ser vazia");
            }

            if (validacao.Mensagens.Count() > 0)
            {
                return Results.BadRequest(validacao);
            }

            var administrador = new Administrador
            {
                Email = administradorDTO.Email,
                Senha = administradorDTO.Senha,
                Perfil = administradorDTO.Perfil?.ToString() ?? Perfil.Editor.ToString()
            };


            administradorServico.Incluir(administrador);

            return Results.Created($"/administrador/{administrador.Id}", new AdministradorModelViews
            {
                Id = administrador.Id,
                Email = administrador.Email,
                Perfil = administrador.Perfil
            });

        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm" }).WithTags("Administradores");




        #endregion

        # region Veiculos
        ErrosDeValidacao validaDTO(VeiculoDTO veiculoDTO)
        {
            var validacao = new ErrosDeValidacao
            {
                Mensagens = new List<string>()
            };

            if (string.IsNullOrEmpty(veiculoDTO.Nome))
            {
                validacao.Mensagens.Add("O nome não pode ser vazio");
            }

            if (string.IsNullOrEmpty(veiculoDTO.Marca))
            {
                validacao.Mensagens.Add("A marca não pode ficar em branco");
            }

            if (veiculoDTO.Ano < 1950)
            {
                validacao.Mensagens.Add("Veiculo muito antigo. Apenas carros superiores ao ano 1950");
            }

            return validacao;
        }




        endpoints.MapPost("/veiculos", ([FromBody] VeiculoDTO veiculoDTO, IVeiculoServico veiculoServico) =>
        {



            var validacao = validaDTO(veiculoDTO);
            if (validacao.Mensagens.Count() > 0)
            {
                return Results.BadRequest(validacao);
            }

            var veiculo = new Veiculo
            {
                Nome = veiculoDTO.Nome,
                Marca = veiculoDTO.Marca,
                Ano = veiculoDTO.Ano
            };


            veiculoServico.Incluir(veiculo);

            return Results.Created($"/veiculo/{veiculo.Id}", veiculo);
        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm, Editor"}).WithTags("Veiculos");



        endpoints.MapGet("/veiculos", ([FromQuery] int? pagina, IVeiculoServico veiculoServico) =>
        {

            var veiculos = veiculoServico.Todos(pagina);
            return Results.Ok(veiculos);
        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm, Editor"}).WithTags("Veiculos");




        endpoints.MapGet("/veiculos/{id}", ([FromRoute] int id, IVeiculoServico veiculoServico) =>
        {

            var veiculo = veiculoServico.BuscaPorId(id);

            if (veiculo == null) return Results.NotFound();
            return Results.Ok(veiculo);
        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm, Editor"}).WithTags("Veiculos");


        endpoints.MapPut("/veiculos/{id}", ([FromRoute] int id, VeiculoDTO veiculoDTO, IVeiculoServico veiculoServico) =>
        {

            var veiculo = veiculoServico.BuscaPorId(id);
            if (veiculo == null) return Results.NotFound();


            var validacao = validaDTO(veiculoDTO);
            if (validacao.Mensagens.Count() > 0)
            {
                return Results.BadRequest(validacao);
            }




            veiculo.Nome = veiculoDTO.Nome;
            veiculo.Marca = veiculoDTO.Marca;
            veiculo.Ano = veiculoDTO.Ano;

            veiculoServico.Atualizar(veiculo);

            return Results.Ok(veiculo);

        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm"}).WithTags("Veiculos");

        endpoints.MapDelete("/veiculos/{id}", ([FromRoute] int id, IVeiculoServico veiculoServico) =>
        {
            var veiculo = veiculoServico.BuscaPorId(id);
            if (veiculo == null) return Results.NotFound();



            veiculoServico.Apagar(veiculo);

            return Results.NoContent();

        }).RequireAuthorization(new AuthorizeAttribute { Roles = "Adm"}).WithTags("Veiculos");



        #endregion
    });

  }
}