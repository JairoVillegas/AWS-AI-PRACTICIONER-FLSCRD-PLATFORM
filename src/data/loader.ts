import type { Card } from '../types/card'

interface DomainFile {
  dominio: number
  cards: Card[]
}

const modules = import.meta.glob<DomainFile>('../../content/domain-*.json', { eager: true })

export function loadAllCards(): Card[] {
  return Object.values(modules).flatMap(m => m.cards)
}
