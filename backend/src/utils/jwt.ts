import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export type AccessTokenPayload = {
  sub: string
  sid: string
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL_SECONDS })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload
}

export type PasswordResetTokenPayload = {
  sub: string
  email: string
  v: string // hash snippet of current password to guarantee single-use
  purpose: 'password_reset'
}

export function signPasswordResetToken(userId: string, email: string, passwordHash: string): string {
  const payload: PasswordResetTokenPayload = {
    sub: userId,
    email,
    v: passwordHash.slice(-12),
    purpose: 'password_reset',
  }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export function verifyPasswordResetToken(token: string): PasswordResetTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as PasswordResetTokenPayload
  if (decoded.purpose !== 'password_reset') {
    throw new Error('Invalid token purpose')
  }
  return decoded
}

