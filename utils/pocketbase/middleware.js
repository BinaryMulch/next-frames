import PocketBase from "pocketbase";
import { NextResponse } from "next/server";

export async function updateSession(request) {
	// Skip auth refresh for server action requests to prevent revalidation loops
	if (request.headers.get("Next-Action")) {
		return NextResponse.next({ request });
	}

	const response = NextResponse.next({ request });

	const authCookie = request.cookies.get("pb_auth");

	if (!authCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
	pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);

	if (!pb.authStore.isValid) {
		response.cookies.delete("pb_auth");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		await pb.collection("users").authRefresh();
		// Set refreshed cookie on response
		const exportedCookie = pb.authStore.exportToCookie({ httpOnly: false });
		const cookieParts = exportedCookie.split(";")[0]; // get "pb_auth=..."
		const cookieValue = cookieParts.split("=").slice(1).join("=");
		response.cookies.set("pb_auth", cookieValue, {
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			// httpOnly must be false — client-side PocketBase SDK reads auth from document.cookie
			httpOnly: false,
		});
	} catch (_) {
		pb.authStore.clear();
		response.cookies.delete("pb_auth");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return response;
}
