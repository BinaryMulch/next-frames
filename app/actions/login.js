"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/pocketbase/server";

export async function login(formData) {

	const pb = await createClient();

	const email = formData.get("email");
	const password = formData.get("password");

	try {
		await pb.collection("users").authWithPassword(email, password);
	} catch (error) {
		return {
			error: error.message || "Invalid email or password"
		}
	}

	// Set auth cookie
	const cookieStore = await cookies();
	const exportedCookie = pb.authStore.exportToCookie({ httpOnly: false });
	const cookieParts = exportedCookie.split(";")[0];
	const cookieValue = cookieParts.split("=").slice(1).join("=");
	cookieStore.set("pb_auth", cookieValue, {
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		// httpOnly must be false — client-side PocketBase SDK reads auth from document.cookie
		httpOnly: false,
	});

	revalidatePath("/", "layout");
	redirect("/dashboard");

}
