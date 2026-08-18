'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Registers GSAP plugins exactly once, on the client.
 * Call from any component that needs ScrollTrigger before creating tweens.
 */
export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 1 });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
