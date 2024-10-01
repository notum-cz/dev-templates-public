import { unstable_setRequestLocale } from "next-intl/server"

import { AppLocale } from "@/types/general"
import { PageProps } from "@/types/next"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { locales } from "@/lib/i18n"
import { Link } from "@/lib/navigation"
import Strapi from "@/lib/strapi"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

async function getData(locale: AppLocale) {
  try {
    const pages = await Strapi.fetchMany("api::page.page", { locale })
    return pages.data
  } catch (e) {
    console.error(`No page defined in Strapi or invalid permissions.`, e)
    return []
  }
}

export default async function RootBuilderPage({ params }: PageProps) {
  removeThisWhenYouNeedMe("RootBuilderPage")

  unstable_setRequestLocale(params.locale)

  const pages = await getData(params.locale)

  return (
    <div>
      <h3 className="text-center text-3xl font-bold text-gray-900">
        Welcome to Page Builder
      </h3>

      {pages.length ? (
        <div>
          <p className="text-center text-xl text-gray-700">Available pages</p>
          <div className="mt-5 flex gap-3">
            {pages.map((page, i) => (
              <Link
                locale={page.attributes.locale as AppLocale}
                href={`/builder/${page.attributes.slug}`}
                key={String(page.id) + i}
              >
                <div className="rounded-md bg-gray-200 p-6 text-center transition-colors duration-200 hover:bg-gray-400">
                  <h3 className="text-lg font-bold text-gray-900">
                    {page.attributes.slug} [{page.id}]
                  </h3>
                  {page.attributes.createdAt && (
                    <p>{String(page.attributes.createdAt)}</p>
                  )}
                  {page.attributes.locale && (
                    <p>{String(page.attributes.locale)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl text-red-700">
          No page available. Check Strapi.
        </p>
      )}
    </div>
  )
}
