/**
 * Document-level SVG defs: the arch clip paths and the lighting filters that
 * give the invitation its material surfaces.
 *
 * Everything tactile on this site is computed, not photographed — `feTurbulence`
 * supplies the fibre, `feDiffuseLighting` and `feSpecularLighting` supply the
 * relief. That keeps embossed paper and moulded wax at a few kilobytes instead
 * of a few megabytes, and it recolours with the palette for free.
 *
 * Render exactly once, near the top of the tree.
 */
import { ARCH_RISE, archClipId, archClipPath, type ArchVariant } from './geometry';

export const FILTER = {
  /** Pattern pressed *into* the surface — the debossed girih on the doors. */
  deboss: 'mat-deboss',
  /** Pattern standing *out* of the surface — used for raised gold mouldings. */
  emboss: 'mat-emboss',
  /** Fine paper tooth. Blend the result with `multiply` over a base colour. */
  paper: 'mat-paper',
  /** Moulded wax with a specular hotspot and a cast shadow. */
  wax: 'mat-wax',
  /** Soft gold sheen for foil edges. */
  foil: 'mat-foil',
} as const;

export function MaterialDefs() {
  const variants = Object.keys(ARCH_RISE) as ArchVariant[];

  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {variants.map((variant) => (
          <clipPath key={variant} id={archClipId(variant)} clipPathUnits="objectBoundingBox">
            <path d={archClipPath(ARCH_RISE[variant])} />
          </clipPath>
        ))}

        {/* ——— Debossed: the shape reads as pressed into the sheet ——— */}
        <filter id={FILTER.deboss} x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="height" />
          {/* Negative surfaceScale inverts the relief, so light falls on the
              far wall of the impression rather than the near one. */}
          <feSpecularLighting
            in="height"
            surfaceScale="-2.4"
            specularConstant="1.15"
            specularExponent="16"
            lightingColor="#ffffff"
            result="spec"
          >
            <feDistantLight azimuth="235" elevation="56" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specClip" />
          </feMerge>
        </filter>

        {/* ——— Embossed: raised, catching light on the near edge ——— */}
        <filter id={FILTER.emboss} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="height" />
          <feSpecularLighting
            in="height"
            surfaceScale="3"
            specularConstant="1.05"
            specularExponent="20"
            lightingColor="#FFF4DC"
            result="spec"
          >
            <feDistantLight azimuth="225" elevation="52" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="sh" />
          <feOffset in="sh" dx="1" dy="1.6" result="shOff" />
          <feFlood floodColor="#3A2A1C" floodOpacity="0.4" result="shCol" />
          <feComposite in="shCol" in2="shOff" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specClip" />
          </feMerge>
        </filter>

        {/* ——— Paper tooth: fine fibre relief across a whole surface ——— */}
        <filter id={FILTER.paper} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="11" result="noise" />
          <feDiffuseLighting
            in="noise"
            surfaceScale="1.15"
            diffuseConstant="1"
            lightingColor="#ffffff"
            result="lit"
          >
            <feDistantLight azimuth="235" elevation="62" />
          </feDiffuseLighting>
          <feColorMatrix in="lit" type="saturate" values="0" />
        </filter>

        {/* ——— Moulded wax: body shading + hotspot + cast shadow ——— */}
        <filter id={FILTER.wax} x="-30%" y="-30%" width="160%" height="165%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="height" />

          <feDiffuseLighting
            in="height"
            surfaceScale="4.5"
            diffuseConstant="1.05"
            lightingColor="#ffffff"
            result="diffuse"
          >
            <feDistantLight azimuth="228" elevation="48" />
          </feDiffuseLighting>
          <feComposite in="diffuse" in2="SourceAlpha" operator="in" result="diffuseClip" />
          <feBlend in="SourceGraphic" in2="diffuseClip" mode="multiply" result="body" />

          <feSpecularLighting
            in="height"
            surfaceScale="4.5"
            specularConstant="1.35"
            specularExponent="26"
            lightingColor="#FFF7E4"
            result="spec"
          >
            <fePointLight x="-30" y="-45" z="110" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
          <feComposite
            in="specClip"
            in2="body"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="lit"
          />

          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="castBlur" />
          <feOffset in="castBlur" dx="0" dy="6" result="castOffset" />
          <feFlood floodColor="#2A1810" floodOpacity="0.42" result="castColour" />
          <feComposite in="castColour" in2="castOffset" operator="in" result="cast" />

          <feMerge>
            <feMergeNode in="cast" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>

        {/* ——— Foil: a soft raised sheen for gold rules and monograms ——— */}
        <filter id={FILTER.foil} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.7" result="height" />
          <feSpecularLighting
            in="height"
            surfaceScale="2.2"
            specularConstant="0.95"
            specularExponent="30"
            lightingColor="#FFFBF0"
            result="spec"
          >
            <fePointLight x="-60" y="-80" z="160" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClip" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specClip" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
