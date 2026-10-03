import citiesJson from '../data/cities.json';
import categoriesJson from '../data/categories.json';
import guidesJson from '../data/guides.json';

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
export const businesses = Object.values(
  import.meta.glob<Business>('../data/businesses/*.json', { eager: true, import: 'default' }),
);

export const publishedCities = cities.filter((c) => c.published);

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

/** تخصص‌هایی که در یک شهر صفحه دارند: همه‌ی اصلی‌ها + اضافه‌های همان شهر. */
export const categoriesForCity = (city: City) =>
  categories.filter((c) => c.core || city.extraCategories.includes(c.slug));

export const businessesIn = (citySlug: string, categorySlug: string) =>
  businesses.filter((b) => b.city === citySlug && b.categories.includes(categorySlug));

/** هر کسب‌وکار فقط یک صفحه دارد: زیر تخصص اول. */
export const businessUrl = (b: Business) => `/${b.city}/${b.categories[0]}/${b.slug}/`;
