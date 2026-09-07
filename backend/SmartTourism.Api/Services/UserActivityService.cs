using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class UserActivityService : IUserActivityService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UserActivityService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task LogAsync(Guid userId, UserActivityType type, string? description = null, string? metadataJson = null, CancellationToken ct = default)
    {
        var activity = new UserActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ActivityType = type,
            Description = description,
            MetadataJson = metadataJson,
            IpAddress = _currentUserService.IpAddress,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.UserActivities.AddAsync(activity, ct);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
