import type { AuthSession, AuthUser, PublicUser } from "./types";

const USERS_KEY = "koreparts-users-v1";
const SESSION_KEY = "koreparts-session-v1";

const SESSION_DAYS = 30;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function loadUsers(): AuthUser[] {
  return readJson<AuthUser[]>(USERS_KEY, []);
}

export function saveUsers(users: AuthUser[]) {
  writeJson(USERS_KEY, users);
}

export function findUserByEmail(email: string): AuthUser | undefined {
  const e = email.trim().toLowerCase();
  return loadUsers().find((u) => u.email === e);
}

export function findUserByProvider(
  provider: AuthUser["provider"],
  providerId: string,
): AuthUser | undefined {
  return loadUsers().find(
    (u) => u.provider === provider && u.providerId === providerId,
  );
}

export function findUserById(id: string): AuthUser | undefined {
  return loadUsers().find((u) => u.id === id);
}

export function upsertUser(user: AuthUser): AuthUser {
  const users = loadUsers();
  const i = users.findIndex((u) => u.id === user.id);
  if (i >= 0) users[i] = user;
  else users.push(user);
  saveUsers(users);
  return user;
}

export function toPublic(u: AuthUser): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    provider: u.provider,
    avatar: u.avatar,
  };
}

export function createSession(user: AuthUser): AuthSession {
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
    avatar: user.avatar,
    expiresAt: Date.now() + SESSION_DAYS * 86400000,
  };
  writeJson(SESSION_KEY, session);
  return session;
}

export function loadSession(): AuthSession | null {
  const s = readJson<AuthSession | null>(SESSION_KEY, null);
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    clearSession();
    return null;
  }
  return s;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function newUserId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
