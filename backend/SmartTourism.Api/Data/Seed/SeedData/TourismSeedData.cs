namespace SmartTourism.Api.Data.Seed.SeedData;

/// <summary>
/// A representative slice of tourism content across all seven provinces —
/// enough to prove out every relationship in the schema end-to-end. Not
/// exhaustive; intended as a seed to build on, not the final content set.
/// </summary>
public static class TourismSeedData
{
    public record DestinationSeed(string Name, string ProvinceSlug, string? CitySlug, string CategorySlug, string Description, decimal DistanceFromKathmanduKm, string PhotoClass, decimal Lat, decimal Lng);
    public record HotelSeed(string Name, string DestinationName, decimal PricePerNightNpr, int AvailableRooms, string PhotoClass, List<string> Amenities);
    public record TrekkingRegionSeed(string Slug, string Name, string ProvinceSlug, string Description);
    public record TrekkingRouteSeed(string Name, string RegionSlug, string Difficulty, int MinDays, int MaxDays, string BestSeason, int MaxAltitudeM, string Description, string PhotoClass, List<string> Permits, List<string> Equipment);

    public static List<DestinationSeed> Destinations => new()
    {
        // Bagmati
        new("Kathmandu Durbar Square", "bagmati", "kathmandu", "heritage",
            "A UNESCO World Heritage plaza of ancient palaces, courtyards, and temples at the historic heart of Kathmandu.",
            0, "photo-heritage-1", 27.7040m, 85.3070m),
        new("Swayambhunath (Monkey Temple)", "bagmati", "kathmandu", "religious",
            "A hilltop Buddhist stupa overlooking the Kathmandu Valley, one of the oldest religious sites in Nepal.",
            3, "photo-religious-1", 27.7149m, 85.2903m),
        new("Bhaktapur Durbar Square", "bagmati", "bhaktapur", "heritage",
            "A remarkably preserved medieval Newar city famous for its pottery square, temples, and wood carvings.",
            13, "photo-heritage-2", 27.6725m, 85.4278m),
        new("Nagarkot Sunrise Point", "bagmati", "dhulikhel", "nature",
            "A ridge-top viewpoint east of Kathmandu famous for sweeping Himalayan sunrise views, including Everest on clear days.",
            32, "photo-nature-1", 27.7172m, 85.5199m),

        // Gandaki
        new("Phewa Lake", "gandaki", "pokhara", "lakes",
            "Pokhara's serene lake with mirror reflections of the Annapurna range, popular for boating and lakeside cafes.",
            200, "photo-lakes-1", 28.2096m, 83.9560m),
        new("World Peace Pagoda", "gandaki", "pokhara", "religious",
            "A hilltop Buddhist stupa above Phewa Lake offering panoramic views of Pokhara and the Annapurnas.",
            203, "photo-religious-2", 28.1928m, 83.9435m),
        new("Poon Hill", "gandaki", "besisahar", "trekking",
            "A classic short trek to a 3,210m viewpoint renowned for sunrise panoramas over the Annapurna and Dhaulagiri ranges.",
            210, "photo-trekking-1", 28.3990m, 83.6997m),

        // Koshi
        new("Everest Base Camp Viewpoint", "koshi", "namche-bazaar", "trekking",
            "The legendary trail through Sherpa villages to the foot of the world's highest mountain.",
            140, "photo-trekking-2", 27.9881m, 86.8250m),
        new("Ilam Tea Gardens", "koshi", "ilam", "nature",
            "Rolling hillside tea estates in Nepal's tea capital, with cool weather and sweeping green vistas.",
            400, "photo-nature-2", 26.9088m, 87.9260m),

        // Lumbini
        new("Lumbini - Birthplace of Buddha", "lumbini", "lumbini-bazar", "religious",
            "A UNESCO World Heritage sacred garden marking the birthplace of Siddhartha Gautama, the Buddha.",
            280, "photo-religious-3", 27.4833m, 83.2761m),
        new("Tansen Hill Town", "lumbini", "tansen", "heritage",
            "A hillside Newar trading town with cobblestone streets, palace ruins, and views over the Kali Gandaki valley.",
            270, "photo-heritage-3", 27.8667m, 83.5500m),

        // Madhesh
        new("Janaki Mandir", "madhesh", "janakpur", "religious",
            "A striking white Koirala-style temple honoring Goddess Sita, one of the largest temples in Nepal.",
            300, "photo-religious-4", 26.7288m, 85.9266m),

        // Karnali
        new("Rara Lake", "karnali", "rara", "lakes",
            "Nepal's largest lake, set in remote Rara National Park and ringed by pine forest and snow peaks.",
            480, "photo-lakes-2", 29.5233m, 82.0850m),

        // Sudurpashchim
        new("Khaptad National Park", "sudurpashchim", "khaptad", "nature",
            "A high-altitude plateau of meadows, forest, and sacred sites, home to rare wildlife and panoramic Himalayan views.",
            550, "photo-nature-3", 29.3667m, 81.2000m)
    };

    public static List<HotelSeed> Hotels => new()
    {
        new("Hotel Yak & Yeti", "Kathmandu Durbar Square", 12000, 40, "photo-hotel-1", new() { "Free WiFi", "Pool", "Spa", "Restaurant", "Airport Shuttle" }),
        new("Kathmandu Heritage Inn", "Kathmandu Durbar Square", 4500, 20, "photo-hotel-2", new() { "Free WiFi", "Restaurant" }),
        new("Bhaktapur Heritage Home", "Bhaktapur Durbar Square", 3800, 15, "photo-hotel-3", new() { "Free WiFi", "Rooftop Terrace" }),
        new("Fish Tail Lodge", "Phewa Lake", 9500, 30, "photo-hotel-4", new() { "Free WiFi", "Lake View", "Restaurant", "Boating" }),
        new("Pokhara Lakeside Resort", "Phewa Lake", 6000, 25, "photo-hotel-5", new() { "Free WiFi", "Pool", "Lake View" }),
        new("Nagarkot Mountain Resort", "Nagarkot Sunrise Point", 5500, 18, "photo-hotel-6", new() { "Free WiFi", "Mountain View", "Restaurant" }),
        new("Lumbini Buddha Garden Hotel", "Lumbini - Birthplace of Buddha", 4200, 22, "photo-hotel-7", new() { "Free WiFi", "Garden", "Restaurant" })
    };

    public static List<TrekkingRegionSeed> TrekkingRegions => new()
    {
        new("khumbu", "Khumbu (Everest) Region", "koshi", "Home to Everest Base Camp and the Sherpa heartland of the high Himalayas."),
        new("annapurna", "Annapurna Region", "gandaki", "Nepal's most popular trekking region, ranging from Poon Hill day hikes to the full Annapurna Circuit."),
        new("langtang", "Langtang Region", "bagmati", "A quieter Himalayan region close to Kathmandu, known for glacial valleys and Tamang culture."),
        new("rara-humla", "Rara-Humla Region", "karnali", "Remote far-western trails around Rara Lake and the high trans-Himalayan Humla valley.")
    };

    public static List<TrekkingRouteSeed> TrekkingRoutes => new()
    {
        new("Everest Base Camp Trek", "khumbu", "Hard", 12, 16, "Mar-May, Sep-Nov", 5364,
            "The classic trek through Namche Bazaar, Tengboche, and Gorak Shep to the foot of Mount Everest.",
            "photo-trek-1",
            new() { "Sagarmatha National Park Permit", "Khumbu Pasang Lhamu Rural Municipality Entry Permit" },
            new() { "Down jacket", "Trekking poles", "Sleeping bag (-15°C)", "Headlamp", "Water purification tablets" }),
        new("Annapurna Base Camp Trek", "annapurna", "Moderate", 7, 12, "Mar-May, Sep-Nov", 4130,
            "A varied trek through rhododendron forest and Gurung villages into the Annapurna Sanctuary.",
            "photo-trek-2",
            new() { "ACAP Permit", "TIMS Card" },
            new() { "Trekking poles", "Rain jacket", "Sleeping bag (-5°C)", "Trekking boots" }),
        new("Poon Hill Trek", "annapurna", "Easy", 3, 5, "Oct-Mar", 3210,
            "A short, family-friendly trek to a famous Himalayan sunrise viewpoint above Ghorepani.",
            "photo-trek-3",
            new() { "ACAP Permit", "TIMS Card" },
            new() { "Comfortable hiking shoes", "Light rain jacket" }),
        new("Langtang Valley Trek", "langtang", "Moderate", 7, 10, "Mar-May, Sep-Dec", 3870,
            "A scenic valley trek close to Kathmandu, passing yak pastures, glaciers, and Tamang villages.",
            "photo-trek-4",
            new() { "Langtang National Park Permit", "TIMS Card" },
            new() { "Trekking poles", "Warm layers", "Sleeping bag (-10°C)" })
    };
}
