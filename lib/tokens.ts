import { nanoid } from "nanoid";

const DEFAULT_TOKEN_LENGTH = 21;

export function generateToken(length: number = DEFAULT_TOKEN_LENGTH): string {
  return nanoid(length);
}

export function generateApiKey(): string {
  return `oa_${nanoid(32)}`;
}
