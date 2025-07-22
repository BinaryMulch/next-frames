"use client";

import { useState } from "react";
import { login } from "@/app/actions/login";

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

		<>
			<div className="bg-gray-50 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-12 px-8 shadow-lg rounded-xl border border-gray-200">
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900">Next Frames</h1>
							<p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
						</div>

						{error &&
							(
								<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-600 text-center">{error}</p>
								</div>
							)
						}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
									placeholder="Enter your email"
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-colors"
									placeholder="Enter your password"
								/>
							</div>

							<div className="pt-2">
								{loading
									? (
										<button
											disabled
											className="w-full flex justify-center items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm cursor-not-allowed opacity-75"
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
											className="w-full flex justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
		</>

	)

}
