using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserActivityService _userActivityService;

    public ReviewService(IUnitOfWork unitOfWork, IUserActivityService userActivityService)
    {
        _unitOfWork = unitOfWork;
        _userActivityService = userActivityService;
    }

    public async Task<IReadOnlyList<ReviewDto>> GetByDestinationAsync(int destinationId, CancellationToken ct = default)
    {
        return await _unitOfWork.Reviews.Query()
            .Where(r => r.DestinationId == destinationId && r.IsActive)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(r.Id, r.DestinationId, r.UserId, r.User.FullName, r.Rating, r.Comment, r.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<ReviewDto> CreateAsync(Guid userId, ReviewCreateDto dto, CancellationToken ct = default)
    {
        var destination = await _unitOfWork.Destinations.GetByIdAsync(dto.DestinationId, ct)
            ?? throw new NotFoundException("Destination", dto.DestinationId);

        if (await _unitOfWork.Reviews.AnyAsync(r => r.DestinationId == dto.DestinationId && r.UserId == userId, ct))
        {
            throw new ConflictException("You have already reviewed this destination. Edit your existing review instead.");
        }

        var review = new Review
        {
            Id = Guid.NewGuid(),
            DestinationId = dto.DestinationId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            IsActive = true
        };

        await _unitOfWork.Reviews.AddAsync(review, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        await RecalculateDestinationRatingAsync(dto.DestinationId, ct);
        await _userActivityService.LogAsync(userId, UserActivityType.ReviewSubmitted, $"Reviewed destination {destination.Name}", ct: ct);

        var user = await _unitOfWork.Users.GetByIdAsync(userId, ct);
        return new ReviewDto(review.Id, review.DestinationId, review.UserId, user!.FullName, review.Rating, review.Comment, review.CreatedAt);
    }

    public async Task<ReviewDto> UpdateAsync(Guid userId, Guid reviewId, ReviewUpdateDto dto, CancellationToken ct = default)
    {
        var review = await _unitOfWork.Reviews.Query(asNoTracking: false)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == reviewId, ct)
            ?? throw new NotFoundException("Review", reviewId);

        if (review.UserId != userId)
            throw new UnauthorizedAppException("You can only edit your own reviews.");

        review.Rating = dto.Rating;
        review.Comment = dto.Comment.Trim();

        await _unitOfWork.SaveChangesAsync(ct);
        await RecalculateDestinationRatingAsync(review.DestinationId, ct);

        return new ReviewDto(review.Id, review.DestinationId, review.UserId, review.User.FullName, review.Rating, review.Comment, review.CreatedAt);
    }

    public async Task DeleteAsync(Guid userId, Guid reviewId, bool isAdmin, CancellationToken ct = default)
    {
        var review = await _unitOfWork.Reviews.Query(asNoTracking: false).FirstOrDefaultAsync(r => r.Id == reviewId, ct)
            ?? throw new NotFoundException("Review", reviewId);

        if (!isAdmin && review.UserId != userId)
            throw new UnauthorizedAppException("You can only delete your own reviews.");

        review.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);

        await RecalculateDestinationRatingAsync(review.DestinationId, ct);
    }

    /// <summary>Keeps Destination.Rating/ReviewCount denormalized fields in sync
    /// with the underlying active reviews, so list endpoints don't need a join
    /// + aggregate on every request.</summary>
    private async Task RecalculateDestinationRatingAsync(int destinationId, CancellationToken ct)
    {
        var destination = await _unitOfWork.Destinations.Query(asNoTracking: false).FirstOrDefaultAsync(d => d.Id == destinationId, ct);
        if (destination == null) return;

        var activeReviews = await _unitOfWork.Reviews.Query()
            .Where(r => r.DestinationId == destinationId && r.IsActive)
            .Select(r => r.Rating)
            .ToListAsync(ct);

        destination.ReviewCount = activeReviews.Count;
        destination.Rating = activeReviews.Count == 0 ? 0 : (decimal)activeReviews.Average();

        await _unitOfWork.SaveChangesAsync(ct);
    }
}
