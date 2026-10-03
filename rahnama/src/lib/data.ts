import citiesJson from '../data/cities.json';
import categoriesJson from '../data/categories.json';
import guidesJson from '../data/guides.json';
import { MIN_LISTINGS } from './site';

export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  published: boolean;
  extraCategories: string[];
  featuredPrice: string;
  guide: string;
  categoryIntros: Record<string, string>;
}

export interface Category {
  slug: string;
  name: string;
  core: boolean;
  icon: string;
}

export interface Business {
  slug: string;
  nameFa: string;
  nameEn: string;
  city: string;
  categories: string[];
  description: string;
  services: string[];
  address: string;
  neighborhood: string;
  hours: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  languages: string[];
  logo: string;
  photos: string[];
  verified: boolean;
  featuredUntil: string | null;
  sample: boolean;
}

export interface Guide {
  city: string;
  slug: string;
  title: string;
  body: string;
}

export const cities = citiesJson as City[];
export const categories = categoriesJson as Category[];
export const guides = guidesJson as Guide[];

const businessFiles = import.meta.glob<Business>('../data/businesses/*.json', { eager: true, import: 'default' });

// ---------- اعتبارسنجی: اگر داده‌ای مشکل داشت، build با پیام فارسی متوقف می‌شود ----------
function fail(file: string, message: string): never {
  throw new Error(`\n\n❌ خطا در فایل «${file}»: ${message}\n`);
}

const citySlugs = new Set(cities.map((c) => c.slug));
const categorySlugs = new Set(categories.map((c) => c.slug));
for (const city of cities) {
  for (const extra of city.extraCategories) {
    if (!categorySlugs.has(extra)) fail('src/data/cities.json', `تخصص «${extra}» در شهر «${city.slug}» در categories.json وجود ندارد.`);
  }
}

const seen = new Set<string>();
export const businesses: Business[] = Object.entries(businessFiles).map(([path, b]) => {
  const file = path.replace('../data/', 'src/data/');
  const expected = path.split('/').pop()!.replace(/\.json$/, '');
  if (b.slug !== expected) fail(file, `مقدار slug («${b.slug}») باید با اسم فایل («${expected}») یکی باشد.`);
  if (seen.has(b.slug)) fail(file, `slug «${b.slug}» تکراری است.`);
  seen.add(b.slug);
  if (!citySlugs.has(b.city)) fail(file, `شهر «${b.city}» وجود ندارد. شهرهای مجاز: ${[...citySlugs].join('، ')}`);
  if (!Array.isArray(b.categories) || b.categories.length === 0) fail(file, 'حداقل یک تخصص لازم است.');
  if (b.categories.length > 3) fail(file, `حداکثر ۳ تخصص مجاز است؛ این فایل ${b.categories.length} تخصص دارد.`);
  const city = cities.find((c) => c.slug === b.city)!;
  for (const cat of b.categories) {
    const category = categories.find((c) => c.slug === cat);
    if (!category) fail(file, `تخصص «${cat}» وجود ندارد. تخصص‌های مجاز در categories.json هستند.`);
    if (!category.core && !city.extraCategories.includes(cat)) fail(file, `تخصص «${cat}» در شهر «${city.name}» فعال نیست.`);
  }
  if (b.featuredUntil && Number.isNaN(Date.parse(b.featuredUntil))) fail(file, `تاریخ featuredUntil («${b.featuredUntil}») درست نیست. شکل درست: 2027-01-31`);
  return b;
});

const samples = businesses.filter((b) => b.sample);
if (samples.length > 0 && !(globalThis as any).__sampleWarned) {
  (globalThis as any).__sampleWarned = true;
  console.warn(`\n⚠️  هشدار: ${samples.length.toLocaleString("fa-IR")} کسب‌وکار نمونه (sample: true) در سایت هست. قبل از انتشار حذفشان کنید:\n   ${samples.map((b) => b.slug).join('، ')}\n`);
}

// ---------- منطق ----------
const today = new Date().toISOString().slice(0, 10);

/** ویژه = featuredUntil امروز یا بعد از امروز. تاریخ فقط موقع build چک می‌شود. */
export const isFeatured = (b: Business) => !!b.featuredUntil && b.featuredUntil.slice(0, 10) >= today;

/** ترتیب نمایش: اول ویژه‌ها، بعد تأییدشده‌ها، بعد به ترتیب الفبا. */
export const sortBusinesses = (list: Business[]) =>
  [...list].sort(
    (a, b) =>
      Number(isFeatured(b)) - Number(isFeatured(a)) ||
      Number(b.verified) - Number(a.verified) ||
      a.nameFa.localeCompare(b.nameFa, 'fa'),
  );

export const publishedCities = cities.filter((c) => c.published);

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)!;

/** تخصص‌هایی که در یک شهر صفحه دارند: همه‌ی اصلی‌ها + اضافه‌های همان شهر. */
export const categoriesForCity = (city: City) =>
  categories.filter((c) => c.core || city.extraCategories.includes(c.slug));

export const businessesIn = (citySlug: string, categorySlug: string) =>
  sortBusinesses(businesses.filter((b) => b.city === citySlug && b.categories.includes(categorySlug)));

export const businessesInCity = (citySlug: string) => businesses.filter((b) => b.city === citySlug);

export const featuredIn = (citySlug?: string) =>
  sortBusinesses(businesses.filter((b) => isFeatured(b) && getCity(b.city)?.published && (!citySlug || b.city === citySlug)));

/** صفحه‌ی تخصص فقط وقتی ایندکس می‌شود که حداقل MIN_LISTINGS کسب‌وکار داشته باشد. */
export const isCategoryIndexable = (citySlug: string, categorySlug: string) =>
  businessesIn(citySlug, categorySlug).length >= MIN_LISTINGS;

/** هر کسب‌وکار فقط یک صفحه دارد: زیر تخصص اول. */
export const businessUrl = (b: Business) => `/${b.city}/${b.categories[0]}/${b.slug}/`;

/** عدد فارسی */
export const fa = (n: number) => n.toLocaleString('fa-IR');

export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`;
export const whatsappHref = (n: string) => `https://wa.me/${n.replace(/\D/g, '')}`;
export const mapHref = (b: Business) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.nameEn} ${b.address}`)}`;
