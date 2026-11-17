"use client"

import { useState } from "react"

// "Or paste a link" row shared by the image and video upload blocks. Calls onSubmit with a valid http(s) URL.
export function PasteLink({ placeholder, onSubmit }: { placeholder: string; onSubmit: (url: string) => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  const submit = () => {
    const url = value.trim()
    if (!/^https?:\/\/\S+$/i.test(url)) return setError("Please enter a valid HTTP or HTTPS link")
    setError("")
    onSubmit(url)
  }

  return (
    <div className="flex flex-col gap-1 mt-3 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPaste={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === "Enter") {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
        />
        <button type="button" onClick={submit} className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
          Add
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
