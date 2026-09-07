using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.DTOs.Trekking;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

/// <summary>Trekking regions (Province -&gt; Region) and routes (Region -&gt; Route).
/// The plain /api/trekking[/{id}] endpoints below are equivalent to
/// /api/trekking/routes[/{id}] — kept as a separate, flatter path because
/// that's the shape client code most commonly expects for a "trekking list"
/// resource, alongside the richer region-aware /routes path.</summary>
[ApiController]
[Route("api/trekking")]
[Produces("application/json")]
public class TrekkingController : ControllerBase
{
    private readonly ITrekkingService _trekkingService;
    private readonly ICurrentUserService _currentUserService;

    public TrekkingController(ITrekkingService trekkingService, ICurrentUserService currentUserService)
    {
        _trekkingService = trekkingService;
        _currentUserService = currentUserService;
    }

    /// <summary>List trekking regions, optionally filtered by province.</summary>
    [HttpGet("regions")]
    [ProducesResponseType(typeof(IReadOnlyList<TrekkingRegionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TrekkingRegionDto>>> GetRegions([FromQuery] int? provinceId, CancellationToken ct)
        => Ok(await _trekkingService.GetRegionsAsync(provinceId, ct));

    /// <summary>Create a trekking region under a province (admin only).</summary>
    [HttpPost("regions")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(TrekkingRegionDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<TrekkingRegionDto>> CreateRegion([FromBody] TrekkingRegionCreateDto dto, CancellationToken ct)
    {
        var created = await _trekkingService.CreateRegionAsync(dto, ct);
        return CreatedAtAction(nameof(GetRegions), new { provinceId = created.ProvinceId }, created);
    }

    /// <summary>List trekking routes with paging and optional region/province/difficulty/search filters.</summary>
    [HttpGet("routes")]
    [ProducesResponseType(typeof(PagedResult<TrekkingRouteListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<TrekkingRouteListItemDto>>> GetRoutes([FromQuery] TrekkingRouteQuery query, CancellationToken ct)
        => Ok(await GetRoutesInternal(query, ct));

    /// <summary>Get a single trekking route by id.</summary>
    [HttpGet("routes/{id:int}")]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> GetRouteById(int id, CancellationToken ct)
        => Ok(await _trekkingService.GetRouteByIdAsync(id, ct));

    /// <summary>Create a trekking route (admin only).</summary>
    [HttpPost("routes")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> CreateRoute([FromBody] TrekkingRouteCreateDto dto, CancellationToken ct)
    {
        var created = await _trekkingService.CreateRouteAsync(dto, ct);
        return CreatedAtAction(nameof(GetRouteById), new { id = created.Id }, created);
    }

    /// <summary>Update a trekking route (admin only).</summary>
    [HttpPut("routes/{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> UpdateRoute(int id, [FromBody] TrekkingRouteUpdateDto dto, CancellationToken ct)
        => Ok(await _trekkingService.UpdateRouteAsync(id, dto, ct));

    /// <summary>Deactivate a trekking route (admin only, soft delete).</summary>
    [HttpDelete("routes/{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteRoute(int id, CancellationToken ct)
    {
        await _trekkingService.DeleteRouteAsync(id, ct);
        return NoContent();
    }

    // -----------------------------------------------------------------
    // Flat aliases: GET/POST /api/trekking, GET/PUT/DELETE /api/trekking/{id}
    // -----------------------------------------------------------------

    /// <summary>List trekking routes (same data as GET /api/trekking/routes).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TrekkingRouteListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<TrekkingRouteListItemDto>>> GetAll([FromQuery] TrekkingRouteQuery query, CancellationToken ct)
        => Ok(await GetRoutesInternal(query, ct));

    /// <summary>Get a single trekking route by id (same data as GET /api/trekking/routes/{id}).</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> GetById(int id, CancellationToken ct)
        => Ok(await _trekkingService.GetRouteByIdAsync(id, ct));

    /// <summary>Create a trekking route (admin only).</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> Create([FromBody] TrekkingRouteCreateDto dto, CancellationToken ct)
    {
        var created = await _trekkingService.CreateRouteAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a trekking route (admin only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(TrekkingRouteDetailDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<TrekkingRouteDetailDto>> Update(int id, [FromBody] TrekkingRouteUpdateDto dto, CancellationToken ct)
        => Ok(await _trekkingService.UpdateRouteAsync(id, dto, ct));

    /// <summary>Deactivate a trekking route (admin only, soft delete).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _trekkingService.DeleteRouteAsync(id, ct);
        return NoContent();
    }

    private async Task<PagedResult<TrekkingRouteListItemDto>> GetRoutesInternal(TrekkingRouteQuery query, CancellationToken ct)
    {
        if (query.IncludeInactive && _currentUserService.Role != Roles.Admin)
        {
            query.IncludeInactive = false;
        }

        return await _trekkingService.GetRoutesAsync(query, ct);
    }
}
