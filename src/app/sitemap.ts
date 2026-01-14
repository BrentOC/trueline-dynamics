
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://trueline-dynamics.com';

    // Static routes
    const routes = [
        '',
        '/search',
        '/login',
        '/privacy-policy',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // In a real application, you would fetch products here and generate dynamic routes
    // const products = await getProducts();
    // const productRoutes = products.map(...)

    return [...routes];
}
