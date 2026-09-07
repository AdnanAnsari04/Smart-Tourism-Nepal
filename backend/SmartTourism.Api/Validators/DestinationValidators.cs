using FluentValidation;
using SmartTourism.Api.DTOs.Catalog;

namespace SmartTourism.Api.Validators;

public class DestinationCreateValidator : AbstractValidator<DestinationCreateDto>
{
    public DestinationCreateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.ProvinceId).GreaterThan(0);
        RuleFor(x => x.District).MaximumLength(120);
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.DistanceFromKathmanduKm).GreaterThanOrEqualTo(0);
        RuleFor(x => x.BestSeason).MaximumLength(150);
        RuleFor(x => x.EntryInformation).MaximumLength(1000);
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180);
    }
}

public class DestinationUpdateValidator : AbstractValidator<DestinationUpdateDto>
{
    public DestinationUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.District).MaximumLength(120);
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.DistanceFromKathmanduKm).GreaterThanOrEqualTo(0);
        RuleFor(x => x.BestSeason).MaximumLength(150);
        RuleFor(x => x.EntryInformation).MaximumLength(1000);
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180);
    }
}
