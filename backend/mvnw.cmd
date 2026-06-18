@echo off
setlocal
set BASE_DIR=%~dp0
set MAVEN_DIR=%BASE_DIR%.mvn\wrapper\apache-maven-3.9.11
set MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd

if exist "%MAVEN_CMD%" goto run_maven

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $base='%BASE_DIR%'; $zip=Join-Path $base '.mvn\wrapper\apache-maven-3.9.11-bin.zip'; $dest=Join-Path $base '.mvn\wrapper'; New-Item -ItemType Directory -Force -Path $dest | Out-Null; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.zip' -OutFile $zip; Expand-Archive -Path $zip -DestinationPath $dest -Force"
if errorlevel 1 exit /b %errorlevel%
if not exist "%MAVEN_CMD%" exit /b 1

:run_maven
call "%MAVEN_CMD%" %*
exit /b %errorlevel%
endlocal
