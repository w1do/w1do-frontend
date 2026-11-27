import { getServiceHubs } from "./w1do/services";
import { getCases } from "./w1do/cases";
import { getBlogPosts } from "./w1do/blog";

/**
 * Стартует загрузку данных главной до рендера компонентов.
 * Компоненты дальше ждут те же промисы из кеша, поэтому сетевые запросы идут параллельно,
 * а не цепочкой Header → Services → Projects → Blog.
 */
export function primeHomepageData(): void {
    void getServiceHubs().catch(() => undefined);
    void getCases().catch(() => undefined);
    void getBlogPosts().catch(() => undefined);
}
