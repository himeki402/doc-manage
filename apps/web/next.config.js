/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'datn-storagefile.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
