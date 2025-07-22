"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/pocketbase/server";

export async function login(formData) {
	const pb = await createClient();
	const cookieStore = await cookies();

	const email = formData.get("email");
	const password = formData.get("password");

	try {
		const authData = await pb.collection('users').authWithPassword(email, password);
		
		// Set auth cookie
		cookieStore.set('pb_auth', pb.authStore.exportToCookie(), {
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 7 * 24 * 60 * 60 // 7 days
		});

		revalidatePath("/", "layout");
		redirect("/dashboard");
	} catch (error) {
		return {
			error: error.message || 'Login failed'
		};
	}
}
