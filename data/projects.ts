import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "cleandasma",
    title: "CleanDasma",
    category: "Mobile Application",
    summary:
      "A hybrid waste management application for the City of Dasmariñas, Cavite, with GPS truck tracking, route planning, and collection updates for residents.",
    description:
      "A hybrid waste management application for the City of Dasmariñas, Cavite, with GPS truck tracking, route planning, and collection updates for residents.",
    tags: ["Flutter", "Firebase", "Mobile App"],
    githubUrl: "https://github.com/Russsz/CleanDasma",
    liveUrl: "https://cleandasma.org",
    thumbnail: "/projects/cleandasma/home.webp",
    screenshotFrame: "phone",
    gallery: [
      { src: "/projects/cleandasma/home.webp", alt: "CleanDasma home screen with the community welcome banner and next collection", caption: "Home" },
      { src: "/projects/cleandasma/splash.webp", alt: "CleanDasma splash screen with the app logo and city tagline", caption: "Splash" },
      { src: "/projects/cleandasma/schedule.webp", alt: "Collection Schedule screen with live truck status and waste sorting guide", caption: "Schedule" },
      { src: "/projects/cleandasma/alerts.webp", alt: "Notifications screen with summary and push notification settings", caption: "Alerts" },
      { src: "/projects/cleandasma/eco-tips.webp", alt: "Eco Tips screen with saved tips, progress and a compost pit guide", caption: "Eco Tips" },
      { src: "/projects/cleandasma/community.webp", alt: "Community Hub screen with household stats and announcements", caption: "Community" },
    ],
    role: "Group leader",
    overview:
      "Hybrid waste management system built as a capstone project for the City of Dasmariñas, in coordination with CENRO (City Environment and Natural Resources Office).",
    problem:
      "Residents of Dasmariñas often miss garbage collection because schedules, delays, and service disruptions aren't communicated clearly or on time. Announcements are scattered across barangay posts and word of mouth, so residents and CENRO (City Environment and Natural Resources Office) have no direct, reliable channel. The result is missed pickups, uncollected waste, poor segregation habits, and weak compliance with RA 9003 (Ecological Solid Waste Management Act).",
    solution:
      "CleanDasma is a hybrid mobile and web waste management system that connects CENRO with residents. Residents get real-time collection schedules, truck tracking, alerts, and segregation tips on their phones. CENRO manages schedules, trucks, routes, drivers, and reports from a web admin dashboard. Every announcement reaches residents instantly through push notifications, and they can report issues back.",
    features: [
      "GPS garbage truck tracking using the driver's phone",
      "Collection route planning and route monitoring",
      "Barangay-based collection schedules with real-time alerts and push notifications",
      "Role-based access for residents, drivers/pahinante, and CENRO admins",
      "Problem reports and service requests from residents",
      "Eco-tips and waste segregation education",
      "Digital barangay bulletin board and community hub",
      "Data analytics, monthly reports, and audit logs",
      "English and Tagalog language support",
    ],
    stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "Supabase Auth", "Firebase Cloud Messaging", "PWA"],
    process: [
      "Requirements gathering through interviews and surveys with CENRO and residents of Dasmariñas",
      "System design: user roles, database schema, and UI/UX wireframes for mobile and admin web",
      "Agile, iterative development of the Flutter mobile app and the web admin dashboard",
      "Backend integration with Supabase for authentication, database, and APIs, plus FCM for push notifications",
      "GPS tracking and route planning for collection trucks",
      "Testing, debugging, and refinement based on user feedback",
      "Evaluation with ISO/IEC 25010 software quality and MARS (Mobile App Rating Scale) by IT experts, a CENRO admin, and resident end-users",
      "Deployment as a web app at cleandasma.org",
    ],
    result:
      "Evaluated with ISO/IEC 25010 and MARS (Mobile App Rating Scale) by IT experts, a CENRO admin, and resident end-users.",
  },
  {
    slug: "agriconnect",
    title: "AgriConnect",
    category: "Web Application",
    summary:
      "An online marketplace that connects Filipino farmers directly with buyers — fresh produce for buyers, fair prices for farmers.",
    description:
      "An online marketplace that connects Filipino farmers directly with buyers — fresh produce for buyers, fair prices for farmers.",
    tags: ["HTML", "CSS", "JavaScript", "Supabase"],
    githubUrl: "https://github.com/NixAmpi/Agriconnect",
    // liveUrl: add the deployed URL here to show the "Visit Site" button.
    thumbnail: "/projects/agriconnect/home.webp",
    screenshotFrame: "browser",
    gallery: [
      { src: "/projects/agriconnect/home.webp", alt: "AgriConnect home page hero: Fresh from Filipino farms, straight to your table", caption: "Home" },
      { src: "/projects/agriconnect/how-it-works.webp", alt: "How it works: browse local harvests, order direct from farmers, get it delivered", caption: "How it works" },
      { src: "/projects/agriconnect/categories.webp", alt: "Shop by category: vegetables, fruits, rice and grains, root crops, coffee and cacao, herbs and spices", caption: "Shop by category" },
      { src: "/projects/agriconnect/why-agriconnect.webp", alt: "Why AgriConnect: fair prices, fresher produce, verified local farmers, support for rural communities", caption: "Why AgriConnect" },
      { src: "/projects/agriconnect/farmers.webp", alt: "Meet our farmers: testimonials from partner farmers", caption: "Meet our farmers" },
      { src: "/projects/agriconnect/for-farmers.webp", alt: "For farmers banner: grow your income, sell directly to buyers", caption: "For farmers" },
    ],
    overview:
      "AgriConnect is a farm-to-buyer e-commerce website for Filipino agricultural produce. Buyers can browse fruits, vegetables, rice, coffee, and more, see which farmer and province each product comes from, and place real orders. Farmers get a public profile that tells their story and lists their products.",
    problem:
      "Small Filipino farmers often sell through middlemen who take a large share of the price, so farmers earn less and buyers pay more. Buyers also rarely know where their produce comes from, how fresh it is, or who grew it.",
    solution:
      "AgriConnect cuts out the middleman by letting farmers list produce directly and buyers order straight from them. Every product shows its farmer, province, harvest date, and stock. Secure accounts, real-time inventory, and a server-side checkout keep orders accurate and trustworthy.",
    features: [
      "Buyer and Seller accounts with sign-up, login, email confirmation, and password reset (Supabase Auth)",
      "Seller farm profile created automatically at sign-up",
      "Shop with search, category filters, and sorting",
      'Product pages with photo, price, stock, harvest date, and a "Grown by" farmer card',
      "Farmer profiles with farm story, province, average rating, and all their products",
      "Cart drawer and checkout with Philippine mobile number validation and delivery fee rules",
      "Secure order placement through a database function that checks prices and stock in one step",
      "Product reviews with a star breakdown (write, edit, delete; sellers can't review their own products)",
      "Wishlist saved to the buyer's account",
      "Row Level Security on every database table",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "Supabase", "PostgreSQL", "Supabase Auth", "Row Level Security", "Formspree"],
    process: [
      "Planned the marketplace flow for two user types: buyers and sellers (farmers)",
      "Designed the database schema in PostgreSQL: profiles, farms, products, orders, reviews, and wishlist",
      "Built the responsive multi-page front end in plain HTML, CSS, and JavaScript with shared modules for cart, auth, and products",
      "Integrated Supabase Auth for accounts and Row Level Security for data protection",
      "Wrote a place_order() database function to handle pricing, stock checks, and delivery fees server-side",
      "Added reviews, wishlist, and farmer profile features through database migrations",
      "Tested the buying flow, loading and error states, and mobile layouts",
    ],
    result:
      "Delivered a fully working farm-to-buyer marketplace with 8 responsive pages, 13 sample products across 6 produce categories, and a secure Supabase backend of 8 database tables protected by Row Level Security. Buyers can browse, review, wishlist, and place real orders with live stock checks, while every product traces back to the farmer and province that grew it. The project strengthened my skills in full-stack web development, relational database design, authentication, and building secure server-side logic without a framework.",
  },
  {
    slug: "flood-awareness",
    title: "Flood Awareness Philippines",
    category: "Web Application",
    summary:
      "A flood-preparedness website that brings safety guides, emergency hotlines, evacuation resources, and flood updates together in one place for Filipino communities.",
    description:
      "A flood-preparedness website that brings safety guides, emergency hotlines, evacuation resources, and flood updates together in one place for Filipino communities.",
    tags: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/NixAmpi/Flood-awareness",
    // liveUrl: add the deployed URL here to show the "Visit Site" button.
    thumbnail: "/projects/flood-awareness/home.webp",
    screenshotFrame: "browser",
    gallery: [
      { src: "/projects/flood-awareness/home.webp", alt: "Flood Awareness Philippines home page: Be Prepared. Stay Safe. Act Early.", caption: "Home" },
      { src: "/projects/flood-awareness/flood-updates.webp", alt: "Latest flood updates with severity levels and quick links to 911, centers, hotlines and a go-bag checklist", caption: "Flood updates" },
      { src: "/projects/flood-awareness/official-sources.webp", alt: "Flood update cards with links to official sources: PAGASA, NDRRMC and Project NOAH", caption: "Official sources" },
      { src: "/projects/flood-awareness/safety-tips.webp", alt: "Flood safety tips for before, during and after a flood, plus emergency preparedness", caption: "Safety tips" },
      { src: "/projects/flood-awareness/vulnerable-groups.webp", alt: "Guidance for vulnerable groups: elderly, persons with disabilities, children and pregnant women, pets", caption: "Vulnerable groups" },
      { src: "/projects/flood-awareness/evacuation-centers.webp", alt: "Evacuation centers section with steps and search by region", caption: "Evacuation centers" },
      { src: "/projects/flood-awareness/checklist.webp", alt: "Household flood preparedness checklist with go-bag essentials and progress tracking", caption: "Preparedness checklist" },
      { src: "/projects/flood-awareness/flood-prone-areas.webp", alt: "Flood-prone areas in Luzon, Visayas and Mindanao with links to hazard maps", caption: "Flood-prone areas" },
      { src: "/projects/flood-awareness/hotlines.webp", alt: "Emergency hotlines with call and copy-number buttons: 911, NDRRMC, PAGASA", caption: "Emergency hotlines" },
      { src: "/projects/flood-awareness/more-hotlines.webp", alt: "More hotlines: Philippine Red Cross, MMDA Metrobase and your barangay hall", caption: "More hotlines" },
    ],
    overview:
      "Flood Awareness Philippines is a public information website that helps Filipino families prepare for, respond to, and recover from floods. It gathers practical flood-preparedness information in one place so families can act early and stay safe, with the tagline 'Be Prepared. Stay Safe. Act Early.'",
    problem:
      "Flooding hits the Philippines every typhoon and monsoon season, but life-saving information is scattered across different agency websites, social media posts, and news reports. During an emergency, families waste time searching for hotlines, evacuation centers, and safety steps, and many don't prepare ahead because they don't know what to do.",
    solution:
      "Flood Awareness Philippines puts everything a household needs into one fast, mobile-friendly site: one-tap emergency hotlines, step-by-step safety tips for before, during, and after a flood, an interactive go-bag checklist, evacuation center guidance by region, flood-prone area listings, and links to official sources like PAGASA, NDRRMC, and Project NOAH. A Low Data mode keeps it usable on weak connections during storms.",
    features: [
      'Persistent "Call 911" button and quick-action bar (Call 911, Find a center, Hotlines, Go-bag checklist)',
      'Emergency hotlines (911, NDRRMC, PAGASA, Philippine Red Cross, MMDA) with tap-to-call, copy-number buttons, cited sources, and an "Unconfirmed" label for numbers that couldn\'t be re-verified',
      "Flood updates feed with four severity levels (Critical, Warning, Advisory, Informational), clearly labeled as sample data",
      "Safety tips by stage: Before, During, and After a flood, plus Emergency Preparedness",
      "Interactive flood preparedness checklist with a progress tracker, saved on the user's device",
      "Go-bag essentials list for at least 72 hours",
      'Evacuation center guidance with "Find centers near me" and browse by region (Metro Manila, Luzon, Visayas, Mindanao)',
      "Flood-prone areas by island group, with links to HazardHunterPH and Project NOAH flood maps",
      "Preparation guidance for vulnerable groups: elderly, PWDs, infants, children and pregnant women, and pets and livestock",
      "Low Data mode toggle for slow or limited connections",
      "Links to official sources: PAGASA, NDRRMC, Project NOAH",
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
    process: [
      "Researched Philippine flood preparedness guidelines and official sources (PAGASA, NDRRMC, DILG, Philippine Red Cross, Project NOAH, HazardHunterPH)",
      "Planned the site structure around what families need most in an emergency: hotlines, safety steps, and where to evacuate",
      "Designed a clean, high-contrast, mobile-first UI with clear severity colors and large tap targets",
      "Built the pages: Home, Flood Updates, Safety Tips, Evacuation Centers, About, and Contact",
      "Added interactive features: tap-to-call and copy-number hotlines, a preparedness checklist with saved progress, and location-based center search",
      "Verified every hotline against its official source, and flagged unconfirmed numbers and sample data for transparency",
      "Added Low Data mode and tested on mobile and desktop",
    ],
    result:
      "Delivered a complete, mobile-friendly flood-preparedness website with 6 main pages covering emergency hotlines, safety tips for every stage of a flood, evacuation center guidance across Luzon, Visayas, and Mindanao, and an interactive 12-item preparedness checklist. Every hotline cites its official source, and sample data is clearly labeled, so users can trust what they read. The project strengthened my skills in responsive web design, accessibility, user-centered information design, and building public-service tools for real community needs.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
