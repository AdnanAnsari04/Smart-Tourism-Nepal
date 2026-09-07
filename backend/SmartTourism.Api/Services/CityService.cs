using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Geography;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class CityService : ICityService
{
    private readonly IUnitOfWork _unitOfWork;

    public CityService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<CityDto>> GetAllAsync(int? provinceId, CancellationToken ct = default)
    {
        var query = _unitOfWork.Cities.Query().Where(c => c.IsActive);
        if (provinceId.HasValue)
        {
            query = query.Where(c => c.ProvinceId == provinceId.Value);
        }

        return await query
            .OrderBy(c => c.Name)
            .Select(c => new CityDto(c.Id, c.Slug, c.Name, c.District, c.Description, c.Latitude, c.Longitude, c.ImageUrl, c.ProvinceId, c.Province.Name))
            .ToListAsync(ct);
    }

    public async Task<CityDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var city = await _unitOfWork.Cities.Query()
            .Where(c => c.Id == id)
            .Select(c => new CityDto(c.Id, c.Slug, c.Name, c.District, c.Description, c.Latitude, c.Longitude, c.ImageUrl, c.ProvinceId, c.Province.Name))
            .FirstOrDefaultAsync(ct);

        return city ?? throw new NotFoundException("City", id);
    }

    public async Task<CityDto> CreateAsync(CityCreateDto dto, CancellationToken ct = default)
    {
        var province = await _unitOfWork.Provinces.GetByIdAsync(dto.ProvinceId, ct)
            ?? throw new NotFoundException("Province", dto.ProvinceId);

        var slug = dto.Slug.Trim().ToLowerInvariant();
        if (await _unitOfWork.Cities.AnyAsync(c => c.Slug == slug, ct))
        {
            throw new ConflictException($"A city with slug '{slug}' already exists.");
        }

        var city = new City
        {
            Slug = slug,
            Name = dto.Name.Trim(),
            District = dto.District.Trim(),
            Description = dto.Description?.Trim(),
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            ImageUrl = dto.ImageUrl,
            ProvinceId = dto.ProvinceId,
            IsActive = true
        };

        await _unitOfWork.Cities.AddAsync(city, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new CityDto(city.Id, city.Slug, city.Name, city.District, city.Description, city.Latitude, city.Longitude, city.ImageUrl, city.ProvinceId, province.Name);
    }

    public async Task<CityDto> UpdateAsync(int id, CityUpdateDto dto, CancellationToken ct = default)
    {
        var city = await _unitOfWork.Cities.Query(asNoTracking: false).FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException("City", id);

        city.Name = dto.Name.Trim();
        city.District = dto.District.Trim();
        city.Description = dto.Description?.Trim();
        city.Latitude = dto.Latitude;
        city.Longitude = dto.Longitude;
        city.ImageUrl = dto.ImageUrl;
        city.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var city = await _unitOfWork.Cities.Query(asNoTracking: false).FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException("City", id);

        city.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
