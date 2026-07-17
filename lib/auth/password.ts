/** PBKDF2-SHA-256 через Web Crypto (браузер) */

function b64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function hashPassword(
  password: string,
  saltB64?: string,
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = saltB64
    ? fromB64(saltB64)
    : crypto.getRandomValues(new Uint8Array(16));
  // copy into plain ArrayBuffer for TS/WebCrypto
  const saltBuf = new ArrayBuffer(saltBytes.byteLength);
  new Uint8Array(saltBuf).set(saltBytes);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuf,
      iterations: 120_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return { hash: b64(bits), salt: b64(new Uint8Array(saltBuf)) };
}

export async function verifyPassword(
  password: string,
  saltB64: string,
  hashB64: string,
): Promise<boolean> {
  const { hash } = await hashPassword(password, saltB64);
  if (hash.length !== hashB64.length) return false;
  let ok = 0;
  for (let i = 0; i < hash.length; i++) {
    ok |= hash.charCodeAt(i) ^ hashB64.charCodeAt(i);
  }
  return ok === 0;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "Пароль не короче 6 символов";
  if (password.length > 128) return "Пароль слишком длинный";
  return null;
}

export function validateEmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Некорректный email";
  return null;
}
