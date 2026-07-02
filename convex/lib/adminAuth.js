import { ConvexError } from "convex/values";

// Convex's default query/mutation runtime has no Node `crypto` module, so this
// implements a minimal signed token (expiry + HMAC-SHA256) on top of Web
// Crypto instead of reusing jsonwebtoken from the old Express backend.
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminToken(secret) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(expiresAt)));
  return `${expiresAt}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifyAdminToken(token, secret) {
  if (!token || typeof token !== "string") return false;
  const [expiresAtRaw, signatureRaw] = token.split(".");
  if (!expiresAtRaw || !signatureRaw) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  let signatureBytes;
  try {
    signatureBytes = base64UrlDecode(signatureRaw);
  } catch {
    return false;
  }
  const key = await getHmacKey(secret);
  return crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(expiresAtRaw));
}

export async function requireAdmin(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET environment variable");
  const valid = await verifyAdminToken(token, secret);
  if (!valid) throw new ConvexError("Unauthorized");
}
