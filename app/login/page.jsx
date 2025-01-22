const LoginPage = () => {

	const login = () => {
		console.log("login");
	}

	const signup = () => {
		console.log("signup");
	}

	return (
		<>

		<div className="container mx-auto">
			<form className="bg-gray-100 my-10">
				<div className="mb-4">
					<label className="block" htmlFor="email">Email</label>
					<input className="block w-full bg-gray-200 text-sm rounded-lg" id="email" name="email" type="email" required />
				</div>
				

				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" required />

				<button formAction={login()}>Log in</button>
				<button formAction={signup()}>Sign up</button>
			</form>
		</div>

</>
	);

};

export default LoginPage;
