import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Lock, FileCheck, Server, Mail } from 'lucide-react'
import { BrandLogo } from '@/components/drive/BrandLogo'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <BrandLogo className="h-8 w-8" />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              9Drive
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/terms"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:inline"
            >
              Terms of Service
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
            <Shield className="h-3.5 w-3.5" />
            Privacy & Trust
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            How 9Drive collects, uses, encrypts, and protects your information, including connected Google Drive storage accounts.
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
          
          {/* Quick Summary Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-7">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600 shrink-0" />
              Our Core Privacy Commitments
            </h2>
            <ul className="mt-3 grid gap-2.5 text-sm text-blue-900">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 mt-0.5">•</span>
                <span><strong>No File Harvesting:</strong> 9Drive acts as a storage gateway. Files you upload stream directly to your connected Google Drive storage under the dedicated <code>9drive</code> folder and are not permanently retained on 9Drive application disks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 mt-0.5">•</span>
                <span><strong>Encrypted Credentials:</strong> OAuth tokens and credentials are encrypted using industry-standard AES encryption prior to database storage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 mt-0.5">•</span>
                <span><strong>Never Sold or Rented:</strong> We never sell, monetize, or disclose your personal data or file contents to third parties or advertising networks.</span>
              </li>
            </ul>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you interact with 9Drive, we collect only the information required to provide multi-account storage gateway services:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 mt-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 text-sm">Account Information</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Your name, email address, and hashed authentication credentials if you sign up via standard registration, or your public profile info if authenticating via Google.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 text-sm">OAuth Authorization Tokens</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  When you connect Google Drive accounts, we store encrypted OAuth refresh tokens and temporary access tokens to read storage quotas and stream your authorized files.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 text-sm">File & Folder Metadata</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  File names, file sizes, MIME types, virtual folder hierarchies, and Google Drive file IDs needed to organize, display, and search your assets in the dashboard.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 text-sm">Usage & Security Logs</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  IP addresses, browser user agent strings, and audit logs of file operations to maintain security, session integrity, and prevent unauthorized access.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We process your data strictly to perform the service functionality you request:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Aggregating and calculating total combined storage quota across your connected Drive accounts.</li>
              <li>Streaming files uploaded through the gateway directly into your connected Google Drive storage folder.</li>
              <li>Providing secure in-browser previews, downloads, and virtual folder organization.</li>
              <li>Enabling password-protected or time-limited public file share links when you choose to share a file.</li>
              <li>Detecting, preventing, and addressing security anomalies or policy abuses.</li>
            </ul>
          </section>

          {/* Section 3: Google API Services User Data Policy Compliance */}
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
              <FileCheck className="h-4 w-4 text-amber-600" />
              Google API Compliance
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              3. Google API Services User Data Policy (Limited Use)
            </h2>
            <p>
              9Drive's use and transfer to any other app of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline hover:text-blue-800"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <div className="space-y-2 text-sm text-slate-600 pt-1">
              <p>Specifically:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>We only request access to Google Drive scopes necessary to manage files in the app's dedicated storage folder and calculate storage quota.</li>
                <li>We do not transfer or disclose Google user data to third parties, unless necessary to provide or improve the core features, comply with applicable law, or as part of a merger or acquisition.</li>
                <li>We do not use or transfer Google user data for serving advertisements, including retargeting, personalized, or interest-based advertising.</li>
                <li>Human personnel are not allowed to view your file content unless you have given explicit consent for troubleshooting, it is necessary for security purposes (such as investigating a bug or abuse), or to comply with applicable laws.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. File Storage & Streaming Architecture</h2>
            <p>
              9Drive is architected as an intermediary gateway:
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <Server className="h-5 w-5 text-indigo-600 shrink-0 mt-1" />
              <div className="text-sm text-slate-600">
                <strong className="text-slate-900">Zero Persistent File Caching:</strong> When you upload a file, the backend streams the data directly through memory to Google's Drive API endpoints without saving the file payload to disk. When you preview or download a file, the data streams through temporary authenticated buffers directly to your browser.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Data Retention & Revocation of Access</h2>
            <p>
              You maintain full control over your connected accounts and stored information at all times:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>
                <strong>Disconnecting Accounts:</strong> You can disconnect any linked Google Drive account at any time via the <em>Settings &gt; Connected Accounts</em> panel. When disconnected, the corresponding encrypted refresh tokens are permanently deleted from our database.
              </li>
              <li>
                <strong>Google Account Permissions:</strong> You may also revoke 9Drive's access at any time through your{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-800"
                >
                  Google Account Security Settings
                </a>.
              </li>
              <li>
                <strong>Account Deletion:</strong> You may request complete deletion of your 9Drive account and all associated metadata by contacting us.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Security Measures</h2>
            <p>
              We implement comprehensive security protocols to safeguard your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>All web communication is encrypted in transit using HTTPS / TLS 1.3.</li>
              <li>All OAuth tokens are symmetrically encrypted at rest with AES before saving to MySQL.</li>
              <li>Account passwords are hashed with modern memory-hard password hashing algorithms (Argon2).</li>
              <li>Session tokens utilize stateless JWT signatures and cryptographic refresh tokens.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our technology or legal requirements. When updates occur, the "Last Updated" date at the top of this page will be revised. Material changes will be accompanied by a notification in the application dashboard.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-slate-200/80 pt-6">
            <h2 className="text-xl font-bold text-slate-900">8. Contact Us</h2>
            <p>
              If you have any questions, inquiries, or privacy concerns regarding this Privacy Policy or your data, please contact our privacy team:
            </p>
            <div className="flex items-center gap-2 font-medium text-blue-600">
              <Mail className="h-4 w-4" />
              <span>support@combined.top</span>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} 9Drive. All rights reserved.</p>
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
