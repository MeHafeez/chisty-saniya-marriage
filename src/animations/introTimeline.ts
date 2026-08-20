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
  /** Content revealed in the doorway once the leaves part. */
  reveal: HTMLElement | null;
  /** Full-screen warm flash used for the hand-off. */
  flash: HTMLElement | null;
  particles: GoldParticlesHandle | null;
}

export interface IntroOptions {
  /** Collapses the whole sequence to a short fade. */
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
 * Choreography — press → light → doors → gold → reveal → flash → wedding.
 */
export function buildIntroTimeline(targets: IntroTargets, options: IntroOptions = {}) {
  const gsap = registerGsap();
  const { reducedMotion = false, onComplete } = options;

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.inOut' },
    onComplete,
  });

  if (reducedMotion) {
    // Everything still resolves to the same end state, just without the travel.
    timeline
      .to([targets.cover, targets.leftDoor, targets.rightDoor], { autoAlpha: 0, duration: 0.35 })
      .to(targets.reveal, { autoAlpha: 1, duration: 0.35 }, '<')
      .to(targets.root, { autoAlpha: 0, duration: 0.3 }, '+=0.1');
    return timeline;
  }

  timeline
    /* 0.0 — the press registers: ground darkens, seal takes the light */
    .to(targets.vignette, { opacity: 1, duration: 1.3 }, 0)
    .to(targets.seal, { scale: 1.12, filter: 'brightness(1.9)', duration: 0.8, ease: 'power2.out' }, 0)

    /* 0.3 — gold begins to gather */
    .call(() => targets.particles?.setIntensity(1.35), undefined, 0.3)
    .call(() => targets.particles?.burst(0.5, 0.46, 22), undefined, 0.4)

    /* 0.5 — the cover furniture withdraws so the doors can be read */
    .to(targets.cover, { autoAlpha: 0, y: -26, filter: 'blur(8px)', duration: 1.1 }, 0.5)
    .to(targets.seal, { scale: 0.72, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 0.6)

    /* 0.6 — light kindles behind the leaves */
    .fromTo(
      targets.light,
      { opacity: 0, scale: 0.55 },
      { opacity: 0.8, scale: 1, duration: 2.2, ease: 'power2.out' },
      0.6,
    )

    /* 0.9 — the leaves break, then accelerate away on their outer hinges */
    .fromTo(
      targets.leftDoor,
      { rotateY: 0 },
      { rotateY: -78, duration: 3, ease: 'power3.inOut' },
      0.9,
    )
    .fromTo(
      targets.rightDoor,
      { rotateY: 0 },
      { rotateY: 78, duration: 3, ease: 'power3.inOut' },
      0.9,
    )
    // A touch of push-back so the leaves recede rather than merely rotating.
    .to([targets.leftDoor, targets.rightDoor], { z: -140, duration: 3, ease: 'power2.in' }, 0.9)

    /* 2.0 — the doorway floods */
    .to(targets.light, { opacity: 1, scale: 1.5, duration: 1.6, ease: 'power2.out' }, 2.0)
    .call(() => targets.particles?.setIntensity(1.6), undefined, 2.2)
    .call(() => targets.particles?.burst(0.5, 0.5, 34), undefined, 2.4)

    /* 2.8 — what stands beyond becomes visible */
    .fromTo(
      targets.reveal,
      { autoAlpha: 0, scale: 0.94, filter: 'blur(14px)' },
      { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power2.out' },
      2.8,
    )

    /* 3.4 — the camera travels through the arch */
    .to(targets.root, { scale: 1.9, duration: 2, ease: 'power2.in' }, 3.3)
    .to([targets.leftDoor, targets.rightDoor], { autoAlpha: 0, duration: 1, }, 3.6)

    /* 3.9 — cinematic flash, then hand over */
    .fromTo(
      targets.flash,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.in' },
      3.9,
    )
    .call(() => targets.particles?.setIntensity(0.5), undefined, 4.5)
    .to(targets.root, { autoAlpha: 0, duration: 1, ease: 'power2.out' }, 4.7);

  return timeline;
}

/** Total run time in seconds, used to schedule the hand-off. */
export const INTRO_DURATION = 5.9;
export const INTRO_DURATION_REDUCED = 0.8;
