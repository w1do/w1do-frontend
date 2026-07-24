import {
  authentication,
  createDirectus,
  readMe,
  rest,
  type AuthenticationData,
  type AuthenticationStorage,
} from '@directus/sdk';

const DIRECTUS_ACCESS_TOKEN_KEY = 'directus_access_token';
const DIRECTUS_REFRESH_TOKEN_KEY = 'directus_refresh_token';
const DIRECTUS_TOKEN_EXPIRES_KEY = 'directus_token_expires';

const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL?.trim().replace(
  /\/+$/,
  ''
);

if (!directusUrl) {
  throw new Error('PUBLIC_DIRECTUS_URL is required.');
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const directusStorage: AuthenticationStorage = {
  get(): AuthenticationData | null {
    const storage = getLocalStorage();

    if (!storage) {
      return null;
    }

    const accessToken = storage.getItem(DIRECTUS_ACCESS_TOKEN_KEY);

    if (!accessToken) {
      return null;
    }

    const refreshToken = storage.getItem(DIRECTUS_REFRESH_TOKEN_KEY);
    const storedExpiresAtValue = storage.getItem(
      DIRECTUS_TOKEN_EXPIRES_KEY
    );
    const storedExpiresAt = storedExpiresAtValue
      ? Number(storedExpiresAtValue)
      : Number.NaN;
    const expiresAt = Number.isFinite(storedExpiresAt)
      ? storedExpiresAt
      : null;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires: expiresAt ? Math.max(expiresAt - Date.now(), 0) : null,
      expires_at: expiresAt,
    };
  },

  set(authData: AuthenticationData | null): void {
    const storage = getLocalStorage();

    if (!storage) {
      return;
    }

    if (!authData?.access_token) {
      storage.removeItem(DIRECTUS_ACCESS_TOKEN_KEY);
      storage.removeItem(DIRECTUS_REFRESH_TOKEN_KEY);
      storage.removeItem(DIRECTUS_TOKEN_EXPIRES_KEY);
      return;
    }

    storage.setItem(DIRECTUS_ACCESS_TOKEN_KEY, authData.access_token);

    if (authData.refresh_token) {
      storage.setItem(
        DIRECTUS_REFRESH_TOKEN_KEY,
        authData.refresh_token
      );
    } else {
      storage.removeItem(DIRECTUS_REFRESH_TOKEN_KEY);
    }

    if (authData.expires_at) {
      storage.setItem(
        DIRECTUS_TOKEN_EXPIRES_KEY,
        String(authData.expires_at)
      );
    } else {
      storage.removeItem(DIRECTUS_TOKEN_EXPIRES_KEY);
    }
  },
};

export const directus = createDirectus(directusUrl)
  .with(authentication('json', { storage: directusStorage }))
  .with(rest());

export async function hasAuthenticatedDirectusSession(): Promise<boolean> {
  try {
    const token = await directus.getToken();

    if (!token) {
      return false;
    }

    await directus.request(readMe({ fields: ['id'] }));
    return true;
  } catch {
    return false;
  }
}

export async function clearDirectusSession(): Promise<void> {
  await directus.setToken(null);
}

export async function logoutDirectusSession(): Promise<void> {
  try {
    await directus.logout({ mode: 'json' });
  } finally {
    await clearDirectusSession();
  }
}
