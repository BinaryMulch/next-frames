import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
    
    // Disable auto-cancellation for server
    pb.autoCancellation(false);
    
    // Load auth data from cookies
    const authCookie = cookieStore.get('pb_auth');
    if (authCookie) {
        try {
            pb.authStore.loadFromCookie(authCookie.value);
        } catch (error) {
            // Invalid auth cookie, ignore
            console.warn('Invalid auth cookie:', error);
        }
    }
    
    return pb;
}

export async function getAuthUser() {
    const pb = await createClient();
    return pb.authStore.isValid ? pb.authStore.model : null;
}