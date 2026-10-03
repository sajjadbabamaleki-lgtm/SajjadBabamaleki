import { businessUrl, getCategory, getCity, isFeatured, telHref, whatsappHref, type Business } from '../../lib/data';

/** داده‌ی آماده برای همه‌ی طرح‌های کارت */
export function cardData(b: Business) {
  return {
    b,
    featured: isFeatured(b),
    url: businessUrl(b),
    category: getCategory(b.categories[0]),
    city: getCity(b.city)!.name,
    tel: telHref(b.phone),
    wa: b.whatsapp ? whatsappHref(b.whatsapp) : '',
    letter: b.nameFa.replace(/^دکتر\s*/, '').trim().charAt(0),
    cover: b.photos[0] ?? '',
    photos: b.photos,
  };
}
