"use client"

import { useState } from "react"

export default function Profile() {
  const [walletAddress] = useState("0x1234567890123456789012345678")
  const [totalEarned] = useState("1,234.56")

  const formatWalletAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 3)}...${address.slice(-2)}`
  }

  const handleDisconnect = () => {
    console.log("Wallet disconnected")
    // Add disconnect logic here
  }

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

      {/* Wallet Section */}
      <div className="mb-8">
        <p className="text-yellow-400 opacity-75 text-sm mb-3">
          CONNECTED WALLET
        </p>
        <p className="text-yellow-400 text-2xl sm:text-3xl font-bold mb-6">
          {formatWalletAddress(walletAddress)}
        </p>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
        >
          Disconnect Wallet
        </button>
      </div>

      {/* Total Earned Component */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <p className="text-black opacity-60 text-sm mb-2">
          TOTAL $ EARNED
        </p>
        <p className="text-black text-3xl sm:text-4xl font-bold">
          ${totalEarned}
        </p>
      </div>

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
