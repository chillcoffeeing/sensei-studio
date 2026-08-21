import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode[]
  className?: string
  loop?: boolean
  autoplay?: number
}

export default function Carousel({ children, className = '', loop = true, autoplay }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || !autoplay) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, autoplay)
    return () => clearInterval(interval)
  }, [emblaApi, autoplay])

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {children.map((child, index) => (
            <div key={index} className="flex-none min-w-0 w-full md:w-1/2 lg:w-1/3">
              {child}
            </div>
          ))}
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-white w-6'
                  : 'bg-neutral-600 hover:bg-neutral-500'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
