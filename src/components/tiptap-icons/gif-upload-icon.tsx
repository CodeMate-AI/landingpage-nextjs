import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const GifUploadIcon = memo(({ className, stroke = "currentColor", fill = "currentColor", ...props }: SvgProps) => {
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
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="6.5"
        fontWeight="700"
        fill={fill}
        stroke="none"
      >
        GIF
      </text>
    </svg>
  )
})

GifUploadIcon.displayName = "GifUploadIcon"

