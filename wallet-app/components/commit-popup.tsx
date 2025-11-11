"use client"

interface CommitPopupProps {
  onConfirm: (amount: string) => void
  direction: "up" | "down"
  marketName?: string
  pageType?: "root" | "creative"
}

export default function CommitPopup({ onConfirm, direction, marketName, pageType = "root" }: CommitPopupProps) {
  const handleConfirm = () => {
    onConfirm("")
  }

  // If direction is "down" (BAD), show the simple confirmation
  if (direction === "down") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-yellow-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-[90%] max-w-md border border-yellow-500 shadow-2xl">
          {/* Sad Message */}
          <p className="text-black text-2xl sm:text-3xl text-center mb-6 font-bold">
            oh, you didn't like my work :(
          </p>

          {/* Go Back Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-black text-yellow-400 rounded-xl py-3 px-6 text-lg font-bold hover:bg-gray-900 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Get video URL based on market and page type
  const getVideoUrl = () => {
    if (pageType === "creative") {
      switch (marketName) {
        case "ETH":
          return "https://drive.google.com/file/d/1c3ScxxFbiiDW6QAgEX60qtqIQhcKVK6g/view?usp=sharing"
        case "BNB":
          return "https://x.com/_BlockRooms/status/1966487631862071698/video/1"
        case "STRK":
          return "https://x.com/_BlockRooms/status/1948384208197759194/video/1"
        case "ZCASH":
          return "https://www.youtube.com/shorts/coeZgtThYTM"
        default:
          return ""
      }
    } else if (pageType === "root" && marketName === "BNB") {
      return "https://youtu.be/aHX-vWxmXz0"
    }
    return ""
  }

  const videoUrl = getVideoUrl()

  // If direction is "up" (GOOD), show the detailed menu
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-yellow-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-[90%] max-w-md border border-yellow-500 shadow-2xl">
        {/* Action Buttons */}
        {pageType === "creative" && videoUrl && (
          <div className="space-y-4 mb-6">
            {/* Watch Video Button */}
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-yellow-400 rounded-xl py-3 px-6 text-lg font-bold hover:bg-gray-900 transition text-center"
            >
              Watch Video
            </a>
          </div>
        )}

        {/* Action Buttons - Only show for BNB on root page */}
        {pageType === "root" && marketName === "BNB" && (
          <div className="space-y-4 mb-6">
            {/* Watch Video Button */}
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-yellow-400 rounded-xl py-3 px-6 text-lg font-bold hover:bg-gray-900 transition text-center"
            >
              Watch Video
            </a>

            {/* Play Game Button */}
            <a
              href="https://blockrooms.fun/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-yellow-400 rounded-xl py-3 px-6 text-lg font-bold hover:bg-gray-900 transition text-center"
            >
              Play Game
            </a>
          </div>
        )}

        {/* Social Links with Go Back */}
        <div className={`flex items-center justify-center gap-4 ${(pageType === "creative" && videoUrl) || (pageType === "root" && marketName === "BNB") ? "" : "mt-0"}`}>
          {/* Go Back Button (Circular) */}
          <button
            onClick={handleConfirm}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#facc15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-7 sm:h-7"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Telegram */}
          <a
            href="https://t.me/OxSuhass"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0088cc] flex items-center justify-center hover:bg-[#006699] transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-7 sm:h-7"
            >
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4 20-7z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/0xSuhass"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              className="sm:w-7 sm:h-7"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Gmail */}
          <a
            href="mailto:suhas.ghosal2002@gmail.com"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition border-2 border-gray-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="sm:w-7 sm:h-7"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#EA4335"/>
              <path d="M22 6l-10 7L2 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
