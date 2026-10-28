import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const ImageUploadIcon = memo(({ className, stroke = "currentColor", ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5-5-8 8" />
    </svg>
  )
})

ImageUploadIcon.displayName = "ImageUploadIcon"

