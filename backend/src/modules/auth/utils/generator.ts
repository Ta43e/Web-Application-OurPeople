import * as generator from 'generate-password';

import { hashPassword } from './hashPassword';

export async function generatePassword() {
  const password = generator.generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
    strict: true,
  });

  return await hashPassword(password);
}
