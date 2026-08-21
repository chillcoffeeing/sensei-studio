import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'

export interface ServiceItem {
  title: string
  description: string
}

interface Props {
  items: ServiceItem[]
  className?: string
}

export default function ServicesAccordion({ items, className = '' }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId().replace(/:/g, '')
  const reduceMotion = useReducedMotion()

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div className={`border-b border-line ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const triggerId = `${baseId}-trigger-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div
            key={item.title}
            className={`group border-t border-line transition-colors duration-300 ${isOpen ? 'bg-neutral-surface' : 'hover:bg-neutral-surface/60'}`}
            onPointerEnter={() => setOpenIndex(index)}
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              onFocus={() => setOpenIndex(index)}
              className="flex min-h-24 w-full cursor-pointer items-center justify-between gap-6 px-0 py-6 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime md:min-h-28 md:py-7"
            >
              <span className="flex min-w-0 items-baseline gap-4 md:gap-7">
                <span className="text-xs font-medium text-muted">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-2xl font-medium leading-none tracking-[-0.055em] md:text-[2.75rem]">{item.title}</span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 1 : 0.45 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
                className="shrink-0 text-2xl font-light text-ink md:text-3xl"
                aria-hidden="true"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0, y: -4 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0, y: -4 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[38ch] pb-7 pl-10 text-base leading-[1.45] text-muted md:pb-8 md:pl-[4.25rem] md:text-lg">{item.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
