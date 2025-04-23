import { flushSession } from "$lib/session";
import { HTTP_STATUS_CODE } from "$lib/utils/HTTP_STATUS_CODES";
import { error, fail, redirect, type Actions, type Handle } from "@sveltejs/kit";
import type { PageServerLoad } from "./login/$types";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";
import { logDeeply } from "$lib/logger";

/**
 * Handles auth by redirecting to login and propagating locals with user data
 */
const auth: Handle = async ({ event, resolve }) => {
    const requestedPath = event.url.pathname;
    if (requestedPath.startsWith('/login')) {
        // Skip the auth if we are on a login page
        return resolve(event);
    }

    // TODO: Handle checking if user is logged
    // const res = await event.locals.api.query(
    // );
    //
    // if (res.error) {
    //     if (res.error.response.status == HTTP_STATUS_CODE.PAGE_EXPIRED) {
    //         console.info('Got response with status 419 from API. Resetting session');
    //         flushSession(event.cookies);
    //     } else {
    //         console.error('Error querying for user: ', res);
    //         error(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 'Internal server error');
    //     }
    // }
    //
    // if (res.data?.me?.id === undefined) {
    //     console.log('Redirecting back to login');
    //
    //     let redirectTo = '';
    //
    //     if (!['/', '/logout'].includes(requestedPath)) {
    //         redirectTo = `?redirectTo=${requestedPath}`;
    //     }
    //
    //     redirect(HTTP_STATUS_CODE.SEE_OTHER, `/login${redirectTo}`);
    // }
    //
    // event.locals.user = res.data.me;

    return resolve(event);
};


export const load: PageServerLoad = async (event) => {
    logDeeply(event.locals);

    // Exclude the `/login` route from authentication checks
    if (event.url.pathname === '/login') {
        return;
    }

    if (!event.locals.user) {
        return redirect(HTTP_STATUS_CODE.PERMANENT_REDIRECT, '/login');
    }

    // Convert the ISO date string to a millisecond timestamp
    let expiryMs = new Date(event.locals.session.expires_at).getTime();
    let nowMs = Date.now();

    // Fix session expiration logic
    let isSessionExpired = expiryMs <= nowMs;

    console.log('Session expired:', isSessionExpired);

    if (isSessionExpired) {
        await invalidateSession(event.locals.session.id);

        return redirect(HTTP_STATUS_CODE.PERMANENT_REDIRECT, '/login');
    }

    return { user: event.locals.user };
};
