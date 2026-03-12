import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createClient() {
	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

	const cookieStore = await cookies();
	const authCookie = cookieStore.get("pb_auth");

	if (authCookie) {
		pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
	}

	return pb;
}
