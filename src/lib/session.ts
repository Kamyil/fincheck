import { env as privateEnv } from "$env/dynamic/private";
import type { Cookies } from "@sveltejs/kit";

// SveltekitV2 doesn't allow dynamic env in pre-rendered parts. But we need it from dynamic.
// https://kit.svelte.dev/docs/migrating-to-sveltekit-2#dynamic-environment-variables-cannot-be-used-during-prerendering
// TODO: check if it's possible to remove this workaround in the future when sveltekit docs get updated
export function getSessionCookieNames() {
    return ["XSRF-TOKEN", privateEnv.SESSION_COOKIE]
}

export function flushSession(cookies: Cookies) {
    getSessionCookieNames().forEach((cookie) => {
        if (cookie) {
            cookies.delete(cookie, { path: '/' });
        }
    })
}
