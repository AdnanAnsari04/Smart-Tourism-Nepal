using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Geography;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class ProvinceService : IProvinceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProvinceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<ProvinceDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _unitOfWork.Provinces.Query()
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .Select(p => new ProvinceDto(
                p.Id, p.Slug, p.Name, p.Capital, p.Description,
                p.Cities.Count(c => c.IsActive),
                p.Destinations.Count(d => d.IsActive)))
            .ToListAsync(ct);
    }

    public async Task<ProvinceDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var province = await _unitOfWork.Provinces.Query()
            .Where(p => p.Id == id)
            .Select(p => new ProvinceDto(
                p.Id, p.Slug, p.Name, p.Capital, p.Description,
                p.Cities.Count(c => c.IsActive),
                p.Destinations.Count(d => d.IsActive)))
            .FirstOrDefaultAsync(ct);

        return province ?? throw new NotFoundException("Province", id);
    }

    public async Task<ProvinceDto> CreateAsync(ProvinceCreateDto dto, CancellationToken ct = default)
    {
        var slug = dto.Slug.Trim().ToLowerInvariant();
        if (await _unitOfWork.Provinces.AnyAsync(p => p.Slug == slug, ct))
        {
            throw new ConflictException($"A province with slug '{slug}' already exists.");
        }

        var province = new Province
        {
            Slug = slug,
            Name = dto.Name.Trim(),
            Capital = dto.Capital.Trim(),
            Description = dto.Description.Trim(),
            IsActive = true
        };

        await _unitOfWork.Provinces.AddAsync(province, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new ProvinceDto(province.Id, province.Slug, province.Name, province.Capital, province.Description, 0, 0);
    }

    public async Task<ProvinceDto> UpdateAsync(int id, ProvinceUpdateDto dto, CancellationToken ct = default)
    {
        var province = await _unitOfWork.Provinces.Query(asNoTracking: false).FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new NotFoundException("Province", id);

        province.Name = dto.Name.Trim();
        province.Capital = dto.Capital.Trim();
        province.Description = dto.Description.Trim();
        province.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var province = await _unitOfWork.Provinces.Query(asNoTracking: false).FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new NotFoundException("Province", id);

        // Soft delete: provinces anchor too much data (cities, destinations,
        // trekking regions) to hard-delete safely from an admin endpoint.
        province.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
