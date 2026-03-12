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
				pathname: "/api/files/**"
			}
		]
	},
	serverExternalPackages: ['pocketbase'],
	experimental: {
		serverActions: {
			bodySizeLimit: "50mb"
		}
	}
};

export default nextConfig;
