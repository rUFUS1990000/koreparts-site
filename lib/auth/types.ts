export type AuthProvider = "email" | "vk" | "yandex";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  /** PBKDF2 base64 — только для email */
  passwordHash?: string;
  passwordSalt?: string;
  provider: AuthProvider;
  providerId?: string;
  avatar?: string;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  provider: AuthProvider;
  avatar?: string;
  /** unix ms */
  expiresAt: number;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  provider: AuthProvider;
  avatar?: string;
};
