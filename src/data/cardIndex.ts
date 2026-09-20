import type { Card } from '../types/card'
import type { GlossaryEntry } from '../types/glossary'
import { loadAllCards } from './loader'
import { glossaryIndex } from './glossaryIndex'

export interface CardResolved extends Card {
  reverso: Card['reverso'] & { glosario_resolved: GlossaryEntry[] }
}

export interface FilterState {
  dominios: number[]
  taskStatements: string[]
  lecciones: number[]
  tipos: string[]
  niveles: number[]
  serviciosAws: string[]
  tags: string[]
  texto: string
}

export function defaultFilters(): FilterState {
  return {
    dominios: [],
    taskStatements: [],
    lecciones: [],
    tipos: [],
    niveles: [],
    serviciosAws: [],
    tags: [],
    texto: '',
  }
}

export const allCards: CardResolved[] = loadAllCards().map(card => ({
  ...card,
  reverso: {
    ...card.reverso,
    glosario_resolved: card.reverso.glosario_refs
      .map(ref => glossaryIndex.get(ref))
      .filter((e): e is GlossaryEntry => e !== undefined),
  },
}))

export const allServiciosAws: string[] = [
  ...new Set(allCards.flatMap(c => c.servicios_aws)),
].sort()

export const allTags: string[] = [
  ...new Set(allCards.flatMap(c => c.tags)),
].sort()

export function filterCards(filters: FilterState): CardResolved[] {
  return allCards.filter(card => {
    if (filters.dominios.length > 0 && !filters.dominios.includes(card.dominio)) return false
    if (filters.taskStatements.length > 0 && !filters.taskStatements.includes(card.task_statement)) return false
    if (filters.lecciones.length > 0 && !filters.lecciones.includes(card.leccion)) return false
    if (filters.tipos.length > 0 && !filters.tipos.includes(card.tipo)) return false
    if (filters.niveles.length > 0 && !filters.niveles.includes(card.nivel as number)) return false
    if (filters.serviciosAws.length > 0 && !filters.serviciosAws.some(s => card.servicios_aws.includes(s))) return false
    if (filters.tags.length > 0 && !filters.tags.some(t => card.tags.includes(t))) return false
    if (filters.texto) {
      const q = filters.texto.toLowerCase()
      const haystack = [card.frente, card.tema, ...card.tags].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}
