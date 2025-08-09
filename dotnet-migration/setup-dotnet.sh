#!/bin/bash

# 🚀 Script de Setup para Migração .NET - Sistema de Comandas Online
# Autor: Pedro Augusto Carvalho
# Data: $(date)

echo "🚀 Iniciando setup da migração para .NET..."

# Verificar se .NET 8 está instalado
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 8 não está instalado. Por favor, instale o .NET 8 SDK."
    echo "📥 Download: https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi

# Verificar versão do .NET
DOTNET_VERSION=$(dotnet --version)
echo "✅ .NET $DOTNET_VERSION encontrado"

# Criar diretório do projeto .NET
echo "📁 Criando estrutura do projeto .NET..."
mkdir -p ComandasApp
cd ComandasApp

# Criar solution
echo "🔧 Criando solution..."
dotnet new sln -n ComandasApp

# Criar projetos
echo "📦 Criando projetos..."
mkdir -p src
cd src

# API
dotnet new webapi -n ComandasApp.API
echo "✅ ComandasApp.API criado"

# Core (Entidades e Interfaces)
dotnet new classlib -n ComandasApp.Core
echo "✅ ComandasApp.Core criado"

# Infrastructure (EF Core, Repositories)
dotnet new classlib -n ComandasApp.Infrastructure
echo "✅ ComandasApp.Infrastructure criado"

# Application (Services, DTOs)
dotnet new classlib -n ComandasApp.Application
echo "✅ ComandasApp.Application criado"

cd ..

# Adicionar projetos ao solution
echo "🔗 Adicionando projetos ao solution..."
dotnet sln add src/ComandasApp.API/ComandasApp.API.csproj
dotnet sln add src/ComandasApp.Core/ComandasApp.Core.csproj
dotnet sln add src/ComandasApp.Infrastructure/ComandasApp.Infrastructure.csproj
dotnet sln add src/ComandasApp.Application/ComandasApp.Application.csproj

# Criar diretórios de testes
echo "🧪 Criando projetos de teste..."
mkdir -p tests
cd tests

dotnet new xunit -n ComandasApp.API.Tests
dotnet new xunit -n ComandasApp.Application.Tests

cd ..

# Adicionar projetos de teste ao solution
dotnet sln add tests/ComandasApp.API.Tests/ComandasApp.API.Tests.csproj
dotnet sln add tests/ComandasApp.Application.Tests/ComandasApp.Application.Tests.csproj

# Criar diretório Docker
echo "🐳 Criando configurações Docker..."
mkdir -p docker

# Adicionar pacotes NuGet necessários
echo "📦 Adicionando pacotes NuGet..."

# API
cd src/ComandasApp.API
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.SignalR
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation.AspNetCore
dotnet add package Serilog.AspNetCore
dotnet add package Swashbuckle.AspNetCore
cd ../..

# Core
cd src/ComandasApp.Core
dotnet add package Microsoft.EntityFrameworkCore
cd ../..

# Infrastructure
cd src/ComandasApp.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
cd ../..

# Application
cd src/ComandasApp.Application
dotnet add package AutoMapper
dotnet add package FluentValidation
cd ../..

# Testes
cd tests/ComandasApp.API.Tests
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Moq
dotnet add package FluentAssertions
cd ../..

cd tests/ComandasApp.Application.Tests
dotnet add package Moq
dotnet add package FluentAssertions
cd ../..

# Criar arquivos de configuração
echo "⚙️ Criando arquivos de configuração..."

# Dockerfile
cat > docker/Dockerfile << 'EOF'
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/ComandasApp.API/ComandasApp.API.csproj", "src/ComandasApp.API/"]
COPY ["src/ComandasApp.Core/ComandasApp.Core.csproj", "src/ComandasApp.Core/"]
COPY ["src/ComandasApp.Infrastructure/ComandasApp.Infrastructure.csproj", "src/ComandasApp.Infrastructure/"]
COPY ["src/ComandasApp.Application/ComandasApp.Application.csproj", "src/ComandasApp.Application/"]
RUN dotnet restore "src/ComandasApp.API/ComandasApp.API.csproj"
COPY . .
WORKDIR "/src/src/ComandasApp.API"
RUN dotnet build "ComandasApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ComandasApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ComandasApp.API.dll"]
EOF

# Docker Compose
cat > docker/docker-compose.yml << 'EOF'
version: '3.8'

services:
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "5001:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Data Source=comandas.db
    volumes:
      - ./data:/app/data
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
EOF

# .gitignore
cat > .gitignore << 'EOF'
# .NET
bin/
obj/
*.user
*.suo
*.cache
*.dll
*.exe
*.pdb
*.log

# Visual Studio
.vs/
*.sln.docstates

# Rider
.idea/

# User-specific files
*.rsuser

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/

# Visual Studio 2015/2017 cache/options directory
.vs/

# MSTest test Results
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*

# NUnit
*.VisualState.xml
TestResult.xml
nunit-*.xml

# Build Results of an ATL Project
[Dd]ebugPS/
[Rr]eleasePS/
dlldata.c

# Benchmark Results
BenchmarkDotNet.Artifacts/

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# StyleCop
StyleCopReport.xml

# Files built by Visual Studio
*_i.c
*_p.c
*_h.h
*.ilk
*.meta
*.obj
*.iobj
*.pch
*.pdb
*.ipdb
*.pgc
*.pgd
*.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*_wpftmp.csproj
*.log
*.tlog
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc

# Chutzpah Test files
_Chutzpah*

# Visual C++ cache files
ipch/
*.aps
*.ncb
*.opendb
*.opensdf
*.sdf
*.cachefile
*.VC.db
*.VC.VC.opendb

# Visual Studio profiler
*.psess
*.vsp
*.vspx
*.sap

# Visual Studio Trace Files
*.e2e

# TFS 2012 Local Workspace
$tf/

# Guidance Automation Toolkit
*.gpState

# ReSharper is a .NET coding add-in
_ReSharper*/
*.[Rr]e[Ss]harper
*.DotSettings.user

# TeamCity is a build add-in
_TeamCity*

# DotCover is a Code Coverage Tool
*.dotCover

# AxoCover is a Code Coverage Tool
.axoCover/*
!.axoCover/settings.json

# Coverlet is a free, cross platform Code Coverage Tool
coverage*.json
coverage*.xml
coverage*.info

# Visual Studio code coverage results
*.coverage
*.coveragexml

# NCrunch
_NCrunch_*
.*crunch*.local.xml
nCrunchTemp_*

# MightyMoose
*.mm.*
AutoTest.Net/

# Web workbench (sass)
.sass-cache/

# Installshield output folder
[Ee]xpress/

# DocProject is a documentation generator add-in
DocProject/buildhelp/
DocProject/Help/*.HxT
DocProject/Help/*.HxC
DocProject/Help/*.hhc
DocProject/Help/*.hhk
DocProject/Help/*.hhp
DocProject/Help/Html2
DocProject/Help/html

# Click-Once directory
publish/

# Publish Web Output
*.[Pp]ublish.xml
*.azurePubxml
# Note: Comment the next line if you want to checkin your web deploy settings,
# but database connection strings (with potential passwords) will be unencrypted
*.pubxml
*.publishproj

# Microsoft Azure Web App publish settings. Comment the next line if you want to
# checkin your Azure Web App publish settings, but sensitive information contained
# in these files may be visible to others.
*.azurePubxml

# Microsoft Azure Build Output
csx/
*.build.csdef

# Microsoft Azure Emulator
ecf/
rcf/

# Windows Store app package directories and files
AppPackages/
BundleArtifacts/
Package.StoreAssociation.xml
_pkginfo.txt
*.appx
*.appxbundle
*.appxupload

# Visual Studio cache files
# files ending in .cache can be ignored
*.[Cc]ache
# but keep track of directories ending in .cache
!?*.[Cc]ache/

# Others
ClientBin/
~$*
*~
*.dbmdl
*.dbproj.schemaview
*.jfm
*.pfx
*.publishsettings
orleans.codegen.cs

# Including strong name files can present a security risk
# (https://github.com/github/gitignore/pull/2483#issue-259490424)
#*.snk

# Since there are multiple workflows, uncomment the next line to ignore bower_components
# (https://github.com/github/gitignore/pull/1529#issuecomment-104372622)
#bower_components/

# RIA/Silverlight projects
Generated_Code/

# Backup & report files from converting an old project file
# to a newer Visual Studio version. Backup files are not needed,
# because we have git ;-)
_UpgradeReport_Files/
Backup*/
UpgradeLog*.XML
UpgradeLog*.htm
ServiceFabricBackup/
*.rptproj.bak

# SQL Server files
*.mdf
*.ldf
*.ndf

# Business Intelligence projects
*.rdl.data
*.bim.layout
*.bim_*.settings
*.rptproj.rsuser
*- [Bb]ackup.rdl
*- [Bb]ackup ([0-9]).rdl
*- [Bb]ackup ([0-9][0-9]).rdl

# Microsoft Fakes
FakesAssemblies/

# GhostDoc plugin setting file
*.GhostDoc.xml

# Node.js Tools for Visual Studio
.ntvs_analysis.dat
node_modules/

# Visual Studio 6 build log
*.plg

# Visual Studio 6 workspace options file
*.opt

# Visual Studio 6 auto-generated workspace file (contains which files were open etc.)
*.vbw

# Visual Studio 6 auto-generated project file (contains which files were open etc.)
*.vbp

# Visual Studio 6 workspace and project file (working project files containing files to include in project)
*.dsw
*.dsp

# Visual Studio 6 technical files
*.ncb
*.aps

# Visual Studio LightSwitch build output
**/*.HTMLClient/GeneratedArtifacts
**/*.DesktopClient/GeneratedArtifacts
**/*.DesktopClient/ModelManifest.xml
**/*.Server/GeneratedArtifacts
**/*.Server/ModelManifest.xml
_Pvt_Extensions

# Paket dependency manager
.paket/paket.exe
paket-files/

# FAKE - F# Make
.fake/

# CodeRush personal settings
.cr/personal

# Python Tools for Visual Studio (PTVS)
__pycache__/
*.pyc

# Cake - Uncomment if you are using it
# tools/**
# !tools/packages.config

# Tabs Studio
*.tss

# Telerik's JustMock configuration file
*.jmconfig

# BizTalk build output
*.btp.cs
*.btm.cs
*.odx.cs
*.xsd.cs

# OpenCover UI analysis results
OpenCover/

# Azure Stream Analytics local run output
ASALocalRun/

# MSBuild Binary and Structured Log
*.binlog

# NVidia Nsight GPU debugger configuration file
*.nvuser

# MFractors (Xamarin productivity tool) working folder
.mfractor/

# Local History for Visual Studio
.localhistory/

# Visual Studio History (VSHistory) files
.vshistory/

# BeatPulse healthcheck temp database
healthchecksdb

# Backup folder for Package Reference Convert tool in Visual Studio 2017
MigrationBackup/

# Ionide (cross platform F# VS Code tools) working folder
.ionide/

# Fody - auto-generated XML schema
FodyWeavers.xsd

# VS Code files for those working on multiple tools
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Local History for Visual Studio Code
.history/

# Windows Installer files from build outputs
*.cab
*.msi
*.msix
*.msm
*.msp

# JetBrains Rider
*.sln.iml

# macOS
.DS_Store

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log
EOF

echo "✅ Setup concluído com sucesso!"
echo ""
echo "📁 Estrutura criada:"
echo "├── ComandasApp/"
echo "│   ├── src/"
echo "│   │   ├── ComandasApp.API/"
echo "│   │   ├── ComandasApp.Core/"
echo "│   │   ├── ComandasApp.Infrastructure/"
echo "│   │   └── ComandasApp.Application/"
echo "│   ├── tests/"
echo "│   │   ├── ComandasApp.API.Tests/"
echo "│   │   └── ComandasApp.Application.Tests/"
echo "│   ├── docker/"
echo "│   │   ├── Dockerfile"
echo "│   │   └── docker-compose.yml"
echo "│   └── ComandasApp.sln"
echo ""
echo "🚀 Próximos passos:"
echo "1. cd ComandasApp"
echo "2. dotnet restore"
echo "3. dotnet build"
echo "4. dotnet run --project src/ComandasApp.API"
echo ""
echo "📚 Documentação: README-MIGRATION.md"
