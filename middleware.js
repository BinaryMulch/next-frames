import {updateSession} from "@/utils/pocketbase/middleware";

export async function middleware(request) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/dashboard"
	]
}
