FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install FFmpeg and curl for health checks
RUN apt-get update && \
    apt-get install -y ffmpeg curl && \
    rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["VideoStreamingApi.csproj", "./"]
RUN dotnet restore "VideoStreamingApi.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "VideoStreamingApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "VideoStreamingApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create storage directory
RUN mkdir -p /app/videos && chmod 777 /app/videos

ENTRYPOINT ["dotnet", "VideoStreamingApi.dll"]
