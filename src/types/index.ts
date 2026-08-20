import type { IconType } from 'react-icons';

/** A person featured on the invitation (couple or family). */
export interface Person {
  readonly id: string;
  /** Everyday name, used for headings and the portal doors. */
  readonly name: string;
  readonly fullName: string;
  /** House name — "the Chisty's Family". Not derivable from `fullName`. */
  readonly familyName: string;
  readonly initial: string;
  readonly role: string;
  /** Optional line under the name, e.g. a profession printed on the card. */
  readonly title?: string;
  readonly parents: string;
  readonly grandparents?: string;
  readonly bio: string;
  readonly image: string;
  readonly socials?: readonly SocialLink[];
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly icon: 'instagram' | 'facebook' | 'twitter';
}

/** A single beat in the love-story timeline. */
export interface StoryChapter {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly date: string;
  readonly place: string;
  readonly description: string;
  readonly image: string;
}

/** A wedding-week ceremony. */
export interface WeddingEvent {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly date: string;
  readonly day: string;
  readonly time: string;
  readonly venue: string;
  readonly address: string;
  readonly icon: IconType;
  readonly accent: string;
  readonly dressCode: string;
  /** Ceremony card artwork. Optional so an event without one still renders. */
  readonly image?: string;
}

export interface FamilyMember {
  readonly id: string;
  readonly name: string;
  readonly relation: string;
  readonly side: 'bride' | 'groom';
}

export interface GalleryImage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption: string;
}

export interface Blessing {
  readonly id: string;
  readonly name: string;
  readonly relation: string;
  readonly message: string;
}

export interface VenueDetails {
  readonly name: string;
  readonly addressLines: readonly string[];
  readonly city: string;
  readonly mapsUrl: string;
  readonly directionsUrl: string;
  readonly coordinates: { readonly lat: number; readonly lng: number };
  readonly note: string;
}

export interface NavLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

/** Countdown time remaining, already split into display units. */
export interface TimeLeft {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly total: number;
}

export type RsvpAttendance = 'joyfully-accepts' | 'regretfully-declines';

export interface RsvpFormValues {
  name: string;
  email: string;
  phone: string;
  guests: number;
  attendance: RsvpAttendance;
  events: string[];
  message: string;
}

export type RsvpStatus = 'idle' | 'submitting' | 'success' | 'error';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
