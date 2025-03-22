/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/**', // Allow all paths under this domain
            },
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;