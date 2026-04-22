import Link from 'next/link'
import type { Metadata } from 'next'
import VoterRegistrationClient from '@/components/VoterRegistrationClient'
import { INEC_STATE_OFFICES } from '@/lib/data/inec-offices'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Voter Registration & PVC Collection — MyReps.ng',
  description: "Find INEC registration offices near you across all 36 states and the FCT. Locate your state and LGA office to register to vote or collect your Permanent Voter's Card.",
}

export default function VoterRegistrationPage() {
  const states = INEC_STATE_OFFICES.map(o => o.state).sort()

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <div className="flex gap-2 text-xs">
            <Link href="/voter-guide" className="text-gray-500 hover:text-gray-700 py-1.5">Voter guide</Link>
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Voter Registration & PVC</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Voter Registration & PVC Collection
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-8">
          Find INEC offices in your state and LGA to register as a voter or collect your
          Permanent Voter&apos;s Card. Nigeria has 774 INEC LGA offices — one in every local government area.
        </p>

        {/* ── Online pre-registration banner ───────────────────────────── */}
        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-2xl shrink-0">🖥️</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900 mb-0.5">Pre-register online first</p>
            <p className="text-xs text-green-700">
              INEC&apos;s self-service portal lets you start your registration online before visiting
              a physical office. Check your registration status, transfer your registration, or
              request PVC collection at a different LGA.
            </p>
          </div>
          <a
            href="https://voters.inec.gov.ng"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap shrink-0"
          >
            voters.inec.gov.ng →
          </a>
        </div>

        {/* ── Office finder ─────────────────────────────────────────────── */}
        <VoterRegistrationClient states={states} />

        {/* ── Steps ─────────────────────────────────────────────────────── */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">How to register and get your PVC</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StepCard
              number={1}
              title="Register online"
              body="Visit voters.inec.gov.ng and complete the self-service pre-registration form. You'll receive a reference number."
            />
            <StepCard
              number={2}
              title="Visit your LGA INEC office"
              body="Go to the INEC office in your LGA with a valid ID (National ID, International Passport, or Driver's Licence) and your pre-registration reference number."
            />
            <StepCard
              number={3}
              title="Biometric capture"
              body="INEC staff will capture your fingerprints and photograph. This links your biometric data to your voter registration record."
            />
            <StepCard
              number={4}
              title="Collect your PVC"
              body="Return to the same LGA office once notified (usually within weeks) to collect your Permanent Voter's Card. Your PVC is your proof of registration."
            />
          </div>

          {/* What to bring */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What to bring</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {[
                'Valid government-issued ID (NIN slip, National ID card, International Passport, or Driver\'s Licence)',
                'Proof of residence (utility bill, tenancy agreement, or letter from LGA)',
                'Your INEC pre-registration reference number (from voters.inec.gov.ng)',
                'Two passport photographs (white background)',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">Eligibility</h3>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>• Nigerian citizen by birth or naturalization</li>
              <li>• At least 18 years of age on the day of registration</li>
              <li>• Resident in the LGA where you are registering</li>
              <li>• Not of unsound mind or under sentence of death or imprisonment exceeding 6 months</li>
            </ul>
          </div>

          {/* Transfer / replacement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Transferring your registration</p>
              <p className="text-xs text-gray-500">
                Moved to a new LGA? Visit voters.inec.gov.ng to apply for a transfer at least
                30 days before any election. You must appear in person at the new LGA office.
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Lost or damaged PVC?</p>
              <p className="text-xs text-gray-500">
                Visit your LGA INEC office with a sworn affidavit and valid ID.
                INEC will verify your biometrics and issue a replacement card.
              </p>
            </div>
          </div>
        </div>

        {/* ── INEC helpline ─────────────────────────────────────────────── */}
        <div className="mt-8 bg-green-800 text-white rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-2xl shrink-0">📞</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-0.5">INEC Citizens Contact Centre</p>
            <p className="text-xs text-green-200">
              For complaints, inquiries, and voter education: <strong className="text-white">0800-CALL-INEC (0800-2255-4632)</strong> — toll-free, Monday–Friday 8am–5pm.
            </p>
          </div>
          <a
            href="https://inec.gov.ng"
            target="_blank"
            rel="noreferrer"
            className="text-xs border border-green-600 text-green-100 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap shrink-0"
          >
            inec.gov.ng →
          </a>
        </div>

        {/* ── Related ───────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/voter-guide" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors">
            <p className="text-sm font-semibold text-gray-900 mb-1">Voter guide</p>
            <p className="text-xs text-gray-500">How to vote on election day — what to bring, the BVAS process.</p>
          </Link>
          <Link href="/polling-units" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors">
            <p className="text-sm font-semibold text-gray-900 mb-1">Find your polling unit</p>
            <p className="text-xs text-gray-500">Look up where you vote from 176,846 indexed polling units.</p>
          </Link>
          <Link href="/constituency" className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Find your constituency</p>
            <p className="text-xs text-green-600">See your senatorial, HOR, and state assembly constituencies.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

function StepCard({ number, title, body }: { number: number; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
      <span className="w-6 h-6 rounded-full bg-green-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-900 mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
