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
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Next Frames</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

					{error &&
						(
							<div className="mb-4 text-center text-red-500">
								{error}
							</div>
						)
					}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm/6 font-medium text-white">
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm/6 font-medium text-white">
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							{loading
								? (
									<button
										className="cursor-not-allowed flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
									>
										Signing in...
									</button>
								)
								: (
									<button
										type="submit"
										className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
									>
										Sign in
									</button>
								)
							}
						</div>
					</form>

				</div>
			</div>
		</>

	)

}
