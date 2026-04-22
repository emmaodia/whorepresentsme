import Link from 'next/link'
import { ELECTIVE_OFFICES } from '@/lib/data/elective-offices'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Run for Office in Nigeria — MyReps.ng',
  description: 'A step-by-step guide to becoming a candidate for elected office in Nigeria — from joining a party to election day.',
}

interface Step {
  number: number
  title: string
  body: string
  tips?: string[]
  warning?: string
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Choose your office',
    body: 'Nigeria has nine categories of elective office across three tiers of government — Federal, State, and Local Government. Your first decision is which office you want to contest and for which constituency. Different offices have different constitutional requirements, campaign scales, and costs.',
    tips: [
      'Federal offices (President, Senator, HOR Member) require a nationwide or large-scale campaign.',
      'State offices (Governor, Deputy Governor, State Assembly) are state-wide or within a state constituency.',
      'Local Government offices (LGA Chairman, Councillor) are smaller in scale and often a good starting point.',
      'Check the qualifications on our office pages before investing time in a campaign.',
    ],
  },
  {
    number: 2,
    title: 'Confirm your eligibility',
    body: 'Before anything else, verify that you meet all constitutional and INEC requirements for your chosen office. Disqualifications can end your campaign at any point — even after winning.',
    tips: [
      'Nigerian citizenship by birth (for the President); by birth or naturalisation for other offices.',
      'Age requirements: President/Governor = 40+; Senator = 35+; HOR Member = 30+; State Assembly = 25+; LGA = 25+; Councillor = 21+.',
      'You must hold a valid School Certificate (WAEC, NECO, GCE, or equivalent) or higher.',
      'No conviction involving dishonesty or fraud in the last 10 years.',
      'No current prison sentence exceeding 12 months.',
      'Must not have been declared of unsound mind by a court.',
    ],
    warning: 'Providing false information on nomination forms is a criminal offence under the Electoral Act 2022.',
  },
  {
    number: 3,
    title: 'Join a registered political party',
    body: 'In Nigeria you must contest on the platform of a political party. Independent candidacy is not permitted for most offices. You should join and be a registered member of a political party before the primaries.',
    tips: [
      'INEC maintains the register of political parties — only parties with INEC recognition are valid.',
      'Joining a party early builds internal relationships needed to win the primaries.',
      'Review the party\'s constitution, manifesto, and internal rules before committing.',
      'Understand the party\'s zoning and rotation arrangements — some positions are reserved for particular zones.',
    ],
  },
  {
    number: 4,
    title: 'Win your party primary',
    body: 'Under the Electoral Act 2022, every candidate must emerge from a valid party primary before being submitted to INEC. Party primaries are closely regulated and INEC monitors them.',
    tips: [
      'Direct primaries: every party member in the constituency votes.',
      'Indirect/delegate primaries: delegates elected by party members vote.',
      'Notify your party of your intention to contest; pay any required expression-of-interest and nomination fees.',
      'Campaign within your party before the primary — build delegate and grassroots support.',
      'INEC monitors primaries and will reject candidates whose primaries were conducted in violation of the Electoral Act.',
    ],
    warning: 'Court cases challenging primary outcomes are common. Keep documentary evidence of every step — attendance lists, notices, and results sheets.',
  },
  {
    number: 5,
    title: 'File your nomination with INEC',
    body: 'After winning your primary, your party submits your nomination to INEC within the deadline specified in the election timetable. You also file your personal nomination documents.',
    tips: [
      'Your party submits Form EC.9 (Notice of Candidate) to INEC.',
      'You must personally fill and submit Form CF.001 (Affidavit of Personal Particulars) — sworn before a High Court judge.',
      'Submit your educational certificates, sworn affidavit, and passport photographs.',
      'Pay the INEC nomination fee (varies by office; set by INEC in the election guidelines).',
      'Presidential and Governorship candidates: attach your running mate\'s details at the same time.',
    ],
    warning: 'Missing INEC filing deadlines disqualifies you — there are no extensions. Track the INEC election timetable at inec.gov.ng.',
  },
  {
    number: 6,
    title: 'Open a campaign account and comply with finance rules',
    body: 'Campaign finance is strictly regulated under the Electoral Act 2022. You must open a dedicated campaign account and report all contributions and expenditures.',
    tips: [
      'Open a separate bank account solely for campaign funds before spending anything.',
      'Expenditure limits per the Electoral Act 2022: President = ₦5 billion; Governor = ₦1 billion; Senator = ₦100 million; HOR Member = ₦70 million; State Assembly = ₦30 million; LGA Chairman = ₦30 million; Councillor = ₦5 million.',
      'Submit a campaign finance report to INEC within 6 months of the election.',
      'Corporate donations are prohibited — individual contributions are capped.',
      'Cash donations above ₦500,000 are prohibited; use bank transfers.',
    ],
    warning: 'Violating campaign finance rules is a criminal offence. INEC and the Independent Corrupt Practices Commission (ICPC) actively investigate violations.',
  },
  {
    number: 7,
    title: 'Declare your assets to the Code of Conduct Bureau',
    body: 'Public officers (elected or appointed) must declare their assets to the Code of Conduct Bureau (CCB) before taking office. This is separate from the INEC process but equally important.',
    tips: [
      'Fill and submit Form CCB1 (Asset Declaration Form) truthfully.',
      'Declare all assets: real estate, vehicles, bank accounts, investments, business interests.',
      'Include assets held by your spouse and children.',
      'Asset declarations are not immediately public but may be investigated.',
    ],
    warning: 'False asset declaration is a criminal offence and can lead to removal from office and prosecution.',
  },
  {
    number: 8,
    title: 'Campaign — know the rules',
    body: 'Campaign is regulated by the Electoral Act and INEC guidelines. There are prohibited activities that can lead to disqualification or criminal prosecution.',
    tips: [
      'Campaign only during the INEC-approved campaign period (usually 90–150 days before the election).',
      'Do not bribe voters — vote-buying is a criminal offence under Section 130 of the Electoral Act 2022.',
      'Use INEC-accredited campaign materials (include your party logo, INEC stamp on posters).',
      'Social media campaigning is allowed but must not spread false information.',
      'Respect other candidates — electoral offences include harassment and intimidation of voters or opponents.',
      'Rally and campaign permits may be required from local authorities.',
    ],
    warning: 'Campaign spending before the official campaign period still counts against your expenditure limit.',
  },
  {
    number: 9,
    title: 'Election day',
    body: 'On election day, INEC administers the voting using the Bimodal Voter Accreditation System (BVAS). Results are uploaded to the INEC Result Viewing Portal (IReV).',
    tips: [
      'Deploy accredited polling agents to every polling unit in your constituency.',
      'Ensure your agents receive and sign polling unit result sheets (Form EC8A).',
      'Monitor the IReV portal for real-time results upload — this is your main evidence in any dispute.',
      'Do not concede or celebrate until collation is complete at the ward, LGA, and state (or national) levels.',
    ],
  },
  {
    number: 10,
    title: 'After the election — results and tribunals',
    body: 'If you win, you proceed to inauguration. If you believe the election was flawed, you have limited time to challenge the result in an election tribunal.',
    tips: [
      'File an election petition within 21 days of the declaration of results.',
      'Election petitions go to the Election Petition Tribunal (EPT), then the Court of Appeal, then the Supreme Court (presidential only).',
      'Grounds for petition: non-compliance with the Electoral Act, corrupt practices, or the winner not qualifying.',
      'Collect your Form EC8A (polling unit results) immediately — this is your primary evidence.',
      'Hire experienced electoral law practitioners early; timelines are strict and non-extendable.',
    ],
    warning: 'Do not delay — 21 days is an absolute deadline. The Supreme Court cannot extend it.',
  },
]

export default function RunForOfficePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/offices" className="text-sm text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
            Browse offices
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/offices" className="hover:text-gray-600">Elective Offices</Link>
          <span>/</span>
          <span className="text-gray-600">How to run for office</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">How to Run for Office in Nigeria</h1>
        <p className="text-sm text-gray-500 mb-2 max-w-2xl">
          A practical, step-by-step guide based on the Constitution of the Federal Republic of Nigeria 1999
          (as amended) and the Electoral Act 2022.
        </p>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-2 mb-8 max-w-2xl">
          This guide is for information only — not legal advice. Consult a qualified electoral law practitioner
          before taking action.
        </p>

        {/* ── Office picker ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Quick — pick your office
          </h2>
          <div className="flex flex-wrap gap-2">
            {ELECTIVE_OFFICES.map(o => (
              <Link
                key={o.slug}
                href={`/offices/${o.slug}`}
                className="text-xs border border-gray-200 rounded-full px-3 py-1.5 hover:border-green-300 hover:bg-green-50 text-gray-700 transition-colors"
              >
                {o.shortTitle}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Steps ─────────────────────────────────────────────────────── */}
        <div className="space-y-10">
          {STEPS.map(step => (
            <div key={step.number} className="relative pl-10 sm:pl-12">
              {/* Step number */}
              <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-green-800 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {step.number}
              </div>
              {/* Connector line */}
              {step.number < STEPS.length && (
                <div className="absolute left-3.5 top-7 bottom-0 w-px bg-green-100" style={{ height: 'calc(100% + 2.5rem)' }} />
              )}

              <h2 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                {step.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.body}</p>

              {step.tips && (
                <ul className="space-y-1.5 mb-3">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {step.warning && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm text-red-700">
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  {step.warning}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Key contacts ──────────────────────────────────────────────── */}
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Key contacts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'INEC — election administration', url: 'https://inec.gov.ng' },
              { name: 'Code of Conduct Bureau — asset declaration', url: 'https://ccb.gov.ng' },
              { name: 'ICPC — campaign finance oversight', url: 'https://icpc.gov.ng' },
              { name: 'EFCC — financial crimes', url: 'https://efcc.gov.ng' },
            ].map(c => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:border-green-200 hover:bg-green-50 transition-colors group"
              >
                <span className="text-sm text-gray-700">{c.name}</span>
                <span className="text-xs text-green-600 group-hover:underline">Visit →</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Related ───────────────────────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/offices" className="bg-green-50 border border-green-100 rounded-xl px-5 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-900 mb-1">Browse all elective offices</p>
            <p className="text-xs text-green-700">Qualifications, powers, and salaries for every office.</p>
          </Link>
          <Link href="/voter-guide" className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-100 transition-colors">
            <p className="text-sm font-semibold text-gray-900 mb-1">Voter registration guide</p>
            <p className="text-xs text-gray-500">How voters register and vote — what candidates should know.</p>
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Information based on the Constitution of the Federal Republic of Nigeria 1999 (as amended), the
          Electoral Act 2022, and INEC guidelines. Expenditure limits are as published in the Electoral Act 2022,
          Section 88. Always verify the latest INEC timetable at inec.gov.ng before filing.
        </p>
      </div>
    </main>
  )
}
