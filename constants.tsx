
import { Product, TradeApplication, ApplicationStatus, Category } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export const CURRENCIES = [
  { code: 'AED', symbol: 'د.إ' },
  { code: 'SAR', symbol: '﷼' },
  { code: 'USD', symbol: '$' },
  { code: 'MAD', symbol: 'DH' }
];

export const CATEGORIES: Category[] = [
  { name: 'Kitchen Accessories', slug: 'kitchen-accessories', is_active: true },
  { name: 'Clothing', slug: 'clothing', is_active: true },
  { name: 'Accessories', slug: 'accessories', is_active: true },
  { name: 'Skin Care', slug: 'skin-care', is_active: true },
  { name: 'Groceries', slug: 'groceries', is_active: true }
];

// Enhanced Metadata with sensory-rich descriptions
const PRODUCT_METADATA: Record<string, { desc: string; seo: string; tags: string; heritage?: string }> = {
  // Kitchen - Evocative and Sensory
  'couscous-pot-medium': { 
    desc: 'Hand-carved patterns dance across the surface of this heavy-duty aluminum steamer, designed in the centuries-old tradition of Fes to coax the soul out of every semolina grain.', 
    seo: 'Authentic Moroccan Hand-Carved Couscous Steamer UAE', 
    tags: 'cookware, steamer, moroccan kitchen, handmade, fes metalwork, traditional',
    heritage: 'Crafted by master metal-smiths in Fes, this vessel uses heavy-gauge aluminum for the gentle, upward flow of aromatic steam required for ethereal, cloud-like couscous.'
  },
  'oil-bottle-ziata': { 
    desc: 'Inspired by the fluid architecture of the Maghreb, this glass dispenser features hand-etched filigree that transforms your finest olive oils into liquid gold.', 
    seo: 'Hand-Etched Moroccan Glass Oil Dispenser Ziata', 
    tags: 'oil bottle, kitchen decor, glass dispenser, moroccan style, ziata, dining',
    heritage: 'A tribute to the Ziata district, this piece balances crystalline clarity with ornate geometry, celebrating the ritual of pouring oil with grace and precision.'
  },
  'safi-plate-21cm': { 
    desc: 'Dipped in the cobalt blues and earthy ochres of the Atlantic coast, each brushstroke on this hand-painted Safi ceramic carries the cooling breeze of the Moroccan shoreline.', 
    seo: 'Safi Hand-Painted Ceramic Plate 21cm Morocco', 
    tags: 'ceramic plate, safi pottery, hand painted, tableware, coastal art, decor',
    heritage: 'The pottery of Safi is legendary for its vibrant glazes. This plate is double-fired for durability, ensuring its intricate patterns remain a centerpiece for generations.'
  },
  'ceramic-tagine-green': { 
    desc: 'Finished with a lustrous, lead-free emerald glaze that shimmers like silk, this serving tagine is the crowning jewel of any celebratory Moroccan feast.', 
    seo: 'Emerald Green Moroccan Serving Tagine Ceramic', 
    tags: 'tagine, green ceramic, serving dish, moroccan pottery, feast, tableware',
    heritage: 'Symbolizing prosperity and paradise, the deep green hue is achieved through a secret artisan glaze formula, perfected over decades in rural collective kilns.'
  },
  'ceramic-tagine-purple': { 
    desc: 'A regal purple finish adds a touch of modern Moroccan luxury to this iconic conical silhouette, designed to keep stews succulent and warm for communal joy.', 
    seo: 'Royal Purple Ceramic Tagine Serving Morocco', 
    tags: 'tagine, purple ceramic, serving dish, moroccan pottery, royal service, dining',
    heritage: 'Bridging ancient craft with contemporary aesthetics, this tagine uses a unique pigment sourced from the High Atlas, providing a rare and sophisticated hue.'
  },
  'cooking-tagine-28cm': { 
    desc: 'Forged from the iron-rich red clay of the High Atlas, this tagine is built for the alchemy of slow heat, infusing stews with an incomparable earthy depth.', 
    seo: 'Traditional Clay Cooking Tagine 28cm Morocco', 
    tags: 'cooking tagine, clay pot, slow cooker, atlas mountains, succulent, kitchen',
    heritage: 'As the porous clay breathes, it creates a micro-environment that tenderizes meats into succulent perfection over hours of gentle simmering on a traditional brazier.'
  },
  'cooking-tagine-30cm': { 
    desc: 'A substantial family-sized clay vessel, handcrafted for even heat distribution and the perfect condensation cycle that keeps ingredients moist and fragrant.', 
    seo: 'Family Sized Clay Cooking Tagine 30cm Morocco', 
    tags: 'family tagine, cooking pot, clay tagine, authentic moroccan, hearth cooking',
    heritage: 'Each pot is hand-thrown on a manual wheel. The unique conical lid is engineered to trap steam, returning moisture to the dish in a continuous cycle of flavor.'
  },
  'cooking-tagine-35cm': { 
    desc: 'The grand patriarch of the kitchen, this extra-large clay tagine is designed for feasts, festivals, and the generous spirit of Moroccan hospitality.', 
    seo: 'Large Feast Clay Cooking Tagine 35cm Morocco', 
    tags: 'large tagine, party serving, clay cooking, moroccan heritage, hospitality',
    heritage: 'Often used in large gatherings, this vessel is treated with natural olive oil before its first firing to enhance its non-stick properties and heat retention.'
  },
  'mug-safi-ceramic': { 
    desc: 'A morning companion that fits perfectly in the palm, hand-thrown and painted with the geometry of Moroccan landscapes and Atlantic tides.', 
    seo: 'Hand-Thrown Safi Ceramic Mug Morocco', 
    tags: 'coffee mug, safi ceramic, handmade mug, moroccan pottery, morning ritual',
    heritage: 'Substantial in weight and cool to the touch, this mug provides a sensory grounding to your start-of-day ritual, bringing the art of Safi into your hands.'
  },
  'ceramic-laban-set': { 
    desc: 'An elegant handcrafted set designed for the refreshing ritual of serving chilled laban, featuring traditional motifs that evoke the shade of a Moroccan courtyard.', 
    seo: 'Moroccan Ceramic Laban Set Handcrafted', 
    tags: 'laban set, milk serving, ceramic set, courtyard dining, moroccan hospitality',
    heritage: 'Historically used to welcome travelers, this set maintains a natural coolness, reflecting the cool tiles and fountains of Marrakech riads.'
  },
  'ceramic-fera9a': { 
    desc: 'A multi-tiered serving masterpiece for appetizers and festive treats, featuring hand-painted panels that celebrate the diverse patterns of the Maghreb.', 
    seo: 'Moroccan Ceramic Fera9a Appetizer Platter', 
    tags: 'fera9a, serving tray, appetizer plate, moroccan ceramic, festive',
    heritage: 'The Fera9a is the center of conversation during social hours. Its intricate divisions are perfect for dates, nuts, and traditional sweets.'
  },
  'ceramic-large': { 
    desc: 'A grand decorative bowl that commands attention, showcasing the sheer scale and skill of Moroccan ceramic artistry through deep relief and vibrant pigment.', 
    seo: 'Decorative Grand Moroccan Ceramic Bowl', 
    tags: 'large bowl, decorative ceramic, moroccan art, home decor, pottery centerpiece',
    heritage: 'Often presented as wedding gifts, these large bowls signify abundance. Every square inch is hand-detailed by master painters using fine-tipped brushes.'
  },
  'tea-glasses': { 
    desc: 'A set of ornate glasses with delicate gold-trimmed designs, ready to hold the steaming, mint-fragrant amber of authentic Moroccan tea.', 
    seo: 'Gold Trimmed Moroccan Tea Glasses Set', 
    tags: 'tea glasses, mint tea, moroccan glasses, gold filigree, hospitality',
    heritage: 'Designed to be held by the rim to avoid heat, these glasses are the essential conduits for the three rounds of tea that define Moroccan hospitality.'
  },
  'royal-tea-pot-large': { 
    desc: 'A gleaming silver-toned testament to Moroccan "Atay" culture, featuring an elegant curved spout engineered for the perfect high-pour and frothy delight.', 
    seo: 'Silver Engraved Royal Moroccan Tea Pot', 
    tags: 'tea pot, moroccan tea, royal service, silver pot, engraved filigree',
    heritage: 'Hand-engraved by master silver-smiths in Fes, the internal filter is designed to keep mint leaves submerged, ensuring a smooth, bitter-free infusion.'
  },
  
  // Clothing
  'johara-caftan': { desc: 'Luxury silk caftan featuring intricate embroidery and classic Moroccan charm.', seo: 'Buy Authentic Moroccan Johara Caftan in UAE', tags: 'caftan, luxury wear, moroccan fashion, silk dress, embroidered' },
  'moroccan-jellaba': { desc: 'Authentic wool-blend jellaba for everyday elegance and cultural comfort.', seo: 'Buy Authentic Moroccan Jellaba in UAE', tags: 'jellaba, traditional wear, modest fashion, moroccan robes, comfort' },
  'gandora': { desc: 'Lightweight and stylish Gandora, perfect for lounging or casual gatherings.', seo: 'Buy Authentic Moroccan Gandora in UAE', tags: 'gandora, casual wear, moroccan clothing, summer dress, loungewear' },
  'jawhara-caftan': { desc: 'Premium Jawhara fabric caftan with stunning traditional Moroccan needlework.', seo: 'Buy Authentic Moroccan Jawhara Caftan in UAE', tags: 'jawhara, caftan, formal wear, moroccan dress, couture' },
  'moroccan-jlaba': { desc: 'Contemporary take on the classic Moroccan Jlaba with modern accents.', seo: 'Buy Authentic Moroccan Jlaba in UAE', tags: 'jlaba, modern moroccan, street wear, cultural fashion, robe' },
  'gandora-colors': { desc: 'Vibrant collection of colorful Gandoras reflecting Moroccan spirit.', seo: 'Buy Authentic Moroccan Gandora Colors in UAE', tags: 'colorful gandora, resort wear, moroccan fashion, ethnic dress, summer' },
  'football-team-t-shirt': { desc: 'Show your pride with the official-style Moroccan National Team jersey.', seo: 'Buy Authentic Moroccan Football Team T-shirt in UAE', tags: 'morocco jersey, football shirt, sports fan, national team, t-shirt' },

  // Skin Care
  'moroccan-soap': { desc: 'Traditional Beldi black soap for a deep-cleansing hammam experience.', seo: 'Buy Authentic Moroccan Soap in UAE', tags: 'black soap, hammam, skin detox, natural soap, beldi' },
  'blue-neela-and-rose': { desc: 'Powerful brightening mask with Moroccan Blue Nila and Rosewater.', seo: 'Buy Authentic Moroccan Blue Neela and Rose in UAE', tags: 'blue nila, rosewater, skin brightening, mask, natural beauty' },
  'aker-fasi-and-rose': { desc: 'Traditional Moroccan poppy powder and rose blend for a natural glow.', seo: 'Buy Authentic Moroccan Aker Fasi and Rose in UAE', tags: 'aker fasi, rosewater, lip tint, skin glow, organic beauty' },
  'pure-rose-water': { desc: 'Distilled from fresh Moroccan roses to tone and refresh your skin.', seo: 'Buy Authentic Moroccan Pure Rose Water in UAE', tags: 'rose water, face toner, organic skincare, moroccan rose, beauty' },
  'pure-lavender': { desc: 'Soothing lavender essential oil sourced from the fields of Morocco.', seo: 'Buy Authentic Moroccan Pure Lavender in UAE', tags: 'lavender oil, aromatherapy, organic oil, calming, skincare' },
  'argan-oil': { desc: '100% pure Moroccan Argan oil, the ultimate liquid gold for skin and hair.', seo: 'Buy Authentic Moroccan Argan Oil in UAE', tags: 'argan oil, liquid gold, pure argan, skin oil, hair oil' },
  'olive-oil-1l': { desc: 'Premium 1-liter bottle of Moroccan extra virgin olive oil for daily use.', seo: 'Buy Authentic Moroccan Olive Oil 1L in UAE', tags: 'olive oil, extra virgin, cooking oil, moroccan pantry, healthy' },
  'amlou-products': { desc: 'Traditional Moroccan almond, argan oil, and honey spread.', seo: 'Buy Authentic Moroccan Amlou Products in UAE', tags: 'amlou, almond spread, moroccan superfood, healthy breakfast, organic' }
};

const generateProducts = (): Product[] => {
  const data = [
    { cat: 'Kitchen Accessories', items: [
      ['Couscous Pot Medium', 249], ['Oil Bottle Ziata', 39], ['Safi Plate 21cm', 69],
      ['Ceramic Tagine Green', 109], ['Ceramic Tagine Purple', 109], ['Cooking Tagine 28cm', 99],
      ['Cooking Tagine 30cm', 119], ['Cooking Tagine 35cm', 159], ['Mug Safi Ceramic', 25],
      ['Ceramic Laban Set', 209], ['Ceramic Fera9a', 199], ['Ceramic Large', 39],
      ['Tea Glasses', 79], ['Royal Tea Pot Large', 189]
    ]},
    { cat: 'Clothing', items: [
      ['Johara Caftan', 249], ['Moroccan Jellaba', 189], ['Gandora', 59],
      ['Jawhara Caftan', 379], ['Moroccan Jlaba', 269], ['Gandora Colors', 59],
      ['Football Team T-shirt', 69]
    ]},
    { cat: 'Accessories', items: [
      ['Moroccan Jewelry Set', 109], ['Moroccan Vintage Set', 109], ['Moroccan Waist Chain', 129],
      ['Waist Chain and Set', 179], ['Classic Earrings', 69], ['Tasbeeh Counter', 29],
      ['Bridal Crown', 99], ['Necklace Sets', 129], ['Basic Necklace', 69], ['Gemstone Necklace', 99]
    ]},
    { cat: 'Skin Care', items: [
      ['Moroccan Soap', 69], ['Blue Neela and Rose', 89], ['Aker Fasi and Rose', 89],
      ['Pure Rose Water', 69], ['Pure Lavender', 49], ['Whitening Cream', 69],
      ['Whitening Soap', 59], ['Bio Products', 89], ['Hair Herbs', 89], ['Scrubs', 119],
      ['Lip Products', 39], ['Bath Bombs', 129], ['Bath Salts', 39], ['Sugar Scrubs', 29],
      ['Essential Oils', 129], ['Serums', 229], ['Argan Oil', 99]
    ]},
    { cat: 'Groceries', items: [
      ['Jibal Products', 16], ['Alsa Products', 9], ['Baking Items', 13],
      ['Merendina', 4], ['Biscuits', 7], ['Olive Oil 500ml', 49], ['Olive Oil 1L', 95],
      ['Spice Collections', 59], ['Harissa', 69], ['Traditional Spices', 49],
      ['Tea Collections', 39], ['Coffee Products', 39], ['Honey', 149], ['Amlou Products', 209]
    ]}
  ];

  const products: Product[] = [];
  let idCounter = 100;

  data.forEach(group => {
    group.items.forEach(([name, price]) => {
      const slug = (name as string)
        .toLowerCase()
        .trim()
        .replace(/ – /g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
        
      const catSlug = group.cat.toLowerCase().replace(/\s+/g, '-');
      const meta = PRODUCT_METADATA[slug] || { 
        desc: `Experience the authentic essence of Morocco with our ${name}.`,
        seo: `Buy Authentic Moroccan ${name} in UAE`,
        tags: `${name.toString().toLowerCase()}, moroccan, premium, authentic, retail`
      };
      
      const longDesc = meta.heritage 
        ? `${meta.desc}\n\n${meta.heritage}\n\nThis piece is more than just an item; it is a gateway to the rich culinary and artisan history of Morocco, verified for authenticity by our trade network.`
        : `Experience the authentic essence of Morocco with our ${name}. Sourced directly from local producers with a commitment to quality and tradition. Each piece reflects the centuries-old skill of artisans working in harmony with natural materials.`;

      products.push({
        id: `prod_${idCounter++}`,
        slug,
        name: name as string,
        description: longDesc,
        short_description: meta.desc,
        seo_meta_title: meta.seo,
        search_tags: meta.tags,
        price: price as number,
        currency: 'AED',
        moq: 1,
        origin: 'Morocco',
        category: group.cat,
        category_slug: catSlug,
        image: `https://picsum.photos/seed/${slug}/600/600`,
        verified: true,
        retailEnabled: true,
        wholesaleEnabled: false,
        is_active: true,
        stock_status: 'in_stock'
      });
    });
  });

  return products;
};

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'b2b_1',
    slug: 'wholesale-argan-oil-bulk',
    name: 'Wholesale Argan Oil (Bulk)',
    description: '100% Organic cold-pressed argan oil from Essaouira. Wholesale only.',
    short_description: 'Pure bulk Argan oil for industrial and beauty use.',
    seo_meta_title: 'Wholesale Moroccan Argan Oil Bulk UAE',
    search_tags: 'wholesale, argan oil, bulk supply, morocco oil, industry',
    price: 65.00,
    currency: 'AED',
    wholesalePrice: 38.00,
    moq: 100,
    origin: 'Morocco',
    category: 'Skin Care',
    category_slug: 'skin-care',
    image: 'https://picsum.photos/seed/argan/400/300',
    verified: true,
    retailEnabled: false,
    wholesaleEnabled: true,
    is_active: true,
    stock_status: 'in_stock'
  },
  ...generateProducts()
];

export const MOCK_APPLICATIONS: TradeApplication[] = [
  {
    id: 'app_1',
    userId: 'user_1',
    type: 'BUYER',
    companyName: 'Dubai Trading LLC',
    country: 'UAE',
    details: 'Looking for bulk beauty products.',
    status: ApplicationStatus.PENDING,
    createdAt: '2024-10-25'
  }
];

export const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DDP', 'CFR'];
