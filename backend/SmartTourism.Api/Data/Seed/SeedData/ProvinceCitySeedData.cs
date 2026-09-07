using SmartTourism.Api.Models.Geography;

namespace SmartTourism.Api.Data.Seed.SeedData;

/// <summary>
/// Nepal's seven provinces plus a representative set of cities in each, so
/// the Province -> City hierarchy is populated across the whole country
/// from first run, not just around Kathmandu.
/// </summary>
public static class ProvinceCitySeedData
{
    public record ProvinceSeed(string Slug, string Name, string Capital, string Description, List<CitySeed> Cities);
    public record CitySeed(string Slug, string Name, string District, decimal Lat, decimal Lng);

    public static List<ProvinceSeed> Provinces => new()
    {
        new("koshi", "Koshi Province", "Biratnagar",
            "Home to Mount Everest and the Kanchenjunga range, Koshi spans from the high Himalayas to the eastern Terai plains.",
            new()
            {
                new("biratnagar", "Biratnagar", "Morang", 26.4525m, 87.2718m),
                new("dharan", "Dharan", "Sunsari", 26.8121m, 87.2836m),
                new("ilam", "Ilam", "Ilam", 26.9088m, 87.9260m),
                new("namche-bazaar", "Namche Bazaar", "Solukhumbu", 27.8069m, 86.7141m)
            }),
        new("madhesh", "Madhesh Province", "Janakpur",
            "The fertile plains of the central Terai, birthplace of Sita and home to the historic Janaki Mandir.",
            new()
            {
                new("janakpur", "Janakpur", "Dhanusha", 26.7288m, 85.9266m),
                new("birgunj", "Birgunj", "Parsa", 27.0104m, 84.8770m),
                new("rajbiraj", "Rajbiraj", "Saptari", 26.5414m, 86.7462m)
            }),
        new("bagmati", "Bagmati Province", "Hetauda",
            "Nepal's most visited province, home to the Kathmandu Valley's UNESCO heritage sites and the gateway to Langtang.",
            new()
            {
                new("kathmandu", "Kathmandu", "Kathmandu", 27.7172m, 85.3240m),
                new("bhaktapur", "Bhaktapur", "Bhaktapur", 27.6710m, 85.4298m),
                new("patan", "Patan (Lalitpur)", "Lalitpur", 27.6588m, 85.3247m),
                new("hetauda", "Hetauda", "Makwanpur", 27.4287m, 85.0325m),
                new("dhulikhel", "Dhulikhel", "Kavrepalanchok", 27.6203m, 85.5504m)
            }),
        new("gandaki", "Gandaki Province", "Pokhara",
            "Anchored by Pokhara and the Annapurna range, Gandaki is Nepal's trekking and adventure-tourism heartland.",
            new()
            {
                new("pokhara", "Pokhara", "Kaski", 28.2096m, 83.9856m),
                new("gorkha", "Gorkha", "Gorkha", 28.0002m, 84.6333m),
                new("besisahar", "Besisahar", "Lamjung", 28.2333m, 84.3667m),
                new("jomsom", "Jomsom", "Mustang", 28.7810m, 83.7233m)
            }),
        new("lumbini", "Lumbini Province", "Deukhuri",
            "The birthplace of Lord Buddha, blending ancient Buddhist heritage with the mid-western Terai and hill trails.",
            new()
            {
                new("lumbini-bazar", "Lumbini Bazaar", "Rupandehi", 27.4833m, 83.2761m),
                new("butwal", "Butwal", "Rupandehi", 27.7000m, 83.4486m),
                new("tansen", "Tansen", "Palpa", 27.8667m, 83.5500m)
            }),
        new("karnali", "Karnali Province", "Birendranagar",
            "Nepal's largest and least-explored province, home to Rara Lake and remote high-Himalayan trekking regions.",
            new()
            {
                new("birendranagar", "Birendranagar (Surkhet)", "Surkhet", 28.6019m, 81.6172m),
                new("jumla", "Jumla", "Jumla", 29.2747m, 82.1838m),
                new("rara", "Rara", "Mugu", 29.5233m, 82.0850m)
            }),
        new("sudurpashchim", "Sudurpashchim Province", "Godawari",
            "Nepal's far-western province, featuring Khaptad National Park, Dhangadhi's plains, and remote Himalayan valleys.",
            new()
            {
                new("dhangadhi", "Dhangadhi", "Kailali", 28.6939m, 80.5877m),
                new("mahendranagar", "Mahendranagar", "Kanchanpur", 28.9647m, 80.1785m),
                new("khaptad", "Khaptad", "Bajhang", 29.3667m, 81.2000m)
            })
    };
}
