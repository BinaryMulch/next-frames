import {login} from "@/app/actions/login";

const LoginPage = () => {

	return (

		<section>
			<div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
				<h1 className="mb-6 text-2xl font-semibold text-gray-900">Next Frames</h1>
				<div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
					<div className="space-y-4 p-6 sm:p-8 md:space-y-6">
						<form className="space-y-4 md:space-y-6">
							<div>
								<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">Email</label>
								<input type="email" name="email" id="email" className="focus:ring-primary-600 focus:border-primary-600 focus:ring-1 focus:outline-none block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900" placeholder="name@company.com" required="" />
							</div>
							<div>
								<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900">Password</label>
								<input type="password" name="password" id="password" placeholder="••••••••" className="focus:ring-primary-600 focus:border-primary-600 focus:ring-1 focus:outline-none block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900" required="" />
							</div>
							<button formAction={login} className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">Sign in</button>
						</form>
					</div>
				</div>
			</div>
		</section>

	);

};

export default LoginPage;
