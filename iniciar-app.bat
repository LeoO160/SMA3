@echo off
echo ============================================
echo    INICIANDO APLICATIVO MEMORIAS DIGITAIS
echo ============================================
echo.

cd /d "%~dp0"
echo Diretorio atual: %CD%
echo.

echo Verificando instalacao do Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [ERRO] Node.js nao encontrado. Por favor instale o Node.js e tente novamente.
  echo Voce pode baixa-lo em: https://nodejs.org/
  pause
  exit /b 1
)

echo Node.js encontrado: 
node -v
echo.

echo Executando aplicacao...
echo.

call npm run dev

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [ERRO] Falha ao iniciar o aplicativo.
  echo Por favor verifique os erros acima.
  echo.
)

pause 