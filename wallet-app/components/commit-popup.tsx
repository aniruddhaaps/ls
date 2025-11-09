"use client"

interface CommitPopupProps {
  onConfirm: (amount: string) => void
  direction: "up" | "down"
}

export default function CommitPopup({ onConfirm, direction }: CommitPopupProps) {
  const handleConfirm = () => {
    onConfirm("")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-yellow-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-[90%] max-w-md border border-yellow-500 shadow-2xl">
        {/* Direction Text */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black text-center mb-6">
          {direction === "up" ? "GOOD" : "BAD"}
        </h1>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-black text-yellow-400 rounded-xl py-3 px-6 text-lg font-bold hover:bg-gray-900 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
