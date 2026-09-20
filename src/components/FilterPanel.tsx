import taxonomyData from '../../content/taxonomy.json'
import { defaultFilters, allServiciosAws, allTags, type FilterState } from '../data/cardIndex'

type Taxonomy = typeof taxonomyData

interface MultiCheckProps {
  label: string
  options: { value: string | number; label: string }[]
  selected: (string | number)[]
  onToggle: (value: string | number) => void
}

function MultiCheck({ label, options, selected, onToggle }: MultiCheckProps) {
  if (options.length === 0) return null
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
      <div className="space-y-1">
        {options.map(opt => (
          <label key={String(opt.value)} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="mt-0.5 rounded shrink-0"
            />
            <span className="text-gray-700 leading-snug">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

interface Props {
  filters: FilterState
  onChange: (f: FilterState) => void
}

const taxonomy: Taxonomy = taxonomyData

export default function FilterPanel({ filters, onChange }: Props) {
  function toggle(key: keyof FilterState, value: string | number) {
    const current = filters[key] as (string | number)[]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const availableTs = taxonomy.dominios
    .filter(d => filters.dominios.length === 0 || filters.dominios.includes(d.id))
    .flatMap(d => d.task_statements)

  const availableLessons = availableTs
    .filter(ts => filters.taskStatements.length === 0 || filters.taskStatements.includes(ts.id))
    .flatMap(ts => ts.lecciones)

  const hasFilters =
    filters.dominios.length > 0 ||
    filters.taskStatements.length > 0 ||
    filters.lecciones.length > 0 ||
    filters.tipos.length > 0 ||
    filters.niveles.length > 0 ||
    filters.serviciosAws.length > 0 ||
    filters.tags.length > 0 ||
    filters.texto !== ''

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-700">Filtros</span>
        {hasFilters && (
          <button
            onClick={() => onChange(defaultFilters())}
            className="text-xs text-blue-600 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Búsqueda</p>
        <input
          type="text"
          placeholder="frente, tema, tags…"
          value={filters.texto}
          onChange={e => onChange({ ...filters, texto: e.target.value })}
          className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <MultiCheck
        label="Dominio"
        options={taxonomy.dominios.map(d => ({ value: d.id, label: `${d.id}. ${d.nombre}` }))}
        selected={filters.dominios}
        onToggle={v => toggle('dominios', v)}
      />

      <MultiCheck
        label="Task Statement"
        options={availableTs.map(ts => ({ value: ts.id, label: `${ts.id} ${ts.nombre}` }))}
        selected={filters.taskStatements}
        onToggle={v => toggle('taskStatements', v)}
      />

      <MultiCheck
        label="Lección"
        options={availableLessons.map(l => ({ value: l.n, label: `L${l.n} — ${l.titulo}` }))}
        selected={filters.lecciones}
        onToggle={v => toggle('lecciones', v)}
      />

      <MultiCheck
        label="Tipo"
        options={taxonomy.tipos.map(t => ({ value: t.id, label: t.nombre }))}
        selected={filters.tipos}
        onToggle={v => toggle('tipos', v)}
      />

      <MultiCheck
        label="Nivel"
        options={taxonomy.niveles.map(n => ({ value: n.id, label: `${n.id} — ${n.nombre}` }))}
        selected={filters.niveles}
        onToggle={v => toggle('niveles', v)}
      />

      <MultiCheck
        label="Servicio AWS"
        options={allServiciosAws.map(s => ({ value: s, label: s }))}
        selected={filters.serviciosAws}
        onToggle={v => toggle('serviciosAws', v)}
      />

      <MultiCheck
        label="Tags"
        options={allTags.map(t => ({ value: t, label: t }))}
        selected={filters.tags}
        onToggle={v => toggle('tags', v)}
      />
    </div>
  )
}
