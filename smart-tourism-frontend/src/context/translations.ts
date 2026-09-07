// Multi-language support (English + Nepali). Per the FRD's scope table
// (section 4.1), "Multi-language support beyond English and Nepali" is
// listed as OUT of scope, which implies English + Nepali support itself
// IS in scope for this phase.
//
// SCOPE NOTE: this covers the primary site chrome. Navbar, Footer, and
// the Home page's marketing copy. As a genuinely working, persisted
// toggle. It does not yet cover every string on every page (forms,
// dashboard, admin, etc.); translating the full site is a larger content
// task best done incrementally by adding more keys to TRANSLATIONS below.

export type Language = "en" | "ne";

export const TRANSLATIONS = {
  en: {
    navDestinations: "Destinations",
    navHotels: "Hotels",
    navTreks: "Treks",
    navTripPlanner: "AI Trip Planner",
    navHeritage: "Heritage",
    navMap: "Map",
    navSignIn: "Sign in",
    navGetStarted: "Get started",

    heroEyebrow: "AI-Powered Trip Planning",
    heroTitle: "Plan Nepal, one conversation at a time.",
    heroSubtitle:
      "Tell Yatra your dates, budget, and interests — get a weather-aware itinerary with hotels, treks, and permits sorted, in minutes instead of days.",
    heroSearchPlaceholder: "Where in Nepal are you headed?",
    heroSearchButton: "Search",

    featuredEyebrow: "Featured Destinations",
    featuredTitle: "Explore places across Nepal.",

    treksEyebrow: "Popular Treks",
    treksTitle: "Matched to your fitness level and season.",

    heritageEyebrow: "Cultural Heritage Hub",
    heritageTitle: "Seven UNESCO World Heritage Sites, explained.",
    heritageLink: "Visit the full Heritage Hub →",

    ctaTitle: "Ready to build your itinerary?",
    ctaButton: "Create your free account",

    footerTagline: "AI-powered trip planning for Nepal.",
    footerExplore: "Explore",
    footerCompany: "Company",
    footerFollow: "Follow",
    footerAbout: "About",
    footerSupport: "Support",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerCopyright: "© 2026 Yatra — Smart Tourism for Nepal",
  },
  ne: {
    navDestinations: "गन्तव्यहरू",
    navHotels: "होटलहरू",
    navTreks: "पदयात्रा",
    navTripPlanner: "एआई यात्रा योजनाकार",
    navHeritage: "सम्पदा",
    navMap: "नक्सा",
    navSignIn: "साइन इन",
    navGetStarted: "सुरु गर्नुहोस्",

    heroEyebrow: "एआई-संचालित यात्रा योजना",
    heroTitle: "नेपाल घुम्नुहोस्, एक कुराकानीमा।",
    heroSubtitle:
      "यात्रालाई आफ्नो मिति, बजेट, र रुचिहरू बताउनुहोस् — मौसम अनुसार योजना, होटल, पदयात्रा र अनुमतिपत्र मिनेटमै तयार हुनेछ।",
    heroSearchPlaceholder: "नेपालमा कहाँ जाँदै हुनुहुन्छ?",
    heroSearchButton: "खोज्नुहोस्",

    featuredEyebrow: "प्रमुख गन्तव्यहरू",
    featuredTitle: "नेपालभरका ठाउँहरू अन्वेषण गर्नुहोस्।",

    treksEyebrow: "लोकप्रिय पदयात्राहरू",
    treksTitle: "तपाईंको फिटनेस स्तर र मौसम अनुसार।",

    heritageEyebrow: "सांस्कृतिक सम्पदा केन्द्र",
    heritageTitle: "सात विश्व सम्पदा क्षेत्र, विस्तृत विवरणसहित।",
    heritageLink: "पूर्ण सम्पदा केन्द्र हेर्नुहोस् →",

    ctaTitle: "आफ्नो यात्रा योजना बनाउन तयार हुनुहुन्छ?",
    ctaButton: "निःशुल्क खाता बनाउनुहोस्",

    footerTagline: "नेपालको लागि एआई-संचालित यात्रा योजना।",
    footerExplore: "अन्वेषण गर्नुहोस्",
    footerCompany: "कम्पनी",
    footerFollow: "फलो गर्नुहोस्",
    footerAbout: "हाम्रोबारे",
    footerSupport: "सहयोग",
    footerPrivacy: "गोपनीयता नीति",
    footerTerms: "सेवाका सर्तहरू",
    footerCopyright: "© २०२६ यात्रा — नेपालको स्मार्ट पर्यटन",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
