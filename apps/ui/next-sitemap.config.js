import { env } from "@/env.mjs"

// https://www.npmjs.com/package/next-sitemap

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: env.NEXT_PUBLIC_APP_PUBLIC_URL,
  generateRobotsTxt: true,
}
