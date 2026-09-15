# Source artwork

The full-size PNGs the site's images are built from. Nothing here is served or
deployed — that is the whole point of the folder. `public/` is copied wholesale
to the host, so a build input left there is shipped to the CDN and sits in the
bundle forever without a single visitor ever requesting it. These seven files
came to about 9 MB of exactly that.

What reads them:

| script | reads | writes |
| --- | --- | --- |
| `optimize-banners.mjs` | `banner-desktop.png`, `banner-mobile.png` | `public/images/banner/` |
| `optimize-events.mjs` | `haldi.png`, `nikha.png`, `valima.png` | `public/images/events/` |
| `optimize-portraits.mjs` | `groom.png`, `bride.png` | `public/images/portraits/` |

Two more scripts edit the files here **in place** before the optimisers run, to
paint out lettering the page now sets as live type:

- `strip-banner-overlays.mjs` — the names and the duplicated scroll cue
- `strip-event-details.mjs` — the date/time/venue block on two ceremony cards

`strip-event-details.mjs` finds the lettering itself, so running it twice is
harmless — the second pass sees nothing to remove and paints no rows.
`strip-banner-overlays.mjs` works from fixed coordinates and has no such guard:
run it twice and the second pass repaints ground that is already clean. If you
replace a banner PNG, put the original in place, run the strip script once, then
the matching optimiser.

`nikha.png` is the filename as supplied; the ceremony itself is the Nikah.
