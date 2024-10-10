"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import AppLink from "@/components/elementary/AppLink"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { AppTextArea } from "@/components/forms/AppTextArea"
import { Button } from "@/components/ui/button"

export function ContactForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations("contactForm")

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", email: "", message: "" },
  })

  const onSubmit = (values: z.infer<FormSchemaType>) => {
    // TODO: Add submit logic
    // eslint-disable-next-line no-console
    console.log("values", values)
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={contactFormName}
        className="w-full"
      >
        <AppField
          name="name"
          type="text"
          required
          label={t("name")}
          placeholder={t("namePlaceholder")}
        />
        <div className="mb-5 flex flex-col gap-5 md:mb-16 md:flex-row md:gap-10">
          <AppField
            name="email"
            type="text"
            autoComplete="email"
            required
            label={t("email")}
            placeholder={t("emailPlaceholder")}
          />
        </div>
        <AppTextArea
          name="message"
          type="text"
          label={t("message")}
          aria-label="contact-message"
        />
      </AppForm>
      <div className="flex w-full flex-col gap-4">
        {gdpr?.href && (
          <div className="mt-5 flex flex-col items-center sm:flex-row">
            <p>{t("gdpr")}</p>
            <AppLink
              openExternalInNewTab={gdpr.newTab}
              className="p-0 pl-1 font-medium"
              href={gdpr?.href}
            >
              {gdpr.label || t("gdprLink")}
            </AppLink>
          </div>
        )}

        <Button
          type="submit"
          className="md:w-fit"
          size="lg"
          form={contactFormName}
        >
          {t("submit")}
        </Button>
      </div>

      {errorMessage && (
        <div className="text-center text-red-500">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  message: z.string().optional(),
})

type FormSchemaType = typeof ContactFormSchema

export const contactFormName = "contactForm"
