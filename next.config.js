/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready configuration for subdomain architecture

  // Async rewrites for subdomain handling
  async rewrites() {
    return {
      beforeFiles: [
        // Middleware handles subdomain routing dynamically
        // No static rewrites needed - keeps it flexible
      ],
    };
  },

  // Security and CORS headers for multi-tenant subdomains
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // CORS - Allow subdomain requests
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? "https://*.botbeetle.com" // Replace with your domain
                : "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          // Security headers (industry standard)
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // SSL/HTTPS enforcement
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Image optimization for subdomains
  images: {
    domains: ["localhost", "botbeetle.com", "*.botbeetle.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.botbeetle.com",
      },
    ],
  },
};

module.exports = nextConfig;
