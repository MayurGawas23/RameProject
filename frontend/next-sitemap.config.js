/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: 'https://rame.org.in', // Replace with your actual domain
    generateRobotsTxt: true, // Generates a robots.txt file
    changefreq: 'daily',
    priority: 0.8,
    sitemapSize: 5000,
    exclude: ["/admin", "/dashboard"], // Exclude private routes
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/admin', '/dashboard'] },
      ],
    },
};

export default sitemapConfig;
