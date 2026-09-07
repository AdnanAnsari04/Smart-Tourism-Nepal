using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.Data.Seed.SeedData;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Models.Trekking;

namespace SmartTourism.Api.Data.Seed;

/// <summary>
/// Idempotent startup seeder: every method checks "does this already exist"
/// before inserting, so re-running the app never duplicates data. Nothing
/// here is hardcoded into a controller — this is the single source of
/// initial data, invoked once from Program.cs after migrations run.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IConfiguration configuration, ILogger logger)
    {
        await SeedRolesAsync(context, logger);
        await SeedAdminUserAsync(context, configuration, logger);
        await SeedProvincesAndCitiesAsync(context, logger);
        await SeedCategoriesAsync(context, logger);
        await SeedDestinationsAsync(context, logger);
        await SeedHotelsAsync(context, logger);
        await SeedTrekkingAsync(context, logger);
    }

    private static async Task SeedRolesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Roles.AnyAsync()) return;

        context.Roles.AddRange(
            new Role { Name = Roles.Admin, Description = "Full administrative access to manage tourism content." },
            new Role { Name = Roles.Tourist, Description = "Standard visitor account: browse, review, and favorite content." }
        );

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded roles: {Admin}, {Tourist}", Roles.Admin, Roles.Tourist);
    }

    private static async Task SeedAdminUserAsync(ApplicationDbContext context, IConfiguration configuration, ILogger logger)
    {
        if (await context.Users.AnyAsync(u => u.NormalizedEmail == "ADMIN@YATRA.COM" ||
                                               u.Role.Name == Roles.Admin)) return;

        var adminRole = await context.Roles.FirstAsync(r => r.Name == Roles.Admin);

        var email = configuration["SeedAdmin:Email"] ?? "admin@yatra.com";
        var fullName = configuration["SeedAdmin:FullName"] ?? "Yatra Platform Admin";

        // Password source, in priority order: SEED_ADMIN_PASSWORD env var >
        // a freshly generated random password (logged once, dev convenience
        // only). Never hardcoded, so it can never leak into source control.
        var password = Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD");
        var generated = false;

        if (string.IsNullOrWhiteSpace(password))
        {
            password = GenerateRandomPassword();
            generated = true;
        }

        var admin = new User
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            Email = email,
            NormalizedEmail = email.Trim().ToUpperInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            RoleId = adminRole.Id,
            IsEmailVerified = true,
            IsActive = true
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();

        if (generated)
        {
            logger.LogWarning(
                "Seeded admin account {Email} with a GENERATED one-time password: {Password}. " +
                "Log in and change it immediately, or set SEED_ADMIN_PASSWORD before first run next time.",
                email, password);
        }
        else
        {
            logger.LogInformation("Seeded admin account {Email} using SEED_ADMIN_PASSWORD from the environment.", email);
        }
    }

    private static async Task SeedProvincesAndCitiesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Provinces.AnyAsync()) return;

        foreach (var provinceSeed in ProvinceCitySeedData.Provinces)
        {
            var province = new Province
            {
                Slug = provinceSeed.Slug,
                Name = provinceSeed.Name,
                Capital = provinceSeed.Capital,
                Description = provinceSeed.Description,
                IsActive = true
            };

            province.Cities = provinceSeed.Cities.Select(c => new City
            {
                Slug = c.Slug,
                Name = c.Name,
                District = c.District,
                Latitude = c.Lat,
                Longitude = c.Lng,
                IsActive = true
            }).ToList();

            context.Provinces.Add(province);
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} provinces with their cities.", ProvinceCitySeedData.Provinces.Count);
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Categories.AnyAsync()) return;

        context.Categories.AddRange(CategorySeedData.Categories.Select(c => new Category
        {
            Slug = c.Slug,
            Label = c.Label,
            Icon = c.Icon,
            IsActive = true
        }));

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} categories.", CategorySeedData.Categories.Count);
    }

    private static async Task SeedDestinationsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Destinations.AnyAsync()) return;

        var provinces = await context.Provinces.ToDictionaryAsync(p => p.Slug);
        var cities = await context.Cities.ToDictionaryAsync(c => c.Slug);
        var categories = await context.Categories.ToDictionaryAsync(c => c.Slug);

        foreach (var seed in TourismSeedData.Destinations)
        {
            if (!provinces.TryGetValue(seed.ProvinceSlug, out var province))
            {
                logger.LogWarning("Skipping destination '{Name}': unknown province slug '{Slug}'.", seed.Name, seed.ProvinceSlug);
                continue;
            }

            if (!categories.TryGetValue(seed.CategorySlug, out var category))
            {
                logger.LogWarning("Skipping destination '{Name}': unknown category slug '{Slug}'.", seed.Name, seed.CategorySlug);
                continue;
            }

            City? city = null;
            if (seed.CitySlug != null)
            {
                cities.TryGetValue(seed.CitySlug, out city);
            }

            context.Destinations.Add(new Destination
            {
                Slug = Slugify(seed.Name),
                Name = seed.Name,
                Description = seed.Description,
                ProvinceId = province.Id,
                District = city?.District,
                CityId = city?.Id,
                CategoryId = category.Id,
                DistanceFromKathmanduKm = seed.DistanceFromKathmanduKm,
                PhotoClass = seed.PhotoClass,
                Latitude = seed.Lat,
                Longitude = seed.Lng,
                Rating = 0,
                ReviewCount = 0,
                IsActive = true
            });
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} destinations.", TourismSeedData.Destinations.Count);
    }

    private static async Task SeedHotelsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Hotels.AnyAsync()) return;

        var destinations = await context.Destinations.ToDictionaryAsync(d => d.Name);
        var amenityCache = await context.Amenities.ToDictionaryAsync(a => a.Name);

        foreach (var seed in TourismSeedData.Hotels)
        {
            if (!destinations.TryGetValue(seed.DestinationName, out var destination))
            {
                logger.LogWarning("Skipping hotel '{Name}': unknown destination '{Destination}'.", seed.Name, seed.DestinationName);
                continue;
            }

            var hotel = new Hotel
            {
                Name = seed.Name,
                DestinationId = destination.Id,
                CityId = destination.CityId,
                ProvinceId = destination.ProvinceId,
                PricePerNightNpr = seed.PricePerNightNpr,
                AvailableRooms = seed.AvailableRooms,
                PhotoClass = seed.PhotoClass,
                Rating = 0,
                ReviewCount = 0,
                IsActive = true
            };

            foreach (var amenityName in seed.Amenities)
            {
                if (!amenityCache.TryGetValue(amenityName, out var amenity))
                {
                    amenity = new Amenity { Name = amenityName };
                    context.Amenities.Add(amenity);
                    amenityCache[amenityName] = amenity;
                }

                hotel.HotelAmenities.Add(new HotelAmenity { Amenity = amenity });
            }

            context.Hotels.Add(hotel);
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} hotels.", TourismSeedData.Hotels.Count);
    }

    private static async Task SeedTrekkingAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.TrekkingRegions.AnyAsync()) return;

        var provinces = await context.Provinces.ToDictionaryAsync(p => p.Slug);

        foreach (var seed in TourismSeedData.TrekkingRegions)
        {
            if (!provinces.TryGetValue(seed.ProvinceSlug, out var province))
            {
                logger.LogWarning("Skipping trekking region '{Name}': unknown province slug '{Slug}'.", seed.Name, seed.ProvinceSlug);
                continue;
            }

            context.TrekkingRegions.Add(new TrekkingRegion
            {
                Slug = seed.Slug,
                Name = seed.Name,
                Description = seed.Description,
                ProvinceId = province.Id,
                IsActive = true
            });
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} trekking regions.", TourismSeedData.TrekkingRegions.Count);

        var regions = await context.TrekkingRegions.ToDictionaryAsync(r => r.Slug);

        foreach (var seed in TourismSeedData.TrekkingRoutes)
        {
            if (!regions.TryGetValue(seed.RegionSlug, out var region))
            {
                logger.LogWarning("Skipping trekking route '{Name}': unknown region slug '{Slug}'.", seed.Name, seed.RegionSlug);
                continue;
            }

            if (!Enum.TryParse<TrekDifficulty>(seed.Difficulty, out var difficulty))
            {
                difficulty = TrekDifficulty.Moderate;
            }

            var route = new TrekkingRoute
            {
                Slug = Slugify(seed.Name),
                Name = seed.Name,
                Description = seed.Description,
                Difficulty = difficulty,
                MinDurationDays = seed.MinDays,
                MaxDurationDays = seed.MaxDays,
                BestSeason = seed.BestSeason,
                MaxAltitudeMeters = seed.MaxAltitudeM,
                TrekkingRegionId = region.Id,
                PhotoClass = seed.PhotoClass,
                IsActive = true
            };

            route.RequiredPermits = seed.Permits.Select(p => new TrekkingRoutePermit { PermitName = p }).ToList();
            route.Equipment = seed.Equipment.Select(e => new TrekkingRouteEquipment { ItemName = e }).ToList();

            context.TrekkingRoutes.Add(route);
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} trekking routes.", TourismSeedData.TrekkingRoutes.Count);
    }

    private static string Slugify(string value)
    {
        var lowered = value.Trim().ToLowerInvariant();
        var chars = lowered.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
        var collapsed = new string(chars);
        while (collapsed.Contains("--")) collapsed = collapsed.Replace("--", "-");
        return collapsed.Trim('-');
    }

    private static string GenerateRandomPassword()
    {
        // Guarantees at least one of each required character class so it
        // passes the same validator real registrations go through.
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        const string special = "!@#$%^&*";

        using var random = System.Security.Cryptography.RandomNumberGenerator.Create();
        char Pick(string set)
        {
            Span<byte> bytes = stackalloc byte[4];
            random.GetBytes(bytes);
            var index = (int)(BitConverter.ToUInt32(bytes) % (uint)set.Length);
            return set[index];
        }

        var all = upper + lower + digits + special;
        var passwordChars = new List<char> { Pick(upper), Pick(lower), Pick(digits), Pick(special) };
        for (var i = 0; i < 8; i++) passwordChars.Add(Pick(all));

        return new string(passwordChars.OrderBy(_ => Guid.NewGuid()).ToArray());
    }
}
