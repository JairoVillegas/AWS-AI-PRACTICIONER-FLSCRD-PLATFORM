import { useState } from 'react'
import type { CardResolved } from '../data/cardIndex'

interface Props {
  card: CardResolved
}

export default function Reverso({ card }: Props) {
  const [mode, setMode] = useState<'quick' | 'learning'>('quick')
  const { reverso } = card

  return (
    <div>
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {(['quick', 'learning'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'quick' ? 'Repaso rápido' : 'Aprendizaje'}
          </button>
        ))}
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-semibold text-blue-900">{reverso.respuesta_corta}</p>
      </div>

      <ul className="mb-4 space-y-1">
        {reverso.puntos_clave.map((pk, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
            <span>{pk}</span>
          </li>
        ))}
      </ul>

      {mode === 'learning' && (
        <>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Explicación</p>
            <p className="text-sm text-gray-700">{reverso.explicacion}</p>
          </div>

          {reverso.tip_examen && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Tip de examen</p>
              <p className="text-sm text-yellow-800">{reverso.tip_examen}</p>
            </div>
          )}

          {card.servicios_aws.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Servicios AWS</p>
              <div className="flex flex-wrap gap-1">
                {card.servicios_aws.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {reverso.glosario_resolved.length > 0 && (
            <details className="mb-4 group">
              <summary className="text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Glosario ({reverso.glosario_resolved.length})
              </summary>
              <div className="mt-2 space-y-2 pl-4">
                {reverso.glosario_resolved.map(entry => (
                  <div key={entry.id} className="p-2 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium text-gray-800">{entry.termino}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{entry.definicion}</p>
                  </div>
                ))}
              </div>
            </details>
          )}

          {reverso.descartes.length > 0 && (
            <details className="mb-4 group">
              <summary className="text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Por qué no ({reverso.descartes.length})
              </summary>
              <div className="mt-2 space-y-2 pl-4">
                {reverso.descartes.map((d, i) => (
                  <div key={i} className="p-2 bg-red-50 rounded-md text-sm">
                    <p className="font-medium text-red-800">{d.opcion}</p>
                    <p className="text-red-600 text-xs mt-0.5">{d.por_que_no}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  )
}
