-- ============================================================================
-- Script SQL para criar o banco de dados com dados de exemplo
-- ============================================================================
-- Este script cria o banco de dados, as tabelas e insere dados de teste
-- Execute este script no MySQL para ter um banco pronto para testar
-- ============================================================================
-- Cria o banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS minimal_api;
USE minimal_api;
-- Remove tabelas existentes (se houver)
DROP TABLE IF EXISTS `Veiculos`;
DROP TABLE IF EXISTS `Administradores`;
DROP TABLE IF EXISTS `__EFMigrationsHistory`;
-- ============================================================================
-- Tabela: Administradores
-- ============================================================================
CREATE TABLE `Administradores` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Email` varchar(255) NOT NULL,
    `Senha` varchar(50) NOT NULL,
    `Perfil` varchar(10) NOT NULL,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ============================================================================
-- Tabela: Veiculos
-- ============================================================================
CREATE TABLE `Veiculos` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nome` varchar(150) NOT NULL,
    `Marca` varchar(100) NOT NULL,
    `Ano` int NOT NULL,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ============================================================================
-- Tabela: Histórico de Migrations (Entity Framework)
-- ============================================================================
CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Insere as migrations aplicadas
INSERT INTO `__EFMigrationsHistory`
VALUES (
        '20251025171152_AdministradorMigration',
        '6.0.36'
    ),
    ('20251025173726_SeedAdministrador', '6.0.36'),
    ('20251026011119_VeiculosMigration', '6.0.36'),
    (
        '20251112163321_UpdateAdministradoresSeed',
        '6.0.36'
    );
-- ============================================================================
-- DADOS DE EXEMPLO - Administradores
-- ============================================================================
INSERT INTO `Administradores` (`Id`, `Email`, `Senha`, `Perfil`)
VALUES (1, 'admin@teste.com', 'admin', 'Adm'),
    (2, 'editor@teste.com', 'editor', 'Editor');
-- ============================================================================
-- DADOS DE EXEMPLO - Veículos (para testar a interface)
-- ============================================================================
INSERT INTO `Veiculos` (`Id`, `Nome`, `Marca`, `Ano`)
VALUES (1, 'Purosangue', 'Ferrari', 2023),
    (2, 'Lanzador', 'Lamborghini', 2026);
-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- Agora você pode usar a aplicação com:
-- 
-- Administrador:
--   Email: admin@teste.com
--   Senha: admin
--
-- Editor:
--   Email: editor@teste.com
--   Senha: editor
-- ============================================================================