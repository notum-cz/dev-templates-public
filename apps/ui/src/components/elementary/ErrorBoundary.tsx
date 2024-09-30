"use client"

import { useState } from "react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import * as Sentry from "@sentry/nextjs"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ErrorBoundary as ErrorBoundaryComp } from "react-error-boundary"

import { isDevelopment } from "@/lib/general-helpers"

import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Button } from "../ui/button"

function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
  customErrorTitle,
  hideReset,
  showErrorMessage,
}: {
  error: any
  resetErrorBoundary: () => void
  customErrorTitle?: string
  hideReset?: boolean
  showErrorMessage?: boolean
}) {
  const [hidden, setHidden] = useState(false)
  const t = useTranslations("errors.global")

  if (hidden) {
    return null
  }

  const handleTryAgain = () => {
    resetErrorBoundary()
  }

  const isDev = isDevelopment()

  return (
    <Alert variant="destructive" className="relative">
      <ExclamationTriangleIcon className="s-4" />
      <AlertTitle>{customErrorTitle ?? t("invalidContent")}</AlertTitle>
      <AlertDescription className="overflow-y-auto">
        {(showErrorMessage || isDev) && <pre>{error.message}</pre>}

        {isDev && <pre>{error.stack?.split("\n").slice(0, 5).join("\n")}</pre>}

        {!hideReset && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleTryAgain}
            className="mt-2"
          >
            {t("tryAgain")}
          </Button>
        )}
      </AlertDescription>

      <span className="absolute right-2 top-2 block">
        <XIcon
          className="size-4 cursor-pointer"
          onClick={() => setHidden(true)}
        />
      </span>
    </Alert>
  )
}

export function ErrorBoundary({
  children,
  hideReset,
  hideFallback,
  customErrorTitle,
  showErrorMessage,
  onReset,
  onError,
}: {
  children: React.ReactNode
  hideReset?: boolean
  hideFallback?: boolean
  customErrorTitle?: string
  showErrorMessage?: boolean
  onReset?: () => void
  onError?: (error: Error, info: { componentStack?: string | null }) => void
}) {
  const handleError = (
    error: Error,
    info: { componentStack?: string | null; digest?: string | null }
  ) => {
    if (onError) {
      onError(error, info)
    }

    Sentry.captureException(error)
  }

  return (
    <ErrorBoundaryComp
      fallbackRender={(props) =>
        hideFallback ? null : (
          <ErrorBoundaryFallback
            {...props}
            hideReset={hideReset}
            customErrorTitle={customErrorTitle}
            showErrorMessage={showErrorMessage}
          />
        )
      }
      onError={handleError}
      onReset={onReset}
    >
      {children}
    </ErrorBoundaryComp>
  )
}
