using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;
    private readonly ICurrentUserService _currentUserService;

    public FavoritesController(IFavoriteService favoriteService, ICurrentUserService currentUserService)
    {
        _favoriteService = favoriteService;
        _currentUserService = currentUserService;
    }

    /// <summary>List the authenticated user's saved destinations, hotels, and trekking routes.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<FavoriteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<FavoriteDto>>> GetAll(CancellationToken ct)
        => Ok(await _favoriteService.GetByUserAsync(_currentUserService.UserId!.Value, ct));

    /// <summary>Save an item to the authenticated user's favorites.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(FavoriteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<FavoriteDto>> Add([FromBody] FavoriteCreateDto dto, CancellationToken ct)
    {
        var created = await _favoriteService.AddAsync(_currentUserService.UserId!.Value, dto, ct);
        return CreatedAtAction(nameof(GetAll), created);
    }

    /// <summary>Remove an item from the authenticated user's favorites.</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Remove(Guid id, CancellationToken ct)
    {
        await _favoriteService.RemoveAsync(_currentUserService.UserId!.Value, id, ct);
        return NoContent();
    }
}
