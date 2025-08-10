import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function Dashboard() {
  const session = await getSession()
  if (!session?.user?.email) {
    return (
      <div className="bg-white p-6 rounded-2xl">
        <p className="mb-3">You must sign in to view the dashboard.</p>
        <a href="/api/auth/signin" className="px-4 py-2 rounded-xl bg-slate-900 text-white">Sign in</a>
      </div>
    )
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { trips: true } })
  return (
    <div className="grid gap-3">
      {user?.trips.map(t => (
        <div key={t.id} className="bg-white p-4 rounded-2xl border">
          <div className="font-medium">{t.destination}</div>
          <div className="text-sm opacity-70">{new Date(t.start).toDateString()} → {new Date(t.end).toDateString()}</div>
          <div className="mt-2">
            <a className="text-sm underline" href={`/api/pdf/${t.id}`}>Download PDF</a>
          </div>
        </div>
      ))}
      {(!user || user.trips.length === 0) && <div className="text-sm opacity-70">No trips yet.</div>}
    </div>
  )
}
