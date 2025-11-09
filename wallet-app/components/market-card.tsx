"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import VerifiedBadge from "./verified-badge"

interface MarketCardProps {
  marketName: string
  onSwipeComplete: (direction: "up" | "down", marketName: string) => void
  hasSwipedThisRound: boolean
  onTimerReset: () => void
}

export default function MarketCard({ marketName, onSwipeComplete, hasSwipedThisRound, onTimerReset }: MarketCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1d")
  const [currentCardId, setCurrentCardId] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isMagnetized, setIsMagnetized] = useState(false)
  const [showRotateHint, setShowRotateHint] = useState(false)
  const dragStartX = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

  useEffect(() => {
    // Show rotation hint for video on mobile
    if (marketName === "BNB" && typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      if (isMobile) {
        setShowRotateHint(true)
        const timer = setTimeout(() => {
          setShowRotateHint(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [marketName])

  useEffect(() => {
    // Initialize audio on client side with mobile-friendly settings and volume boost
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/game-start.mp3')
      audio.preload = 'auto'
      audio.volume = 1.0 // Max browser volume
      audio.load()
      audioRef.current = audio

      // Create Web Audio API context for volume amplification
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        const audioContext = new AudioContext()
        const gainNode = audioContext.createGain()
        gainNode.gain.value = 2.0 // 200% volume boost

        const source = audioContext.createMediaElementSource(audio)
        source.connect(gainNode)
        gainNode.connect(audioContext.destination)

        audioContextRef.current = audioContext
        gainNodeRef.current = gainNode
        sourceNodeRef.current = source
      }

      // Unlock audio on first touch/click for iOS
      const unlockAudio = () => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            audioRef.current?.pause()
            audioRef.current!.currentTime = 0
          }).catch(() => {})
        }
        // Resume audio context on iOS
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume()
        }
        document.removeEventListener('touchstart', unlockAudio)
        document.removeEventListener('click', unlockAudio)
      }

      document.addEventListener('touchstart', unlockAudio, { once: true })
      document.addEventListener('click', unlockAudio, { once: true })
    }
  }, [])

  const periods = ["1h", "8h", "1d", "1w", "1m", "6m", "1y"]

  const cards = [currentCardId, currentCardId + 1, currentCardId + 2]

  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setIsMagnetized(false)
    dragStartX.current = clientX
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isMagnetized) return
    const rawOffset = clientX - dragStartX.current
    const dragCoefficient = 0.5
    const offset = rawOffset * dragCoefficient
    const iconFullyVisibleThreshold = 80

    if (Math.abs(offset) >= iconFullyVisibleThreshold) {
      setIsMagnetized(true)
      setIsDragging(false)
      const direction = offset > 0 ? 1 : -1
      setDragOffset(direction * 500)
      setRotation(direction * 12)

      // Play sound on swipe
      if (audioRef.current) {
        // Resume audio context if suspended (iOS requirement)
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume()
        }

        audioRef.current.currentTime = 0
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Audio play failed:', err)
            // Retry once on mobile
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {})
              }
            }, 100)
          })
        }
      }

      setTimeout(() => {
        setCurrentCardId(prev => prev + 1)
        setDragOffset(0)
        setRotation(0)
        setIsMagnetized(false)
        // Trigger commit popup
        onSwipeComplete(direction > 0 ? "up" : "down", marketName)
      }, 400)
    } else {
      setDragOffset(offset)
      setRotation(offset / 20)
    }
  }

  const handleDragEnd = () => {
    if (isMagnetized) return
    setIsDragging(false)
    setDragOffset(0)
    setRotation(0)
  }

  const iconOpacity = Math.min(Math.abs(dragOffset) / 80, 0.6)
  const iconScale = Math.min(Math.abs(dragOffset) / 80, 1)

  return (
    <div className="relative h-full w-full overflow-hidden select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Swipe Feedback Icons */}
      {dragOffset > 0 && (
        <div
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[15]"
          style={{
            opacity: iconOpacity,
            transform: `translateY(-50%) scale(${iconScale})`,
            transition: isMagnetized ? 'all 0.4s ease-out' : 'none',
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <ArrowUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {dragOffset < 0 && (
        <div
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[15]"
          style={{
            opacity: iconOpacity,
            transform: `translateY(-50%) scale(${iconScale})`,
            transition: isMagnetized ? 'all 0.4s ease-out' : 'none',
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <ArrowDown className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Card Stack */}
      {cards.reverse().map((cardId, reverseIndex) => {
        const index = cards.length - 1 - reverseIndex
        const isTopCard = index === 0
        const opacity = 1 - (index * 0.15)

        return (
          <div
            key={cardId}
            className="absolute inset-4 sm:inset-6 bg-yellow-400 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col border border-yellow-500 select-none"
            style={{
              transform: isTopCard
                ? `translateX(${dragOffset}px) rotate(${rotation}deg)`
                : 'none',
              transition: isTopCard && (isDragging && !isMagnetized)
                ? 'none'
                : isTopCard && isMagnetized
                ? 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
              zIndex: 10 - index,
              opacity: opacity,
              cursor: isTopCard ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={isTopCard ? (e) => handleDragStart(e.clientX) : undefined}
            onMouseMove={isTopCard ? (e) => handleDragMove(e.clientX) : undefined}
            onMouseUp={isTopCard ? handleDragEnd : undefined}
            onMouseLeave={isTopCard ? handleDragEnd : undefined}
            onTouchStart={isTopCard ? (e) => handleDragStart(e.touches[0].clientX) : undefined}
            onTouchMove={isTopCard ? (e) => handleDragMove(e.touches[0].clientX) : undefined}
            onTouchEnd={isTopCard ? handleDragEnd : undefined}
          >
        {/* Header Spacer */}
        <div
          className="mb-2 sm:mb-3"
          style={{
            height: 'calc(3rem + env(safe-area-inset-top, 0px))',
          }}
        />

        {/* Image Area */}
        <div className="flex-1 mb-1 sm:mb-1.5 relative overflow-hidden rounded-2xl sm:rounded-3xl">
          {marketName === "BNB" ? (
            <>
              <video
                src="/blockrooms.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              {/* Rotation Hint Overlay */}
              {showRotateHint && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20 pointer-events-none">
                  <Image
                    src="/icons/rotated.png"
                    alt="Rotate device"
                    width={60}
                    height={60}
                    className="animate-pulse"
                  />
                </div>
              )}
            </>
          ) : (
            <Image
              src="/image.png"
              alt="Profile"
              fill
              className="object-cover pointer-events-none"
              priority
              draggable={false}
            />
          )}
          {/* Verified Badge Overlay - Above white tab */}
          <div className="absolute bottom-[14rem] left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 flex flex-col gap-2 sm:gap-3 pointer-events-none">
            <VerifiedBadge />
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">Suhas, 23</h2>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-6 sm:h-6"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <p className="text-white text-base sm:text-lg md:text-xl font-medium">HITK</p>
              </div>
            </div>
          </div>

          {/* DM Button - Aligned with name */}
          <div className="absolute bottom-[14.5rem] right-3 sm:right-4 md:right-6 pointer-events-auto">
            <button className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg hover:bg-yellow-500 transition">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-7 sm:h-7"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
            </button>
          </div>

          {/* Things we can talk about card */}
          <div className="absolute bottom-4 left-2 right-2 sm:left-3 sm:right-3 bg-white rounded-xl sm:rounded-2xl pt-3 pb-3 px-3 sm:pt-4 sm:pb-4 sm:px-4 shadow-lg pointer-events-auto flex flex-col h-40 sm:h-44">
            <h3 className="text-gray-700 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Things I have worked on</h3>

            <div className="flex-1"></div>

            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 sm:w-4 sm:h-4"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-gray-900 font-medium text-sm sm:text-base">From Kolkata, WB</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 sm:w-4 sm:h-4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                <span className="text-gray-700 text-sm sm:text-base font-medium">Full-Stack</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 sm:w-4 sm:h-4"
                >
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span className="text-gray-700 font-medium text-sm sm:text-base">Web3</span>
              </div>
              <div className="bg-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="text-gray-700 font-medium text-sm sm:text-base">+5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Spacer */}
        <div
          style={{
            height: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
          }}
        />
          </div>
        )
      })}
    </div>
  )
}
