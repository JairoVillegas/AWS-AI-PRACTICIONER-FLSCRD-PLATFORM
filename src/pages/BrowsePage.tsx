import { useState, useMemo } from 'react'
import { allCards, filterCards, defaultFilters, type FilterState, type CardResolved } from '../data/cardIndex'
import FilterPanel from '../components/FilterPanel'
import CardGrid from '../components/CardGrid'
import CardModal from '../components/CardModal'

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters())
  const [selectedCard, setSelectedCard] = useState<CardResolved | null>(null)

  const filtered = useMemo(() => filterCards(filters), [filters])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">AWS AI Practitioner</h1>
        <span className="text-sm text-gray-400">
          {filtered.length} de {allCards.length} tarjeta{allCards.length !== 1 ? 's' : ''}
        </span>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-72 shrink-0 border-r bg-white overflow-y-auto p-4">
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <CardGrid cards={filtered} onCardClick={setSelectedCard} />
        </main>
      </div>

      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}
