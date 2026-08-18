'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { HiOutlineXMark, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

import { EASE } from '@/constants/motion';
import { useExperience } from '@/context/ExperienceProvider';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { GalleryImage } from '@/types';

export interface LightboxProps {
  images: readonly GalleryImage[];
  /** `null` closes the lightbox. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Full-screen image viewer with keyboard navigation and a restored focus target. */
export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const { lenis } = useExperience();
  const isOpen = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);

  useScrollLock(isOpen, lenis);

  const image = index !== null ? images[index] : undefined;

  const goTo = useCallback(
    (direction: 1 | -1) => {
      if (index === null || images.length === 0) return;
      onNavigate((index + direction + images.length) % images.length);
    },
    [images.length, index, onNavigate],
  );

  useEffect(() => {
    if (!isOpen) return;

    restoreRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') goTo(1);
      if (event.key === 'ArrowLeft') goTo(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen, onClose, goTo]);

  return (
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center px-4 py-16 sm:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE.soft }}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${images.length}: ${image.caption}`}
        >
          <motion.button
            type="button"
            className="absolute inset-0 cursor-default bg-ink/92 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            tabIndex={-1}
            aria-label="Close image viewer"
          />

          {/* Close */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-all duration-500 hover:border-gold hover:text-gold sm:right-8 sm:top-8"
          >
            <HiOutlineXMark aria-hidden className="text-xl" />
          </button>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous image"
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-all duration-500 hover:border-gold hover:text-gold sm:left-8"
              >
                <HiOutlineChevronLeft aria-hidden className="text-xl" />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next image"
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-all duration-500 hover:border-gold hover:text-gold sm:right-8"
              >
                <HiOutlineChevronRight aria-hidden className="text-xl" />
              </button>
            </>
          )}

          {/* Frame */}
          <AnimatePresence mode="wait">
            <motion.figure
              key={image.id}
              className="relative z-[1] flex max-h-full w-full max-w-4xl flex-col items-center"
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
              transition={{ duration: 0.85, ease: EASE.luxe }}
            >
              <div className="relative w-full overflow-hidden border border-ivory/15">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 1024px) 92vw, 56rem"
                  className="max-h-[72vh] w-full object-contain"
                  priority
                />
              </div>

              <figcaption className="mt-6 flex flex-col items-center gap-2 text-center">
                <span className="font-script text-2xl text-gold-soft">{image.caption}</span>
                <span className="font-sans text-[0.5625rem] uppercase tracking-[0.34em] text-ivory/50">
                  {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
