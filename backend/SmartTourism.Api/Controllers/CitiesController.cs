using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Geography;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CitiesController : ControllerBase
{
    private readonly ICityService _cityService;

    public CitiesController(ICityService cityService)
    {
        _cityService = cityService;
    }

    /// <summary>List cities, optionally filtered by province.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<CityDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CityDto>>> GetAll([FromQuery] int? provinceId, CancellationToken ct)
        => Ok(await _cityService.GetAllAsync(provinceId, ct));

    /// <summary>Get a single city by id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CityDto>> GetById(int id, CancellationToken ct)
        => Ok(await _cityService.GetByIdAsync(id, ct));

    /// <summary>Create a city under a province (admin only).</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(CityDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<CityDto>> Create([FromBody] CityCreateDto dto, CancellationToken ct)
    {
        var created = await _cityService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a city (admin only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(CityDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<CityDto>> Update(int id, [FromBody] CityUpdateDto dto, CancellationToken ct)
        => Ok(await _cityService.UpdateAsync(id, dto, ct));

    /// <summary>Deactivate a city (admin only, soft delete).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _cityService.DeleteAsync(id, ct);
        return NoContent();
    }
}
