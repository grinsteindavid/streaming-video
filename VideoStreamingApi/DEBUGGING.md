# Debugging the Video Streaming API with VS Code and Docker

## Prerequisites

1. **VS Code Extensions**
   - Install the [C# Dev Kit extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) for VS Code
   - Install the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for VS Code

## Setup Steps

### 1. Start the Docker Containers

```bash
# Navigate to your project directory
cd /Users/looper/workshop/video-streaming-mvp/VideoStreamingApi

# Start the Docker containers
docker-compose up -d
```

### 2. Find the Container Name

The container name might be different from what's in the launch.json file. Let's check the actual name:

```bash
docker ps
```

Look for the container running your API and note its name (e.g., `videostreamingapi-api-1` or `videostreamingapi_api_1`).

### 3. Update the Launch Configuration

Update the `.vscode/launch.json` file with the correct container name from step 2.

### 4. Attach the Debugger

1. Set breakpoints in your code by clicking in the gutter (left margin) of the editor
2. Press F5 or click the "Run and Debug" button in VS Code
3. Select "Docker .NET Attach" from the dropdown menu
4. VS Code will show a list of processes - select the dotnet process running your application

## Troubleshooting

### Container Name Issues

If you get an error about the container not being found, double-check the container name with `docker ps` and update the `pipeArgs` in your launch.json:

```json
"pipeArgs": ["exec", "-i", "ACTUAL_CONTAINER_NAME_HERE"]
```

### Process Selection Issues

When attaching to a process, look for the main dotnet process. It's usually the one with the longest running time or the one that's using the most CPU.

### Breakpoints Not Hitting

If breakpoints aren't being hit:

1. Make sure the source code in the container matches your local source code
2. Check that the `sourceFileMap` in launch.json correctly maps the container path to your local path
3. Try adding a `console.WriteLine()` statement near your breakpoint to verify the code is being executed

### Missing Symbols

If you get a "No symbols have been loaded" message:

1. Make sure you're running the container in Debug mode (our Dockerfile.dev is set up for this)
2. Verify that the debugger path in the container is correct (`/vsdbg/vsdbg`)

## Example Workflow

1. Start the containers: `docker-compose up -d`
2. Set breakpoints in your code
3. Start debugging in VS Code (F5)
4. Make a request to your API (e.g., visit http://localhost:5000/api/videos in your browser)
5. The breakpoint should be hit, and you can inspect variables, step through code, etc.

## Advanced: Debugging on Startup

If you need to debug code that runs during application startup:

1. Add `System.Threading.Thread.Sleep(10000);` at the beginning of your `Program.cs` file
2. Restart the container
3. Quickly attach the debugger during the 10-second sleep window
4. Set breakpoints in your startup code
5. When you're done, remove the sleep statement

## Notes

- The Docker container has been configured with the VS Code debugger tools installed
- Port 5005 has been exposed for debugging communication
- Hot reload is still active, so code changes will be applied, but you'll need to reattach the debugger
