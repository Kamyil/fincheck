import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { HTTP_STATUS_CODE } from '$lib/utils/HTTP_STATUS_CODES';
import { users } from '$lib/server/db/schema/users';
import { superValidate } from 'sveltekit-superforms/server';


export let load: PageServerLoad = async ({ params }) => {
  // Replace with your database
  // let user = db.users.findUnique({
  //   where: { id: params.id }
  // });
  //
  // if (!user) error(404, 'Not found');
  //
  // let user = 
  // let form = await superValidate(user, your_adapter(schema));

  // Always return { form } in load functions
  // TODO: Fill it
  //  let user = db
  // .select()
  // .from(table.users)
  // .where(sql`${users.id} = ${params.id}`)
  let form = {};


  return { form };
};

export let actions: Actions = {
  login: async (event) => {
    let formData = await event.request.formData();
    console.dir({ formData }, { depth: null });
    let username = formData.get('username');
    let password = formData.get('password');

    if (!validateUsername(username)) {
      return fail(HTTP_STATUS_CODE.BAD_REQUEST, {
        message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
      });
    }

    if (!validatePassword(password)) {
      return fail(HTTP_STATUS_CODE.BAD_REQUEST, { message: 'Invalid password (min 6, max 255 characters)' });
    }

    let results = await db.select().from(users).where(eq(users.username, username));
    let existingUser = results.at(0);

    console.dir({ results }, { depth: null });

    if (!existingUser) {
      return fail(HTTP_STATUS_CODE.BAD_REQUEST, { message: 'Incorrect username or password' });
    }

    let validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    console.log({ validPassword });

    if (!validPassword) {
      return fail(HTTP_STATUS_CODE.BAD_REQUEST, { message: 'Incorrect username or password' });
    }

    let sessionToken = auth.generateSessionToken();
    let session = await auth.createSession(sessionToken, existingUser.id);

    auth.setSessionTokenCookie(event, sessionToken, session.expires_at);

    return redirect(HTTP_STATUS_CODE.FOUND, '/');
  },
  // register: async (event) => {
  //   let formData = await event.request.formData();
  //   let username = formData.get('username');
  //   let password = formData.get('password');
  //
  //   if (!validatePassword(password)) {
  //     return fail(HTTP_STATUS_CODE.BAD_REQUEST, { message: 'Invalid password' });
  //   }
  //
  //   let userId = generateUserId();
  //   let passwordHash = await hash(password, {
  //     // recommended minimum parameters
  //     memoryCost: 19456,
  //     timeCost: 2,
  //     outputLen: 32,
  //     parallelism: 1
  //   });
  //
  //   try {
  //     await db.insert(users).values({ id: userId, username, password_hash: passwordHash });
  //     let sessionToken = auth.generateSessionToken();
  //     let session = await auth.createSession(sessionToken, userId);
  //     auth.setSessionTokenCookie(event, sessionToken, session.expires_at);
  //   } catch (e) {
  //     return fail(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, { message: 'An error has occurred' });
  //   }
  //   return redirect(HTTP_STATUS_CODE.FOUND, '/demo/lucia');
  // }
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  let bytes = crypto.getRandomValues(new Uint8Array(15));
  let id = encodeBase32LowerCase(bytes);

  return id;
}

function validateUsername(username: unknown): username is string {
  return (
    typeof username === 'string' &&
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/.test(username)
  );
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
