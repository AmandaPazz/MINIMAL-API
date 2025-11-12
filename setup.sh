#!/bin/bash
# ============================================================================
# Script de Setup Automático para Linux/Mac
# ============================================================================
# Este script ajuda a configurar o projeto rapidamente
# ============================================================================

echo ""
echo "========================================"
echo "  Setup - Minimal API"
echo "========================================"
echo ""

echo "[1/2] Verificando configuração..."
echo ""
echo "[ATENÇÃO] IMPORTANTE: Edite o arquivo Api/appsettings.json e configure:"
echo "  - Sua senha MySQL (Pwd=) na string de conexão"
echo "  - Se não tiver senha, deixe Pwd= vazio: Pwd=;"
echo "  - O usuário já está configurado como root"
echo ""
read -p "Pressione Enter para continuar..."

echo "[2/2] Restaurando dependências do .NET..."
cd Api
dotnet restore
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao restaurar dependências!"
    exit 1
fi
echo "[OK] Dependências restauradas!"
echo ""

echo "========================================"
echo "  Próximo Passo:"
echo "========================================"
echo ""
echo "1. Edite Api/appsettings.json e configure sua senha MySQL"
echo "2. Execute o script SQL: database.sql"
echo "   (via MySQL Workbench ou linha de comando)"
echo "3. Execute: cd Api && dotnet run"
echo ""
echo "========================================"
echo ""

