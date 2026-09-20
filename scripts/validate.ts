import { readFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ROOT = process.cwd()

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

const cardSchema = readJson(resolve(ROOT, 'schema/card.schema.json'))
const glossarySchema = readJson(resolve(ROOT, 'schema/glossary.schema.json'))
const glossaryFile = readJson(resolve(ROOT, 'content/glossary.json')) as {
  entries: { id: string; [k: string]: unknown }[]
}

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validateCard = ajv.compile(cardSchema as object)
const validateGlossary = ajv.compile(glossarySchema as object)

let hasErrors = false
const errors: string[] = []
const warnings: string[] = []

function err(msg: string) { errors.push(`  ✗ ${msg}`); hasErrors = true }
function warn(msg: string) { warnings.push(`  ⚠ ${msg}`) }

// --- Validate glossary ---
console.log('Validating content/glossary.json...')
if (!validateGlossary(glossaryFile)) {
  for (const e of validateGlossary.errors ?? []) {
    err(`glossary.json ${e.instancePath} ${e.message}`)
  }
}

const glossaryIds = new Set<string>()
for (const entry of glossaryFile.entries) {
  if (glossaryIds.has(entry.id)) err(`Slug de glosario duplicado: "${entry.id}"`)
  else glossaryIds.add(entry.id)
}

// --- Load and validate domain files ---
const contentDir = resolve(ROOT, 'content')
const domainFiles = readdirSync(contentDir)
  .filter(f => /^domain-\d+\.json$/.test(f))
  .sort()

interface RawCard {
  id?: string
  dominio?: number
  task_statement?: string
  leccion?: number
  reverso?: { glosario_refs?: string[] }
  relacionadas?: string[]
  [k: string]: unknown
}

const allCards: RawCard[] = []
const cardIds = new Set<string>()

for (const file of domainFiles) {
  const filePath = join(contentDir, file)
  const domain = readJson(filePath) as { cards?: RawCard[] }
  const cards = domain.cards ?? []
  console.log(`Validating ${file} (${cards.length} cards)...`)

  for (const card of cards) {
    if (!validateCard(card)) {
      for (const e of validateCard.errors ?? []) {
        err(`${file} [${card.id ?? '?'}] ${e.instancePath} ${e.message}`)
      }
    }

    const id = card.id ?? ''
    if (cardIds.has(id)) err(`ID de tarjeta duplicado: "${id}"`)
    else if (id) cardIds.add(id)

    // ID ↔ campos coherence
    const match = id.match(/^D(\d+)-T(\d+\.\d+)-L(\d+)-\d{3}$/)
    if (match) {
      if (Number(match[1]) !== card.dominio)
        err(`${id}: dominio en id (${match[1]}) ≠ campo dominio (${card.dominio})`)
      if (match[2] !== card.task_statement)
        err(`${id}: task_statement en id (${match[2]}) ≠ campo (${card.task_statement})`)
      if (Number(match[3]) !== card.leccion)
        err(`${id}: leccion en id (${match[3]}) ≠ campo (${card.leccion})`)
    }

    // glosario_refs exist
    for (const ref of card.reverso?.glosario_refs ?? []) {
      if (!glossaryIds.has(ref)) err(`${id}: glosario_ref inexistente: "${ref}"`)
    }

    allCards.push(card)
  }
}

// Warnings: relacionadas not yet existing
for (const card of allCards) {
  for (const rel of card.relacionadas ?? []) {
    if (!cardIds.has(rel)) warn(`${card.id}: relacionada pendiente: "${rel}"`)
  }
}

// --- Distribution report ---
const LINE = '─'.repeat(60)
console.log(`\n${LINE}`)
console.log('REPORTE DE DISTRIBUCIÓN')
console.log(LINE)
console.log(`Total tarjetas:          ${allCards.length}`)
console.log(`Total entradas glosario: ${glossaryFile.entries.length}`)

const count = <K,>(arr: K[], key: (x: K) => string | number): Map<string | number, number> => {
  const m = new Map<string | number, number>()
  for (const x of arr) { const k = key(x); m.set(k, (m.get(k) ?? 0) + 1) }
  return m
}

const sorted = <K extends string | number>(m: Map<K, number>) =>
  [...m.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))

console.log('\nPor dominio:')
for (const [k, n] of sorted(count(allCards, c => c.dominio ?? '?')))
  console.log(`  Dominio ${k}: ${n}`)

console.log('\nPor task statement:')
for (const [k, n] of sorted(count(allCards, c => c.task_statement ?? '?')))
  console.log(`  ${k}: ${n}`)

console.log('\nPor nivel:')
for (const [k, n] of sorted(count(allCards, c => (c as { nivel?: number }).nivel ?? '?')))
  console.log(`  N${k}: ${n}`)

console.log('\nPor tipo:')
for (const [k, n] of sorted(count(allCards, c => (c as { tipo?: string }).tipo ?? '?')))
  console.log(`  ${k}: ${n}`)

// --- Warnings ---
if (warnings.length > 0) {
  console.log(`\n⚠  Warnings (${warnings.length}):`)
  warnings.forEach(w => console.log(w))
}

// --- Errors ---
if (errors.length > 0) {
  console.log(`\n✗ Errores (${errors.length}):`)
  errors.forEach(e => console.log(e))
  process.exit(1)
} else {
  console.log('\n✓ Validación exitosa')
}
