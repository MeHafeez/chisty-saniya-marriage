'use client';

import { motion } from 'framer-motion';

import { EASE } from '@/constants/motion';
import { cn } from '@/utils/cn';
import { crescentPath, onionDomePath, pointedArchPath } from './geometry';

export interface MosqueSilhouetteProps {
  className?: string;
  /** Drives the staggered rise; keep false until the scene should assemble. */
  active?: boolean;
}

const GROUND = 400;

/** One minaret: shaft, two balconies, cap dome and crescent. */
function Minaret({ x, height, delay, active }: { x: number; height: number; delay: number; active: boolean }) {
  const width = 22;
  const capBase = GROUND - height;
  const half = width / 2;

  return (
    <motion.g
      initial={{ opacity: 0, y: 70 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
      transition={{ duration: 1.9, delay, ease: EASE.luxe }}
    >
      {/* Shaft, very slightly tapered */}
      <path
        d={`M${x - half} ${GROUND} L${x - half * 0.78} ${capBase} L${x + half * 0.78} ${capBase} L${x + half} ${GROUND} Z`}
        fill="currentColor"
      />
      {/* Balconies */}
      {[0.38, 0.66].map((t) => {
        const y = GROUND - height * t;
        return (
          <g key={t}>
            <rect x={x - half * 1.7} y={y} width={half * 3.4} height={5} rx={1} fill="currentColor" />
            <rect
              x={x - half * 1.45}
              y={y - 7}
              width={half * 2.9}
              height={7}
              fill="currentColor"
              fillOpacity="0.55"
            />
          </g>
        );
      })}
      {/* Cap */}
      <path d={onionDomePath(x, capBase, half * 1.35, height * 0.13)} fill="currentColor" />
      <rect x={x - 1} y={capBase - height * 0.19} width={2} height={height * 0.05} fill="currentColor" />
      <path
        d={crescentPath(x, capBase - height * 0.215, 6)}
        fill="currentColor"
        className="text-gold"
      />
    </motion.g>
  );
}

/**
 * The courtyard beyond the doors: a domed prayer hall flanked by minarets,
 * fronted by an arcade of pointed arches. Drawn as one silhouette so it reads
 * instantly at any size, with a gold rim-light picking out the skyline.
 */
export function MosqueSilhouette({ className, active = true }: MosqueSilhouetteProps) {
  const arcade = [318, 378, 438, 498, 558];

  return (
    <svg
      viewBox="0 0 900 420"
      className={cn('h-full w-full', className)}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="mosque-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E241F" />
          <stop offset="70%" stopColor="#241C18" />
          <stop offset="100%" stopColor="#1A1411" />
        </linearGradient>
        <linearGradient id="mosque-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6CF9E" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C6A66A" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="mosque-halo" cx="0.5" cy="0.62" r="0.55">
          <stop offset="0%" stopColor="#F0DFBB" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F0DFBB" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo behind the central dome */}
      <motion.ellipse
        cx="450"
        cy="240"
        rx="260"
        ry="200"
        fill="url(#mosque-halo)"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
        transition={{ duration: 2.6, delay: 0.2, ease: EASE.luxe }}
        style={{ transformOrigin: '450px 240px' }}
      />

      <g fill="url(#mosque-body)" color="#241C18">
        <Minaret x={132} height={286} delay={0.5} active={active} />
        <Minaret x={768} height={286} delay={0.62} active={active} />

        {/* Flanking wings */}
        <motion.g
          initial={{ opacity: 0, y: 48 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 1.8, delay: 0.34, ease: EASE.luxe }}
        >
          <rect x="212" y="312" width="96" height={GROUND - 312} />
          <rect x="592" y="312" width="96" height={GROUND - 312} />
          <path d={onionDomePath(260, 312, 38, 62)} />
          <path d={onionDomePath(640, 312, 38, 62)} />
          <path d={pointedArchPath(236, 400, 48, 66)} fill="#120E0C" />
          <path d={pointedArchPath(616, 400, 48, 66)} fill="#120E0C" />
        </motion.g>

        {/* Prayer hall */}
        <motion.g
          initial={{ opacity: 0, y: 60 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 2, delay: 0.16, ease: EASE.luxe }}
        >
          <rect x="300" y="268" width="300" height={GROUND - 268} />
          {/* Drum */}
          <rect x="392" y="238" width="116" height="34" rx="3" />
          {/* Great dome */}
          <path d={onionDomePath(450, 240, 88, 132)} />
          {/* Finial */}
          <rect x="447" y="86" width="6" height="26" />
          <path d={crescentPath(450, 74, 13)} className="text-gold" fill="#D9BE84" />

          {/* Arcade */}
          {arcade.map((x) => (
            <path key={x} d={pointedArchPath(x, 400, 44, 88)} fill="#140F0D" />
          ))}
          {/* Central iwan */}
          <path d={pointedArchPath(414, 400, 72, 128)} fill="#0E0A09" />
        </motion.g>

        {/* Skyline rim-light */}
        <motion.g
          fill="none"
          stroke="url(#mosque-rim)"
          strokeWidth="1.6"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2.4, delay: 1.2 }}
        >
          <path d={onionDomePath(450, 240, 88, 132)} />
          <path d={onionDomePath(260, 312, 38, 62)} />
          <path d={onionDomePath(640, 312, 38, 62)} />
        </motion.g>
      </g>

      {/* Courtyard floor catching the light */}
      <motion.rect
        x="0"
        y={GROUND}
        width="900"
        height="20"
        fill="#0E0A09"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      />
    </svg>
  );
}
