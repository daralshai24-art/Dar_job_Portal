export default function robots() {
    const baseUrl = "https://jobs.daralshai.com"; // TODO: Update with actual domain

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/admin/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
