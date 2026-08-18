/** Zero-pad a countdown unit so digits never reflow mid-tick. */
export const pad = (value: number, length = 2): string =>
  Math.max(0, Math.floor(value)).toString().padStart(length, '0');

/** "12 June 2026" — the invitation's long-date voice. */
export const formatLongDate = (date: Date, locale = 'en-GB'): string =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

/** "Friday" */
export const formatWeekday = (date: Date, locale = 'en-GB'): string =>
  new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);

/** Split a date into typographic parts so each can be animated on its own. */
export const splitDate = (date: Date, locale = 'en-GB') => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);

  const find = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: find('day'),
    month: find('month'),
    year: find('year'),
    weekday: formatWeekday(date, locale),
  };
};

/** Split a string into words, each carrying its characters — for split-text reveals. */
export const splitIntoWords = (text: string): string[] =>
  text.split(/(\s+)/).filter((chunk) => chunk.length > 0);

/** Normalise a phone number for `tel:` links. */
export const toTelHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;
