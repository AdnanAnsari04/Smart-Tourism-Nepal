using FluentValidation;
using SmartTourism.Api.DTOs.Catalog;

namespace SmartTourism.Api.Validators;

public class HotelCreateValidator : AbstractValidator<HotelCreateDto>
{
    public HotelCreateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.HotelType).MaximumLength(50);
        RuleFor(x => x.Address).MaximumLength(300);
        RuleFor(x => x.DestinationId).GreaterThan(0).When(x => x.DestinationId.HasValue);
        RuleFor(x => x.ProvinceId).GreaterThan(0);
        RuleFor(x => x.PricePerNightNpr).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5);
        RuleFor(x => x.AvailableRooms).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Amenities).NotNull();
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90).When(x => x.Latitude.HasValue);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180).When(x => x.Longitude.HasValue);
        RuleFor(x => x.ContactPhone).MaximumLength(30);
        RuleFor(x => x.Website)
            .MaximumLength(300)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uri) && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("Website must be a valid http(s) URL.")
            .When(x => !string.IsNullOrWhiteSpace(x.Website));
    }
}

public class HotelUpdateValidator : AbstractValidator<HotelUpdateDto>
{
    public HotelUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.HotelType).MaximumLength(50);
        RuleFor(x => x.Address).MaximumLength(300);
        RuleFor(x => x.DestinationId).GreaterThan(0).When(x => x.DestinationId.HasValue);
        RuleFor(x => x.PricePerNightNpr).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5);
        RuleFor(x => x.AvailableRooms).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Amenities).NotNull();
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90).When(x => x.Latitude.HasValue);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180).When(x => x.Longitude.HasValue);
        RuleFor(x => x.ContactPhone).MaximumLength(30);
        RuleFor(x => x.Website)
            .MaximumLength(300)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uri) && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("Website must be a valid http(s) URL.")
            .When(x => !string.IsNullOrWhiteSpace(x.Website));
    }
}
