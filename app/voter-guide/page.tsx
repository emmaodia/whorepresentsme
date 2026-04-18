import Link from 'next/link'

export const metadata = {
  title: 'Voter Registration & Election Day Guide | WhoRepresentsMe.ng',
  description: 'Everything you need to know about voter registration, what to bring on election day, and how voting works in Nigeria.',
}

export default function VoterGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-4 overflow-hidden rounded-sm border border-gray-200">
              <div className="w-2 bg-green-800" />
              <div className="w-2 bg-white" />
              <div className="w-2 bg-green-800" />
            </div>
            <span className="text-base font-semibold text-green-800 tracking-tight">
              WhoRepresentsMe<span className="text-gray-400">.ng</span>
            </span>
          </Link>
          <div className="flex gap-3 text-xs">
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-700 py-1.5">
              Full directory
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Voter Registration & Election Day Guide</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Everything you need to know to register, prepare for, and participate in Nigerian elections.
          </p>
        </div>

        {/* ── Quick links ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-10">
          <QuickLink href="#register" label="How to register" />
          <QuickLink href="#documents" label="What you need" />
          <QuickLink href="#election-day" label="Election day" />
          <QuickLink href="#rights" label="Your rights" />
        </div>

        {/* ── Section 1: Registration ──────────────────────────────── */}
        <Section id="register" number={1} title="How to register to vote">
          <p>
            Voter registration in Nigeria is managed by the <strong>Independent National Electoral Commission (INEC)</strong> through
            the Continuous Voter Registration (CVR) exercise.
          </p>

          <StepList steps={[
            {
              title: 'Pre-register online',
              description: 'Visit the INEC CVR portal at cvr.inecnigeria.org to fill in your details and book an appointment at your nearest registration centre.',
            },
            {
              title: 'Visit a registration centre',
              description: 'Go to your designated INEC registration centre (usually your LGA INEC office) on your appointment date. Bring a valid ID and proof of address.',
            },
            {
              title: 'Biometric capture',
              description: 'INEC will capture your fingerprints, photograph, and other biometric data. This takes about 10-15 minutes.',
            },
            {
              title: 'Collect your PVC',
              description: 'Your Permanent Voter\'s Card (PVC) will be ready for collection at the same INEC office. Check INEC\'s website or call your LGA office for collection dates.',
            },
          ]} />

          <InfoBox type="important">
            You must register at a centre within your state/LGA of residence. You can only vote at the polling unit where you registered.
          </InfoBox>
        </Section>

        {/* ── Section 2: Documents ─────────────────────────────────── */}
        <Section id="documents" number={2} title="What you need">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">For registration</h4>
          <ul className="text-sm text-gray-700 space-y-1.5 mb-4">
            <li className="flex items-start gap-2"><Bullet />A valid government-issued ID (NIN slip, national ID card, international passport, or driver's licence)</li>
            <li className="flex items-start gap-2"><Bullet />Proof of address (utility bill, bank statement, or tenancy agreement)</li>
            <li className="flex items-start gap-2"><Bullet />Your National Identification Number (NIN) — mandatory since 2021</li>
          </ul>

          <h4 className="text-sm font-semibold text-gray-900 mb-2">For election day</h4>
          <ul className="text-sm text-gray-700 space-y-1.5">
            <li className="flex items-start gap-2"><Bullet />Your Permanent Voter's Card (PVC) — this is the <strong>only</strong> acceptable ID at the polling unit</li>
            <li className="flex items-start gap-2"><Bullet />Know your polling unit number and location (check on INEC's voter status portal)</li>
          </ul>

          <InfoBox type="tip">
            Check your voter status and polling unit at{' '}
            <a href="https://voters.inecnigeria.org" target="_blank" rel="noreferrer" className="text-green-700 underline">
              voters.inecnigeria.org
            </a>
          </InfoBox>
        </Section>

        {/* ── Section 3: Election day ──────────────────────────────── */}
        <Section id="election-day" number={3} title="What happens on election day">
          <StepList steps={[
            {
              title: 'Arrive early',
              description: 'Polling units open at 8:30 AM and close at 2:30 PM. Arrive early — if you are in the queue by 2:30 PM, you will be allowed to vote.',
            },
            {
              title: 'Accreditation',
              description: 'Present your PVC to the polling officer. Your identity is verified using INEC\'s Bimodal Voter Accreditation System (BVAS) — fingerprint and facial recognition.',
            },
            {
              title: 'Receive your ballot',
              description: 'After accreditation, you receive a ballot paper. Each election (Presidential, Governorship, Senate, House of Reps) has a separate ballot with a different colour.',
            },
            {
              title: 'Mark your choice',
              description: 'Go to the voting cubicle. Mark your preferred candidate\'s box with a thumbprint using the ink pad provided. Fold the ballot and put it in the ballot box.',
            },
            {
              title: 'Results',
              description: 'Counting happens at the polling unit immediately after voting closes. Results are announced publicly at the polling unit, then transmitted electronically via the INEC Result Viewing Portal (IReV).',
            },
          ]} />

          <InfoBox type="important">
            Movement is restricted on election day. No vehicular movement is allowed except for emergency services and accredited election officials. Plan to walk to your polling unit.
          </InfoBox>
        </Section>

        {/* ── Section 4: Rights ────────────────────────────────────── */}
        <Section id="rights" number={4} title="Your rights as a voter">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <RightCard title="Secret ballot" description="Your vote is private. Nobody can see who you voted for. The voting cubicle ensures secrecy." />
            <RightCard title="Free from intimidation" description="It is a criminal offence for anyone to intimidate, threaten, or coerce you regarding your vote." />
            <RightCard title="Assistance if needed" description="Voters with disabilities or who cannot read may request assistance from a person of their choice." />
            <RightCard title="Report irregularities" description="You can report electoral offences to INEC, the police, or civil society election observers." />
            <RightCard title="Observe the count" description="You have the right to remain at the polling unit to watch vote counting and result announcement." />
            <RightCard title="Challenge results" description="Election results can be challenged through the Election Petition Tribunal within 21 days." />
          </div>
        </Section>

        {/* ── Section 5: Key contacts ──────────────────────────────── */}
        <Section id="contacts" number={5} title="Key contacts & resources">
          <div className="space-y-2">
            <ContactRow label="INEC website" value="inecnigeria.org" href="https://inecnigeria.org" />
            <ContactRow label="INEC CVR portal" value="cvr.inecnigeria.org" href="https://cvr.inecnigeria.org" />
            <ContactRow label="Check voter status" value="voters.inecnigeria.org" href="https://voters.inecnigeria.org" />
            <ContactRow label="View election results" value="irev.inecnigeria.org" href="https://irev.inecnigeria.org" />
            <ContactRow label="INEC contact centre" value="0700-CALL-INEC (0700-2255-4632)" href="tel:070022554632" />
          </div>
        </Section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="mt-10 bg-green-50 border border-green-100 rounded-lg p-6 text-center">
          <p className="text-sm font-semibold text-green-800 mb-1">Know who you're voting for</p>
          <p className="text-xs text-green-600 mb-4">
            Look up every elected official who represents you — senators, HOR members, your governor.
          </p>
          <Link
            href="/find"
            className="inline-block text-sm bg-green-800 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition-colors"
          >
            Find my representatives
          </Link>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 mt-12 px-4 py-6">
        <div className="max-w-3xl mx-auto text-center text-xs text-gray-400">
          <p className="mb-2">
            This guide is for informational purposes. For official and up-to-date information,
            visit <a href="https://inecnigeria.org" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">inecnigeria.org</a>.
          </p>
          <p>WhoRepresentsMe.ng · Open data · Nigeria</p>
        </div>
      </footer>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ id, number, title, children }: { id: string; number: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-green-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="pl-10 space-y-3 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function StepList({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-900">{step.title}</p>
            <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function InfoBox({ type, children }: { type: 'important' | 'tip'; children: React.ReactNode }) {
  const styles = type === 'important'
    ? 'bg-amber-50 border-amber-200 text-amber-800'
    : 'bg-blue-50 border-blue-200 text-blue-800'
  const label = type === 'important' ? 'Important' : 'Tip'

  return (
    <div className={`border rounded-lg px-4 py-3 mt-3 ${styles}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  )
}

function RightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-lg px-3 sm:px-4 py-2.5 gap-2">
      <span className="text-xs text-gray-400">{label}</span>
      <a href={href} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline">
        {value}
      </a>
    </div>
  )
}

function Bullet() {
  return <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0 mt-1.5" />
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-center text-xs sm:text-sm bg-green-50 text-green-800 border border-green-100 rounded-lg px-3 py-3 hover:bg-green-100 transition-colors font-medium"
    >
      {label}
    </a>
  )
}
