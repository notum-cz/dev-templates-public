import { env } from "process"

import { createSharedPathnamesNavigation } from "next-intl/navigation"

import { locales } from "./i18n"

// https://next-intl-docs.vercel.app/docs/routing/navigation
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })

export function isAppLink(link: string): boolean {
  try {
    const baseUrl = env.NEXT_PUBLIC_APP_PUBLIC_URL ?? ""
    const url = new URL(link, baseUrl)
    return url.hostname === new URL(baseUrl).hostname
  } catch (error) {
    return false
  }
}
