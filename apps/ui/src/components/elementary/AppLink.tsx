import React from "react"
import { VariantProps } from "class-variance-authority"

import { isAppLink, Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"
import { buttonVariants } from "@/components/ui/button"

export interface AppLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string
  label?: string
  children?: React.ReactNode
  openExternalInNewTab?: boolean
  icon?: React.ReactNode
}

const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({
    href,
    label,
    className,
    children,
    icon,
    openExternalInNewTab = false,
    variant = "link",
    size = "default",
    ...props
  }) => {
    const combinedClassName = cn(buttonVariants({ variant, size }), className)

    if (isAppLink(href)) {
      return (
        <Link href={href} className={combinedClassName} {...props}>
          <div className="group flex flex-row items-center">
            {children}
            <div className="flex cursor-pointer items-center gap-2">
              <div className={cn("flex justify-between", {})}>{label}</div>
              {icon && (
                <span className="transition-transform duration-200 ease-in group-hover:translate-x-2">
                  {icon}
                </span>
              )}
            </div>
          </div>
        </Link>
      )
    }

    return (
      <a
        href={href}
        target={openExternalInNewTab ? "_blank" : ""}
        rel={openExternalInNewTab ? "noopener noreferrer" : ""}
        className={combinedClassName}
      >
        <div className="group flex flex-row items-center">
          {children}
          <div className="flex cursor-pointer items-center gap-2">
            <div className="flex justify-between">{label}</div>
            {icon && (
              <span className="transition-transform duration-200 ease-in group-hover:translate-x-2">
                {icon}
              </span>
            )}
          </div>
        </div>
      </a>
    )
  }
)

AppLink.displayName = "AppLink"

export default AppLink
