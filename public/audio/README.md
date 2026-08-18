# Ambient audio

Drop a looping instrumental here as `ambient.mp3`.

```
public/audio/ambient.mp3
```

The music toggle (bottom-left) appears **only** when this file loads successfully, so the
invitation is complete without it. Playback begins on the "Open Invitation" click — a real
user gesture — so no browser autoplay policy blocks it.

Configure the path and volume in [`src/constants/site.ts`](../../src/constants/site.ts):

```ts
export const AUDIO_TRACK = {
  src: '/audio/ambient.mp3',
  title: 'Ambient Strings',
  volume: 0.35,
} as const;
```

Keep the file small — 2–4 MB, mono, 96–128 kbps is plenty for background strings, and it
loads lazily (`preload: 'none'`) so it never delays first paint.
