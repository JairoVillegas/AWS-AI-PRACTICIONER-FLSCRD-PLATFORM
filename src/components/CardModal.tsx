import { useEffect } from 'react'
import type { CardResolved } from '../data/cardIndex'
import Reverso from './Reverso'

interface Props {
  card: CardResolved
  onClose: () => void
}

export default function CardModal({ card, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between p-6 pb-4 border-b">
          <div className="flex-1 pr-4">
            <p className="text-xs text-gray-400 mb-1">{card.id} · {card.tema}</p>
            <p className="text-base font-semibold text-gray-900 leading-snug">{card.frente}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Reverso card={card} />
        </div>
      </div>
    </div>
  )
}
