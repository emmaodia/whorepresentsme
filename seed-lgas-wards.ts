/**
 * seed-lgas-wards.ts
 * Populates the `lgas` and `wards` tables from the polling-unit JSON files
 * that already live in public/data/polling-units/.
 *
 * The JSON files contain the authoritative INEC LGA→Ward hierarchy
 * (same data used by the "Find my polling unit" feature).
 *
 * It also cross-references lib/data/inec-offices.ts to attach the
 * INEC headquarters town to each LGA record.
 *
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_KEY=<key> npx tsx seed-lgas-wards.ts
 *
 * Safe to re-run — uses upsert on the UNIQUE(state_id, name) /
 * UNIQUE(lga_id, name) constraints.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { INEC_LGA_OFFICES } from './lib/data/inec-offices'

const SUPABASE_URL        = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PU_DIR = path.join(process.cwd(), 'public/data/polling-units')

// Maps JSON filename stem → canonical state name in DB
const FILE_TO_STATE: Record<string, string> = {
  'abia': 'Abia', 'adamawa': 'Adamawa', 'akwa-ibom': 'Akwa Ibom',
  'anambra': 'Anambra', 'bauchi': 'Bauchi', 'bayelsa': 'Bayelsa',
  'benue': 'Benue', 'borno': 'Borno', 'cross-river': 'Cross River',
  'delta': 'Delta', 'ebonyi': 'Ebonyi', 'edo': 'Edo', 'ekiti': 'Ekiti',
  'enugu': 'Enugu', 'fct': 'FCT', 'gombe': 'Gombe', 'imo': 'Imo',
  'jigawa': 'Jigawa', 'kaduna': 'Kaduna', 'kano': 'Kano',
  'katsina': 'Katsina', 'kebbi': 'Kebbi', 'kogi': 'Kogi', 'kwara': 'Kwara',
  'lagos': 'Lagos', 'nasarawa': 'Nasarawa', 'niger': 'Niger', 'ogun': 'Ogun',
  'ondo': 'Ondo', 'osun': 'Osun', 'oyo': 'Oyo', 'plateau': 'Plateau',
  'rivers': 'Rivers', 'sokoto': 'Sokoto', 'taraba': 'Taraba',
  'yobe': 'Yobe', 'zamfara': 'Zamfara',
}

// Build a lookup: "STATE:lga name lowercase" → headquarters town
const HQ_MAP = new Map<string, string>()
for (const o of INEC_LGA_OFFICES) {
  HQ_MAP.set(`${o.state}:${o.lga.toLowerCase()}`, o.headquarters)
}

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

// Batch upsert helper
async function upsertBatch(
  table: string,
  rows: Record<string, unknown>[],
  conflict: string,
  chunkSize = 500,
): Promise<void> {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const { error } = await db.from(table).upsert(chunk, {
      onConflict: conflict,
      ignoreDuplicates: true,
    })
    if (error) throw new Error(`upsert ${table}: ${error.message}`)
  }
}

async function run() {
  console.log('\n🌱  seed-lgas-wards.ts\n')

  // ── 1. Load state IDs ─────────────────────────────────────────────────────────
  const { data: stateRows, error: stateErr } = await db
    .from('states').select('id, name')
  if (stateErr || !stateRows?.length) {
    console.error('Cannot load states:', stateErr?.message)
    process.exit(1)
  }
  const stateIdMap = new Map(stateRows.map(s => [s.name as string, s.id as number]))

  // ── 2. Build LGA records from JSON files ──────────────────────────────────────
  type LGARow  = { state_id: number; name: string; headquarters: string | null; [k: string]: unknown }
  type WardSpec = { stateName: string; lgaName: string; wardName: string }

  const lgaRows: LGARow[] = []
  const wardSpecs: WardSpec[] = []
  const seenLGAs = new Set<string>()

  const files = fs.readdirSync(PU_DIR)
    .filter(f => f.endsWith('.json') && f !== 'index.json')
    .sort()

  for (const file of files) {
    const stem = file.replace('.json', '')
    const stateName = FILE_TO_STATE[stem]
    if (!stateName) { console.warn(`  ⚠️  No state mapping for ${file}`); continue }

    const stateId = stateIdMap.get(stateName)
    if (!stateId) { console.warn(`  ⚠️  State "${stateName}" not found in DB`); continue }

    const raw = JSON.parse(fs.readFileSync(path.join(PU_DIR, file), 'utf8'))
    const lgasObj: Record<string, Record<string, unknown[]>> = raw.lgas

    for (const [lgaKey, wardsObj] of Object.entries(lgasObj)) {
      const lgaName = toTitleCase(lgaKey)
      const uniqueKey = `${stateName}::${lgaName}`

      if (!seenLGAs.has(uniqueKey)) {
        seenLGAs.add(uniqueKey)
        const hq = HQ_MAP.get(`${stateName}:${lgaKey}`) ?? null
        lgaRows.push({ state_id: stateId, name: lgaName, headquarters: hq })
      }

      for (const wardKey of Object.keys(wardsObj)) {
        wardSpecs.push({
          stateName,
          lgaName,
          wardName: toTitleCase(wardKey),
        })
      }
    }
  }

  console.log(`  ${lgaRows.length} LGAs collected across ${files.length} states`)
  console.log(`  ${wardSpecs.length} wards collected\n`)

  // ── 3. Upsert LGAs ────────────────────────────────────────────────────────────
  console.log('Upserting LGAs...')
  await upsertBatch('lgas', lgaRows, 'state_id,name')
  console.log(`  ✓ ${lgaRows.length} LGAs upserted`)

  // ── 4. Reload LGA IDs ─────────────────────────────────────────────────────────
  const { data: lgaDbRows, error: lgaErr } = await db
    .from('lgas').select('id, state_id, name')
  if (lgaErr || !lgaDbRows?.length) {
    console.error('Cannot load lgas after insert:', lgaErr?.message)
    process.exit(1)
  }
  // Build lookup: "state_id::lga_name" → lga_id
  const lgaIdMap = new Map<string, number>()
  for (const row of lgaDbRows) {
    lgaIdMap.set(`${row.state_id}::${row.name}`, row.id as number)
  }

  // ── 5. Build ward rows ────────────────────────────────────────────────────────
  type WardRow = { lga_id: number; name: string; [k: string]: unknown }
  const wardRows: WardRow[] = []

  for (const spec of wardSpecs) {
    const stateId = stateIdMap.get(spec.stateName)!
    const lgaId   = lgaIdMap.get(`${stateId}::${spec.lgaName}`)
    if (!lgaId) {
      console.warn(`  ⚠️  LGA not found in DB: ${spec.stateName} / ${spec.lgaName}`)
      continue
    }
    wardRows.push({ lga_id: lgaId, name: spec.wardName })
  }

  // ── 6. Upsert wards ───────────────────────────────────────────────────────────
  console.log('\nUpserting wards...')
  await upsertBatch('wards', wardRows, 'lga_id,name')
  console.log(`  ✓ ${wardRows.length} wards upserted`)

  // ── Summary ───────────────────────────────────────────────────────────────────
  const { count: lgaCount }  = await db.from('lgas').select('*', { count: 'exact', head: true })
  const { count: wardCount } = await db.from('wards').select('*', { count: 'exact', head: true })

  console.log(`\n✅  Done.`)
  console.log(`   lgas  table: ${lgaCount} rows`)
  console.log(`   wards table: ${wardCount} rows`)
  console.log('\nNext steps:')
  console.log('  1. Run migrations/016_create_lgas_wards.sql on your Supabase project first.')
  console.log('  2. Then run this script with your SUPABASE_URL and SUPABASE_SERVICE_KEY.')
  console.log('  3. Use lga_id / ward_id on the officials table when adding LGA chairmen and councillors.\n')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
