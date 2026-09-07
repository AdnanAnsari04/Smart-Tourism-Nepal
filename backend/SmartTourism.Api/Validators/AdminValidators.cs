using FluentValidation;
using SmartTourism.Api.DTOs.Admin;

namespace SmartTourism.Api.Validators;

public class UpdateUserRoleValidator : AbstractValidator<UpdateUserRoleDto>
{
    public UpdateUserRoleValidator()
    {
        RuleFor(x => x.Role).NotEmpty().MaximumLength(50);
    }
}

public class AdminUserQueryValidator : AbstractValidator<AdminUserQuery>
{
    public AdminUserQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
