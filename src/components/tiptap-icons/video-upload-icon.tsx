import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const VideoUploadIcon = memo(({ className, stroke = "currentColor", fill = "currentColor", ...props }: SvgProps) => {
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
      <path d="M10 9.5v5l4.5-2.5z" fill={fill} />
    </svg>
  )
})

VideoUploadIcon.displayName = "VideoUploadIcon"

