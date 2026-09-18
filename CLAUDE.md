# AWS AI Practitioner - App de flashcards

App web personal para preparar la certificación AWS Certified AI Practitioner (AIF-C01).
Sin backend, sin autenticación, sin base de datos. Todo el estado del usuario vive en localStorage.

## Stack

Vite + React + TypeScript + Tailwind.

## Regla principal: `/content` es la fuente de verdad

Los archivos de `/content` se generan fuera de este repo y se reemplazan por completo cada vez
que llega un lote nuevo de contenido.

- **Nunca editar, reformatear ni reordenar nada dentro de `/content`.** Si un dato está mal, se
  reporta; no se corrige aquí.
- Nada de datos mock ni de ejemplo. Si algo falla, debe fallar contra los datos reales.
- El contenido es parcial y crece por lotes. Ningún componente puede asumir que existen los cinco
  dominios ni que un dominio está completo.

## Archivos de contenido

- `content/taxonomy.json` — dominios, task statements, lecciones, tipos de tarjeta y niveles.
  **Es la única fuente de estos valores.** Prohibido escribir literales como `"definicion"` o
  `"1.1"` dispersos en el código; todo sale de aquí.
- `content/glossary.json` — `{ version, nota, entries: [{ id, termino, definicion, aliases[], dominios[] }] }`.
  El `id` es un slug y es la clave de referencia.
- `content/domain-N.json` — `{ dominio, dominio_nombre, peso_examen, version, estado, cards: [...] }`.

## Forma de una tarjeta

```ts
{
  id: string              // "D1-T1.1-L3-004"
  dominio: number
  task_statement: string  // "1.1"
  leccion: number
  tema: string
  tipo: string            // uno de taxonomy.tipos[].id
  nivel: number           // 1..5, de taxonomy.niveles[].id
  frente: string
  reverso: {
    respuesta_corta: string
    explicacion: string
    glosario_refs: string[]   // slugs hacia glossary.entries[].id
    puntos_clave: string[]
    descartes: { opcion: string, por_que_no: string }[]
    tip_examen: string
  }
  servicios_aws: string[]
  tags: string[]
  relacionadas: string[]   // ids de otras tarjetas
  fuente: string
}
```

`descartes` puede venir vacío. `servicios_aws` puede venir vacío.

## Dos modos de lectura del reverso

El reverso se diseñó para servir a dos usos, y la UI debe soportar ambos:

- **Repaso rápido** — solo `respuesta_corta` y `puntos_clave`.
- **Aprendizaje** — todo desplegado, incluidos `glosario` (resuelto desde los slugs), `descartes`
  y `tip_examen`.

`glosario` y `descartes` deben ser colapsables.

## Validación

`npm run validate` debe fallar (exit code distinto de cero) ante: JSON inválido, incumplimiento de
schema, ids de tarjeta duplicados, slugs de glosario duplicados, `glosario_refs` que no existen,
`tipo` o `nivel` fuera de taxonomy, o incoherencia entre el id de la tarjeta y sus campos
`dominio` / `task_statement` / `leccion`.

**Excepción:** un id en `relacionadas` que no existe todavía es un **warning**, no un error.
Apunta a tarjetas de lotes que aún no llegaron. Hoy hay 24 casos así y es lo esperado.

`npm run validate` también imprime un reporte de distribución: tarjetas por dominio, por lección,
por nivel y por tipo. Sirve para detectar lecciones mal cubiertas.

## Fuera de alcance

No hay servidor, no hay cuentas de usuario, no hay sincronización entre dispositivos.
El progreso de estudio debe ser exportable e importable como JSON para no perderlo al limpiar el
navegador.
