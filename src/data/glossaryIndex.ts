import type { GlossaryEntry } from '../types/glossary'
import glossaryData from '../../content/glossary.json'

export const glossaryIndex = new Map<string, GlossaryEntry>(
  (glossaryData.entries as GlossaryEntry[]).map(e => [e.id, e]),
)
