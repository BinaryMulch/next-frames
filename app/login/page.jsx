"use client";

import { useState } from "react";
import { login } from "@/app/actions/login";
import ThemeToggle from "@/components/themeToggle";

export default function LoginPage() {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		setError(null);
		setLoading(true);

		const formData = new FormData(event.currentTarget);
		const result = await login(formData);

		if (result && result.error) {
			setError(result.error);
		}

		setLoading(false);
	}

	return (

		<div className="bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-gray-950 dark:via-primary-950/20 dark:to-gray-900 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 transition-colors duration-200">
				<div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
					<div className="relative bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl p-8 shadow-2xl shadow-primary-500/5 rounded-2xl border border-gray-200 dark:border-gray-700/30 transition-colors duration-200">
						<div className="absolute top-4 right-4">
							<ThemeToggle />
						</div>
						<div className="text-center mb-8">
							<h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Next Frames</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
						</div>

						{error &&
							(
								<div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
									<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
								</div>
							)
						}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-xl border border-gray-300 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-150"
									placeholder="Enter your email"
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-xl border border-gray-300 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-150"
									placeholder="Enter your password"
								/>
							</div>

							<div className="pt-2">
								{loading
									? (
										<button
											disabled
											className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 cursor-not-allowed opacity-75"
										>
											<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Signing in...
										</button>
									)
									: (
										<button
											type="submit"
											className="w-full flex justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-150"
										>
											Sign in
										</button>
									)
								}
							</div>
						</form>
					</div>
				</div>
		</div>

	)

}
