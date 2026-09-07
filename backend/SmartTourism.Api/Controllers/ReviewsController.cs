using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

/// <summary>
/// Direct review management by id. Creating a review happens via
/// POST /api/destinations/{id}/reviews (see DestinationsController) since a
/// review always belongs to a destination; this controller covers edit/delete.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly ICurrentUserService _currentUserService;

    public ReviewsController(IReviewService reviewService, ICurrentUserService currentUserService)
    {
        _reviewService = reviewService;
        _currentUserService = currentUserService;
    }

    /// <summary>Update your own review.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ReviewDto>> Update(Guid id, [FromBody] ReviewUpdateDto dto, CancellationToken ct)
        => Ok(await _reviewService.UpdateAsync(_currentUserService.UserId!.Value, id, dto, ct));

    /// <summary>Delete your own review, or any review if you are an admin.</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var isAdmin = _currentUserService.Role == Roles.Admin;
        await _reviewService.DeleteAsync(_currentUserService.UserId!.Value, id, isAdmin, ct);
        return NoContent();
    }
}
