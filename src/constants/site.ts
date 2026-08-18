import { COUPLE, COUPLE_ORDER, WEDDING } from './wedding';
import { formatLongDate } from '@/utils/format';

const [first, second] = COUPLE_ORDER;
const coupleNames = `${first.name} & ${second.name}`;

export const SITE = {
  name: `${coupleNames} — ${WEDDING.occasion}`,
  shortName: coupleNames,
  title: `${coupleNames} · ${formatLongDate(WEDDING.date)}`,
  description: `You are warmly invited to the ${WEDDING.occasion} of ${COUPLE.groom.fullName} and ${COUPLE.bride.fullName} on ${formatLongDate(WEDDING.date)} at ${WEDDING.city}.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chisty-wedding.example.com',
  locale: 'en_GB',
  themeColor: '#FDF9F5',
  keywords: [
    'wedding invitation',
    'valima',
    'nikah',
    coupleNames,
    COUPLE.groom.fullName,
    COUPLE.bride.fullName,
    'Guntur wedding',
    WEDDING.hashtag,
  ],
} as const;

/** Ambient track played behind the invitation. Drop your own file at this path. */
export const AUDIO_TRACK = {
  src: '/audio/ambient.mp3',
  title: 'Ambient Strings',
  volume: 0.35,
} as const;
