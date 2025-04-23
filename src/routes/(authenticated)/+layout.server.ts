import { fail, redirect, type Actions } from "@sveltejs/kit";
import * as auth from '$lib/server/auth';
import { HTTP_STATUS_CODE } from "$lib/utils/HTTP_STATUS_CODES";
