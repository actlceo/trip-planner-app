import { createTrip } from './server-actions'
import Interests from '@/components/Interests'
import { prisma } from '@/lib/prisma'

export default async function Page({ searchParams }: { searchParams?: { trip?: string } }) {
  const tripId = searchParams?.trip
  const trip = tripId ? await prisma.trip.findUnique({ where: { id: tripId } }) : null

  return (
    <div className="grid gap-6">
      <section className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-3">Create Trip</h2>
        <form action={createTrip} className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded-xl p-2" name="destination" placeholder="Destination" required />
          <input className="border rounded-xl p-2" type="date" name="start" required />
          <input className="border rounded-xl p-2" type="date" name="end" required />
          <input className="border rounded-xl p-2" type="number" min={1} name="travelers" defaultValue={2} />
          <div className="sm:col-span-2">
            <label className="text-sm">Interests</label>
            <Interests />
          </div>
          <button className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white w-max">Save Trip</button>
        </form>
      </section>

      {trip && (
        <section className="bg-white rounded-2xl shadow p-4 sm:p-6 grid gap-3">
          <h2 className="text-lg font-semibold">Plan for {trip.destination}</h2>
          <div className="text-sm opacity-70">Trip created. See it in your Dashboard.</div>
        </section>
      )}
    </div>
  )
}
