import { useEffect, useRef } from 'react'

interface Props {
  src: string
  poster?: string
  className?: string
  muted?: boolean
  loop?: boolean
  autoplay?: boolean
}

export default function VideoBackground({
  src,
  poster,
  className = '',
  muted = true,
  loop = true,
  autoplay = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (!autoplay || reduceMotionQuery.matches) {
        video.pause()
        return
      }

      video.play().catch(() => {
        // Autoplay can be blocked by the browser; the poster remains visible.
      })
    }

    syncPlayback()
    reduceMotionQuery.addEventListener('change', syncPlayback)

    return () => reduceMotionQuery.removeEventListener('change', syncPlayback)
  }, [autoplay])

  return (
    <div className={`video-background pointer-events-none absolute inset-0 z-0 overflow-hidden bg-panel ${className}`} aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        autoPlay={autoplay}
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="h-[120%] w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
    </div>
  )
}
