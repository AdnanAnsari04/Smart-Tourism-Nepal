using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;
using SmartTourism.Api.Exceptions;

namespace SmartTourism.Api.Validators;

/// <summary>
/// Runs any registered FluentValidation IValidator&lt;T&gt; against every
/// [FromBody]/route/query argument bound for the action before it executes.
/// This is what makes "Proper validation" apply automatically to every
/// endpoint instead of each controller action having to call validators by
/// hand — register a validator for a DTO and it's enforced everywhere that
/// DTO is used as an action parameter.
/// </summary>
public class ValidationActionFilter : IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationActionFilter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var errors = new Dictionary<string, string[]>();

        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument == null) continue;

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
            if (_serviceProvider.GetService(validatorType) is not IValidator validator) continue;

            var validationContext = new ValidationContext<object>(argument);
            var result = await validator.ValidateAsync(validationContext, context.HttpContext.RequestAborted);

            if (!result.IsValid)
            {
                foreach (var group in result.Errors.GroupBy(e => e.PropertyName))
                {
                    errors[group.Key] = group.Select(e => e.ErrorMessage).ToArray();
                }
            }
        }

        if (errors.Count > 0)
        {
            throw new ValidationAppException(errors);
        }

        await next();
    }
}
