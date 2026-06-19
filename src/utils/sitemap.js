/**
 * Функция для сериализации элементов карты сайта.
 * @param {import('@astrojs/sitemap').SitemapItem} item
 * @returns {import('@astrojs/sitemap').SitemapItem}
 */
export function serializeSitemapItem(item) {
  const isHome = item.url === 'https://w1do.ru' || item.url === 'https://w1do.ru/';
  
  const config = [
    { pattern: /services/, changefreq: 'daily', priority: 1.0 },
    { pattern: /blog/, changefreq: 'daily', priority: 1.0 },
    { pattern: /case/, changefreq: 'weekly', priority: 0.7 },
    { pattern: /knowledge/, changefreq: 'weekly', priority: 0.6 },
  ];

  if (isHome) {
    // @ts-ignore
    item.changefreq = 'daily';
    item.priority = 1.0;
    return item;
  }

  for (const entry of config) {
    if (entry.pattern.test(item.url)) {
      // @ts-ignore
      item.changefreq = entry.changefreq;
      item.priority = entry.priority;
      return item;
    }
  }

  // Значения по умолчанию
  // @ts-ignore
  item.changefreq = 'monthly';
  item.priority = 0.5;
  
  return item;
}
