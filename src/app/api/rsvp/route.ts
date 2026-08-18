import { NextResponse } from 'next/server';

import { validateRsvp, hasErrors } from '@/utils/validation';
import type { RsvpFormValues } from '@/types';

/**
 * Receives an RSVP.
 *
 * This reference implementation validates the payload and logs it. Replace the
 * marked block with your own delivery — a database write, a transactional email,
 * a Google Sheet append — without changing the client contract.
 */
export async function POST(request: Request) {
  let payload: Partial<RsvpFormValues>;

  try {
    payload = (await request.json()) as Partial<RsvpFormValues>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request body.' }, { status: 400 });
  }

  const values: RsvpFormValues = {
    name: String(payload.name ?? '').slice(0, 120),
    email: String(payload.email ?? '').slice(0, 160),
    phone: String(payload.phone ?? '').slice(0, 40),
    guests: Number(payload.guests ?? 0),
    attendance: payload.attendance === 'regretfully-declines' ? 'regretfully-declines' : 'joyfully-accepts',
    events: Array.isArray(payload.events) ? payload.events.slice(0, 12).map(String) : [],
    message: String(payload.message ?? '').slice(0, 600),
  };

  // Never trust the client's own validation.
  const errors = validateRsvp(values);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  /* ——— Replace this block with real delivery ——— */
  console.info('[RSVP]', {
    receivedAt: new Date().toISOString(),
    ...values,
  });
  /* ——————————————————————————————————————————— */

  return NextResponse.json({ ok: true, message: 'RSVP received.' }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
