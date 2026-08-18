import { GiLotus, GiPeaceDove, GiThreeLeaves } from 'react-icons/gi';

import type {
  Blessing,
  FamilyMember,
  GalleryImage,
  NavLink,
  Person,
  StoryChapter,
  VenueDetails,
  WeddingEvent,
} from '@/types';

/* ==================================================================== *
 *  SINGLE SOURCE OF TRUTH
 *
 *  Everything below marked "— from the card" is transcribed verbatim from
 *  the printed invitation and should only change if the card changes.
 *
 *  Items marked "TODO (family)" are NOT on the card. They carry neutral
 *  placeholder wording so the site is complete out of the box — please
 *  replace them with your own words before sharing the link:
 *    · COUPLE.*.bio          · GALLERY (photographs + captions)
 *    · WEDDING.hashtag       · RSVP_DEADLINE
 * ==================================================================== */

/* ——— The couple — from the card ——————————————————————— */

export const COUPLE = {
  groom: {
    id: 'groom',
    name: 'Khaja',
    fullName: 'Shaik Khaja Mohiddin Chisty',
    familyName: 'Chisty',
    initial: 'K',
    role: 'The Groom',
    title: 'Senior Software Engineer',
    parents: 'Eldest son of Mrs. & Mr. Shaik Chinna Baji',
    grandparents: 'Grandson of Late Mrs & Mr Shaik Shaik Bade Saida',
    // TODO (family): replace with a few lines in your own words.
    bio: 'Eldest son of the Shaik family of Guntur, and a Senior Software Engineer by profession.',
    // Transparent cut-out; renditions built by `npm run portraits`.
    image: '/images/portraits/groom-1000.webp',
  },
  bride: {
    id: 'bride',
    name: 'Saniya',
    fullName: 'Syed Saniya',
    familyName: 'Syed',
    initial: 'S',
    role: 'The Bride',
    parents: 'The one and only daughter of Mrs & Mr Syed Allah Malik',
    grandparents: 'Granddaughter of Mrs & Mr Syed Khaalek',
    // TODO (family): replace with a few lines in your own words.
    bio: 'The one and only daughter of the Syed family, and the answer to a great many prayers.',
    // Transparent cut-out; renditions built by `npm run portraits`.
    image: '/images/portraits/bride-1000.webp',
  },
} as const satisfies Record<'bride' | 'groom', Person>;

/**
 * Display order follows the printed card: the groom's family are the hosts of
 * the Valima, so his name is set first everywhere the two appear together.
 */
export const COUPLE_ORDER = [COUPLE.groom, COUPLE.bride] as const;

export const MONOGRAM = `${COUPLE.groom.initial} · ${COUPLE.bride.initial}`;

/* ——— The occasion — from the card ————————————————————— */

export const WEDDING = {
  /**
   * The Valima — the ceremony this invitation is for, and the countdown target.
   * Saturday, 3 October 2026, dinner at 8:00 p.m. IST (UTC+05:30).
   */
  date: new Date('2026-10-03T20:00:00+05:30'),
  /** As printed beneath the Gregorian date. */
  hijriDate: '22 Rabbi-al-Thani 1448 Hijri',
  occasion: 'Valima Ceremony',
  city: 'Guntur, Andhra Pradesh',
  // TODO (family): change or remove.
  hashtag: '#KhajaWedsSaniya',
  invitationLine:
    'Solicit your gracious presence on the auspicious occasion of the Valima Ceremony of our eldest son.',
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  bismillahTranslation: 'In the name of Allah, the Most Beneficent, the Most Merciful',
  inShaAllah: 'In Sha Allah',
  hosts: 'Mrs. & Mr. Shaik Chinna Baji',
  blessedBy: 'Late Mrs & Mr Shaik Shaik Bade Saida',
  quote: {
    text: 'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.',
    source: 'Surah Ar-Rum, 30:21',
  },
} as const;

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'welcome', label: 'Welcome', href: '#welcome' },
  { id: 'couple', label: 'The Couple', href: '#couple' },
  { id: 'events', label: 'Ceremonies', href: '#events' },
  { id: 'story', label: 'The Three Days', href: '#story' },
  { id: 'countdown', label: 'Countdown', href: '#countdown' },
  { id: 'venue', label: 'Venue', href: '#venue' },
  { id: 'family', label: 'Family', href: '#family' },
  { id: 'blessings', label: 'Blessings', href: '#blessings' },
];

/** Drawn directly from the card's own wording. */
export const WELCOME_LETTER = {
  salutation: 'Assalamu Alaikum,',
  lines: [
    'With the blessings of Almighty Allah and of our elders, we invite you to share in our happiness.',
    'Our eldest son, Shaik Khaja Mohiddin Chisty, will be united in marriage with Syed Saniya — the one and only daughter of Mrs & Mr Syed Allah Malik.',
    'Three days of celebration await: Haldi at Guntur, the Nikah at Yerragondapalem, and the Valima at B. Convention Centre.',
    'Your presence and your duas would mean everything to us.',
  ],
  closing: 'With warm regards,',
  signature: 'Mrs. & Mr. Shaik Chinna Baji',
} as const;

/* ——— The three days ——————————————————————————————————
 * The Events section carries the logistics; this timeline explains what each
 * rite means, for guests who may not know the customs. All dates from the card.
 * ------------------------------------------------------------------ */

export const STORY_CHAPTERS: readonly StoryChapter[] = [
  {
    id: 'haldi',
    index: 'I',
    title: 'The Haldi',
    date: 'Thursday, 1 October 2026',
    place: "Groom's Place, Guntur",
    description:
      'The celebration opens at home. Turmeric is applied by the hands of family and friends — an old blessing for health, protection and a bright beginning. Dinner is served first, and the Haldi follows late into the evening.',
    image: '/images/story/chapter-01.svg',
  },
  {
    id: 'nikah',
    index: 'II',
    title: 'The Nikah',
    date: 'Friday, 2 October 2026',
    place: 'Manjunadha Convention, Yerragondapalem',
    description:
      'The marriage itself: the offer and the acceptance, spoken before witnesses on the blessed day of Jummah, and sealed with the signing of the contract. A few quiet words, and two families become one.',
    image: '/images/story/chapter-02.svg',
  },
  {
    id: 'valima',
    index: 'III',
    title: 'The Valima',
    date: 'Saturday, 3 October 2026',
    place: 'B. Convention Centre, Guntur',
    description:
      'The feast given by the groom in thanks — the sunnah of announcing a marriage with generosity and an open table. This is the evening you are invited to share with us.',
    image: '/images/story/chapter-03.svg',
  },
];

/* ——— Ceremonies — from the card ——————————————————————— */

export const EVENTS: readonly WeddingEvent[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    tagline: 'An evening of turmeric & gold',
    description:
      'Where it all begins — turmeric, laughter, and the whole family under one roof.',
    date: '1 October 2026',
    day: 'Thursday',
    time: 'Dinner 8:00 p.m. · Haldi 10:00 p.m.',
    venue: "Groom's Place",
    address: 'Guntur, Andhra Pradesh',
    icon: GiThreeLeaves,
    accent: '#E8C87E',
    dressCode: 'Marigold & white',
    image: '/images/events/haldi-1054.webp',
  },
  {
    id: 'nikah',
    name: 'Nikah',
    tagline: 'The promise itself',
    description:
      'The ceremony that makes it real, on the blessed day of Jummah, followed by lunch.',
    date: '2 October 2026',
    day: 'Friday',
    time: 'Nikah 11:30 a.m. · Lunch 12:30 p.m.',
    venue: 'Manjunadha Convention',
    address: 'Yerragondapalem, Andhra Pradesh',
    icon: GiPeaceDove,
    accent: '#B99551',
    dressCode: 'Ivory & gold — formal',
    image: '/images/events/nikah-1054.webp',
  },
  {
    id: 'valima',
    name: 'Valima',
    tagline: 'The feast of thanks',
    description:
      'The celebration we have waited for — dinner, family, and an open table for everyone we love.',
    date: '3 October 2026',
    day: 'Saturday',
    time: 'Dinner 8:00 p.m.',
    venue: 'B. Convention Centre',
    address: 'Near Andhra Muslim College, Guntur',
    icon: GiLotus,
    accent: '#C6A66A',
    dressCode: 'Festive formal',
    image: '/images/events/valima-1054.webp',
  },
];

/* ——— Venue of the Valima — from the card —————————————— */

export const VENUE: VenueDetails = {
  name: 'B. Convention Centre',
  addressLines: ['Near Andhra Muslim College', 'Guntur, Andhra Pradesh'],
  city: 'India',
  // A text search rather than a dropped pin: it resolves to the venue itself
  // rather than to approximate coordinates.
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=B+Convention+Centre%2C+Near+Andhra+Muslim+College%2C+Guntur',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=B+Convention+Centre%2C+Near+Andhra+Muslim+College%2C+Guntur',
  // Guntur city centre — approximate, used only for the schema.org listing.
  coordinates: { lat: 16.3067, lng: 80.4365 },
  note: 'Dinner is served from 8:00 p.m. The Nikah is held the previous day at Manjunadha Convention, Yerragondapalem.',
};

/* ——— Gallery — TODO (family): replace with photographs ——— */

export const GALLERY: readonly GalleryImage[] = [
  { id: 'g1', src: '/images/gallery/frame-01.svg', alt: 'Placeholder — Haldi celebration', width: 800, height: 1100, caption: 'Haldi' },
  { id: 'g2', src: '/images/gallery/frame-02.svg', alt: 'Placeholder — hands adorned with henna', width: 800, height: 800, caption: 'Mehendi' },
  { id: 'g3', src: '/images/gallery/frame-03.svg', alt: 'Placeholder — the Nikah ceremony', width: 800, height: 1000, caption: 'The Nikah' },
  { id: 'g4', src: '/images/gallery/frame-04.svg', alt: 'Placeholder — rings resting on silk', width: 800, height: 640, caption: 'Two circles, no ends' },
  { id: 'g5', src: '/images/gallery/frame-05.svg', alt: 'Placeholder — the bride', width: 800, height: 1180, caption: 'The Bride' },
  { id: 'g6', src: '/images/gallery/frame-06.svg', alt: 'Placeholder — family gathered around a long table', width: 800, height: 900, caption: 'One long table' },
  { id: 'g7', src: '/images/gallery/frame-07.svg', alt: 'Placeholder — floral arrangements', width: 800, height: 760, caption: 'Flowers for the hall' },
  { id: 'g8', src: '/images/gallery/frame-08.svg', alt: 'Placeholder — the Valima hall', width: 800, height: 1060, caption: 'The Valima' },
  { id: 'g9', src: '/images/gallery/frame-09.svg', alt: 'Placeholder — the two families', width: 800, height: 820, caption: 'Two families, one' },
];

/* ——— Families — from the card ————————————————————————— */

export const FAMILY: readonly FamilyMember[] = [
  { id: 'g1', name: 'Mrs. & Mr. Shaik Chinna Baji', relation: 'Parents of the Groom', side: 'groom' },
  { id: 'g2', name: 'Late Mrs & Mr Shaik Shaik Bade Saida', relation: 'Grandparents of the Groom', side: 'groom' },
  { id: 'b1', name: 'Mrs & Mr Syed Allah Malik', relation: 'Parents of the Bride', side: 'bride' },
  { id: 'b2', name: 'Mrs & Mr Syed Khaalek', relation: 'Grandparents of the Bride', side: 'bride' },
];

/** "Best compliments from" — from the card, in the printed order. */
export const WELL_WISHERS = {
  heading: 'Best Compliments From',
  names: [
    'Mrs & Mr Shaik Imran',
    'Mrs & Mr Shaik Bade Baji',
    'Mrs & Mr Shaik Karimulla (Late)',
    'Shaik Rehan',
  ],
  closing: 'Near and Dear',
} as const;

/* ——— Blessings ————————————————————————————————————————
 * Authentic marriage duas with their sources, rather than words put into the
 * mouths of named relatives. Replace with real messages from guests whenever
 * you have them.
 * ------------------------------------------------------------------ */

export const BLESSINGS: readonly Blessing[] = [
  {
    id: 'b1',
    name: 'بَارَكَ اللَّهُ لَكَ',
    relation: 'Sunan Abi Dawud 2130',
    message:
      'May Allah bless you, and shower His blessings upon you, and join you together in goodness.',
  },
  {
    id: 'b2',
    name: 'Surah Al-Furqan',
    relation: 'Al-Furqan 25:74',
    message:
      'Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders of the righteous.',
  },
  {
    id: 'b3',
    name: 'Surah Ar-Rum',
    relation: 'Ar-Rum 30:21',
    message:
      'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.',
  },
  {
    id: 'b4',
    name: 'A prayer for the home',
    relation: 'For Khaja & Saniya',
    message:
      'May your home always be one of peace, your table always full, and your patience with one another never run short.',
  },
  {
    id: 'b5',
    name: 'From the two families',
    relation: 'Shaik & Syed',
    message:
      'Two families have become one. May Allah keep this bond strong, and may every year be kinder than the last.',
  },
];

export const CLOSING = {
  heading: 'Jazak Allahu Khairan',
  lines: [
    'For the duas whispered on our behalf.',
    'For the elders whose blessings brought us here.',
    'For choosing to spend these days with us.',
  ],
  farewell: 'We cannot wait to see you there, In Sha Allah.',
} as const;

// TODO (family): not printed on the card — set a date that suits you.
export const RSVP_DEADLINE = '20 September 2026';
