import { z } from 'zod'
import { NextResponse } from 'next/server'

// ── Schemas ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token:    z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const checkoutSchema = z.object({
  courseId: z.string().min(1, 'courseId is required'),
})

export const progressSchema = z.object({
  lessonId:    z.string().min(1, 'lessonId is required'),
  watchedSecs: z.number().int().min(0),
  completed:   z.boolean().optional(),
})

export const contactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email('Invalid email address'),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

// ── Helper ─────────────────────────────────────────────────────────────────

/**
 * Parses and validates request body against a Zod schema.
 * Returns { data } on success or { error: NextResponse } on failure.
 */
export async function parseBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<{ data: z.infer<T>; error?: never } | { data?: never; error: NextResponse }> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    }
  }

  const result = schema.safeParse(body)
  if (!result.success) {
const message = result.error.issues[0]?.message ?? 'Invalid request'
    return {
      error: NextResponse.json({ error: message }, { status: 400 }),
    }
  }
  return { data: result.data }
}
