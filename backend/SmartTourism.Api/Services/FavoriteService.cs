using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserActivityService _userActivityService;

    public FavoriteService(IUnitOfWork unitOfWork, IUserActivityService userActivityService)
    {
        _unitOfWork = unitOfWork;
        _userActivityService = userActivityService;
    }

    public async Task<IReadOnlyList<FavoriteDto>> GetByUserAsync(Guid userId, CancellationToken ct = default)
    {
        var favorites = await _unitOfWork.Favorites.Query()
            .Where(f => f.UserId == userId)
            .Include(f => f.Destination)
            .Include(f => f.Hotel)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync(ct);

        return favorites.Select(MapToDto).ToList();
    }

    public async Task<FavoriteDto> AddAsync(Guid userId, FavoriteCreateDto dto, CancellationToken ct = default)
    {
        if (!Enum.TryParse<FavoriteItemType>(dto.ItemType, true, out var itemType))
        {
            throw new BadRequestException("ItemType must be one of: Destination, Hotel, TrekkingRoute.");
        }

        var favorite = new Favorite
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ItemType = itemType,
            ItemId = dto.ItemId,
            CreatedAt = DateTime.UtcNow
        };

        switch (itemType)
        {
            case FavoriteItemType.Destination:
                if (!await _unitOfWork.Destinations.AnyAsync(d => d.Id == dto.ItemId, ct))
                    throw new NotFoundException("Destination", dto.ItemId);
                favorite.DestinationId = dto.ItemId;
                break;

            case FavoriteItemType.Hotel:
                if (!await _unitOfWork.Hotels.AnyAsync(h => h.Id == dto.ItemId, ct))
                    throw new NotFoundException("Hotel", dto.ItemId);
                favorite.HotelId = dto.ItemId;
                break;

            case FavoriteItemType.TrekkingRoute:
                if (!await _unitOfWork.TrekkingRoutes.AnyAsync(r => r.Id == dto.ItemId, ct))
                    throw new NotFoundException("TrekkingRoute", dto.ItemId);
                break;
        }

        if (await _unitOfWork.Favorites.AnyAsync(f => f.UserId == userId && f.ItemType == itemType && f.ItemId == dto.ItemId, ct))
        {
            throw new ConflictException("This item is already in your favorites.");
        }

        await _unitOfWork.Favorites.AddAsync(favorite, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(userId, UserActivityType.FavoriteAdded, $"Added {itemType} #{dto.ItemId} to favorites", ct: ct);

        // Reload with navigation properties for the response DTO.
        var saved = await _unitOfWork.Favorites.Query()
            .Include(f => f.Destination)
            .Include(f => f.Hotel)
            .FirstAsync(f => f.Id == favorite.Id, ct);

        return MapToDto(saved);
    }

    public async Task RemoveAsync(Guid userId, Guid favoriteId, CancellationToken ct = default)
    {
        var favorite = await _unitOfWork.Favorites.Query(asNoTracking: false).FirstOrDefaultAsync(f => f.Id == favoriteId, ct)
            ?? throw new NotFoundException("Favorite", favoriteId);

        if (favorite.UserId != userId)
            throw new UnauthorizedAppException("You can only remove your own favorites.");

        _unitOfWork.Favorites.Remove(favorite);
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(userId, UserActivityType.FavoriteRemoved, $"Removed {favorite.ItemType} #{favorite.ItemId} from favorites", ct: ct);
    }

    private static FavoriteDto MapToDto(Favorite favorite)
    {
        var (name, imageUrl) = favorite.ItemType switch
        {
            FavoriteItemType.Destination => (favorite.Destination?.Name ?? "Unknown destination", favorite.Destination?.ImageUrl),
            FavoriteItemType.Hotel => (favorite.Hotel?.Name ?? "Unknown hotel", favorite.Hotel?.ImageUrl),
            _ => ("Trekking route", (string?)null)
        };

        return new FavoriteDto(favorite.Id, favorite.ItemType.ToString(), favorite.ItemId, name, imageUrl, favorite.CreatedAt);
    }
}
