using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HotelsController : ControllerBase
{
    private readonly IHotelService _hotelService;
    private readonly ICurrentUserService _currentUserService;

    public HotelsController(IHotelService hotelService, ICurrentUserService currentUserService)
    {
        _hotelService = hotelService;
        _currentUserService = currentUserService;
    }

    /// <summary>List hotels with paging and optional province/city/destination/price/rating filters.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HotelListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<HotelListItemDto>>> GetAll([FromQuery] HotelQuery query, CancellationToken ct)
    {
        if (query.IncludeInactive && _currentUserService.Role != Roles.Admin)
        {
            query.IncludeInactive = false;
        }

        return Ok(await _hotelService.GetAllAsync(query, ct));
    }

    /// <summary>Get a single hotel by id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(HotelDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<HotelDetailDto>> GetById(int id, CancellationToken ct)
        => Ok(await _hotelService.GetByIdAsync(id, ct));

    /// <summary>Create a hotel (admin only).</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(HotelDetailDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<HotelDetailDto>> Create([FromBody] HotelCreateDto dto, CancellationToken ct)
    {
        var created = await _hotelService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a hotel (admin only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(HotelDetailDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<HotelDetailDto>> Update(int id, [FromBody] HotelUpdateDto dto, CancellationToken ct)
        => Ok(await _hotelService.UpdateAsync(id, dto, ct));

    /// <summary>Deactivate a hotel (admin only, soft delete).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _hotelService.DeleteAsync(id, ct);
        return NoContent();
    }
}
