import { sign, verify } from "jsonwebtoken";

export interface JWTPayloadType {
  userId: string;
  selectedCurrencyId: string;
}

const accessSecretKey = process.env.JWT_SECRET || "fallback_access_secret_key";
const refreshSecretKey =
  process.env.JWT_SECRET || "fallback_refresh_secret_key";

export function generateAccessToken(payload: JWTPayloadType) {
  const token = sign(payload, accessSecretKey, {
    expiresIn: "15m",
  });

  return token;
}

export function generateRefreshToken(payload: JWTPayloadType) {
  const token = sign(payload, refreshSecretKey, {
    expiresIn: "168h",
  });

  return token;
}

export function verifyAccessToken(token: string): JWTPayloadType {
  const payload = verify(token, accessSecretKey);

  return payload as JWTPayloadType;
}

export function verifyRefreshToken(token: string): JWTPayloadType {
  const payload = verify(token, refreshSecretKey);

  return payload as JWTPayloadType;
}
