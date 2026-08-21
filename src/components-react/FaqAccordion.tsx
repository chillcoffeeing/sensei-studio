import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

interface Props {
  items: FaqItem[]
  className?: string
}

export default function FaqAccordion({ items, className = '' }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId().replace(/:/g, '')
  const reduceMotion = useReducedMotion()

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, index) => {
        const triggerId = `${baseId}-trigger-${index}`
        const panelId = `${baseId}-panel-${index}`
        const isOpen = openIndex === index

        return (
          <div key={item.question}>
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink transition-colors hover:text-muted active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime md:text-lg"
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
                className="shrink-0 text-xl font-light text-muted"
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
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[48ch] pb-5 text-sm leading-relaxed text-muted md:text-base">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
