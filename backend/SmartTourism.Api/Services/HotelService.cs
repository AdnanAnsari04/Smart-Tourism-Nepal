using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class HotelService : IHotelService
{
    private readonly IUnitOfWork _unitOfWork;

    public HotelService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<HotelListItemDto>> GetAllAsync(HotelQuery query, CancellationToken ct = default)
    {
        var hotels = _unitOfWork.Hotels.Query();

        if (!query.IncludeInactive)
            hotels = hotels.Where(h => h.IsActive);

        if (query.ProvinceId.HasValue) hotels = hotels.Where(h => h.ProvinceId == query.ProvinceId.Value);
        if (query.CityId.HasValue) hotels = hotels.Where(h => h.CityId == query.CityId.Value);
        if (query.DestinationId.HasValue) hotels = hotels.Where(h => h.DestinationId == query.DestinationId.Value);
        if (!string.IsNullOrWhiteSpace(query.HotelType)) hotels = hotels.Where(h => h.HotelType == query.HotelType);
        if (query.MinPricePerNight.HasValue) hotels = hotels.Where(h => h.PricePerNightNpr >= query.MinPricePerNight.Value);
        if (query.MaxPricePerNight.HasValue) hotels = hotels.Where(h => h.PricePerNightNpr <= query.MaxPricePerNight.Value);
        if (query.MinRating.HasValue) hotels = hotels.Where(h => h.Rating >= query.MinRating.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            hotels = hotels.Where(h => EF.Functions.Like(h.Name, $"%{term}%"));
        }

        var totalCount = await hotels.CountAsync(ct);

        var descending = !string.Equals(query.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        IOrderedQueryable<Hotel> ordered = query.SortBy?.Trim().ToLowerInvariant() switch
        {
            "price" => descending ? hotels.OrderByDescending(h => h.PricePerNightNpr) : hotels.OrderBy(h => h.PricePerNightNpr),
            "name" => descending ? hotels.OrderByDescending(h => h.Name) : hotels.OrderBy(h => h.Name),
            "newest" => descending ? hotels.OrderByDescending(h => h.CreatedAt) : hotels.OrderBy(h => h.CreatedAt),
            _ => descending ? hotels.OrderByDescending(h => h.Rating) : hotels.OrderBy(h => h.Rating)
        };
        hotels = ordered.ThenBy(h => h.Name);

        var items = await hotels
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(h => new HotelListItemDto(
                h.Id, h.Name, h.HotelType, h.DestinationId, h.Destination != null ? h.Destination.Name : null, h.Province.Name,
                h.CityId, h.City != null ? h.City.Name : null,
                h.PricePerNightNpr, h.Rating, h.AvailableRooms,
                h.HotelAmenities.Select(ha => ha.Amenity.Name).ToList(),
                h.PhotoClass, h.ImageUrl, h.Latitude, h.Longitude, h.IsActive))
            .ToListAsync(ct);

        return PagedResult<HotelListItemDto>.Create(items, query.Page, query.PageSize, totalCount);
    }

    public async Task<HotelDetailDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var hotel = await _unitOfWork.Hotels.Query()
            .Where(h => h.Id == id)
            .Select(h => new HotelDetailDto(
                h.Id, h.Name, h.Description, h.HotelType, h.Address, h.DestinationId, h.Destination != null ? h.Destination.Name : null,
                h.ProvinceId, h.Province.Name, h.CityId, h.City != null ? h.City.Name : null,
                h.PricePerNightNpr, h.Rating, h.ReviewCount, h.AvailableRooms,
                h.HotelAmenities.Select(ha => ha.Amenity.Name).ToList(),
                h.PhotoClass, h.ImageUrl, h.Latitude, h.Longitude, h.ContactPhone, h.Website,
                h.IsActive, h.CreatedAt, h.UpdatedAt))
            .FirstOrDefaultAsync(ct);

        return hotel ?? throw new NotFoundException("Hotel", id);
    }

    public async Task<HotelDetailDto> CreateAsync(HotelCreateDto dto, CancellationToken ct = default)
    {
        if (dto.DestinationId.HasValue && !await _unitOfWork.Destinations.AnyAsync(d => d.Id == dto.DestinationId.Value, ct))
            throw new NotFoundException("Destination", dto.DestinationId.Value);

        if (!await _unitOfWork.Provinces.AnyAsync(p => p.Id == dto.ProvinceId, ct))
            throw new NotFoundException("Province", dto.ProvinceId);

        if (dto.CityId.HasValue && !await _unitOfWork.Cities.AnyAsync(c => c.Id == dto.CityId.Value, ct))
            throw new NotFoundException("City", dto.CityId.Value);

        var hotel = new Hotel
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            HotelType = string.IsNullOrWhiteSpace(dto.HotelType) ? null : dto.HotelType.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            DestinationId = dto.DestinationId,
            CityId = dto.CityId,
            ProvinceId = dto.ProvinceId,
            PricePerNightNpr = dto.PricePerNightNpr,
            Rating = dto.Rating,
            AvailableRooms = dto.AvailableRooms,
            PhotoClass = dto.PhotoClass,
            ImageUrl = dto.ImageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            ContactPhone = string.IsNullOrWhiteSpace(dto.ContactPhone) ? null : dto.ContactPhone.Trim(),
            Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website.Trim(),
            ReviewCount = 0,
            IsActive = true
        };

        await _unitOfWork.Hotels.AddAsync(hotel, ct);
        await _unitOfWork.SaveChangesAsync(ct); // need hotel.Id before linking amenities

        await SyncAmenitiesAsync(hotel.Id, dto.Amenities, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(hotel.Id, ct);
    }

    public async Task<HotelDetailDto> UpdateAsync(int id, HotelUpdateDto dto, CancellationToken ct = default)
    {
        var hotel = await _unitOfWork.Hotels.Query(asNoTracking: false).FirstOrDefaultAsync(h => h.Id == id, ct)
            ?? throw new NotFoundException("Hotel", id);

        if (dto.DestinationId.HasValue && !await _unitOfWork.Destinations.AnyAsync(d => d.Id == dto.DestinationId.Value, ct))
            throw new NotFoundException("Destination", dto.DestinationId.Value);

        if (dto.CityId.HasValue && !await _unitOfWork.Cities.AnyAsync(c => c.Id == dto.CityId.Value, ct))
            throw new NotFoundException("City", dto.CityId.Value);

        hotel.Name = dto.Name.Trim();
        hotel.Description = dto.Description?.Trim();
        hotel.HotelType = string.IsNullOrWhiteSpace(dto.HotelType) ? null : dto.HotelType.Trim();
        hotel.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();
        hotel.DestinationId = dto.DestinationId;
        hotel.CityId = dto.CityId;
        hotel.PricePerNightNpr = dto.PricePerNightNpr;
        hotel.Rating = dto.Rating;
        hotel.AvailableRooms = dto.AvailableRooms;
        hotel.PhotoClass = dto.PhotoClass;
        hotel.ImageUrl = dto.ImageUrl;
        hotel.Latitude = dto.Latitude;
        hotel.Longitude = dto.Longitude;
        hotel.ContactPhone = string.IsNullOrWhiteSpace(dto.ContactPhone) ? null : dto.ContactPhone.Trim();
        hotel.Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website.Trim();
        hotel.IsActive = dto.IsActive;

        await SyncAmenitiesAsync(id, dto.Amenities, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var hotel = await _unitOfWork.Hotels.Query(asNoTracking: false).FirstOrDefaultAsync(h => h.Id == id, ct)
            ?? throw new NotFoundException("Hotel", id);

        hotel.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }

    /// <summary>Replaces a hotel's amenity links with the given set of amenity
    /// names, creating any master Amenity rows that don't exist yet.</summary>
    private async Task SyncAmenitiesAsync(int hotelId, IReadOnlyList<string> amenityNames, CancellationToken ct)
    {
        var existingLinks = await _unitOfWork.HotelAmenities.Query(asNoTracking: false)
            .Where(ha => ha.HotelId == hotelId)
            .ToListAsync(ct);

        foreach (var link in existingLinks)
        {
            _unitOfWork.HotelAmenities.Remove(link);
        }

        var distinctNames = amenityNames
            .Select(n => n.Trim())
            .Where(n => n.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var name in distinctNames)
        {
            var amenity = await _unitOfWork.Amenities.FirstOrDefaultAsync(a => a.Name == name, ct);
            if (amenity == null)
            {
                amenity = new Amenity { Name = name };
                await _unitOfWork.Amenities.AddAsync(amenity, ct);
                await _unitOfWork.SaveChangesAsync(ct); // need amenity.Id for the join row
            }

            await _unitOfWork.HotelAmenities.AddAsync(new HotelAmenity { HotelId = hotelId, AmenityId = amenity.Id }, ct);
        }
    }
}
