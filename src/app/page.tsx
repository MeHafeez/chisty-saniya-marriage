import { Footer } from '@/components/layout/Footer';
import { RoyalTransition } from '@/components/royal/RoyalTransition';
import {
  Blessings,
  Closing,
  Countdown,
  Couple,
  Events,
  Family,
  Hero,
  Venue,
  Welcome,
} from '@/sections';

/**
 * The invitation, in order.
 *
 * Every section is separated by a `RoyalTransition` rather than butting
 * directly against its neighbour: the two grounds blend through a gradient and
 * a gold ornament carries the join, so the page reads as one continuous
 * document. The motif varies while the language stays the same.
 *
 * Section grounds, for reference when reordering:
 *   Hero cream · Welcome cream · Couple champagne · Events champagne
 *   · Countdown NIGHT · Venue NIGHT · Family champagne
 *   · Blessings champagne
 *
 * The Three Days (LoveStory), Gallery, RSVP, and Closing sections have been removed
 * at the couple's request. Their components are still in the repository,
 * so either can be restored by re-adding it here and to `NAV_LINKS`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <RoyalTransition from="cream" to="cream" motif="sprig" />
      <Welcome />

      <RoyalTransition from="cream" to="cream" motif="line" />
      <Couple />

      <RoyalTransition from="cream" to="cream" motif="swag" />
      <Events />

      <RoyalTransition from="cream" to="night" motif="line" />
      <Countdown />

      <RoyalTransition from="night" to="night" motif="line" />
      <Venue />

      <RoyalTransition from="night" to="cream" motif="swag" />
      <Family />

      <RoyalTransition from="cream" to="cream" motif="line" />
      <Blessings />

      <Closing />

      <Footer />
    </>
  );
}
