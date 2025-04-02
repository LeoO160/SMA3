@echo off
echo.
echo ====================================================
echo  CONFIGURAÇÃO DO SUPABASE PARA O PROJETO MEMÓRIAS
echo ====================================================
echo.
echo Este script irá recriar sua tabela "memorias" e configurar o storage
echo com todas as permissões necessárias.
echo.
echo IMPORTANTE: É necessário ter o Node.js instalado.
echo.
pause

echo.
echo Verificando se o Node.js está instalado...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Erro: Node.js não encontrado. Por favor, instale o Node.js e tente novamente.
  echo Você pode baixá-lo em: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

echo Node.js encontrado! Versão:
node --version
echo.

echo Instalando dependências...
echo Copiando configuração temporária...
copy scripts-supabase.json temp-package.json >nul
npm install --prefix . -f
if %ERRORLEVEL% NEQ 0 (
  echo Erro ao instalar dependências.
  del temp-package.json >nul 2>nul
  pause
  exit /b 1
)

echo.
echo Executando script de configuração do Supabase...
node index.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Ocorreu um erro ao executar o script.
  del temp-package.json >nul 2>nul
  pause
  exit /b 1
)

echo Limpando arquivos temporários...
del temp-package.json >nul 2>nul

echo.
echo ====================================================
echo  CONFIGURAÇÃO CONCLUÍDA!
echo ====================================================
echo.
echo Agora você pode voltar ao aplicativo e usar o
echo botão "Testar Conexão com Supabase" para verificar
echo se tudo está funcionando corretamente.
echo.
echo Para iniciar o aplicativo, execute: npm run dev
echo.
pause 
 