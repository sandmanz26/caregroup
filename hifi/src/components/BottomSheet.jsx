import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function BottomSheet({ open, onClose, title, children, onScroll, contentRef, size = 'md' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-ink-900/50 backdrop-blur-[2px] transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[85vh] w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} flex-col rounded-t-[28px] bg-white shadow-xl transition-transform duration-200 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-center pt-2">
          <span className="h-1.5 w-10 rounded-full bg-ink-300/70" />
        </div>
        <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-3">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200"
          >
            <X size={18} />
          </button>
        </div>
        <div ref={contentRef} onScroll={onScroll} className="overflow-y-auto px-5 pb-7">{children}</div>
      </div>
    </div>
  )
}
