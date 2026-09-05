import { Link } from 'react-router-dom'
import { FileText, ArrowLeft, Mail, Scale } from 'lucide-react'
import { BrandLogo } from '@/components/drive/BrandLogo'

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <BrandLogo className="h-8 w-8" />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Combined
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/privacy"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:inline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-slate-200/70 bg-gradient-to-b from-white to-slate-100/60 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-4">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Please read these Terms of Service carefully before accessing or using the Combined storage gateway application.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <span>Effective Date: September 2026</span>
            <span>•</span>
            <span>Last Updated: September 5, 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Summary Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600 shrink-0" />
              Agreement Overview
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              By accessing or using Combined (the &quot;Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Service.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Description of Service</h2>
            <p>
              Combined is an advanced cloud storage gateway platform designed to streamline and unify storage management across multiple Google Drive accounts. The Service allows users to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Connect one or more authorized Google Drive accounts via OAuth 2.0.</li>
              <li>View aggregated and unified storage quota analytics.</li>
              <li>Stream and organize files directly into a designated <code>9drive</code> root directory on Google Drive.</li>
              <li>Manage virtual directories, search file metadata, and generate public or password-protected access tokens.</li>
            </ul>
            <p className="text-sm text-slate-500 italic">
              Note: Combined does not host persistent user file contents on its own hardware infrastructure; files are hosted within your connected third-party storage providers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. User Accounts & Registration</h2>
            <p>
              To use Combined, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your credentials and authentication tokens.</li>
              <li>Notify us immediately of any unauthorized use or security breach involving your account.</li>
              <li>Accept responsibility for all activities that occur under your registered account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Third-Party Services & Google Drive</h2>
            <p>
              By linking your Google account(s) to Combined, you authorize the Service to access your Google Drive storage within the scopes granted during the OAuth consent flow.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                You acknowledge and agree that your use of Google Drive is also governed by Google&apos;s respective Terms of Service and Privacy Policies. Combined is not responsible for outages, rate limits, data policies, or service terminations imposed by Google.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. User Content & Intellectual Property</h2>
            <p>
              <strong>You retain 100% ownership</strong> of all files, documents, media, and data that you upload, transmit, or organize through Combined.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Combined does not claim any copyright or proprietary interest in your files.</li>
              <li>You grant Combined only the limited technical rights necessary to stream, process, and display your files solely to fulfill the functionality of the Service.</li>
              <li>All intellectual property rights in the Combined application, brand, logo, and user interface belong exclusively to Combined.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Prohibited Conduct</h2>
            <p>You agree not to misuse the Service. Specifically, you may not:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Upload, store, or transmit any material that is unlawful, defamatory, harassing, or infringes intellectual property rights.</li>
              <li>Distribute malware, ransomware, viruses, or any software designed to disrupt or compromise computer systems.</li>
              <li>Attempt to reverse-engineer, decompile, or compromise the security of the Combined platform.</li>
              <li>Circumvent storage limits, abuse API endpoints, or conduct automated denial-of-service attacks.</li>
              <li>Use the Service for any unauthorized commercial reselling or automated bulk exploitation.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Termination & Suspension</h2>
            <p>
              You may terminate your account at any time by disconnecting your cloud drives and ceasing use of the Service. We reserve the right to suspend or terminate access to Combined if you violate these Terms or if required to do so by applicable laws or provider restrictions.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Disclaimer of Warranties</h2>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900">
              <p className="font-semibold mb-1">AS-IS SERVICE PROVISION:</p>
              <p>
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF TEMPORARY DATA LOSS RESULTING FROM THIRD-PARTY PROVIDER OUTAGES.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Limitation of Liability</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMBINED AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE SERVICE.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">9. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of Combined after any modifications constitutes acceptance of the new Terms of Service.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-slate-200/80 pt-6">
            <h2 className="text-xl font-bold text-slate-900">10. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, please reach out to us:
            </p>
            <div className="flex items-center gap-2 font-medium text-blue-600">
              <Mail className="h-4 w-4" />
              <span>legal@combined.top</span>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Combined. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-slate-800 transition">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-800 transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-slate-800 transition">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
