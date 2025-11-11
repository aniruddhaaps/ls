"use client"

import { useState, useEffect } from "react"

export default function Profile() {
  const [displayedText, setDisplayedText] = useState("")
  const [showResumePopup, setShowResumePopup] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

  const fullText = `Hey there,

suhas this side, based out of kolkata, knows typescript, react, nextjs, full stack, zk, nodejs, python, express, solidity and as well as content creation skills like motion graphics, premier pro, after effects as well as 3d animation like blender. Well im out here looking for opportunities so you can swipe right on me if you'd like to build something together. also my resume is below for your concern.`

  useEffect(() => {
    let currentIndex = 0
    const typingSpeed = 30 // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTypingComplete(true)
        // Show resume popup after typing is complete
        setTimeout(() => {
          setShowResumePopup(true)
        }, 500)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div
      className="h-full w-full flex flex-col p-8"
      style={{ backgroundColor: '#27262c' }}
    >
      {/* Header Spacer */}
      <div
        className="mb-8"
        style={{
          height: 'calc(1rem + env(safe-area-inset-top, 0px))',
        }}
      />

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-12">
        Profile
      </h1>

      {/* Typewriter Text */}
      <div className="flex-1 overflow-y-auto mb-8">
        <p className="text-white text-lg sm:text-xl leading-relaxed whitespace-pre-wrap font-mono">
          {displayedText}
          {!typingComplete && <span className="animate-pulse">|</span>}
        </p>
      </div>

      {/* Resume Popup */}
      {showResumePopup && (
        <div
          className="bg-yellow-400 rounded-2xl p-6 shadow-lg cursor-pointer hover:bg-yellow-500 transition"
          style={{
            animation: 'slideUp 0.5s ease-out',
          }}
          onClick={() => {
            // Add resume download or view logic here
            console.log("Resume clicked")
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-xl sm:text-2xl font-bold mb-1">
                Resume
              </p>
              <p className="text-black opacity-75 text-sm">
                Click to view or download
              </p>
            </div>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom Navigation Spacer */}
      <div
        className="mt-auto"
        style={{
          height: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
        }}
      />
    </div>
  )
}
