# Yatra — Smart Tourism for Nepal

AI-powered trip planning platform for Nepal: destination discovery, hotel
and trek booking, itinerary planning, a cultural heritage hub, and admin
tooling — backed by a real ASP.NET Core + SQL Server backend.

```
smart-tourism-frontend/   React + TypeScript (Vite) — the website
backend/SmartTourism.Api/ ASP.NET Core Web API + SQL Server — the server
```

Login, Registration, Google Sign-In, and the entire Admin Dashboard
(live stats, user management, Destinations/Hotels/Treks CRUD) are connected
to the real backend and a real database. Booking persistence, payment
processing, the AI itinerary generator, and email verification are still
frontend-only mocks — see [What's real vs. mocked](#whats-real-vs-mocked).

---

## Table of contents

- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Pages / routes](#pages--routes)
- [Authentication & authorization](#authentication--authorization)
- [Admin dashboard & tourism management API](#admin-dashboard--tourism-management-api)
- [Setting up real Google Sign-In](#setting-up-real-google-sign-in)
- [Testing the API directly](#testing-the-api-directly)
- [What's real vs. mocked](#whats-real-vs-mocked)
- [Known gaps](#known-gaps)

---

## Quick start

Requires: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0),
Node 18+, and Docker (for local SQL Server) — or any reachable SQL Server
instance.

**1. Start the database**
```bash
cd backend
docker compose up -d
```

**2. Start the backend** (Terminal 1)
```bash
cd backend/SmartTourism.Api
export SEED_ADMIN_PASSWORD='Your_Admin_Password!'
export GOOGLE_CLIENT_ID='your-client-id.apps.googleusercontent.com'   # optional, see below
dotnet restore
dotnet build
dotnet run
```
Wait for `Now listening on: http://localhost:5000`. This applies database
migrations and seeds starter data (7 provinces, cities, categories, sample
destinations/hotels/treks, roles, and an admin account) automatically.

**3. Start the frontend** (Terminal 2)
```bash
cd smart-tourism-frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

**4. Log in**

Email `admin@yatra.com`, password whatever you set as `SEED_ADMIN_PASSWORD`
(or check the backend console log for a generated one-time password if you
didn't set it).

Other useful scripts:
```bash
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint, zero warnings allowed
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend framework | ASP.NET Core Web API (C#, .NET 8) |
| Database | Microsoft SQL Server + Entity Framework Core |
| Authentication | JWT (access + refresh token rotation) + Google Sign-In (OAuth) |
| Password security | BCrypt hashing |
| Validation | FluentValidation on every DTO |
| API docs | Swagger / OpenAPI |
| Logging | Serilog |
| Local environment | Docker + Docker Compose |
| Frontend | React + TypeScript (Vite) |
| Testing tools | Swagger UI, Postman, VS Code SQL extension |

---

## Project structure

```
backend/SmartTourism.Api/
  Controllers/     Auth, Users, Admin, Destinations, Hotels, Trekking, ...
  Services/        business logic + validation
  Models/          EF Core entities (Identity, Catalog, Trekking, Engagement)
  DTOs/            request/response contracts
  Migrations/       EF Core migrations
  Data/Seed/        starter data (provinces, cities, categories, sample content)

smart-tourism-frontend/src/
  pages/            one file per route (see table below)
  pages/admin/       live Admin Dashboard tabs (Overview, Users, Destinations, Hotels, Treks)
  components/        shared UI: Navbar, Footer, Sidebar, AdminSidebar, AuthLayout,
                      CulturalBackdrop, RequireAuth, RequireRole, WeatherForecast
  api/                fetch wrappers + typed request/response functions per domain
  data/               mock datasets still used by pages not yet connected to the backend
  types/              TypeScript interfaces matching each dataset
  context/            language (English/Nepali) provider and translation strings
  utils/              form validators, session/role helpers
  styles/             one CSS file per page/feature, plus index.css for design tokens
```

---

## Environment variables

**Backend** (`backend/SmartTourism.Api`, export before `dotnet run`, or put
in `appsettings.Development.json` for local dev):

| Variable | Purpose |
|---|---|
| `SQL_CONNECTION_STRING` | Database connection string |
| `JWT_SECRET` / `JWT_ISSUER` / `JWT_AUDIENCE` | Token signing config |
| `CORS_ORIGINS` | Allowed frontend origins |
| `SEED_ADMIN_PASSWORD` | Password for the seeded `admin@yatra.com` account (random one-time password generated + logged if unset) |
| `GOOGLE_CLIENT_ID` | OAuth Client ID for Google Sign-In (see below) |

**Frontend** (`smart-tourism-frontend/.env`):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Same Google OAuth Client ID as the backend |

---

## Pages / routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, featured destinations, heritage/trek highlights |
| `/login`, `/register`, `/verify-email`, `/forgot-password` | Auth | Login/Register/Google Sign-In call the real backend; email verification and password reset are still mocked |
| `/destinations`, `/destinations/:id` | Destinations | Search/filter grid + detail page with weather, reviews, AR/VR placeholder |
| `/hotels` | Hotels | Booking.com-style destination/date/occupancy search |
| `/treks` | Treks | Difficulty filter, permits & equipment |
| `/heritage` | Heritage Hub | UNESCO sites, 30-place searchable directory, festivals |
| `/map` | Tourism Map | Leaflet + OpenStreetMap, all destinations plotted |
| `/trip-planner` | AI Trip Planner | Form-based mock itinerary generator (no live AI yet) |
| `/dashboard`, `/profile`, `/bookings`, `/budget`, `/trip-summary`, `/settings`, `/notifications`, `/payment` | Tourist account area | Behind `RequireRole role="tourist"` |
| `/admin` | Admin Dashboard | **Live**: Overview, Users, Destinations, Hotels, Treks tabs call the real backend. Bookings/Reports tabs are placeholders (no backend yet) |

Role is read from the real JWT returned by the backend at login (`getRole()`
in `src/utils/session.ts`), enforced client-side by `RequireAuth.tsx` /
`RequireRole.tsx`. This is route-level protection for the frontend only —
the backend independently re-checks the role server-side
(`[Authorize(Roles = "Admin")]`) on every admin request, which is the real
security boundary.

---

## Authentication & authorization

Full register → login → refresh → logout flow, JWT-based, with:

- **Registration & login** — BCrypt-hashed passwords, JWT access token +
  refresh token pair returned on success.
- **Google Sign-In** — real OAuth. The frontend's "Continue with Google"
  button gets an ID token from Google; the backend verifies it directly
  against Google's public keys (`POST /api/auth/google-login`) before
  trusting it. New accounts are created automatically, or linked to an
  existing email-matched account.
- **Refresh token rotation** — `POST /api/auth/refresh` revokes the old
  refresh token and issues a new pair, so a stolen/reused old token is
  detectable.
- **Logout** (`POST /api/auth/logout`) — blacklists the current access
  token immediately (checked on every request via the JWT bearer's
  `OnTokenValidated` event) and revokes the refresh token, since JWTs are
  otherwise stateless and would keep working until they expire on their own.
- **Profile** — `GET/PUT /api/users/me` updates `FullName`/`PhoneNumber`/
  `Country` only; `Email`, `PasswordHash`, `RoleId`, and `IsActive` are never
  bindable through this endpoint (mass-assignment guard).
- **Role-based access** — `Roles.Admin` / `Roles.Tourist`, enforced via
  `[Authorize(Roles = "Admin")]` on every admin/write endpoint. An
  authenticated non-admin hitting an admin route gets **403 Forbidden**, not
  401 (ASP.NET Core's standard behavior once the caller is already
  authenticated).
- **Account deactivation takes effect immediately** — `User.IsActive` is
  re-checked from the database on every request (not just at login), so a
  disabled account is locked out mid-session, not just on next login.

### Testing the auth flow directly

```bash
BASE=https://localhost:5001/api

# Register
curl -sk -X POST $BASE/auth/register -H "Content-Type: application/json" -d '{
  "fullName": "Test User", "email": "test1@example.com",
  "password": "Passw0rd!", "confirmPassword": "Passw0rd!",
  "phoneNumber": "9800000000", "country": "Nepal"
}' | tee register.json

# Login
curl -sk -X POST $BASE/auth/login -H "Content-Type: application/json" -d '{
  "email": "test1@example.com", "password": "Passw0rd!"
}' | tee login.json

ACCESS=$(python3 -c "import json;print(json.load(open('login.json'))['accessToken'])")
REFRESH=$(python3 -c "import json;print(json.load(open('login.json'))['refreshToken'])")

# Access a protected route
curl -sk $BASE/users/me -H "Authorization: Bearer $ACCESS"

# Refresh
curl -sk -X POST $BASE/auth/refresh -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}" | tee refresh.json
ACCESS2=$(python3 -c "import json;print(json.load(open('refresh.json'))['accessToken'])")
REFRESH2=$(python3 -c "import json;print(json.load(open('refresh.json'))['refreshToken'])")

# Logout — blacklists ACCESS2, revokes REFRESH2
curl -sk -X POST $BASE/auth/logout -H "Authorization: Bearer $ACCESS2" \
  -H "Content-Type: application/json" -d "{\"refreshToken\":\"$REFRESH2\"}" -i

# Access again -> should now be 401
curl -sk -o /dev/null -w "%{http_code}\n" $BASE/users/me -H "Authorization: Bearer $ACCESS2"
```

Other things worth checking manually:
- Wrong password → 401. Duplicate registration email → 409. Garbage refresh token → 401.
- Flip `Users.IsActive = 0` for a logged-in user in the DB → their next request (not just next login) should 401.
- Call an `[Authorize(Roles="Admin")]` endpoint with a Tourist's token → 403.

---

## Admin dashboard & tourism management API

### Dashboard
```
GET /api/admin/dashboard   (Admin only)
```
Returns total/active/inactive users, total admins, total
destinations/hotels/trekking routes/reviews/provinces/categories, new users
and new reviews in the last 7 days, the 5 most recently created users, and
the 10 most recent entries from the `UserActivities` audit log.

### User management
```
GET    /api/admin/users              search + role + active-status filters, paged, sortable
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}/status  { "isActive": bool }
PUT    /api/admin/users/{id}/role    { "role": "Admin" | "Tourist" }
DELETE /api/admin/users/{id}
```

Built-in guardrails:
- An admin can't deactivate, delete, or demote **their own** account.
- The **last remaining active admin** can't be deactivated, demoted, or
  deleted — there's always at least one way back in.
- `role` is validated against the real `Roles` table, so adding a third role
  later needs no code change, just a new row.
- Deleting a user who has reviews on record deactivates the account instead
  (409, with an explanation) rather than orphaning their review history.

### Destinations / Hotels / Trekking Routes

Full CRUD on all three, admin-only for writes:
```
GET / GET {id} / POST / PUT {id} / DELETE {id}
```

Fields include everything the spec asks for:
- **Destination**: Name, Description, Province, District, City, Category,
  Image, Latitude/Longitude, Rating, BestSeason, EntryInformation, Status,
  CreatedAt/UpdatedAt.
- **Hotel**: Name, Description, Location (Province/City/Address), Hotel
  type, Rating, Price, Amenities, Images, Latitude/Longitude,
  Contact/Website, Status.
- **Trekking Route**: Name, Region, Province, District, Description, Image,
  Difficulty, Duration, Altitude, Best season, Starting/Ending point,
  Latitude/Longitude, Rating, Status.

`/api/trekking` also has flat aliases (`GET/POST /api/trekking`,
`GET/PUT/DELETE /api/trekking/{id}`) alongside the region-aware
`/api/trekking/routes` / `/api/trekking/regions` paths — both return the
same data.

### Search, filter, sort, pagination

All three list endpoints share the same shape — filtered and paginated
**server-side** (never "load everything and filter in JS"):

```
/api/destinations?city=Pokhara&category=Nature&sortBy=rating&page=1&pageSize=20
/api/hotels?city=Pokhara&minRating=4&sortBy=price&sortDir=asc&page=1&pageSize=20
/api/trekking?difficulty=Moderate&page=1&pageSize=20
```

- `?search=` does a server-side `LIKE` match.
- `?sortBy=&sortDir=asc|desc` — `rating` (default), `name`, `newest`; hotels
  add `price`; trekking adds `difficulty`, `duration`, `altitude`.
- `?page=&pageSize=` — response wrapped in `PagedResult<T>` (`items`,
  `page`, `pageSize`, `totalCount`, `totalPages`).
- `?includeInactive=true` lets an authenticated **Admin** see
  deactivated/soft-deleted listings through the same public endpoints they
  browse with. Silently ignored (forced back to active-only) for anyone
  else — the query string is never trusted for this.

### Testing the admin flow directly

```bash
BASE=https://localhost:5001/api
ADMIN_TOKEN=...   # log in as the seeded admin
USER_TOKEN=...    # register + log in as a normal Tourist

curl -sk $BASE/admin/dashboard -H "Authorization: Bearer $ADMIN_TOKEN"

# Non-admin gets 403, not 401
curl -sk -o /dev/null -w "%{http_code}\n" $BASE/admin/dashboard -H "Authorization: Bearer $USER_TOKEN"

curl -sk "$BASE/admin/users?search=test&page=1&pageSize=10" -H "Authorization: Bearer $ADMIN_TOKEN"
curl -sk -X PUT $BASE/admin/users/<id>/status -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"isActive": false}'
curl -sk -X PUT $BASE/admin/users/<id>/role -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"role": "Admin"}'
curl -sk -X DELETE $BASE/admin/users/<id> -H "Authorization: Bearer $ADMIN_TOKEN" -i

curl -sk -X POST $BASE/destinations -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{
  "name":"Sample Viewpoint","description":"...", "provinceId":1,"district":"Kaski",
  "cityId":null,"categoryId":1,"distanceFromKathmanduKm":200,
  "bestSeason":"Oct-Dec","entryInformation":"Free entry","latitude":28.2,"longitude":83.9
}'

curl -sk "$BASE/destinations?includeInactive=true" -H "Authorization: Bearer $ADMIN_TOKEN"
curl -sk "$BASE/destinations?includeInactive=true" -H "Authorization: Bearer $USER_TOKEN"   # ignored, still active-only

# Validation -> 400
curl -sk -X POST $BASE/hotels -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name":"","provinceId":0,"pricePerNightNpr":-5,"rating":9,"availableRooms":-1,"amenities":[]}'
```

---

## Setting up real Google Sign-In

The code is fully wired up (frontend button + backend token verification).
The one manual step is creating a free **Google OAuth Client ID** — about 5
minutes in Google Cloud Console.

### Step 1 — Create a Google Cloud project (skip if you already have one)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/).
2. Sign in with any Google account.
3. Top-left, click the project dropdown → **New Project**.
4. Name it anything (e.g. "Smart Tourism Nepal") → **Create**.
5. Make sure the new project is selected (top-left dropdown).

### Step 2 — Configure the OAuth consent screen (required first, one-time)

1. Left sidebar: **APIs & Services** → **OAuth consent screen**.
2. User Type: **External** → **Create**.
3. Fill in App name, User support email, Developer contact email.
4. Click through Scopes and Test users (defaults are fine locally) to the Summary, then **Back to Dashboard**.
5. Your app stays in "Testing" mode for local dev — add your own Google email as a **Test user** on this same page, or sign-in will be blocked.

### Step 3 — Create the OAuth Client ID

1. Left sidebar: **APIs & Services** → **Credentials**.
2. **+ Create Credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. Name: anything (e.g. "Yatra Web Frontend").
5. Under **Authorized JavaScript origins**, **+ Add URI**:
   ```
   http://localhost:5173
   ```
6. Leave "Authorized redirect URIs" empty — this flow doesn't use redirects.
7. Click **Create**. Copy the **Client ID** (ends in `.apps.googleusercontent.com`) — you don't need the client secret shown next to it, this app never uses it.

### Step 4 — Put the Client ID in both places

**Backend**, before `dotnet run`:
```bash
export GOOGLE_CLIENT_ID='your-client-id-here.apps.googleusercontent.com'
```

**Frontend** — `smart-tourism-frontend/.env`:
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```
(same value both places — restart `npm run dev` after editing)

### Step 5 — Run and test

```bash
# Terminal 1
cd backend/SmartTourism.Api
export GOOGLE_CLIENT_ID='your-client-id-here.apps.googleusercontent.com'
export SEED_ADMIN_PASSWORD='Your_Admin_Password!'
dotnet run

# Terminal 2
cd smart-tourism-frontend
npm run dev
```

Open `http://localhost:5173/login` — Google's real button should render.
Click it, pick an account, and check `SELECT * FROM Users WHERE GoogleId IS
NOT NULL` in your SQL tool afterward to see the real account created.

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| Button doesn't appear / shows an inline error | `VITE_GOOGLE_CLIENT_ID` is empty, or `npm run dev` wasn't restarted after editing `.env` |
| "The given origin is not allowed" (browser console) | JavaScript origin doesn't exactly match `http://localhost:5173` (trailing slash, http vs https, wrong port) |
| "Access blocked" / "App not verified" | Your Google account isn't added as a Test user, or the consent screen wasn't fully saved |
| Backend error "Google sign-in is not configured" | `GOOGLE_CLIENT_ID` wasn't exported before `dotnet run` in that terminal session — exports don't persist between terminals/restarts |

---

## What's real vs. mocked

**Real, backend-connected:** registration, login, Google Sign-In, logout,
token refresh, profile view/update, role-based access control, the entire
Admin Dashboard (live stats, user management, Destinations/Hotels/Treks
CRUD with search/filter/sort/pagination).

**Real, no backend needed:** all other UI interactions, client-side
validation, the Leaflet map, the print-to-PDF trip summary, the language
toggle, route guards, filtering/search/sort on public list pages.

**Still mocked, waiting on future backend work:** booking persistence,
payment processing (`/payment` supports eSewa, Khalti, IME Pay, ConnectIPS,
and card UI/UX, but no real transaction is processed), the AI itinerary
generator (returns a templated sample, not a live model call), email
verification (no email is actually sent), password-reset-by-email
(placeholder only), notifications (static sample data), the Admin
Dashboard's Bookings and Reports tabs.

---

## Known gaps

- No booking system, automated report generation, or email-based password reset yet (see above).
- Bundle size warning on build (>500kB JS) — worth code-splitting routes with `React.lazy()` before a real launch.
- Language toggle covers primary navigation and the Home page; most account/admin pages are still English-only.
- Dark mode is not implemented (tokens exist for it in `index.css` but aren't wired up).