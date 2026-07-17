"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { saveProfile, type UserProfile } from "@/lib/storage";
import { fetchVkProfile, fetchYandexProfile, type OAuthProfile } from "./oauth";
import {
  hashPassword,
  validateEmail,
  validatePassword,
  verifyPassword,
} from "./password";
import {
  clearSession,
  createSession,
  findUserByEmail,
  findUserById,
  findUserByProvider,
  loadSession,
  newUserId,
  toPublic,
  upsertUser,
} from "./store";
import type { AuthProvider, AuthSession, PublicUser } from "./types";

type AuthContextValue = {
  user: PublicUser | null;
  session: AuthSession | null;
  loading: boolean;
  registerWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  loginWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  loginWithOAuthProfile: (
    profile: OAuthProfile,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  completeOAuthFromHash: (
    hash: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateAccount: (patch: {
    name?: string;
    phone?: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  changePassword: (
    current: string,
    next: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function syncProfileFromUser(user: {
  name: string;
  email: string;
  phone?: string;
}) {
  try {
    const prev = JSON.parse(
      localStorage.getItem("koreparts-profile-v1") || "{}",
    ) as Partial<UserProfile>;
    const next: UserProfile = {
      name: user.name || prev.name || "",
      phone: user.phone || prev.phone || "",
      email: user.email || prev.email || "",
      city: prev.city || "",
      carBrand: prev.carBrand || "",
      carModel: prev.carModel || "",
      carYear: prev.carYear || "",
      vin: prev.vin || "",
      bonuses: prev.bonuses ?? 0,
    };
    saveProfile(next);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const s = loadSession();
    if (!s) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }
    const u = findUserById(s.userId);
    if (!u) {
      clearSession();
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }
    setSession(s);
    setUser(toPublic(u));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const registerWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const em = email.trim().toLowerCase();
      const nm = name.trim();
      if (nm.length < 2) return { ok: false as const, error: "Укажите имя" };
      const eErr = validateEmail(em);
      if (eErr) return { ok: false as const, error: eErr };
      const pErr = validatePassword(password);
      if (pErr) return { ok: false as const, error: pErr };
      if (findUserByEmail(em)) {
        return { ok: false as const, error: "Этот email уже зарегистрирован" };
      }

      const { hash, salt } = await hashPassword(password);
      const user = upsertUser({
        id: newUserId(),
        email: em,
        name: nm,
        passwordHash: hash,
        passwordSalt: salt,
        provider: "email",
        createdAt: new Date().toISOString(),
      });
      const s = createSession(user);
      syncProfileFromUser(user);
      setSession(s);
      setUser(toPublic(user));
      return { ok: true as const };
    },
    [],
  );

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const em = email.trim().toLowerCase();
    const eErr = validateEmail(em);
    if (eErr) return { ok: false as const, error: eErr };
    if (!password) return { ok: false as const, error: "Введите пароль" };

    const existing = findUserByEmail(em);
    if (!existing || existing.provider !== "email") {
      return {
        ok: false as const,
        error: existing
          ? `Этот email привязан к входу через ${existing.provider === "vk" ? "VK" : "Яндекс"}`
          : "Неверный email или пароль",
      };
    }
    if (!existing.passwordHash || !existing.passwordSalt) {
      return { ok: false as const, error: "Неверный email или пароль" };
    }
    const ok = await verifyPassword(
      password,
      existing.passwordSalt,
      existing.passwordHash,
    );
    if (!ok) return { ok: false as const, error: "Неверный email или пароль" };

    const s = createSession(existing);
    syncProfileFromUser(existing);
    setSession(s);
    setUser(toPublic(existing));
    return { ok: true as const };
  }, []);

  const loginWithOAuthProfile = useCallback(async (profile: OAuthProfile) => {
    let user =
      findUserByProvider(profile.provider, profile.providerId) ||
      findUserByEmail(profile.email);

    if (user) {
      // обновим имя/аватар
      user = upsertUser({
        ...user,
        name: profile.name || user.name,
        avatar: profile.avatar || user.avatar,
        provider: profile.provider as AuthProvider,
        providerId: profile.providerId,
        email: profile.email || user.email,
      });
    } else {
      user = upsertUser({
        id: newUserId(),
        email: profile.email.toLowerCase(),
        name: profile.name,
        provider: profile.provider,
        providerId: profile.providerId,
        avatar: profile.avatar,
        createdAt: new Date().toISOString(),
      });
    }

    const s = createSession(user);
    syncProfileFromUser(user);
    setSession(s);
    setUser(toPublic(user));
    return { ok: true as const };
  }, []);

  const completeOAuthFromHash = useCallback(
    async (hash: string) => {
      const { parseOAuthHash } = await import("./oauth");
      const parsed = parseOAuthHash(hash);
      if (!parsed) return { ok: false as const, error: "Нет данных OAuth" };
      if (parsed.error) return { ok: false as const, error: parsed.error };
      if (!parsed.accessToken) {
        return { ok: false as const, error: "Токен не получен" };
      }

      try {
        let profile: OAuthProfile;
        if (parsed.provider === "vk") {
          if (!parsed.userId) {
            return { ok: false as const, error: "VK не вернул user_id" };
          }
          profile = await fetchVkProfile(
            parsed.accessToken,
            parsed.userId,
            parsed.email,
          );
        } else {
          profile = await fetchYandexProfile(parsed.accessToken);
        }
        return loginWithOAuthProfile(profile);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "OAuth ошибка";
        return { ok: false as const, error: msg };
      }
    },
    [loginWithOAuthProfile],
  );

  const updateAccount = useCallback(
    async (patch: { name?: string; phone?: string }) => {
      const s = loadSession();
      if (!s) return { ok: false as const, error: "Нет сессии" };
      const existing = findUserById(s.userId);
      if (!existing) return { ok: false as const, error: "Пользователь не найден" };
      const next = upsertUser({
        ...existing,
        name: patch.name?.trim() || existing.name,
        phone: patch.phone !== undefined ? patch.phone.trim() : existing.phone,
      });
      const sess = createSession(next);
      syncProfileFromUser(next);
      setSession(sess);
      setUser(toPublic(next));
      return { ok: true as const };
    },
    [],
  );

  const changePassword = useCallback(
    async (current: string, nextPass: string) => {
      const s = loadSession();
      if (!s) return { ok: false as const, error: "Нет сессии" };
      const existing = findUserById(s.userId);
      if (!existing || existing.provider !== "email") {
        return {
          ok: false as const,
          error: "Смена пароля только для входа по email",
        };
      }
      if (!existing.passwordHash || !existing.passwordSalt) {
        return { ok: false as const, error: "Пароль не задан" };
      }
      const ok = await verifyPassword(
        current,
        existing.passwordSalt,
        existing.passwordHash,
      );
      if (!ok) return { ok: false as const, error: "Неверный текущий пароль" };
      const pErr = validatePassword(nextPass);
      if (pErr) return { ok: false as const, error: pErr };
      const { hash, salt } = await hashPassword(nextPass);
      upsertUser({
        ...existing,
        passwordHash: hash,
        passwordSalt: salt,
      });
      return { ok: true as const };
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      registerWithEmail,
      loginWithEmail,
      loginWithOAuthProfile,
      completeOAuthFromHash,
      updateAccount,
      changePassword,
      logout,
      refresh,
    }),
    [
      user,
      session,
      loading,
      registerWithEmail,
      loginWithEmail,
      loginWithOAuthProfile,
      completeOAuthFromHash,
      updateAccount,
      changePassword,
      logout,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
