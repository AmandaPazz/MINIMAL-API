@echo off
REM ============================================================================
REM Script de Setup Automático para Windows
REM ============================================================================
REM Este script ajuda a configurar o projeto rapidamente
REM ============================================================================

echo.
echo ========================================
echo   Setup - Minimal API
echo ========================================
echo.

echo [1/2] Verificando configuracao...
echo.
echo [ATENCAO] IMPORTANTE: Edite o arquivo Api\appsettings.json e configure:
echo   - Sua senha MySQL (Pwd=) na string de conexao
echo   - Se nao tiver senha, deixe Pwd= vazio: Pwd=;
echo   - O usuario ja esta configurado como root
echo.
pause

echo [2/2] Restaurando dependencias do .NET...
cd Api
dotnet restore
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao restaurar dependencias!
    pause
    exit /b 1
)
echo [OK] Dependencias restauradas!
echo.

echo ========================================
echo   Proximo Passo:
echo ========================================
echo.
echo 1. Edite Api\appsettings.json e configure sua senha MySQL
echo 2. Execute o script SQL: database.sql
echo    (via MySQL Workbench ou linha de comando)
echo 3. Execute: cd Api && dotnet run
echo.
echo ========================================
echo.
pause

