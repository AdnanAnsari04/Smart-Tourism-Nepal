export type HeritageEntry = {
  id: string;
  name: string;
  province: string;
  type: string;
  context: string;
  visit: string;
  tone: string;
};

// Frontend editorial content; verify opening hours and local guidance before launch.
export const heritageSites: HeritageEntry[] = [
  { id: "h1", name: "Kathmandu Durbar Square", province: "Bagmati", type: "Palace square", context: "A historic urban centre with palace courtyards, living shrines, and Newar architectural detail.", visit: "Walk with a local cultural guide; ask before photographing ceremonies.", tone: "coral" },
  { id: "h2", name: "Patan Durbar Square", province: "Bagmati", type: "Craft and architecture", context: "Known for courtyards, metalwork traditions, and carefully carved temple structures.", visit: "Pair the square with a visit to a local craft workshop.", tone: "gold" },
  { id: "h3", name: "Bhaktapur Durbar Square", province: "Bagmati", type: "Historic city", context: "A pedestrian-friendly historic city shaped by pottery, woodcarving, and pagoda architecture.", visit: "Allow half a day and keep clear of active religious spaces.", tone: "blue" },
  { id: "h4", name: "Pashupatinath Temple", province: "Bagmati", type: "Sacred riverside site", context: "A major Hindu pilgrimage complex on the Bagmati River with distinct visitor boundaries.", visit: "Dress modestly; non-Hindu visitors should follow marked viewing areas.", tone: "coral" },
  { id: "h5", name: "Boudhanath Stupa", province: "Bagmati", type: "Buddhist heritage", context: "A living Buddhist neighbourhood where monasteries, shops, and daily practice meet.", visit: "Walk clockwise around the stupa and keep voices low.", tone: "gold" },
  { id: "h6", name: "Swayambhunath", province: "Bagmati", type: "Hilltop stupa", context: "A long-standing hilltop Buddhist site overlooking Kathmandu Valley.", visit: "Use the steps carefully and avoid blocking worshippers.", tone: "blue" },
  { id: "h7", name: "Kirtipur", province: "Bagmati", type: "Newar town", context: "A hill town of brick lanes, old courtyards, temples, and active community life.", visit: "Explore on foot with time for local food and neighbourhood quiet.", tone: "green" },
  { id: "h8", name: "Nuwakot Durbar", province: "Bagmati", type: "Hill palace", context: "A historic ridge settlement overlooking the Trishuli corridor and surrounding hills.", visit: "Confirm access locally and allow time for the road journey.", tone: "gold" },
  { id: "h9", name: "Janaki Mandir", province: "Madhesh", type: "Pilgrimage architecture", context: "An important Mithila cultural landmark in Janakpur, closely connected with local devotional life.", visit: "Wear respectful clothing and follow photography guidance inside sacred areas.", tone: "coral" },
  { id: "h10", name: "Mithila Art Centre", province: "Madhesh", type: "Living craft", context: "A place to learn about Mithila painting and the artists carrying the tradition forward.", visit: "Buy directly from artists where possible and ask about the work's story.", tone: "gold" },
  { id: "h11", name: "Lumbini Sacred Garden", province: "Lumbini", type: "World heritage", context: "A pilgrimage landscape associated with the birthplace of Siddhartha Gautama.", visit: "Keep the garden quiet and follow monastery and temple etiquette.", tone: "green" },
  { id: "h12", name: "Tilaurakot", province: "Lumbini", type: "Archaeological site", context: "An archaeological landscape linked with the ancient Shakya kingdom near Lumbini.", visit: "Stay on marked paths and treat excavated areas as protected heritage.", tone: "blue" },
  { id: "h13", name: "Tansen Bazaar", province: "Lumbini", type: "Hill town", context: "A historic hill settlement with Newar-influenced streets, metal craft, and local trade.", visit: "Walk slowly through the bazaar and support small local shops.", tone: "gold" },
  { id: "h14", name: "Rani Mahal", province: "Lumbini", type: "Riverside palace", context: "A riverside palace setting on the Kali Gandaki with a layered local history.", visit: "Check road and weather conditions before travelling.", tone: "coral" },
  { id: "h15", name: "Pokhara Old Bazaar", province: "Gandaki", type: "Trading quarter", context: "A historic market area reflecting Pokhara's older commercial and cultural life.", visit: "Combine the walk with local food and nearby community businesses.", tone: "blue" },
  { id: "h16", name: "Gorkha Durbar", province: "Gandaki", type: "Hill palace", context: "A ridge-top palace and cultural landscape above the historic Gorkha area.", visit: "Wear sturdy shoes and take time with the uphill route.", tone: "gold" },
  { id: "h17", name: "Manakamana Temple", province: "Gandaki", type: "Pilgrimage site", context: "A major hill pilgrimage destination reached through a dramatic landscape.", visit: "Follow queue and temple photography rules; keep the visit unhurried.", tone: "coral" },
  { id: "h18", name: "Muktinath", province: "Gandaki", type: "Sacred landscape", context: "A high-altitude pilgrimage area shared by Hindu and Buddhist traditions.", visit: "Prepare for altitude and respect both traditions represented here.", tone: "green" },
  { id: "h19", name: "Kagbeni", province: "Gandaki", type: "Trans-Himalayan settlement", context: "An old settlement of stone lanes, courtyards, and mountain trade routes.", visit: "Ask permission before entering monasteries or photographing residents.", tone: "blue" },
  { id: "h20", name: "Ilam Tea Gardens", province: "Koshi", type: "Agricultural culture", context: "Tea-growing landscapes shaped by local farming knowledge and eastern hill communities.", visit: "Choose a farm visit that pays local hosts directly.", tone: "green" },
  { id: "h21", name: "Halesi Maratika", province: "Koshi", type: "Pilgrimage landscape", context: "A cave and hill pilgrimage setting important across Hindu and Buddhist communities.", visit: "Follow site-specific guidance and dress for a respectful visit.", tone: "gold" },
  { id: "h22", name: "Baraha Kshetra", province: "Koshi", type: "Riverside pilgrimage", context: "A sacred confluence landscape in the eastern hills and Terai transition.", visit: "Keep riverbanks clean and ask local custodians about access.", tone: "coral" },
  { id: "h23", name: "Panchthar Limbu Heritage Trails", province: "Koshi", type: "Community heritage", context: "Village landscapes where Limbu language, food, craft, and hospitality remain part of daily life.", visit: "Use a local host and learn from community-led interpretation.", tone: "green" },
  { id: "h24", name: "Sinja Valley", province: "Karnali", type: "Archaeological landscape", context: "A remote valley associated with the historic Khasa civilisation and early Nepali language history.", visit: "Travel with a local guide and plan carefully for remote conditions.", tone: "blue" },
  { id: "h25", name: "Rara Cultural Landscape", province: "Karnali", type: "Landscape heritage", context: "Lake, forest, and mountain communities form a living cultural landscape beyond the viewpoint.", visit: "Carry waste out and use locally run stays and guides.", tone: "green" },
  { id: "h26", name: "Shey Gompa", province: "Karnali", type: "Buddhist monastery", context: "A high mountain monastery landscape connected with the cultural life of Upper Dolpo.", visit: "Confirm seasonal access and follow monastery customs.", tone: "gold" },
  { id: "h27", name: "Kakre Vihar", province: "Karnali", type: "Buddhist ruins", context: "A forested archaeological and religious site near Surkhet with carved remains.", visit: "Protect the ruins and avoid removing stones or artefacts.", tone: "coral" },
  { id: "h28", name: "Khaptad Ashram", province: "Sudurpashchim", type: "Spiritual landscape", context: "A quiet highland setting associated with the former ashram of Khaptad Baba.", visit: "Keep the meadows quiet and follow park conservation rules.", tone: "green" },
  { id: "h29", name: "Ugratara Temple", province: "Sudurpashchim", type: "Temple heritage", context: "A respected cultural site in Dadeldhura connected with local community life.", visit: "Ask custodians about appropriate visitor areas and photography.", tone: "coral" },
  { id: "h30", name: "Dodhara Chandani", province: "Sudurpashchim", type: "River culture", context: "Far-western river landscapes and communities shaped by movement, farming, and trade.", visit: "Use local transport and respect private homes and working areas.", tone: "blue" },
];
