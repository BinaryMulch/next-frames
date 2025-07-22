import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export async function updateSession(request) {
    const response = NextResponse.next();
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
    
    // Disable auto-cancellation for middleware
    pb.autoCancellation(false);
    
    // Load auth data from cookies
    const authCookie = request.cookies.get('pb_auth');
    if (authCookie) {
        try {
            pb.authStore.loadFromCookie(authCookie.value);
            
            // Verify the auth is still valid
            if (pb.authStore.isValid) {
                try {
                    // Refresh the auth if needed
                    if (pb.authStore.token) {
                        await pb.collection('users').authRefresh();
                        // Update cookie with refreshed token
                        response.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 7 * 24 * 60 * 60 // 7 days
                        });
                    }
                } catch (error) {
                    // Auth refresh failed, clear invalid auth
                    console.warn('Auth refresh failed:', error);
                    pb.authStore.clear();
                    response.cookies.set('pb_auth', '', {
                        maxAge: 0,
                        path: '/'
                    });
                }
            }
        } catch (error) {
            // Invalid auth cookie, clear it
            pb.authStore.clear();
            response.cookies.set('pb_auth', '', {
                maxAge: 0,
                path: '/'
            });
        }
    }
    
    return response;
}