import { Post } from "@/types/database";

export const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-1",
    slug: "arriving-in-ljubljana-dragons-bridges-and-castle-views",
    title: "Arriving in Ljubljana: Dragons, Bridges & Castle Views",
    excerpt: "The emerald waters of the Ljubljanica river, the fierce guardian dragons of Zmajski Most, and a sunset walk up to Ljubljana Castle.",
    content: `## Welcome to the Dragon City

Crossing the famous **Dragon Bridge** (*Zmajski most*) in the late afternoon sun was our official introduction to Slovenia. The four winged dragons guarding the bridge feel alive against the backdrop of pastel baroque facades and willows trailing into the Ljubljanica river.

### Wandering the Old Town
Ljubljana is remarkably peaceful. The historic center is closed to motorized traffic, filled with lively outdoor cafes, street musicians near Prešeren Square, and the unique architecture of **Jože Plečnik**, who gave this city its distinct columned bridges and riverside promenades.

\`\`\`
Key Highlights:
- Triple Bridge (Tromostovje)
- Ljubljana Castle Funicular & Panoramic Tower
- Central Market riverside arcades
\`\`\`

As dusk settled, we rode the funicular up to **Ljubljana Castle**. Looking out over the red rooftops toward the snow-dusted Kamnik–Savinja Alps in the distance, Slovenia felt like stepping directly into an alpine storybook.`,
    cover_image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80",
    location: "Ljubljana",
    trip_date: "2026-09-18",
    published: true,
    featured: true,
    gallery_images: [
      "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    slug: "lake-bled-and-the-emerald-socha-valley",
    title: "Lake Bled & the Emerald Soča River",
    excerpt: "Rowing traditional pletna boats across mirror-still alpine waters, tasting Bled cream cake, and crossing Vršič Pass into the turquoise Soča valley.",
    content: `## Mirror Waters of Lake Bled

Nothing prepares you for the tranquility of **Lake Bled** at sunrise. With mist rising off the glassy water and the church tower rising from the tiny island, the scene is almost surreal.

We chartered a traditional wooden *pletna* boat rowed by a local oarsman to reach the island church of the Assumption of Mary. After ringing the wishing bell in the church tower, we hiked up to Ojstrica for the classic panoramic viewpoint.

### Over the Vršič Pass to Soča
From the Julian Alps, we drove across the dramatic 50 hairpin turns of the **Vršič Pass**, built during World War I, descending into the breathtaking valley of the **Soča River**. The water here is an unreal shade of vibrant aquamarine and emerald—pure glacial runoff cutting through white limestone gorges.`,
    cover_image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80",
    location: "Lake Bled",
    trip_date: "2026-09-20",
    published: true,
    featured: false,
    gallery_images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    slug: "piran-and-the-slovenian-adriatic-coast",
    title: "Sunset in Venetian Piran on the Adriatic",
    excerpt: "Cobblestone alleys, salt flats of Sečovlje, and fresh seafood by the sea in Slovenia’s historic coastal jewel.",
    content: `## The Venetian Charms of the Adriatic

Slovenia may only have 47 kilometers of coastline, but every meter is packed with character. **Piran** sits on a narrow peninsula jutting into the Adriatic Sea, with architecture heavily shaped by centuries under the Republic of Venice.

Tartini Square opens directly to the harbor, surrounded by Venetian Gothic palaces. We climbed the hillside to the Church of Saint George to watch fishing boats return as the sun melted into the horizon over the Gulf of Trieste.`,
    cover_image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80",
    location: "Piran",
    trip_date: "2026-09-22",
    published: true,
    featured: false,
    gallery_images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
