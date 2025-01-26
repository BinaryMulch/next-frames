/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
				pathname: "**"
			},
			{
				protocol: "https",
				hostname: "olspbesdefesqvhvbohi.supabase.co",
				pathname: "**"
			}
		]
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb"
		}
	}
};

export default nextConfig;
