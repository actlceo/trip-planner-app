import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: { days: { include: { items: true }, orderBy: { date: 'asc' } } }
  })
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Ownership check
  if (trip.userId) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user || user.id !== trip.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const doc = new PDFDocument({ margin: 48 })
  const chunks: Uint8Array[] = []
  doc.on('data', c => chunks.push(c as Uint8Array))
  const done = new Promise<Buffer>(res => doc.on('end', () => res(Buffer.concat(chunks as any))))

  doc.fontSize(18).text(`Itinerary: ${trip.destination}`)
  doc.moveDown(0.5)
  doc.fontSize(12).text(`Dates: ${trip.start.toDateString()} → ${trip.end.toDateString()}`)
  doc.text(`Travelers: ${trip.travelers}`)
  doc.text(`Interests: ${trip.interests}`)
  doc.moveDown()

  trip.days.forEach((d) => {
    doc.fontSize(14).text(new Date(d.date).toDateString(), { underline: true })
    if (d.items.length === 0) {
      doc.fontSize(11).fillColor('#666').text('No items yet')
      doc.fillColor('black')
    } else {
      d.items.forEach(it => doc.fontSize(12).text(`• ${it.title}${it.time ? ' — ' + it.time : ''}`))
    }
    doc.moveDown()
  })

  doc.end()
  const buf = await done
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="itinerary-${trip.destination.replace(/\s+/g,'-').toLowerCase()}.pdf"`
    }
  })
}
