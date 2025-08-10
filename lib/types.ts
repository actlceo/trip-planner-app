import { z } from 'zod'
export const tripSchema = z.object({
  destination: z.string().min(2),
  start: z.string(),
  end: z.string(),
  travelers: z.coerce.number().int().min(1).default(1),
  interests: z.array(z.string()).min(0),
})
export type TripInput = z.infer<typeof tripSchema>
