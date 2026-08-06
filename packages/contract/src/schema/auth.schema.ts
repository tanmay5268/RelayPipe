import { z } from "zod";

export const getApiKeyInputSchema = z.object({});

export const getApiKeyOutputSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string().nullable(),
  active: z.boolean(),
  lastUsedAt: z.date().nullable(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
});

export type GetApiKeyInput = z.infer<typeof getApiKeyInputSchema>;
export type GetApiKeyOutput = z.infer<typeof getApiKeyOutputSchema>;