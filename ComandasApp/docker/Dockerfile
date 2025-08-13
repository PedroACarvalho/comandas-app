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
