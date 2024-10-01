import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const optionalZodBoolean = z
  .string()
  .toLowerCase()
  .transform((x) => x === "true")
  .pipe(z.boolean())
  .optional()

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NEXT_OUTPUT: z.string().optional(),
    NEXT_IMAGES_UNOPTIMIZED: optionalZodBoolean,
    NODE_ENV: z.string().optional(),
  },
  /*
   * Environment variables available on the client (and server).
   * You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS: optionalZodBoolean,
    NEXT_PUBLIC_NODE_ENV: z.string().optional(),
    NEXT_PUBLIC_REVALIDATE: z.number().or(z.literal(false)).optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   * You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_OUTPUT: process.env.NEXT_OUTPUT,
    NEXT_IMAGES_UNOPTIMIZED: process.env.NEXT_IMAGES_UNOPTIMIZED,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_PUBLIC_URL: process.env.NEXT_PUBLIC_APP_PUBLIC_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS:
      process.env.NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS,
    NEXT_PUBLIC_REVALIDATE:
      isNaN(Number(process.env.NEXT_PUBLIC_REVALIDATE)) === false
        ? Number(process.env.NEXT_PUBLIC_REVALIDATE)
        : false,
  },
})
