# Smart Tourism Nepal — Backend Foundation

ASP.NET Core Web API backend for the existing `smart-tourism-frontend` React app.
This is an **addition** alongside the frontend — nothing in `smart-tourism-frontend/`
was modified.

## Stack

ASP.NET Core 8 Web API · EF Core 8 · SQL Server · JWT auth · FluentValidation ·
Swagger/OpenAPI · Serilog · a small generic Repository/UnitOfWork layer.

## Project layout

```
backend/SmartTourism.Api/
  Controllers/        REST endpoints (thin — call Services, map exceptions via middleware)
  Services/            Business logic, one service per domain
  Services/Interfaces/ All service contracts (IServices.cs)
  Repositories/        Generic IRepository<T> + IUnitOfWork
  Models/               EF Core entities (Identity, Geography, Catalog, Trekking, Engagement)
  DTOs/                 Request/response contracts, grouped by domain
  Data/                 ApplicationDbContext, Fluent API configurations, seeding
  Validators/            FluentValidation rules + the action filter that runs them
  Middleware/            Global exception handler, request logging
  Authentication/        JWT settings + signing key helper
  Authorization/         Role name constants
  Configuration/         DI/Swagger/CORS/JWT registration extension methods
  Migrations/             Created by `dotnet ef migrations add` (see below — none committed yet)
```

## 1. Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server, any of:
  - Docker (`docker compose up -d` using the provided `backend/docker-compose.yml`), or
  - SQL Server LocalDB / a local SQL Server instance, or
  - Azure SQL / any reachable SQL Server

## 2. Configure secrets (local development)

Nothing in this repo contains a real secret. For local development the
easiest path is `appsettings.Development.json`, which already has a
placeholder connection string matching the Docker Compose password below —
**change it** if you're pointing at a different SQL Server instance.

Alternatively, use environment variables (recommended, and required in
Production — see `.env.example`):

```
SQL_CONNECTION_STRING=Server=localhost,1433;Database=SmartTourismDb;User Id=sa;Password=<your-password>;TrustServerCertificate=True;MultipleActiveResultSets=true
JWT_SECRET=<any random string, 32+ chars>
JWT_ISSUER=SmartTourism.Api
JWT_AUDIENCE=SmartTourism.Client
CORS_ORIGINS=http://localhost:5173
SEED_ADMIN_EMAIL=admin@yatra.com
SEED_ADMIN_PASSWORD=<pick a strong password>
```

If `SEED_ADMIN_PASSWORD` isn't set, the seeder generates a random one and
logs it **once** on first run — watch the console/log file for a line like
`Seeded admin account admin@yatra.com with a GENERATED one-time password: ...`.

## 3. Start SQL Server (Docker option)

```bash
cd backend
docker compose up -d
```

## 4. Restore, build, and create the initial migration

The `Migrations/` folder is intentionally empty in this delivery — generate
it once against your own machine's installed EF tooling:

```bash
cd backend/SmartTourism.Api
dotnet restore
dotnet tool install --global dotnet-ef   # skip if already installed
dotnet ef migrations add InitialCreate
```

## 5. Run the API

```bash
dotnet run
```

On startup the app will, in order:
1. Apply any pending EF Core migrations (`Database.MigrateAsync()` — creates
   the database and all tables if they don't exist yet).
2. Seed roles, the admin account, all 7 provinces + cities, categories, and
   a representative set of destinations/hotels/trekking regions & routes —
   idempotently, so re-running never duplicates data.

Then open **https://localhost:5001/swagger** (or `http://localhost:5000/swagger`)
to explore and try every endpoint.

## 6. Verify the foundation ("Final Test" checklist)

- [ ] `dotnet build` — no compiler errors
- [ ] `dotnet run` — app starts, logs "Database migrations applied successfully."
      and "Database seed complete."
- [ ] `GET /api/health` and `GET /health` — both return healthy/200
- [ ] `GET /api/provinces` — returns all 7 provinces
- [ ] `GET /api/destinations` — returns paged destinations spanning multiple provinces
- [ ] `POST /api/auth/login` with `admin@yatra.com` / the seeded or configured
      password — returns an access + refresh token
- [ ] `/swagger` — loads, shows all controllers, "Authorize" button accepts a Bearer token

## Notes on design decisions

- **Soft deletes everywhere content-bearing**: Provinces, Cities, Categories,
  Destinations, Hotels, and TrekkingRoutes all use `IsActive` instead of hard
  deletion, since removing a Province, for example, would orphan Cities,
  Destinations, and TrekkingRegions beneath it.
- **Denormalized rating fields**: `Destination.Rating`/`ReviewCount` and
  `Hotel.Rating`/`ReviewCount` are recalculated whenever a review changes,
  so list endpoints don't need a join+aggregate on every request.
- **Refresh token rotation**: each `/api/auth/refresh` call revokes the old
  token and issues a new one (`RefreshToken.ReplacedByTokenId`), so reuse of
  a stolen/old token is detectable.
- **JWT signing key**: the configured `JWT_SECRET` is hashed with SHA-256
  before use as the HMAC key (`JwtKeyHelper`), so operators can use any
  plain random string rather than a pre-encoded base64 key.
