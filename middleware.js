import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs";
import {NextRequest, NextResponse} from "next/server";

export async function middleware(request) {
	const response = NextResponse.next();

	const supabase = createMiddlewareClient({request, response})

	const {data: session} = await supabase.auth.getSession();

	if (!session) {
		return NextResponse.rewrite(new URL("/login", request.URL));
	}

	return response;
};

export const config = {
	matcher: [
		"/api"
	]
};
