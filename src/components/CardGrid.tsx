import type { CardResolved } from '../data/cardIndex'

const TIPO_COLORS: Record<string, string> = {
  definicion:       'bg-blue-100 text-blue-700',
  comparacion:      'bg-purple-100 text-purple-700',
  servicio_aws:     'bg-orange-100 text-orange-700',
  caso_de_uso:      'bg-green-100 text-green-700',
  escenario_examen: 'bg-yellow-100 text-yellow-800',
  calculo:          'bg-red-100 text-red-700',
  por_que:          'bg-pink-100 text-pink-700',
  arquitectura:     'bg-indigo-100 text-indigo-700',
  secuencia:        'bg-teal-100 text-teal-700',
  trampa_examen:    'bg-rose-100 text-rose-700',
}

interface Props {
  cards: CardResolved[]
  onCardClick: (card: CardResolved) => void
}

export default function CardGrid({ cards, onCardClick }: Props) {
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No hay tarjetas con esos filtros.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(card => (
        <button
          key={card.id}
          onClick={() => onCardClick(card)}
          className="text-left bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col gap-2"
        >
          <p className="text-sm font-medium text-gray-800 line-clamp-3 flex-1">{card.frente}</p>
          <p className="text-xs text-gray-400 truncate">{card.tema}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_COLORS[card.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
              {card.tipo}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              N{card.nivel}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
