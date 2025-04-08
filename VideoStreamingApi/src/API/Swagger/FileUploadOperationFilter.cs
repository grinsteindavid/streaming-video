using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace VideoStreamingApi.API.Swagger
{
    /// <summary>
    /// Operation filter to properly handle file uploads in Swagger UI
    /// </summary>
    public class FileUploadOperationFilter : IOperationFilter
    {
        /// <summary>
        /// Applies the file upload operation filter
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParameters = context.MethodInfo.GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType == typeof(IFormFileCollection))
                .ToList();

            if (!fileParameters.Any())
            {
                return;
            }

            // Set the content type to multipart/form-data for operations with file parameters
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = fileParameters.ToDictionary(
                                p => p.Name,
                                p => new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            ),
                            Required = new HashSet<string>(fileParameters.Select(p => p.Name))
                        }
                    }
                },
                Required = true
            };
        }
    }
}
