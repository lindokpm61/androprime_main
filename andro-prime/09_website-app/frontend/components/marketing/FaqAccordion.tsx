'use client'

import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="border-t-4 border-black">
      {items.map((item, i) => (
        <div key={i} className="border-b-4 border-black">
          <button
            className="w-full flex items-center justify-between py-8 text-left gap-8"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-sans font-black uppercase text-2xl tracking-tighter text-black">
              {item.question}
            </span>
            <span className="shrink-0 w-8 h-8 border-2 border-black flex items-center justify-center font-sans font-black text-xl transition-transform duration-200"
              style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
              +
            </span>
          </button>
          {openIndex === i && (
            <div className="pb-8">
              <p className="font-serif text-xl text-black leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
