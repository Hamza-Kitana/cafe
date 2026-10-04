import type { Localized } from "./cafe";
import type { ImageKey } from "./images";

export type MenuItem = {
  id: string;
  name: Localized;
  desc: Localized;
  price: number;
  /** Accent used by scenes that render the item (drinks worlds, shisha ambient light). */
  color?: string;
  signature?: boolean;
};

export type CategoryId = "coffee" | "hot" | "cold" | "mocktails" | "juices" | "desserts" | "shisha";

export type MenuCategory = {
  id: CategoryId;
  title: Localized;
  tagline: Localized;
  image: ImageKey;
  imagePosition: string;
  background: string;
  accent: string;
  /** Editorial type treatment for the category headline. */
  type: "serif-italic" | "serif" | "sans-wide" | "sans-bold" | "sans-light";
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "coffee",
    title: { en: "Coffee", ar: "القهوة" },
    tagline: { en: "Specialty beans, roasted in Amman.", ar: "بن مختص، محمّص بعمّان." },
    image: "coffee",
    imagePosition: "50% 45%",
    background: "#22150e",
    accent: "#e0a35a",
    type: "serif-italic",
    items: [
      {
        id: "espresso",
        name: { en: "Espresso", ar: "إسبريسو" },
        desc: {
          en: "Double shot, Ethiopian Yirgacheffe. Bright, floral, honest.",
          ar: "دبل شوت إثيوبي، طعمه واضح وريحته ورد.",
        },
        price: 2.5,
      },
      {
        id: "americano",
        name: { en: "Americano", ar: "أمريكانو" },
        desc: { en: "Long, clean and quietly strong.", ar: "طويل ونظيف وقوي على رواق." },
        price: 2.75,
      },
      {
        id: "latte",
        name: { en: "Latte", ar: "لاتيه" },
        desc: {
          en: "Silky steamed milk over a gentle espresso base.",
          ar: "حليب مخفوق ناعم فوق إسبريسو هادي.",
        },
        price: 3.25,
      },
      {
        id: "spanish-latte",
        name: { en: "Spanish Latte", ar: "سبانش لاتيه" },
        desc: {
          en: "Condensed milk sweetness, slow-poured and velvety.",
          ar: "حلاوة الحليب المكثّف، ناعم ومخملي.",
        },
        price: 3.75,
        signature: true,
      },
      {
        id: "cappuccino",
        name: { en: "Cappuccino", ar: "كابتشينو" },
        desc: {
          en: "Equal thirds. Dense foam, a dust of cacao.",
          ar: "رغوة كثيفة ورشّة كاكاو على الوجه.",
        },
        price: 3.25,
      },
      {
        id: "flat-white",
        name: { en: "Flat White", ar: "فلات وايت" },
        desc: {
          en: "Ristretto and micro-foam. Small, serious.",
          ar: "ريستريتو ورغوة ناعمة. صغير بس جدّي.",
        },
        price: 3.5,
      },
      {
        id: "iced-coffee",
        name: { en: "Iced Coffee", ar: "آيس كوفي" },
        desc: {
          en: "Cold, deep, a little caramel. For long nights.",
          ar: "بارد وعميق مع لمسة كراميل، للسهرات الطويلة.",
        },
        price: 3.5,
      },
    ],
  },
  {
    id: "hot",
    title: { en: "Hot Drinks", ar: "المشروبات الساخنة" },
    tagline: { en: "Slow cups for slow conversations.", ar: "كاسات دافية لحكي على رواق." },
    image: "indoor",
    imagePosition: "55% 60%",
    background: "#2a1412",
    accent: "#d98a6a",
    type: "serif",
    items: [
      {
        id: "turkish",
        name: { en: "Turkish Coffee", ar: "قهوة تركية" },
        desc: { en: "Cardamom, slow-boiled on hot sand.", ar: "مع هيل، على الرمل وعلى رواق." },
        price: 2.0,
        signature: true,
      },
      {
        id: "hot-chocolate",
        name: { en: "Hot Chocolate", ar: "هوت شوكليت" },
        desc: {
          en: "Belgian dark chocolate, steamed milk.",
          ar: "شوكولاتة بلجيكية غامقة وحليب سخن.",
        },
        price: 3.5,
      },
      {
        id: "sahlab",
        name: { en: "Sahlab", ar: "سحلب" },
        desc: { en: "Rose water, pistachio, cinnamon.", ar: "ماء ورد، فستق، قرفة." },
        price: 3.25,
      },
      {
        id: "karak",
        name: { en: "Karak Tea", ar: "شاي كرك" },
        desc: { en: "Spiced, milky and strong.", ar: "بهارات وحليب وتقيل." },
        price: 2.25,
      },
      {
        id: "mint-tea",
        name: { en: "Mint Tea", ar: "شاي بالنعنع" },
        desc: { en: "Fresh mint, served in a glass pot.", ar: "نعنع فريش، بإبريق زجاج." },
        price: 2.0,
      },
    ],
  },
  {
    id: "cold",
    title: { en: "Cold Drinks", ar: "المشروبات الباردة" },
    tagline: { en: "Ice, coffee and something sweet.", ar: "ثلج وقهوة وإشي حلو." },
    image: "drinks",
    imagePosition: "50% 55%",
    background: "#0e1f26",
    accent: "#7cc6d9",
    type: "sans-wide",
    items: [
      {
        id: "iced-latte",
        name: { en: "Iced Latte", ar: "آيس لاتيه" },
        desc: { en: "Double shot over ice and cold milk.", ar: "دبل شوت على ثلج وحليب بارد." },
        price: 3.5,
      },
      {
        id: "frappe-caramel",
        name: { en: "Caramel Frappé", ar: "فرابيه كراميل" },
        desc: { en: "Blended, whipped, salted caramel.", ar: "مخفوق مع كراميل مملّح." },
        price: 4.0,
      },
      {
        id: "cold-brew",
        name: { en: "Cold Brew", ar: "كولد برو" },
        desc: { en: "Steeped for eighteen hours.", ar: "منقوع ١٨ ساعة." },
        price: 3.75,
      },
      {
        id: "milkshake",
        name: { en: "Milkshake", ar: "ميلك شيك" },
        desc: {
          en: "Vanilla, Lotus or Oreo. Thick enough to argue about.",
          ar: "فانيلا، لوتس أو أوريو. تقيل لدرجة النقاش.",
        },
        price: 4.0,
        color: "#c98f7a",
      },
      {
        id: "iced-tea",
        name: { en: "Iced Tea", ar: "آيس تي" },
        desc: {
          en: "Peach or passion fruit, brewed in-house.",
          ar: "خوخ أو باشن فروت، محضّر عنا.",
        },
        price: 2.75,
        color: "#c0703a",
      },
    ],
  },
  {
    id: "mocktails",
    title: { en: "Mocktails", ar: "الموكتيلات" },
    tagline: { en: "All the drama, none of the regret.", ar: "كل الدراما، بدون ولا ندم." },
    image: "drinks",
    imagePosition: "88% 50%",
    background: "#0f2318",
    accent: "#8fdc8a",
    type: "serif-italic",
    items: [
      {
        id: "mojito",
        name: { en: "Mojito", ar: "موهيتو" },
        desc: {
          en: "Fresh mint, crushed lime, sparkling cold.",
          ar: "نعنع فريش وليمون مهروس وفوّار بارد.",
        },
        price: 3.5,
        color: "#3f9a5a",
        signature: true,
      },
      {
        id: "lemon-mint",
        name: { en: "Lemon Mint", ar: "ليمون ونعنع" },
        desc: { en: "Jordan's summer, blended to a frost.", ar: "صيف عمّان كله بكاسة وحدة." },
        price: 2.75,
        color: "#a9b93a",
      },
      {
        id: "blue-lagoon",
        name: { en: "Blue Lagoon", ar: "بلو لاجون" },
        desc: { en: "Citrus blue, ice and a little drama.", ar: "حمضيات زرقا، ثلج، وشوية دراما." },
        price: 3.75,
        color: "#2f7fc0",
      },
      {
        id: "passion-sunset",
        name: { en: "Passion Sunset", ar: "باشن سنست" },
        desc: {
          en: "Passion fruit, orange, a grenadine horizon.",
          ar: "باشن فروت وبرتقال وغروب رمّان.",
        },
        price: 4.0,
      },
      {
        id: "rose-lemonade",
        name: { en: "Rose Lemonade", ar: "ليموناضة ورد" },
        desc: { en: "Damask rose, lemon, soda.", ar: "ورد جوري وليمون وصودا." },
        price: 3.5,
      },
    ],
  },
  {
    id: "juices",
    title: { en: "Fresh Juices", ar: "العصائر" },
    tagline: { en: "Squeezed when you order. Not before.", ar: "بنعصره لما تطلب، مش قبل." },
    image: "drinks",
    imagePosition: "12% 50%",
    background: "#2a1708",
    accent: "#f0a040",
    type: "sans-bold",
    items: [
      {
        id: "fresh-juice",
        name: { en: "Fresh Juice", ar: "عصير فريش" },
        desc: {
          en: "Orange, mango or strawberry, squeezed to order.",
          ar: "برتقال، مانجا أو فراولة، بنعصره قدّامك.",
        },
        price: 3.0,
        color: "#e08a2a",
      },
      {
        id: "orange",
        name: { en: "Orange", ar: "برتقال" },
        desc: { en: "Pressed to order.", ar: "بنعصره عالطلب." },
        price: 3.0,
      },
      {
        id: "mango",
        name: { en: "Mango", ar: "مانجا" },
        desc: { en: "Thick, golden, cold.", ar: "تقيل، ذهبي، بارد." },
        price: 3.5,
      },
      {
        id: "strawberry-banana",
        name: { en: "Strawberry Banana", ar: "فراولة وموز" },
        desc: { en: "Blended with milk or water.", ar: "مع حليب أو مي." },
        price: 3.5,
      },
      {
        id: "carrot-orange",
        name: { en: "Carrot Orange", ar: "جزر وبرتقال" },
        desc: { en: "Sweet, bright, good for you.", ar: "حلو وفريش ومفيد كمان." },
        price: 3.25,
      },
    ],
  },
  {
    id: "desserts",
    title: { en: "Desserts", ar: "الحلويات" },
    tagline: { en: "Made for sharing. Rarely shared.", ar: "معمولة للمشاركة. نادرًا ما بتتشارك." },
    image: "coffee",
    imagePosition: "20% 15%",
    background: "#24131b",
    accent: "#e6a3b4",
    type: "serif-italic",
    items: [
      {
        id: "cheesecake",
        name: { en: "San Sebastián Cheesecake", ar: "تشيز كيك سان سيباستيان" },
        desc: { en: "Burnt top, creamy heart.", ar: "وجه محروق وقلب كريمي." },
        price: 4.5,
        signature: true,
      },
      {
        id: "lotus-brownie",
        name: { en: "Lotus Brownie", ar: "براوني لوتس" },
        desc: { en: "Warm, with vanilla ice cream.", ar: "سخن مع بوظة فانيلا." },
        price: 4.25,
      },
      {
        id: "knafeh",
        name: { en: "Knafeh Bites", ar: "لقيمات كنافة" },
        desc: { en: "Nabulsi cheese, warm sugar syrup.", ar: "جبنة نابلسية وقطر سخن." },
        price: 4.0,
      },
      {
        id: "molten",
        name: { en: "Molten Cake", ar: "مولتن كيك" },
        desc: { en: "A dark chocolate core.", ar: "قلب شوكولاتة سايح." },
        price: 4.5,
      },
      {
        id: "tiramisu",
        name: { en: "Pistachio Tiramisu", ar: "تيراميسو فستق" },
        desc: { en: "Espresso-soaked, pistachio cream.", ar: "مشرّب إسبريسو مع كريمة فستق." },
        price: 4.75,
      },
    ],
  },
  {
    id: "shisha",
    title: { en: "Shisha", ar: "الأرجيلة" },
    tagline: { en: "Prepared by our lounge master.", ar: "بيحضّرها معلّم الأرجيلة." },
    image: "lounge",
    imagePosition: "65% 50%",
    background: "#16121c",
    accent: "#c9a6e8",
    type: "sans-light",
    items: [
      {
        id: "double-apple",
        name: { en: "Double Apple", ar: "تفاحتين" },
        desc: { en: "The classic. Anise-warm and smooth.", ar: "الكلاسيكية. دافية وناعمة." },
        price: 6.0,
        color: "#c0392b",
      },
      {
        id: "mint",
        name: { en: "Mint", ar: "نعنع" },
        desc: { en: "Ice-cold clarity on every draw.", ar: "برودة وصفا مع كل نفَس." },
        price: 6.0,
        color: "#3fbf8f",
      },
      {
        id: "grape",
        name: { en: "Grape", ar: "عنب" },
        desc: { en: "Dark, sweet, deep-purple clouds.", ar: "حلو وغامق، غيمة بنفسجية." },
        price: 6.0,
        color: "#7d3cb5",
      },
      {
        id: "lemon",
        name: { en: "Lemon", ar: "ليمون" },
        desc: { en: "Sharp citrus, clean finish.", ar: "حمضي وحاد ونظيف." },
        price: 6.0,
        color: "#e5c23a",
      },
      {
        id: "blueberry",
        name: { en: "Blueberry", ar: "توت أزرق" },
        desc: { en: "Soft berry with a cool edge.", ar: "توت ناعم مع طرف بارد." },
        price: 6.0,
        color: "#3d5fd1",
      },
      {
        id: "watermelon",
        name: { en: "Watermelon", ar: "بطيخ" },
        desc: { en: "Summer nights on the terrace.", ar: "ليالي الصيف على التراس." },
        price: 6.0,
        color: "#e2475f",
      },
      {
        id: "layali-mix",
        name: { en: "Layali Mix", ar: "خلطة ليالي" },
        desc: { en: "Our secret. Ask the lounge master.", ar: "سرّنا. اسأل معلّم الأرجيلة." },
        price: 8.0,
        color: "#e0a35a",
        signature: true,
      },
    ],
  },
];

const byId = new Map(menu.flatMap((c) => c.items.map((i) => [i.id, i] as const)));

export function menuItem(id: string): MenuItem {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}

export const category = (id: CategoryId) => menu.find((c) => c.id === id)!;

/** Items featured by the scroll scenes, in order. */
export const featured = {
  coffeeLab: ["espresso", "latte", "spanish-latte", "cappuccino", "iced-coffee"],
  drinks: ["mojito", "lemon-mint", "blue-lagoon", "milkshake", "fresh-juice", "iced-tea"],
};
