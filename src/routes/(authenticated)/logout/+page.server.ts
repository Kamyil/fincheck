import { HTTP_STATUS_CODE } from "$lib/utils/HTTP_STATUS_CODES";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {

        if (!event.locals.session) {
                return fail(HTTP_STATUS_CODE.UNAUTHORIZED);
        }

        await invalidateSession(event.locals.session.id);
        deleteSessionTokenCookie(event);

        return redirect(HTTP_STATUS_CODE.FOUND, '/login');
}
