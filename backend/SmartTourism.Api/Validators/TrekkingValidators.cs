using FluentValidation;
using SmartTourism.Api.DTOs.Trekking;

namespace SmartTourism.Api.Validators;

public class TrekkingRegionCreateValidator : AbstractValidator<TrekkingRegionCreateDto>
{
    public TrekkingRegionCreateValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.ProvinceId).GreaterThan(0);
    }
}

public class TrekkingRouteCreateValidator : AbstractValidator<TrekkingRouteCreateDto>
{
    public TrekkingRouteCreateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.District).MaximumLength(120);
        RuleFor(x => x.Difficulty).NotEmpty().Must(d => d is "Easy" or "Moderate" or "Hard")
            .WithMessage("Difficulty must be one of: Easy, Moderate, Hard.");
        RuleFor(x => x.MinDurationDays).GreaterThan(0);
        RuleFor(x => x.MaxDurationDays).GreaterThanOrEqualTo(x => x.MinDurationDays);
        RuleFor(x => x.BestSeason).NotEmpty().MaximumLength(100);
        RuleFor(x => x.MaxAltitudeMeters).GreaterThan(0);
        RuleFor(x => x.StartingPoint).MaximumLength(150);
        RuleFor(x => x.EndingPoint).MaximumLength(150);
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90).When(x => x.Latitude.HasValue);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180).When(x => x.Longitude.HasValue);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5);
        RuleFor(x => x.TrekkingRegionId).GreaterThan(0);
        RuleFor(x => x.RequiredPermits).NotNull();
        RuleFor(x => x.Equipment).NotNull();
    }
}

public class TrekkingRouteUpdateValidator : AbstractValidator<TrekkingRouteUpdateDto>
{
    public TrekkingRouteUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.District).MaximumLength(120);
        RuleFor(x => x.Difficulty).NotEmpty().Must(d => d is "Easy" or "Moderate" or "Hard")
            .WithMessage("Difficulty must be one of: Easy, Moderate, Hard.");
        RuleFor(x => x.MinDurationDays).GreaterThan(0);
        RuleFor(x => x.MaxDurationDays).GreaterThanOrEqualTo(x => x.MinDurationDays);
        RuleFor(x => x.BestSeason).NotEmpty().MaximumLength(100);
        RuleFor(x => x.MaxAltitudeMeters).GreaterThan(0);
        RuleFor(x => x.StartingPoint).MaximumLength(150);
        RuleFor(x => x.EndingPoint).MaximumLength(150);
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90).When(x => x.Latitude.HasValue);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180).When(x => x.Longitude.HasValue);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5);
    }
}
