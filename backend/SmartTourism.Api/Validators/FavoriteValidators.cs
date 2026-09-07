using FluentValidation;
using SmartTourism.Api.DTOs.Engagement;

namespace SmartTourism.Api.Validators;

public class FavoriteCreateValidator : AbstractValidator<FavoriteCreateDto>
{
    public FavoriteCreateValidator()
    {
        RuleFor(x => x.ItemType).NotEmpty().Must(t => t is "Destination" or "Hotel" or "TrekkingRoute")
            .WithMessage("ItemType must be one of: Destination, Hotel, TrekkingRoute.");
        RuleFor(x => x.ItemId).GreaterThan(0);
    }
}
