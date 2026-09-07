import type { City } from "../types/city";

// Coordinates are town-centre approximations (a few hundred metres of
// drift), not surveyed points — good enough for map pins and province/city
// grouping, not for turn-by-turn navigation. Expand this list as more
// destinations, hotels, and treks are added; every new record should
// reference one of these city ids rather than a bare province name.
export const cities: City[] = [
  // ---- Koshi ----
  { id: "ilam", name: "Ilam", provinceId: "koshi", district: "Ilam", description: "Hill town at the centre of Nepal's tea-growing country.", lat: 26.9083, lng: 87.928 },
  { id: "dharan", name: "Dharan", provinceId: "koshi", district: "Sunsari", description: "Foothill city and gateway to the eastern hills.", lat: 26.8065, lng: 87.2846 },
  { id: "biratnagar", name: "Biratnagar", provinceId: "koshi", district: "Morang", description: "Koshi Province's capital and largest city in the eastern Terai.", lat: 26.4525, lng: 87.2718 },
  { id: "dhankuta", name: "Dhankuta", provinceId: "koshi", district: "Dhankuta", description: "Terraced hill town known for orange orchards.", lat: 26.9847, lng: 87.3372 },
  { id: "hile", name: "Hile", provinceId: "koshi", district: "Dhankuta", description: "Bazaar town and trailhead for eastern hill treks.", lat: 27.05, lng: 87.35 },
  { id: "lukla", name: "Lukla", provinceId: "koshi", district: "Solukhumbu", description: "Airstrip town and gateway to the Everest region.", lat: 27.6869, lng: 86.7314 },
  { id: "namche-bazaar", name: "Namche Bazaar", provinceId: "koshi", district: "Solukhumbu", description: "Sherpa trading hub and acclimatisation stop on the way to Everest.", lat: 27.8069, lng: 86.7141 },
  { id: "taplejung", name: "Taplejung", provinceId: "koshi", district: "Taplejung", description: "District headquarters and gateway to the Kanchenjunga region.", lat: 27.35, lng: 87.6667 },
  { id: "basantapur", name: "Basantapur", provinceId: "koshi", district: "Terhathum", description: "Ridge-top bazaar and trailhead for treks toward Kanchenjunga.", lat: 27.207, lng: 87.617 },
  { id: "koshi-tappu", name: "Koshi Tappu", provinceId: "koshi", district: "Sunsari", description: "Wetland gateway village for the Koshi Tappu Wildlife Reserve.", lat: 26.65, lng: 86.9333 },

  // ---- Madhesh ----
  { id: "janakpur", name: "Janakpur", provinceId: "madhesh", district: "Dhanusha", description: "Madhesh Province's capital, centred on the Janaki Mandir.", lat: 26.7288, lng: 85.9266 },
  { id: "birgunj", name: "Birgunj", provinceId: "madhesh", district: "Parsa", description: "Major border-crossing city and trade hub.", lat: 27.0104, lng: 84.8821 },
  { id: "rajbiraj", name: "Rajbiraj", provinceId: "madhesh", district: "Saptari", description: "District headquarters town in the eastern Terai.", lat: 26.5389, lng: 86.75 },
  { id: "simraungadh", name: "Simraungadh", provinceId: "madhesh", district: "Bara", description: "Site of the ruined medieval Simraungadh fort and capital.", lat: 27.15, lng: 85.1167 },
  { id: "dhanushadham", name: "Dhanushadham", provinceId: "madhesh", district: "Dhanusha", description: "Pilgrimage site associated with the Ramayana, near Janakpur.", lat: 26.85, lng: 86.0167 },

  // ---- Bagmati ----
  { id: "kathmandu", name: "Kathmandu", provinceId: "bagmati", district: "Kathmandu", description: "Nepal's capital, centred on the Kathmandu Durbar Square.", lat: 27.7172, lng: 85.324 },
  { id: "lalitpur", name: "Lalitpur (Patan)", provinceId: "bagmati", district: "Lalitpur", description: "Ancient Newar city known for craftsmanship and Patan Durbar Square.", lat: 27.6588, lng: 85.3247 },
  { id: "bhaktapur", name: "Bhaktapur", provinceId: "bagmati", district: "Bhaktapur", description: "Medieval pottery and pagoda-temple town in the Kathmandu Valley.", lat: 27.671, lng: 85.4298 },
  { id: "nagarkot", name: "Nagarkot", provinceId: "bagmati", district: "Bhaktapur", description: "Hill station on the valley rim, known for Himalayan sunrises.", lat: 27.7172, lng: 85.5205 },
  { id: "dhulikhel", name: "Dhulikhel", provinceId: "bagmati", district: "Kavrepalanchok", description: "Quiet hill town with wide mountain panoramas.", lat: 27.6206, lng: 85.5482 },
  { id: "chitlang", name: "Chitlang", provinceId: "bagmati", district: "Makwanpur", description: "Terraced valley village on an old trade route south of Kathmandu.", lat: 27.5833, lng: 85.1333 },
  { id: "sauraha", name: "Sauraha (Chitwan)", provinceId: "bagmati", district: "Chitwan", description: "Gateway village for Chitwan National Park safaris.", lat: 27.5766, lng: 84.5013 },
  { id: "langtang", name: "Langtang Valley", provinceId: "bagmati", district: "Rasuwa", description: "Glacial valley trekking region north of Kathmandu.", lat: 28.21, lng: 85.52 },
  { id: "hetauda", name: "Hetauda", provinceId: "bagmati", district: "Makwanpur", description: "Bagmati Province's capital, in the inner Terai.", lat: 27.4287, lng: 85.0322 },
  { id: "shivapuri", name: "Shivapuri", provinceId: "bagmati", district: "Kathmandu", description: "Forested national park ridge on Kathmandu Valley's northern rim.", lat: 27.8167, lng: 85.4 },

  // ---- Gandaki ----
  { id: "pokhara", name: "Pokhara", provinceId: "gandaki", district: "Kaski", description: "Gandaki Province's capital, on the shore of Phewa Lake.", lat: 28.2096, lng: 83.9856 },
  { id: "bandipur", name: "Bandipur", provinceId: "gandaki", district: "Tanahun", description: "Preserved Newar hilltop trading town.", lat: 27.9333, lng: 84.4167 },
  { id: "ghandruk", name: "Ghandruk", provinceId: "gandaki", district: "Kaski", description: "Gurung village with close-up views of Annapurna South.", lat: 28.3771, lng: 83.8125 },
  { id: "manang", name: "Manang", provinceId: "gandaki", district: "Manang", description: "High-valley village on the Annapurna Circuit.", lat: 28.6667, lng: 84.0167 },
  { id: "jomsom", name: "Jomsom", provinceId: "gandaki", district: "Mustang", description: "Windswept trade town and gateway to Upper Mustang.", lat: 28.781, lng: 83.724 },
  { id: "besisahar", name: "Besisahar", provinceId: "gandaki", district: "Lamjung", description: "Roadhead and traditional starting point of the Annapurna Circuit.", lat: 28.2333, lng: 84.3667 },

  // ---- Lumbini ----
  { id: "lumbini", name: "Lumbini", provinceId: "lumbini", district: "Rupandehi", description: "Birthplace of the Buddha, a UNESCO World Heritage Site.", lat: 27.4833, lng: 83.2767 },
  { id: "butwal", name: "Butwal", provinceId: "lumbini", district: "Rupandehi", description: "Fast-growing commercial hub at the edge of the Terai.", lat: 27.7, lng: 83.45 },
  { id: "tansen", name: "Tansen", provinceId: "lumbini", district: "Palpa", description: "Hilltop Newari town with palaces and long valley views.", lat: 27.8667, lng: 83.55 },
  { id: "nepalgunj", name: "Nepalgunj", provinceId: "lumbini", district: "Banke", description: "Mid-western Terai trade city near the Indian border.", lat: 28.05, lng: 81.6167 },
  { id: "bardiya", name: "Bardiya (Thakurdwara)", provinceId: "lumbini", district: "Bardiya", description: "Gateway village for Bardiya National Park.", lat: 28.3833, lng: 81.3167 },

  // ---- Karnali ----
  { id: "jumla", name: "Jumla", provinceId: "karnali", district: "Jumla", description: "Remote district headquarters in the Karnali highlands.", lat: 29.2747, lng: 82.1838 },
  { id: "rara", name: "Rara", provinceId: "karnali", district: "Mugu", description: "Village on the shore of Rara Lake, Nepal's largest lake.", lat: 29.5333, lng: 82.0833 },
  { id: "dunai", name: "Dunai (Dolpo)", provinceId: "karnali", district: "Dolpa", description: "Headquarters town for the remote Dolpo region.", lat: 29.173, lng: 82.928 },
  { id: "simikot", name: "Simikot", provinceId: "karnali", district: "Humla", description: "Airstrip town and gateway to Humla and Mount Kailash routes.", lat: 29.97, lng: 81.82 },
  { id: "birendranagar", name: "Birendranagar (Surkhet)", provinceId: "karnali", district: "Surkhet", description: "Karnali Province's capital, in a mid-hill valley.", lat: 28.6, lng: 81.6167 },
  { id: "badimalika", name: "Badimalika", provinceId: "karnali", district: "Bajura", description: "High-altitude Hindu pilgrimage temple in the Karnali hills.", lat: 29.5833, lng: 81.3667 },

  // ---- Sudurpashchim ----
  { id: "dhangadhi", name: "Dhangadhi", provinceId: "sudurpashchim", district: "Kailali", description: "Largest city in the far west, near Shuklaphanta.", lat: 28.6833, lng: 80.6 },
  { id: "mahendranagar", name: "Mahendranagar (Bhimdatta)", provinceId: "sudurpashchim", district: "Kanchanpur", description: "Border city and gateway to the far-western Terai.", lat: 28.9647, lng: 80.1786 },
  { id: "silgadhi", name: "Silgadhi", provinceId: "sudurpashchim", district: "Doti", description: "Hill town and access point for Khaptad National Park.", lat: 29.2667, lng: 80.9833 },
  { id: "dadeldhura", name: "Dadeldhura", provinceId: "sudurpashchim", district: "Dadeldhura", description: "Ridge-top district headquarters near Api Himal viewpoints.", lat: 29.3, lng: 80.5833 },
  { id: "shuklaphanta", name: "Shuklaphanta", provinceId: "sudurpashchim", district: "Kanchanpur", description: "Grassland national park near the far-western border, known for swamp deer.", lat: 28.85, lng: 80.1667 },
  { id: "darchula", name: "Darchula", provinceId: "sudurpashchim", district: "Darchula", description: "Remote border district headquarters below Api Himal.", lat: 29.85, lng: 80.55 },
];

export function getCitiesByProvince(provinceId: string): City[] {
  return cities.filter((c) => c.provinceId === provinceId);
}

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}
