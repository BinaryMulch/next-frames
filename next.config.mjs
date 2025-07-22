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
				hostname: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
					new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : 
					"*.supabase.co",
				pathname: "**"
			}
		]
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "50mb"
		}
	}
};

export default nextConfig;
