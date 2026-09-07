using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DestinationsController : ControllerBase
{
    private readonly IDestinationService _destinationService;
    private readonly IReviewService _reviewService;
    private readonly ICurrentUserService _currentUserService;

    public DestinationsController(IDestinationService destinationService, IReviewService reviewService, ICurrentUserService currentUserService)
    {
        _destinationService = destinationService;
        _reviewService = reviewService;
        _currentUserService = currentUserService;
    }

    /// <summary>List destinations with paging and optional province/city/category/search filters.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<DestinationListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<DestinationListItemDto>>> GetAll([FromQuery] DestinationQuery query, CancellationToken ct)
    {
        // Never trust the caller's IncludeInactive flag unless they're an
        // authenticated Admin — everyone else only ever sees active listings,
        // no matter what they put in the query string.
        if (query.IncludeInactive && _currentUserService.Role != Roles.Admin)
        {
            query.IncludeInactive = false;
        }

        return Ok(await _destinationService.GetAllAsync(query, ct));
    }

    /// <summary>Get a single destination by id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(DestinationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DestinationDetailDto>> GetById(int id, CancellationToken ct)
        => Ok(await _destinationService.GetByIdAsync(id, ct));

    /// <summary>Get all active reviews for a destination.</summary>
    [HttpGet("{id:int}/reviews")]
    [ProducesResponseType(typeof(IReadOnlyList<ReviewDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ReviewDto>>> GetReviews(int id, CancellationToken ct)
        => Ok(await _reviewService.GetByDestinationAsync(id, ct));

    /// <summary>Submit a review for a destination (authenticated users, one review per destination).</summary>
    [HttpPost("{id:int}/reviews")]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<ReviewDto>> AddReview(int id, [FromBody] ReviewCreateDto dto, CancellationToken ct)
    {
        if (dto.DestinationId != id)
        {
            dto = dto with { DestinationId = id };
        }

        var review = await _reviewService.CreateAsync(_currentUserService.UserId!.Value, dto, ct);
        return CreatedAtAction(nameof(GetReviews), new { id }, review);
    }

    /// <summary>Create a destination (admin only).</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(DestinationDetailDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<DestinationDetailDto>> Create([FromBody] DestinationCreateDto dto, CancellationToken ct)
    {
        var created = await _destinationService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a destination (admin only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(DestinationDetailDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DestinationDetailDto>> Update(int id, [FromBody] DestinationUpdateDto dto, CancellationToken ct)
        => Ok(await _destinationService.UpdateAsync(id, dto, ct));

    /// <summary>Deactivate a destination (admin only, soft delete).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _destinationService.DeleteAsync(id, ct);
        return NoContent();
    }
}
