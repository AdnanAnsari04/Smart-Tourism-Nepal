namespace SmartTourism.Api.Exceptions;

/// <summary>Base type for exceptions the global exception middleware understands
/// and maps to a specific HTTP status code, instead of a generic 500.</summary>
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message) { }
}

public class NotFoundException : AppException
{
    public NotFoundException(string entityName, object key)
        : base($"{entityName} with id '{key}' was not found.") { }

    public NotFoundException(string message) : base(message) { }
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message) { }
}

public class BadRequestException : AppException
{
    public BadRequestException(string message) : base(message) { }
}

public class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message) : base(message) { }
}

/// <summary>Thrown when FluentValidation fails; carries field-level errors
/// through to the middleware so it can return a standard 400 payload.</summary>
public class ValidationAppException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationAppException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors;
    }
}
