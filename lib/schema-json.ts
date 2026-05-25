import type { Prisma } from "@prisma/client";
import type { AppSchema } from "@/types/app";

export function appSchemaToJson(schema: AppSchema): Prisma.InputJsonValue {
  return schema as unknown as Prisma.InputJsonValue;
}

export function jsonToAppSchema(value: Prisma.JsonValue): AppSchema {
  return value as unknown as AppSchema;
}
