using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Geography;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProvincesController : ControllerBase
{
    private readonly IProvinceService _provinceService;

    public ProvincesController(IProvinceService provinceService)
    {
        _provinceService = provinceService;
    }

    /// <summary>List all seven provinces of Nepal.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ProvinceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ProvinceDto>>> GetAll(CancellationToken ct)
        => Ok(await _provinceService.GetAllAsync(ct));

    /// <summary>Get a single province by id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProvinceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProvinceDto>> GetById(int id, CancellationToken ct)
        => Ok(await _provinceService.GetByIdAsync(id, ct));

    /// <summary>Create a province (admin only).</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ProvinceDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<ProvinceDto>> Create([FromBody] ProvinceCreateDto dto, CancellationToken ct)
    {
        var created = await _provinceService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a province (admin only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ProvinceDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProvinceDto>> Update(int id, [FromBody] ProvinceUpdateDto dto, CancellationToken ct)
        => Ok(await _provinceService.UpdateAsync(id, dto, ct));

    /// <summary>Deactivate a province (admin only, soft delete).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _provinceService.DeleteAsync(id, ct);
        return NoContent();
    }
}
