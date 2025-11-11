"use client"

import MarketCard from "./market-card"
import CommitPopup from "./commit-popup"
import { useRef, useEffect, useState } from "react"
import { ChevronUp, ChevronDown, Search, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MarketsView() {
  const markets = ["ETH", "BNB", "STRK", "ZCASH"]
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCommitPopup, setShowCommitPopup] = useState(false)
  const [commitDirection, setCommitDirection] = useState<"up" | "down">("up")
  const [swipedMarkets, setSwipedMarkets] = useState<Set<string>>(new Set())
  const [currentSwipedMarket, setCurrentSwipedMarket] = useState<string>("")

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop
        const itemHeight = container.clientHeight
        const index = Math.round(scrollTop / itemHeight)
        setCurrentIndex(index)

        container.scrollTo({
          top: index * itemHeight,
          behavior: 'smooth'
        })
      }, 150)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const scrollToMarket = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const itemHeight = container.clientHeight
    container.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    })
    setCurrentIndex(index)
  }

  const handleSwipeComplete = (direction: "up" | "down", marketName: string) => {
    setCommitDirection(direction)
    setCurrentSwipedMarket(marketName)
    setShowCommitPopup(true)
    // Mark this market as swiped for this round
    setSwipedMarkets(prev => new Set(prev).add(marketName))
  }

  const handleCommitConfirm = (amount: string) => {
    console.log(`Committed ${amount} betting ${commitDirection.toUpperCase()}`)
    setShowCommitPopup(false)
  }

  const handleTimerReset = () => {
    // Clear all swipes when timer resets (new round begins)
    setSwipedMarkets(new Set())
  }

  return (
    <div className="relative h-full w-full">
      {/* Fixed Header - Always on top */}
      <div
        className="absolute z-50 flex items-center justify-between pointer-events-none left-8 right-7 sm:left-12 sm:right-11"
        style={{
          top: 'calc(3.2rem + env(safe-area-inset-top, 0px))',
        }}
      >
        <div className="pointer-events-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Creative</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          <button className="p-2 sm:p-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
          </button>
          <button className="p-2 sm:p-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition">
            <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
          </button>
        </div>
      </div>

      {/* Scrollable Market Cards */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {markets.map((market, index) => (
          <div
            key={market}
            className="h-full snap-start relative"
          >
            <MarketCard
              marketName={market}
              onSwipeComplete={handleSwipeComplete}
              hasSwipedThisRound={swipedMarkets.has(market)}
              onTimerReset={handleTimerReset}
              pageType="creative"
              isActive={currentIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Desktop Navigation Arrows */}
      {!isMobile && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => scrollToMarket(currentIndex - 1)}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              style={{ top: '-60px' }}
            >
              <ChevronUp className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {currentIndex < markets.length - 1 && (
            <button
              onClick={() => scrollToMarket(currentIndex + 1)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              style={{ bottom: '-60px' }}
            >
              <ChevronDown className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </>
      )}

      {/* Commit Popup */}
      {showCommitPopup && (
        <CommitPopup
          direction={commitDirection}
          onConfirm={handleCommitConfirm}
          marketName={currentSwipedMarket}
          pageType="creative"
        />
      )}

      {/* Fixed Bottom Navigation - Always on top */}
      <div
        className="absolute inset-x-4 bottom-0 z-50 flex items-center justify-between bg-white rounded-t-3xl py-2 px-2 sm:p-4 px-6 sm:px-8"
        style={{
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Link href="/" className="p-3 sm:p-4 hover:bg-gray-100 rounded-full transition">
          <Image
            src="/icons/user-square.svg"
            alt="Profile"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(95%)_contrast(92%)]"
          />
        </Link>
        <Link href="/" className="p-4 sm:p-5 hover:bg-gray-100 rounded-full transition">
          <Image
            src="/icons/video-console.svg"
            alt="Markets"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(95%)_contrast(92%)]"
          />
        </Link>
        <Link href="/creative" className="p-3 sm:p-4 bg-yellow-400 rounded-full transition">
          <Image
            src="/icons/transaction-history.svg"
            alt="Creative"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 [filter:brightness(0)]"
          />
        </Link>
        <button className="p-3 sm:p-4 hover:bg-gray-100 rounded-full transition">
          <Image
            src="/icons/brain-02.svg"
            alt="Contact"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(95%)_contrast(92%)]"
          />
        </button>
      </div>
    </div>
  )
}
