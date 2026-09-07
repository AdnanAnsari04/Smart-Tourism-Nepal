using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class DestinationService : IDestinationService
{
    private readonly IUnitOfWork _unitOfWork;

    public DestinationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<DestinationListItemDto>> GetAllAsync(DestinationQuery query, CancellationToken ct = default)
    {
        var destinations = _unitOfWork.Destinations.Query();

        if (!query.IncludeInactive)
            destinations = destinations.Where(d => d.IsActive);

        if (query.ProvinceId.HasValue)
            destinations = destinations.Where(d => d.ProvinceId == query.ProvinceId.Value);

        if (query.CityId.HasValue)
            destinations = destinations.Where(d => d.CityId == query.CityId.Value);

        if (query.CategoryId.HasValue)
            destinations = destinations.Where(d => d.CategoryId == query.CategoryId.Value);

        if (query.MinRating.HasValue)
            destinations = destinations.Where(d => d.Rating >= query.MinRating.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            destinations = destinations.Where(d => EF.Functions.Like(d.Name, $"%{term}%") || EF.Functions.Like(d.Description, $"%{term}%"));
        }

        var totalCount = await destinations.CountAsync(ct);

        var descending = !string.Equals(query.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        IOrderedQueryable<Destination> ordered = query.SortBy?.Trim().ToLowerInvariant() switch
        {
            "name" => descending ? destinations.OrderByDescending(d => d.Name) : destinations.OrderBy(d => d.Name),
            "distance" => descending ? destinations.OrderByDescending(d => d.DistanceFromKathmanduKm) : destinations.OrderBy(d => d.DistanceFromKathmanduKm),
            "newest" => descending ? destinations.OrderByDescending(d => d.CreatedAt) : destinations.OrderBy(d => d.CreatedAt),
            _ => descending ? destinations.OrderByDescending(d => d.Rating) : destinations.OrderBy(d => d.Rating)
        };
        destinations = ordered.ThenBy(d => d.Name);

        var items = await destinations
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(d => new DestinationListItemDto(
                d.Id, d.Slug, d.Name, d.Province.Name, d.District ?? (d.City != null ? d.City.District : null),
                d.CityId, d.City != null ? d.City.Name : null,
                d.Category.Label, d.Rating, d.ReviewCount, d.DistanceFromKathmanduKm, d.BestSeason,
                d.PhotoClass, d.ImageUrl, d.Latitude, d.Longitude, d.IsActive))
            .ToListAsync(ct);

        return PagedResult<DestinationListItemDto>.Create(items, query.Page, query.PageSize, totalCount);
    }

    public async Task<DestinationDetailDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var destination = await _unitOfWork.Destinations.Query()
            .Where(d => d.Id == id)
            .Select(d => new DestinationDetailDto(
                d.Id, d.Slug, d.Name, d.Description, d.ProvinceId, d.Province.Name,
                d.District ?? (d.City != null ? d.City.District : null),
                d.CityId, d.City != null ? d.City.Name : null, d.CategoryId, d.Category.Label,
                d.Rating, d.ReviewCount, d.DistanceFromKathmanduKm, d.BestSeason, d.EntryInformation,
                d.PhotoClass, d.ImageUrl,
                d.Latitude, d.Longitude, d.IsActive, d.CreatedAt, d.UpdatedAt))
            .FirstOrDefaultAsync(ct);

        return destination ?? throw new NotFoundException("Destination", id);
    }

    public async Task<DestinationDetailDto> CreateAsync(DestinationCreateDto dto, CancellationToken ct = default)
    {
        if (!await _unitOfWork.Provinces.AnyAsync(p => p.Id == dto.ProvinceId, ct))
            throw new NotFoundException("Province", dto.ProvinceId);

        if (!await _unitOfWork.Categories.AnyAsync(c => c.Id == dto.CategoryId, ct))
            throw new NotFoundException("Category", dto.CategoryId);

        if (dto.CityId.HasValue && !await _unitOfWork.Cities.AnyAsync(c => c.Id == dto.CityId.Value, ct))
            throw new NotFoundException("City", dto.CityId.Value);

        var slug = await GenerateUniqueSlugAsync(dto.Name, ct);

        var destination = new Destination
        {
            Slug = slug,
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            ProvinceId = dto.ProvinceId,
            District = string.IsNullOrWhiteSpace(dto.District) ? null : dto.District.Trim(),
            CityId = dto.CityId,
            CategoryId = dto.CategoryId,
            DistanceFromKathmanduKm = dto.DistanceFromKathmanduKm,
            BestSeason = string.IsNullOrWhiteSpace(dto.BestSeason) ? null : dto.BestSeason.Trim(),
            EntryInformation = string.IsNullOrWhiteSpace(dto.EntryInformation) ? null : dto.EntryInformation.Trim(),
            PhotoClass = dto.PhotoClass,
            ImageUrl = dto.ImageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Rating = 0,
            ReviewCount = 0,
            IsActive = true
        };

        await _unitOfWork.Destinations.AddAsync(destination, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(destination.Id, ct);
    }

    public async Task<DestinationDetailDto> UpdateAsync(int id, DestinationUpdateDto dto, CancellationToken ct = default)
    {
        var destination = await _unitOfWork.Destinations.Query(asNoTracking: false).FirstOrDefaultAsync(d => d.Id == id, ct)
            ?? throw new NotFoundException("Destination", id);

        if (!await _unitOfWork.Categories.AnyAsync(c => c.Id == dto.CategoryId, ct))
            throw new NotFoundException("Category", dto.CategoryId);

        if (dto.CityId.HasValue && !await _unitOfWork.Cities.AnyAsync(c => c.Id == dto.CityId.Value, ct))
            throw new NotFoundException("City", dto.CityId.Value);

        destination.Name = dto.Name.Trim();
        destination.Description = dto.Description.Trim();
        destination.District = string.IsNullOrWhiteSpace(dto.District) ? null : dto.District.Trim();
        destination.CityId = dto.CityId;
        destination.CategoryId = dto.CategoryId;
        destination.DistanceFromKathmanduKm = dto.DistanceFromKathmanduKm;
        destination.BestSeason = string.IsNullOrWhiteSpace(dto.BestSeason) ? null : dto.BestSeason.Trim();
        destination.EntryInformation = string.IsNullOrWhiteSpace(dto.EntryInformation) ? null : dto.EntryInformation.Trim();
        destination.PhotoClass = dto.PhotoClass;
        destination.ImageUrl = dto.ImageUrl;
        destination.Latitude = dto.Latitude;
        destination.Longitude = dto.Longitude;
        destination.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var destination = await _unitOfWork.Destinations.Query(asNoTracking: false).FirstOrDefaultAsync(d => d.Id == id, ct)
            ?? throw new NotFoundException("Destination", id);

        destination.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken ct)
    {
        var baseSlug = Slugify(name);
        var slug = baseSlug;
        var suffix = 1;

        while (await _unitOfWork.Destinations.AnyAsync(d => d.Slug == slug, ct))
        {
            suffix++;
            slug = $"{baseSlug}-{suffix}";
        }

        return slug;
    }

    private static string Slugify(string value)
    {
        var lowered = value.Trim().ToLowerInvariant();
        var chars = lowered.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
        var collapsed = new string(chars);
        while (collapsed.Contains("--")) collapsed = collapsed.Replace("--", "-");
        return collapsed.Trim('-');
    }
}
