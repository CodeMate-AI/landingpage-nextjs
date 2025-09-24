"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export default function SmoothTodoInput() {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      console.log("Adding todo:", value)
      setValue("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8f6f0] to-[#f0ece3]">
      <div className="w-full max-w-lg px-6">
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Background with smooth color transition */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundColor: isFocused ? "#ffffff" : "#f5f1eb",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Subtle border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: isFocused
                  ? "0 0 0 2px rgba(156, 163, 175, 0.3), 0 8px 25px rgba(0, 0, 0, 0.1)"
                  : "0 2px 10px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            <div className="relative flex items-center p-4">
              {/* Input field */}
              <motion.input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Add a new task..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-lg font-medium outline-none"
                animate={{
                  paddingLeft: isFocused ? "8px" : "4px",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />

              {/* Submit button */}
              <motion.button
                type="submit"
                className="ml-3 p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  opacity: value.trim() ? 1 : 0.5,
                  scale: value.trim() ? 1 : 0.9,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Plus size={20} />
              </motion.button>
            </div>

            {/* Animated bottom border */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"
              animate={{
                width: isFocused ? "100%" : "0%",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Floating particles effect when focused */}
          {isFocused && (
            <div className="absolute -inset-4 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-300 rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                    y: [0, -20],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                  style={{
                    left: `${20 + i * 10}%`,
                    top: "50%",
                  }}
                />
              ))}
            </div>
          )}
        </motion.form>

        {/* Demo todo list */}
        <motion.div
          className="mt-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {["Review project proposal", "Call team meeting", "Update documentation"].map((todo, index) => (
            <motion.div
              key={index}
              className="p-4 bg-white/60 backdrop-blur-sm rounded-xl text-gray-700 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
            >
              {todo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
