"use client"

import { useEffect } from "react"

export default function VideoPreloader() {
  useEffect(() => {
    // Preload videos in the background for faster loading
    const videos = [
      "https://3vttymersn3cbaps.public.blob.vercel-storage.com/blockrooms.mp4",
      "https://3vttymersn3cbaps.public.blob.vercel-storage.com/suh%20done%20%281%29.mp4",
      "https://3vttymersn3cbaps.public.blob.vercel-storage.com/blocktwitter.mp4",
      "https://3vttymersn3cbaps.public.blob.vercel-storage.com/block2.mp4",
      "https://3vttymersn3cbaps.public.blob.vercel-storage.com/drivewala%20%281%29.mp4"
    ]

    // Create video elements and preload metadata
    videos.forEach(src => {
      const video = document.createElement("video")
      video.preload = "auto"
      video.src = src
      video.load()
    })
  }, [])

  return null
}
