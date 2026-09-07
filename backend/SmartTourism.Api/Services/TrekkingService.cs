using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.DTOs.Trekking;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Trekking;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class TrekkingService : ITrekkingService
{
    private readonly IUnitOfWork _unitOfWork;

    public TrekkingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<TrekkingRegionDto>> GetRegionsAsync(int? provinceId, CancellationToken ct = default)
    {
        var query = _unitOfWork.TrekkingRegions.Query().Where(r => r.IsActive);
        if (provinceId.HasValue) query = query.Where(r => r.ProvinceId == provinceId.Value);

        return await query
            .OrderBy(r => r.Name)
            .Select(r => new TrekkingRegionDto(r.Id, r.Slug, r.Name, r.Description, r.ProvinceId, r.Province.Name, r.TrekkingRoutes.Count(t => t.IsActive)))
            .ToListAsync(ct);
    }

    public async Task<TrekkingRegionDto> CreateRegionAsync(TrekkingRegionCreateDto dto, CancellationToken ct = default)
    {
        if (!await _unitOfWork.Provinces.AnyAsync(p => p.Id == dto.ProvinceId, ct))
            throw new NotFoundException("Province", dto.ProvinceId);

        var slug = dto.Slug.Trim().ToLowerInvariant();
        if (await _unitOfWork.TrekkingRegions.AnyAsync(r => r.Slug == slug, ct))
            throw new ConflictException($"A trekking region with slug '{slug}' already exists.");

        var region = new TrekkingRegion
        {
            Slug = slug,
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            ProvinceId = dto.ProvinceId,
            IsActive = true
        };

        await _unitOfWork.TrekkingRegions.AddAsync(region, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var province = await _unitOfWork.Provinces.GetByIdAsync(dto.ProvinceId, ct);
        return new TrekkingRegionDto(region.Id, region.Slug, region.Name, region.Description, region.ProvinceId, province!.Name, 0);
    }

    public async Task<PagedResult<TrekkingRouteListItemDto>> GetRoutesAsync(TrekkingRouteQuery query, CancellationToken ct = default)
    {
        var routes = _unitOfWork.TrekkingRoutes.Query();

        if (!query.IncludeInactive)
            routes = routes.Where(r => r.IsActive);

        if (query.TrekkingRegionId.HasValue)
            routes = routes.Where(r => r.TrekkingRegionId == query.TrekkingRegionId.Value);

        if (query.ProvinceId.HasValue)
            routes = routes.Where(r => r.TrekkingRegion.ProvinceId == query.ProvinceId.Value);

        if (!string.IsNullOrWhiteSpace(query.Difficulty) &&
            Enum.TryParse<TrekDifficulty>(query.Difficulty, true, out var difficulty))
        {
            routes = routes.Where(r => r.Difficulty == difficulty);
        }

        if (query.MinDurationDays.HasValue)
            routes = routes.Where(r => r.MaxDurationDays >= query.MinDurationDays.Value);

        if (query.MaxDurationDays.HasValue)
            routes = routes.Where(r => r.MinDurationDays <= query.MaxDurationDays.Value);

        if (query.MinRating.HasValue)
            routes = routes.Where(r => r.Rating >= query.MinRating.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            routes = routes.Where(r => EF.Functions.Like(r.Name, $"%{term}%") || EF.Functions.Like(r.Description, $"%{term}%"));
        }

        var totalCount = await routes.CountAsync(ct);

        var descending = !string.Equals(query.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        IOrderedQueryable<TrekkingRoute> ordered = query.SortBy?.Trim().ToLowerInvariant() switch
        {
            "difficulty" => descending ? routes.OrderByDescending(r => r.Difficulty) : routes.OrderBy(r => r.Difficulty),
            "duration" => descending ? routes.OrderByDescending(r => r.MaxDurationDays) : routes.OrderBy(r => r.MaxDurationDays),
            "altitude" => descending ? routes.OrderByDescending(r => r.MaxAltitudeMeters) : routes.OrderBy(r => r.MaxAltitudeMeters),
            "name" => descending ? routes.OrderByDescending(r => r.Name) : routes.OrderBy(r => r.Name),
            "newest" => descending ? routes.OrderByDescending(r => r.CreatedAt) : routes.OrderBy(r => r.CreatedAt),
            "rating" => descending ? routes.OrderByDescending(r => r.Rating) : routes.OrderBy(r => r.Rating),
            _ => routes.OrderBy(r => r.Name)
        };
        routes = ordered.ThenBy(r => r.Name);

        var items = await routes
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(r => new TrekkingRouteListItemDto(
                r.Id, r.Slug, r.Name, r.TrekkingRegion.Name, r.TrekkingRegion.Province.Name, r.District,
                r.Difficulty.ToString(), r.MinDurationDays, r.MaxDurationDays, r.MaxAltitudeMeters, r.Rating,
                r.PhotoClass, r.ImageUrl, r.IsActive))
            .ToListAsync(ct);

        return PagedResult<TrekkingRouteListItemDto>.Create(items, query.Page, query.PageSize, totalCount);
    }

    public async Task<TrekkingRouteDetailDto> GetRouteByIdAsync(int id, CancellationToken ct = default)
    {
        var route = await _unitOfWork.TrekkingRoutes.Query()
            .Where(r => r.Id == id)
            .Select(r => new TrekkingRouteDetailDto(
                r.Id, r.Slug, r.Name, r.Description, r.District, r.Difficulty.ToString(),
                r.MinDurationDays, r.MaxDurationDays, r.BestSeason, r.MaxAltitudeMeters,
                r.StartingPoint, r.EndingPoint, r.Latitude, r.Longitude, r.Rating,
                r.TrekkingRegionId, r.TrekkingRegion.Name, r.TrekkingRegion.ProvinceId, r.TrekkingRegion.Province.Name,
                r.RequiredPermits.Select(p => p.PermitName).ToList(),
                r.Equipment.Select(e => e.ItemName).ToList(),
                r.PhotoClass, r.ImageUrl, r.IsActive, r.CreatedAt, r.UpdatedAt))
            .FirstOrDefaultAsync(ct);

        return route ?? throw new NotFoundException("TrekkingRoute", id);
    }

    public async Task<TrekkingRouteDetailDto> CreateRouteAsync(TrekkingRouteCreateDto dto, CancellationToken ct = default)
    {
        if (!await _unitOfWork.TrekkingRegions.AnyAsync(r => r.Id == dto.TrekkingRegionId, ct))
            throw new NotFoundException("TrekkingRegion", dto.TrekkingRegionId);

        if (!Enum.TryParse<TrekDifficulty>(dto.Difficulty, true, out var difficulty))
            throw new BadRequestException("Difficulty must be one of: Easy, Moderate, Hard.");

        var slug = await GenerateUniqueSlugAsync(dto.Name, ct);

        var route = new TrekkingRoute
        {
            Slug = slug,
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            District = string.IsNullOrWhiteSpace(dto.District) ? null : dto.District.Trim(),
            Difficulty = difficulty,
            MinDurationDays = dto.MinDurationDays,
            MaxDurationDays = dto.MaxDurationDays,
            BestSeason = dto.BestSeason.Trim(),
            MaxAltitudeMeters = dto.MaxAltitudeMeters,
            StartingPoint = string.IsNullOrWhiteSpace(dto.StartingPoint) ? null : dto.StartingPoint.Trim(),
            EndingPoint = string.IsNullOrWhiteSpace(dto.EndingPoint) ? null : dto.EndingPoint.Trim(),
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Rating = dto.Rating,
            TrekkingRegionId = dto.TrekkingRegionId,
            PhotoClass = dto.PhotoClass,
            ImageUrl = dto.ImageUrl,
            IsActive = true,
            RequiredPermits = dto.RequiredPermits.Select(p => new TrekkingRoutePermit { PermitName = p }).ToList(),
            Equipment = dto.Equipment.Select(e => new TrekkingRouteEquipment { ItemName = e }).ToList()
        };

        await _unitOfWork.TrekkingRoutes.AddAsync(route, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return await GetRouteByIdAsync(route.Id, ct);
    }

    public async Task<TrekkingRouteDetailDto> UpdateRouteAsync(int id, TrekkingRouteUpdateDto dto, CancellationToken ct = default)
    {
        var route = await _unitOfWork.TrekkingRoutes.Query(asNoTracking: false)
            .Include(r => r.RequiredPermits)
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new NotFoundException("TrekkingRoute", id);

        if (!Enum.TryParse<TrekDifficulty>(dto.Difficulty, true, out var difficulty))
            throw new BadRequestException("Difficulty must be one of: Easy, Moderate, Hard.");

        route.Name = dto.Name.Trim();
        route.Description = dto.Description.Trim();
        route.District = string.IsNullOrWhiteSpace(dto.District) ? null : dto.District.Trim();
        route.Difficulty = difficulty;
        route.MinDurationDays = dto.MinDurationDays;
        route.MaxDurationDays = dto.MaxDurationDays;
        route.BestSeason = dto.BestSeason.Trim();
        route.MaxAltitudeMeters = dto.MaxAltitudeMeters;
        route.StartingPoint = string.IsNullOrWhiteSpace(dto.StartingPoint) ? null : dto.StartingPoint.Trim();
        route.EndingPoint = string.IsNullOrWhiteSpace(dto.EndingPoint) ? null : dto.EndingPoint.Trim();
        route.Latitude = dto.Latitude;
        route.Longitude = dto.Longitude;
        route.Rating = dto.Rating;
        route.PhotoClass = dto.PhotoClass;
        route.ImageUrl = dto.ImageUrl;
        route.IsActive = dto.IsActive;

        route.RequiredPermits.Clear();
        foreach (var permit in dto.RequiredPermits)
            route.RequiredPermits.Add(new TrekkingRoutePermit { PermitName = permit });

        route.Equipment.Clear();
        foreach (var item in dto.Equipment)
            route.Equipment.Add(new TrekkingRouteEquipment { ItemName = item });

        await _unitOfWork.SaveChangesAsync(ct);

        return await GetRouteByIdAsync(id, ct);
    }

    public async Task DeleteRouteAsync(int id, CancellationToken ct = default)
    {
        var route = await _unitOfWork.TrekkingRoutes.Query(asNoTracking: false).FirstOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new NotFoundException("TrekkingRoute", id);

        route.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken ct)
    {
        var baseSlug = Slugify(name);
        var slug = baseSlug;
        var suffix = 1;

        while (await _unitOfWork.TrekkingRoutes.AnyAsync(r => r.Slug == slug, ct))
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
