import { z } from "zod";

export const hourSchema = z.object({
    date: z.preprocess( arg => typeof arg == 'string' ? new Date( arg ) : undefined, z.date() ),
    hours: z.number(),
    name: z.string(),
    description: z.string(),
    supervisor_name: z.string(),
    supervisor_contact: z.string()
})