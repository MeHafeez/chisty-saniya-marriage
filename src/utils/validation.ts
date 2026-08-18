import type { FieldErrors, RsvpFormValues } from '@/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Permissive on purpose: guests will type +880, spaces, dashes and brackets.
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

export const MAX_GUESTS = 8;

/** Validates the RSVP form. Returns an empty object when everything is fine. */
export function validateRsvp(values: RsvpFormValues): FieldErrors<RsvpFormValues> {
  const errors: FieldErrors<RsvpFormValues> = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please tell us your name.';
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'That email address does not look right.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'A phone number helps us reach you.';
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (values.attendance === 'joyfully-accepts') {
    if (!Number.isFinite(values.guests) || values.guests < 1) {
      errors.guests = 'At least one seat, we hope.';
    } else if (values.guests > MAX_GUESTS) {
      errors.guests = `Please contact us directly for parties over ${MAX_GUESTS}.`;
    }

    if (values.events.length === 0) {
      errors.events = 'Choose at least one celebration to attend.';
    }
  }

  if (values.message.length > 600) {
    errors.message = 'Please keep your note under 600 characters.';
  }

  return errors;
}

export const hasErrors = (errors: FieldErrors<RsvpFormValues>): boolean =>
  Object.keys(errors).length > 0;
