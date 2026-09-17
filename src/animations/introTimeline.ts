'use client';

import type { GoldParticlesHandle } from '@/components/royal/GoldParticles';
import { registerGsap } from './gsap';

/**
 * Elements the opening choreographs. Every one is optional so the timeline
 * degrades safely if a ref has not mounted yet.
 */
export interface IntroTargets {
  root: HTMLElement | null;
  /** Full-bleed darkening layer behind everything. */
  vignette: HTMLElement | null;
  /** The ornamental frame + names that sit in front of the closed doors. */
  cover: HTMLElement | null;
  /** Warm light source sitting *behind* the doors. */
  light: HTMLElement | null;
  /** Central glow on the seal/medallion. */
  seal: HTMLElement | null;
  leftDoor: HTMLElement | null;
  rightDoor: HTMLElement | null;
  /** Full-screen warm flash used for the hand-off. */
  flash: HTMLElement | null;
  particles: GoldParticlesHandle | null;
}

export interface IntroOptions {
  /** Suppresses the swing and the camera push; see the branch below. */
  reducedMotion?: boolean;
  /** Fires when the invitation should take over (page unlocks, chrome fades in). */
  onComplete?: () => void;
}

/**
 * The single master timeline for the opening.
 *
 * One timeline rather than a pile of independent timers: the whole sequence can
 * be scrubbed, paused, reversed or killed as a unit, and the beats stay in a
 * fixed relationship no matter how the browser schedules frames.
 *
 * Choreography — press → light → doors → gold → flash → wedding.
 */
export function buildIntroTimeline(targets: IntroTargets, options: IntroOptions = {}) {
  const gsap = registerGsap();
  const { reducedMotion = false, onComplete } = options;

  const timeline = gsap.timeline({
    paused: true,
    // Governs the vignette, the cover's withdrawal and the leaves fading out.
    // Softened along with the leaves themselves: a cubic default left those
    // moving briskly against doors that no longer do, and the mismatch read as
    // hurry even where nothing had actually got faster.
    defaults: { ease: 'power2.inOut' },
    onComplete,
  });

  if (reducedMotion) {
    // Calm, not cancelled.
    //
    // The leaves do not swing and the camera does not push: those are the
    // large travel the preference is actually asking about, and they go. But
    // the light still blooms behind the doors and the cover still gives way,
    // slowly enough to read as an opening rather than a cut. Nothing here
    // moves in space — every tween is opacity alone.
    //
    // This was a third of a second of everything vanishing at once, which is
    // how a guest with the setting turned on came to open their invitation
    // and find a blank rectangle.
    timeline
      .to(targets.seal, { autoAlpha: 0, duration: 0.6 }, 0)
      .to(targets.cover, { autoAlpha: 0, duration: 1.1 }, 0.2)
      .fromTo(targets.light, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0.2)
      .to([targets.leftDoor, targets.rightDoor], { autoAlpha: 0, duration: 1.4 }, 0.5)
      .fromTo(targets.flash, { opacity: 0 }, { opacity: 1, duration: 0.9 }, 1.5)
      .to(targets.root, { autoAlpha: 0, duration: 0.8 }, 2.2);
    return timeline;
  }

  timeline
    /* 0.0 — the press registers: ground darkens, seal takes the light */
    .to(targets.vignette, { opacity: 1, duration: 1.4 }, 0)
    .to(targets.seal, { scale: 1.12, filter: 'brightness(1.9)', duration: 0.9, ease: 'power2.out' }, 0)

    /* 0.3 — gold begins to gather */
    .call(() => targets.particles?.setIntensity(1.35), undefined, 0.3)
    .call(() => targets.particles?.burst(0.5, 0.46, 22), undefined, 0.45)

    /* 0.5 — the cover furniture withdraws so the doors can be read.
       It used to blur as it went. That put a second animating blur on screen
       through the same window as the light behind the leaves, and the two
       together are what a phone could not keep up with. Lifting and fading
       reads as a withdrawal on its own. */
    .to(targets.cover, { autoAlpha: 0, y: -26, duration: 1.2 }, 0.5)
    .to(targets.seal, { scale: 0.72, autoAlpha: 0, duration: 1, ease: 'power2.in' }, 0.7)

    /* 0.7 — light kindles behind the leaves */
    .fromTo(
      targets.light,
      { opacity: 0, scale: 0.55 },
      { opacity: 0.8, scale: 1, duration: 2.8, ease: 'power2.out' },
      0.7,
    )

    /* 0.9 — the leaves part, and keep parting.

       The ease matters more here than the duration. A cubic in/out spends the
       middle of its travel at roughly four times its own average speed, so the
       leaves lunged through the halfway point however long the tween was given
       — lengthening it only drew out the waiting at either end. A sine curve
       peaks at about 1.6x instead: never hurrying, simply continuing. Together
       with the longer swing, the fastest these ever move is now about a quarter
       of what it was. */
    .fromTo(targets.leftDoor, { rotateY: 0 }, { rotateY: -78, duration: 4.4, ease: 'sine.inOut' }, 0.9)
    .fromTo(targets.rightDoor, { rotateY: 0 }, { rotateY: 78, duration: 4.4, ease: 'sine.inOut' }, 0.9)
    // A touch of push-back so the leaves recede rather than merely rotating.
    .to([targets.leftDoor, targets.rightDoor], { z: -140, duration: 4.4, ease: 'power1.in' }, 0.9)

    /* 2.8 — the doorway floods */
    .to(targets.light, { opacity: 1, scale: 1.5, duration: 2.4, ease: 'power2.out' }, 2.8)
    .call(() => targets.particles?.setIntensity(1.6), undefined, 3.2)
    .call(() => targets.particles?.burst(0.5, 0.5, 34), undefined, 3.6)

    /* 4.5 — the camera travels through the arch, as the leaves reach full swing */
    .to(targets.root, { scale: 1.9, duration: 2.2, ease: 'power2.in' }, 4.5)
    .to([targets.leftDoor, targets.rightDoor], { autoAlpha: 0, duration: 1.1 }, 5.0)

    /* 5.5 — cinematic flash, then hand over */
    .fromTo(targets.flash, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.in' }, 5.5)
    .call(() => targets.particles?.setIntensity(0.5), undefined, 6.2)
    .to(targets.root, { autoAlpha: 0, duration: 1, ease: 'power2.out' }, 6.5);

  return timeline;
}

