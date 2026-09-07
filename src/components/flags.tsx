import React from 'react'

export function FlagIndia({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={`inline-block rounded-sm shadow-sm overflow-hidden shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Flag of India"
    >
      <path fill="#FF9933" d="M0 0h640v160H0z" />
      <path fill="#FFFFFF" d="M0 160h640v160H0z" />
      <path fill="#128807" d="M0 320h640v160H0z" />
      <g transform="matrix(3.2 0 0 3.2 320 240)">
        <circle r="20" fill="none" stroke="#000088" strokeWidth="2" />
        <circle r="3.5" fill="#000088" />
        <g id="in-spoke">
          <g id="in-spoke-half">
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#000088" strokeWidth="0.8" />
          </g>
          <use href="#in-spoke-half" transform="rotate(15)" />
        </g>
        <use href="#in-spoke" transform="rotate(30)" />
        <use href="#in-spoke" transform="rotate(60)" />
        <use href="#in-spoke" transform="rotate(90)" />
        <use href="#in-spoke" transform="rotate(120)" />
        <use href="#in-spoke" transform="rotate(150)" />
        <use href="#in-spoke" transform="rotate(180)" />
        <use href="#in-spoke" transform="rotate(210)" />
        <use href="#in-spoke" transform="rotate(240)" />
        <use href="#in-spoke" transform="rotate(270)" />
        <use href="#in-spoke" transform="rotate(300)" />
        <use href="#in-spoke" transform="rotate(330)" />
      </g>
    </svg>
  )
}

export function FlagUSA({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={`inline-block rounded-sm shadow-sm overflow-hidden shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Flag of the United States"
    >
      <g fillRule="evenodd">
        {/* Red background */}
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        {/* White stripes */}
        <path
          stroke="#fff"
          strokeWidth="36.92"
          d="M0 55.38h640M0 129.23h640M0 203.08h640M0 276.92h640M0 350.77h640M0 424.62h640"
        />
        {/* Blue canton */}
        <path fill="#192f5d" d="M0 0h280v258.46H0z" />
        {/* Simplified clean stars cluster */}
        <g fill="#fff">
          <circle cx="35" cy="30" r="7" />
          <circle cx="85" cy="30" r="7" />
          <circle cx="135" cy="30" r="7" />
          <circle cx="185" cy="30" r="7" />
          <circle cx="235" cy="30" r="7" />
          
          <circle cx="60" cy="65" r="7" />
          <circle cx="110" cy="65" r="7" />
          <circle cx="160" cy="65" r="7" />
          <circle cx="210" cy="65" r="7" />

          <circle cx="35" cy="100" r="7" />
          <circle cx="85" cy="100" r="7" />
          <circle cx="135" cy="100" r="7" />
          <circle cx="185" cy="100" r="7" />
          <circle cx="235" cy="100" r="7" />

          <circle cx="60" cy="135" r="7" />
          <circle cx="110" cy="135" r="7" />
          <circle cx="160" cy="135" r="7" />
          <circle cx="210" cy="135" r="7" />

          <circle cx="35" cy="170" r="7" />
          <circle cx="85" cy="170" r="7" />
          <circle cx="135" cy="170" r="7" />
          <circle cx="185" cy="170" r="7" />
          <circle cx="235" cy="170" r="7" />

          <circle cx="60" cy="205" r="7" />
          <circle cx="110" cy="205" r="7" />
          <circle cx="160" cy="205" r="7" />
          <circle cx="210" cy="205" r="7" />

          <circle cx="35" cy="235" r="7" />
          <circle cx="85" cy="235" r="7" />
          <circle cx="135" cy="235" r="7" />
          <circle cx="185" cy="235" r="7" />
          <circle cx="235" cy="235" r="7" />
        </g>
      </g>
    </svg>
  )
}
