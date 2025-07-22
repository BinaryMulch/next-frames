import PocketBase from 'pocketbase';

let pb = null;

export function createClient() {
    if (!pb) {
        pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
        
        // Configure auto-cancellation for SSR
        if (typeof window === 'undefined') {
            pb.autoCancellation(false);
        }
    }
    return pb;
}

export function getClient() {
    return createClient();
}