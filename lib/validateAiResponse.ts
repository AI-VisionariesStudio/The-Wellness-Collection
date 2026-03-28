/**
 * Layer 2 of the 3-layer AI defense:
 *   Layer 1 — System prompt constraints (enforced by the model)
 *   Layer 2 — This validator (server-side, runs before response reaches the client)
 *   Layer 3 — UI disclaimer (shown to the user)
 *
 * Scans AI response text for language that violates the psychoeducational-only
 * boundary. Matches are logged and the response is replaced with a safe fallback.
 * Patterns target actionable clinical language directed at the user — not
 * educational third-person discussion of clinical topics.
 */

const VIOLATION_PATTERNS = [
  // Therapeutic referrals directed at the user
  /\byou should (see|speak (with|to)|talk (with|to)|consult|visit)\b.{0,40}(therapist|counselor|psychologist|psychiatrist|clinician|professional|doctor)/i,
  /\bi (recommend|suggest|advise)\b.{0,40}(therapy|counseling|counselling|treatment|professional help)/i,
  /\bseek (therapy|counseling|counselling|professional (help|support|treatment))\b/i,
  /\bget (therapy|counseling|counselling|professional help)\b/i,
  /\bsee (a|your) (therapist|counselor|psychologist|psychiatrist|doctor|clinician)\b/i,
  /\bspeak (with|to) (a|your) (therapist|counselor|psychologist|psychiatrist|clinician)\b/i,
  /\bplease (seek|get|find|consider)\b.{0,30}(therapy|counseling|counselling|professional)\b/i,

  // Direct diagnostic statements about the user
  /\byou (have|may have|might have|could have|seem to have|appear to have)\b.{0,60}(disorder|condition|syndrome|trauma|ptsd|anxiety|depression|attachment (issue|disorder|style))\b/i,
  /\bsounds? like you (have|are experiencing)\b/i,
  /\bthis (sounds?|seems?|appears?) (like|to be) (a )?(diagnosis|disorder|condition)\b/i,
  /\byou (are|seem|appear) (to be )?(clinically|medically)\b/i,

  // Medication / prescription guidance
  /\b(medication|medicate|prescri(be|bed|ption))\b.{0,40}\byou\b/i,
  /\byou\b.{0,40}\b(medication|medicate|prescri(be|bed|ption))\b/i,

  // Clinical assessment of the user
  /\bdiagnos(e|es|ing|ed|is|tic)\b.{0,30}\byou\b/i,
  /\byou\b.{0,30}\bdiagnos(e|es|ing|ed|is|tic)\b/i,
]

const FALLBACK =
  "I can only provide educational information grounded in the lesson content. For personal support or clinical guidance, please reach out to a licensed mental health professional."

/**
 * Returns the original text if it passes validation, or a safe fallback if
 * clinical/therapeutic language directed at the user is detected.
 */
export function validateAiResponse(text: string, context?: string): string {
  for (const pattern of VIOLATION_PATTERNS) {
    if (pattern.test(text)) {
      console.warn('[ai-validator] Violation detected', { pattern: pattern.source, context })
      return FALLBACK
    }
  }
  return text
}
