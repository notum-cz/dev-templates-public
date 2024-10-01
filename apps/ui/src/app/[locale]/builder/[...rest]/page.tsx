import { notFound } from "next/navigation"
import { Attribute } from "@repo/strapi"
import { unstable_setRequestLocale } from "next-intl/server"

import { PageProps } from "@/types/next"

import { locales } from "@/lib/i18n"
import { getMetadataFromStrapi } from "@/lib/next-helpers"
import Strapi from "@/lib/strapi"
import { ComponentsRenderer } from "@/components/page-builder/ComponentsRenderer"
import { PageBuilderFooter } from "@/components/page-builder/single-types/Footer"
import { PageBuilderNavbar } from "@/components/page-builder/single-types/Navbar"

export async function generateStaticParams() {
  const promises = locales.map((locale) =>
    Strapi.fetchAll("api::page.page", { locale })
  )

  const results = await Promise.allSettled(promises)

  const params = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value.data)
    .flat()
    .map((page) => ({
      locale: page.attributes.locale,
      rest: [page.attributes.slug],
    }))

  return params
}

async function fetchData(pageUrl: string, locale: string) {
  try {
    return Strapi.fetchOneBySlug("api::page.page", pageUrl, {
      // @ts-ignore - "deep" is not recognized as it comes from strapi extension
      populate: "deep" as "*",
      locale,
    })
  } catch (e: any) {
    console.error(`"api::page.page" wasn't fetched: `, e?.message)
    return undefined
  }
}

type Props = PageProps<{
  rest: string[]
}>

export async function generateMetadata({ params }: Props) {
  const pageUrl = params.rest.filter((part) => part != "builder").join("/")
  return getMetadataFromStrapi({ pageUrl, locale: params.locale })
}

export default async function StrapiPage({ params }: Props) {
  unstable_setRequestLocale(params.locale)

  const pageUrl = params.rest.filter((part) => part != "builder").join("/")
  const response = await fetchData(pageUrl, params.locale)

  const page = response?.data?.attributes

  if (page?.content == null) {
    notFound()
  }

  const pageSpecificNavbar = page.content.find(
    (x) => x.__component === "layout.navbar"
  ) as
    | Attribute.GetDynamicZoneValue<
        Attribute.DynamicZone<["layout.navbar"]>
      >[number]
    | undefined

  const pageComponents = page.content.filter((x) => {
    return !(x.__component === "layout.navbar" || x.isVisible === false)
  })

  return (
    <main className="w-full overflow-x-hidden">
      <PageBuilderNavbar
        locale={params.locale}
        pageSpecificNavbar={pageSpecificNavbar}
      />
      <ComponentsRenderer pageComponents={pageComponents} />
      <PageBuilderFooter locale={params.locale} />
    </main>
  )
}
