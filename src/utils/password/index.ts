import { DotEnvService } from '@environment';
import { compare, hash } from 'bcrypt';

/**
 * Returns hashed password by hash password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @returns The hashed password mean of `password`
 *
 * @beta
 */
export const hashPassword = async (password: string): Promise<string> => {
  const env = new DotEnvService();
  console.log(env.get('SALT'));
  return await hash(password, +env.get('SALT'));
};

/**
 * Returns boolean by compare password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @param hash - The second input number
 * @returns The boolean mean of `password` and `hash`
 *
 * @beta
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};
