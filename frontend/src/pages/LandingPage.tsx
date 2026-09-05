import { Link } from 'react-router-dom'
import {
  Cloud,
  HardDrive,
  ShieldCheck,
  Layers,
  Lock,
  FolderTree,
  ArrowRight,
  CheckCircle2,
  Zap,
  Share2,
  Server,
  FileCheck,
  ExternalLink,
} from 'lucide-react'
import { BrandLogo } from '@/components/drive/BrandLogo'
import { getStoredUser } from '@/lib/auth'

export function LandingPage() {
  const user = getStoredUser()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <BrandLogo className="h-9 w-9" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Combine Drive
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                combine-drive
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#purpose" className="hover:text-blue-600 transition">
              Purpose & Overview
            </a>
            <a href="#features" className="hover:text-blue-600 transition">
              Key Features
            </a>
            <a href="#google-scopes" className="hover:text-blue-600 transition">
              Google Drive Integration
            </a>
            <a href="#security" className="hover:text-blue-600 transition">
              Security & Privacy
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <Link
                to="/all-files"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-slate-50 to-blue-50/30 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-700 mb-6 shadow-xs">
            <Cloud className="h-4 w-4" />
            <span>Official Application Homepage · <strong>combine-drive</strong></span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Unify Your Google Drive Storage with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Combine Drive
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong>Combine Drive</strong> is an open cloud storage management gateway that aggregates multiple personal Google Drive accounts into a unified virtual workspace. Pool quotas, intelligently route file uploads to accounts with available capacity, and organize files without storing persistent data on external servers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition transform active:scale-95"
            >
              Start Using Combine Drive
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm sm:text-base font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              Sign In to Your Workspace
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Multi-Account Pooling (15GB + 15GB+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Dedicated <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">9drive</code> Folder</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero File Storage on App Disks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose of Application Section (Google Verification Requirement) */}
      <section id="purpose" className="py-16 sm:py-20 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Purpose of Combine Drive
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why Combine Drive exists and how it helps individuals manage cloud files across separate Google accounts.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white mb-5 shadow-sm">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  The Problem: Fragmented Cloud Storage
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Many users maintain multiple Google accounts (e.g., personal, work, freelance, academic). Each account provides a 15GB free tier, but their storage is completely siloed. Finding a file or managing uploads across multiple disjointed Google Drive tabs is cumbersome and inefficient.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Independent Google Drive accounts remain separate and uncoordinated.
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-5 shadow-sm">
                  <HardDrive className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  The Solution: Combine Drive Storage Gateway
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  <strong>Combine Drive (combine-drive)</strong> acts as an intelligent personal gateway. Users connect their own Google Drive accounts via secure OAuth 2.0. The application pools your available quotas together, provides a single dashboard to organize files in virtual directories, and automatically uploads incoming files to whichever account has adequate free storage.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-blue-200/60 text-xs font-semibold text-blue-700">
                Full user control · All physical storage remains in your Google Drive.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-16 sm:py-20 border-b border-slate-200/80 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Convenience and Complete Data Privacy
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Explore the core capabilities that make Combine Drive a reliable storage gateway.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                <Cloud className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multi-Account Drive Pooling</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect two or more Google Drive accounts to monitor combined capacity, used storage, and real-time free space from a centralized quota tracker.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Intelligent Upload Routing</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you upload large files, Combine Drive inspects connected storage balances and automatically routes uploads to the account with sufficient space.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <FolderTree className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Virtual Directory Hierarchy</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Organize files in rich nested virtual folders regardless of which underlying Google Drive account physically holds the individual files.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 mb-4">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Isolated 9Drive Folder</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                All uploads are contained inside a designated <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">9drive</code> root folder on your Google Drive. We never modify your personal photos or documents outside this directory.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Encrypted Token Storage</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                OAuth access tokens and refresh tokens are encrypted at rest with AES-256 before database insertion. Your credentials are never exposed or logged.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 mb-4">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure Public Links</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate secure share links or embed previews for specific files without requiring recipients to have Google accounts or direct Drive access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Drive Scopes Explanation (Google Verification Requirement) */}
      <section id="google-scopes" className="py-16 sm:py-20 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-3">
              <FileCheck className="h-3.5 w-3.5" />
              Google API Transparency
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Combine Drive Requests Google Drive Permissions
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Combine Drive requests only the permissions strictly required to perform cloud storage synchronization.
            </p>
          </div>

          <div className="mt-10 space-y-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                <div className="font-mono text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 w-fit">
                  https://www.googleapis.com/auth/drive
                </div>
                <span className="text-xs font-semibold text-slate-500">Google Drive Full Access Scope</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Why we need this:</strong> Allows Combine Drive to create and maintain the dedicated <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">9drive</code> root directory on your Google Drive, stream uploaded files directly into that folder, sync changes, retrieve storage quota balances (total &amp; used bytes), and generate streaming previews or download links for your files.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 w-fit">
                  https://www.googleapis.com/auth/userinfo.email &amp; profile
                </div>
                <span className="text-xs font-semibold text-slate-500">Basic Account Identification</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Why we need this:</strong> Used exclusively to identify which Google account (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">user@gmail.com</code>) was linked and to display your account identifier and avatar in the Connected Accounts manager on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Google API Limited Use Commitment */}
      <section id="security" className="py-16 sm:py-20 border-b border-slate-200/80 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border border-blue-200 bg-white p-8 sm:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Google API Services User Data Policy Compliance
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Strict adherence to Google&apos;s Limited Use requirements.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Combine Drive&apos;s use and transfer to any other app of information received from Google APIs adheres to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google API Services User Data Policy
                  <ExternalLink className="h-3 w-3" />
                </a>
                , including the <strong>Limited Use</strong> requirements.
              </p>

              <div className="grid gap-3 sm:grid-cols-3 pt-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <strong className="block text-slate-900 font-bold mb-1">No AI / Model Training</strong>
                  <span>We never use your Google Drive files or personal information to train artificial intelligence or machine learning models.</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <strong className="block text-slate-900 font-bold mb-1">No Advertising / Data Selling</strong>
                  <span>We do not sell, rent, or monetize your Google Drive data, metadata, or personal identities to any third-party advertisers.</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <strong className="block text-slate-900 font-bold mb-1">Direct Pass-Through Streaming</strong>
                  <span>Files you upload stream directly into your Google Drive and are not retained on application server disks.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold">
                <Link to="/privacy" className="text-blue-600 hover:underline flex items-center gap-1">
                  Read Full Privacy Policy <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/terms" className="text-blue-600 hover:underline flex items-center gap-1">
                  Read Terms of Service <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white text-center px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Combine Your Google Drives?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create your free account today and start managing your multi-account Google Drive storage through Combine Drive.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-white px-7 py-3 text-sm sm:text-base font-bold text-blue-600 shadow-md hover:bg-blue-50 transition transform active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-xs px-7 py-3 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 mt-auto">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="h-7 w-7" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base">Combine Drive</span>
              <span className="text-[11px] text-slate-400">Application identifier: <code>combine-drive</code></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500">
            <Link to="/privacy" className="hover:text-blue-600 transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-blue-600 transition">
              Terms of Service
            </Link>
            <span>•</span>
            <a href="mailto:support@combined.top" className="hover:text-blue-600 transition">
              support@combined.top
            </a>
          </div>

          <p className="text-xs text-slate-400 text-center sm:text-right">
            © {new Date().getFullYear()} Combine Drive (combine-drive). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
