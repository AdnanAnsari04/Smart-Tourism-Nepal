using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Data;

namespace SmartTourism.Api.Controllers;

/// <summary>Simple liveness/readiness endpoint used by the "Final Test" checklist
/// and by any container orchestrator health probe.</summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HealthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var canConnect = await _context.Database.CanConnectAsync(ct);

        if (!canConnect)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { status = "unhealthy", database = "unreachable" });
        }

        return Ok(new { status = "healthy", database = "connected", timestampUtc = DateTime.UtcNow });
    }
}
