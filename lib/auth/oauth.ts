/**
 * OAuth VK + Яндекс (implicit token flow для SPA / static).
 *
 * Нужны env:
 *   NEXT_PUBLIC_YANDEX_CLIENT_ID
 *   NEXT_PUBLIC_VK_APP_ID
 *
 * Redirect URI в приложениях:
 *   https://ваш-домен.ru/auth/callback/
 *   http://localhost:3000/auth/callback  (dev)
 */

export const YANDEX_CLIENT_ID =
  process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID?.trim() || "";
export const VK_APP_ID = process.env.NEXT_PUBLIC_VK_APP_ID?.trim() || "";

export function oauthRedirectUri(): string {
  if (typeof window === "undefined") return "";
  const base = window.location.origin;
  // trailing slash совместим со static export
  return `${base}/auth/callback/`;
}

export function yandexAuthUrl(): string | null {
  if (!YANDEX_CLIENT_ID) return null;
  const u = new URL("https://oauth.yandex.ru/authorize");
  u.searchParams.set("response_type", "token");
  u.searchParams.set("client_id", YANDEX_CLIENT_ID);
  u.searchParams.set("redirect_uri", oauthRedirectUri());
  u.searchParams.set("force_confirm", "yes");
  return u.toString();
}

export function vkAuthUrl(): string | null {
  if (!VK_APP_ID) return null;
  const u = new URL("https://oauth.vk.com/authorize");
  u.searchParams.set("client_id", VK_APP_ID);
  u.searchParams.set("display", "page");
  u.searchParams.set("redirect_uri", oauthRedirectUri());
  u.searchParams.set("scope", "email");
  u.searchParams.set("response_type", "token");
  u.searchParams.set("v", "5.199");
  return u.toString();
}

export type OAuthTokenPayload = {
  provider: "yandex" | "vk";
  accessToken: string;
  userId?: string;
  email?: string;
  error?: string;
};

/** Парсит #access_token=... из redirect OAuth */
export function parseOAuthHash(hash: string): OAuthTokenPayload | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  const p = new URLSearchParams(raw);

  const error = p.get("error_description") || p.get("error") || undefined;
  if (error) {
    return { provider: "yandex", accessToken: "", error };
  }

  const accessToken = p.get("access_token") || "";
  if (!accessToken) return null;

  // VK кладёт user_id и email в hash
  const userId = p.get("user_id") || undefined;
  const email = p.get("email") || undefined;

  if (userId) {
    return { provider: "vk", accessToken, userId, email };
  }
  return { provider: "yandex", accessToken, email };
}

export type OAuthProfile = {
  provider: "yandex" | "vk";
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
};

export async function fetchYandexProfile(
  accessToken: string,
): Promise<OAuthProfile> {
  const url = `https://login.yandex.ru/info?format=json&oauth_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Не удалось получить профиль Яндекс");
  }
  const data = (await res.json()) as {
    id?: string | number;
    login?: string;
    default_email?: string;
    emails?: string[];
    real_name?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    default_avatar_id?: string;
    is_avatar_empty?: boolean;
  };

  const id = String(data.id || data.login || "");
  if (!id) throw new Error("Яндекс не вернул id пользователя");

  const email =
    data.default_email ||
    data.emails?.[0] ||
    (data.login ? `${data.login}@yandex.ru` : `${id}@yandex.oauth`);

  const name =
    data.real_name ||
    data.display_name ||
    [data.first_name, data.last_name].filter(Boolean).join(" ") ||
    data.login ||
    "Пользователь Яндекс";

  let avatar: string | undefined;
  if (data.default_avatar_id && !data.is_avatar_empty) {
    avatar = `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`;
  }

  return { provider: "yandex", providerId: id, email, name, avatar };
}

export async function fetchVkProfile(
  accessToken: string,
  userId: string,
  emailFromHash?: string,
): Promise<OAuthProfile> {
  // JSONP-like через jsonp не нужен: users.get часто CORS-blocked,
  // поэтому минимальный профиль из token + опционально API.
  let name = `VK ${userId}`;
  let avatar: string | undefined;

  try {
    const api = `https://api.vk.com/method/users.get?user_ids=${encodeURIComponent(userId)}&fields=photo_200&access_token=${encodeURIComponent(accessToken)}&v=5.199`;
    const res = await fetch(api);
    if (res.ok) {
      const json = (await res.json()) as {
        response?: { id: number; first_name?: string; last_name?: string; photo_200?: string }[];
        error?: { error_msg?: string };
      };
      const u = json.response?.[0];
      if (u) {
        name = [u.first_name, u.last_name].filter(Boolean).join(" ") || name;
        avatar = u.photo_200;
      }
    }
  } catch {
    /* CORS — используем fallback */
  }

  const email = emailFromHash || `id${userId}@vk.oauth`;

  return {
    provider: "vk",
    providerId: userId,
    email,
    name,
    avatar,
  };
}
