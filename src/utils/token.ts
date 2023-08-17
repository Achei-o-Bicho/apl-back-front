import * as speakeasy from 'speakeasy';

export function generateTokenOTP(secret: string): string {
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    step: 600,
  });
  return token;
}
