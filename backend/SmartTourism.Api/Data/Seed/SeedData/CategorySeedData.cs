namespace SmartTourism.Api.Data.Seed.SeedData;

/// <summary>Destination categories, matching the frontend's category filter chips.</summary>
public static class CategorySeedData
{
    public record CategorySeed(string Slug, string Label, string Icon);

    public static List<CategorySeed> Categories => new()
    {
        new("nature", "Nature & Wildlife", "🌿"),
        new("heritage", "Heritage & Culture", "🏛️"),
        new("trekking", "Trekking & Adventure", "🥾"),
        new("lakes", "Lakes & Rivers", "🏞️"),
        new("religious", "Religious Sites", "🛕"),
        new("adventure-sports", "Adventure Sports", "🪂"),
        new("wellness", "Wellness & Retreats", "🧘")
    };
}
