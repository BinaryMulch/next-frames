import PocketBase from "pocketbase";

export function createClient() {
	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

	if (typeof document !== "undefined") {
		pb.authStore.loadFromCookie(document.cookie);

		pb.authStore.onChange(() => {
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
		});
	}

	return pb;
}
