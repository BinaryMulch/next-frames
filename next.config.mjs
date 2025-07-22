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
				protocol: "http",
				hostname: "127.0.0.1",
				port: "8090",
				pathname: "**"
			},
			{
				protocol: "https", 
				hostname: process.env.NEXT_PUBLIC_POCKETBASE_URL ? 
					new URL(process.env.NEXT_PUBLIC_POCKETBASE_URL).hostname : 
					"localhost",
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
