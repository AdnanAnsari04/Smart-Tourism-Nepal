using System.Net;
using System.Text.Json;
using FluentValidation;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Exceptions;

namespace SmartTourism.Api.Middleware;

/// <summary>
/// Single place that turns any exception into a consistent JSON error
/// response. Controllers and services never write try/catch blocks for
/// HTTP status mapping — they just throw the appropriate AppException (or
/// let FluentValidation throw) and this middleware does the rest.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message, errors) = MapException(exception);

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
        }
        else
        {
            _logger.LogWarning("{ExceptionType} on {Method} {Path}: {Message}", exception.GetType().Name, context.Request.Method, context.Request.Path, message);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new ApiErrorResponse
        {
            Message = message,
            StatusCode = (int)statusCode,
            TraceId = context.TraceIdentifier,
            // Never leak internal exception details for unhandled 500s, even in dev,
            // to keep the middleware's behavior predictable for API consumers.
            Errors = errors
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }

    private static (HttpStatusCode statusCode, string message, IDictionary<string, string[]>? errors) MapException(Exception exception) => exception switch
    {
        ValidationAppException validationEx => (HttpStatusCode.BadRequest, validationEx.Message, validationEx.Errors),

        FluentValidation.ValidationException fluentEx => (
            HttpStatusCode.BadRequest,
            "One or more validation errors occurred.",
            fluentEx.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray()) as IDictionary<string, string[]>
        ),

        NotFoundException notFoundEx => (HttpStatusCode.NotFound, notFoundEx.Message, null),
        ConflictException conflictEx => (HttpStatusCode.Conflict, conflictEx.Message, null),
        BadRequestException badRequestEx => (HttpStatusCode.BadRequest, badRequestEx.Message, null),
        UnauthorizedAppException unauthorizedEx => (HttpStatusCode.Unauthorized, unauthorizedEx.Message, null),

        UnauthorizedAccessException => (HttpStatusCode.Forbidden, "You do not have permission to perform this action.", null),

        _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.", null)
    };
}
