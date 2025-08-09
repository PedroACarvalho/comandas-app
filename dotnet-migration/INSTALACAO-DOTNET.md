# 🚀 Instalação do .NET 8 - macOS

## 📋 Pré-requisitos

### 1. Verificar se o .NET já está instalado
```bash
dotnet --version
```

Se retornar uma versão, o .NET já está instalado. Se retornar "command not found", continue com a instalação.

## 🛠️ Métodos de Instalação

### Método 1: Homebrew (Recomendado)

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar .NET 8 SDK
brew install dotnet

# Verificar instalação
dotnet --version
```

### Método 2: Download Direto

1. **Acesse**: https://dotnet.microsoft.com/download/dotnet/8.0
2. **Baixe**: .NET 8.0 SDK para macOS
3. **Execute**: O instalador baixado
4. **Verifique**: `dotnet --version`

### Método 3: Script de Instalação

```bash
# Baixar e executar script de instalação
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0

# Adicionar ao PATH (se necessário)
echo 'export PATH="$HOME/.dotnet:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## ✅ Verificação da Instalação

```bash
# Verificar versão
dotnet --version

# Verificar ferramentas instaladas
dotnet --list-sdks
dotnet --list-runtimes

# Testar criação de projeto
dotnet new console -n TestApp
cd TestApp
dotnet run
cd ..
rm -rf TestApp
```

## 🛠️ Ferramentas Adicionais (Opcional)

### Visual Studio Code
```bash
# Instalar VS Code
brew install --cask visual-studio-code

# Extensões recomendadas
code --install-extension ms-dotnettools.csharp
code --install-extension ms-dotnettools.vscode-dotnet-runtime
code --install-extension ms-dotnettools.csdevkit
```

### JetBrains Rider (Alternativa ao VS Code)
```bash
# Instalar Rider
brew install --cask rider
```

## 🔧 Configuração do Ambiente

### 1. Configurar Git (se necessário)
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### 2. Configurar .NET
```bash
# Configurar NuGet (se necessário)
dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
```

## 🚀 Próximos Passos

Após instalar o .NET 8:

1. **Voltar ao projeto**:
   ```bash
   cd /Users/pedroaugustocarvalho/Documents/comandas-app
   ```

2. **Executar script de setup**:
   ```bash
   ./dotnet-migration/setup-dotnet.sh
   ```

3. **Verificar estrutura criada**:
   ```bash
   cd ComandasApp
   dotnet restore
   dotnet build
   ```

## ❗ Troubleshooting

### Problema: "command not found: dotnet"
**Solução**: O .NET não está no PATH. Adicione ao ~/.zshrc:
```bash
echo 'export PATH="$HOME/.dotnet:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Problema: "Permission denied"
**Solução**: Execute com sudo ou corrija permissões:
```bash
sudo chmod +x dotnet-migration/setup-dotnet.sh
```

### Problema: "Homebrew not found"
**Solução**: Instale o Homebrew primeiro:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 📚 Recursos Adicionais

- **Documentação oficial**: https://docs.microsoft.com/dotnet/
- **Tutoriais**: https://dotnet.microsoft.com/learn
- **Comunidade**: https://discord.gg/dotnet

---

**Status**: ✅ Pronto para instalação  
**Última Atualização**: $(date)  
**Responsável**: Pedro Augusto Carvalho
