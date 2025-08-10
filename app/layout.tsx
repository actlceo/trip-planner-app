import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Itinerary Builder',
  description: 'Plan trips quickly',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <header className="flex items-center justify-between pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Itinerary Builder</h1>
            <div className="flex items-center gap-3 text-sm">
              <Link className="underline" href="/dashboard">Dashboard</Link>
              <a className="underline" href="/api/auth/signin">Sign in</a>
              <a className="underline" href="/api/auth/signout">Sign out</a>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
