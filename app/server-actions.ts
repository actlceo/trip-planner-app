'use server'
import { prisma } from '@/lib/prisma'
import { tripSchema } from '@/lib/types'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createTrip(formData: FormData) {
  const data = tripSchema.parse({
    destination: formData.get('destination') as string,
    start: formData.get('start') as string,
    end: formData.get('end') as string,
    travelers: formData.get('travelers') as string,
    interests: (formData.getAll('interests') as string[]) ?? [],
  })

  const session = await getSession()
  const s = new Date(data.start)
  const e = new Date(data.end)

  const trip = await prisma.trip.create({
    data: {
      destination: data.destination,
      start: s, end: e,
      travelers: data.travelers,
      interests: data.interests.join(','),
      user: session?.user?.email ? { connect: { email: session.user.email } } : undefined,
      days: { create: (() => {
        const arr: { date: Date }[] = []
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) arr.push({ date: new Date(d) })
        return arr
      })() }
    }
  })
  redirect(`/?trip=${trip.id}`)
}
