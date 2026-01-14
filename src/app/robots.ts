
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://trueline-dynamics.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/account/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
