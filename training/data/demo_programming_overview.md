# Demo components — graphics, sound, and code (C64 intro)

**Summary:** Overview of C-64 demo components: graphics, sound (DMC, JCH's editors, standard music players), and code; notes on synchronizing visuals with the screen refresh and using loaders (IRQ loaders) for multi-part demos.

## Overview
A typical C-64 demo is built from three elements: graphics, sound (music/effects), and the demo code that ties them together. This note focuses on the coding side while outlining the expectations for graphics and music integration.

## Sound and music
Most demos use pre-made music played by a standard player (for example tunes created with DMC or JCH's editor). Playing music via a player routine is usually straightforward; you may reuse music by others provided you credit the author. Music playback implementations are often separate routines (music players) that the demo code calls or services from an interrupt.

## Graphics focus
Graphics effects are the primary creative work in a demo and are the area where most coding effort goes. Typical graphics primitives include character graphics, bitmaps, and sprites (see linked "graphics_intro"). Graphics effects generally require precise timing and synchronization with the video output to avoid tearing and to create raster-timed effects.

## Synchronization with screen refresh
Demos synchronize visual updates to the C-64 screen refresh (raster timing) to maintain stable output and enable raster effects. Common synchronization methods:
- Raster interrupts (IRQ) — update state at a chosen raster line (briefly: VIC-II raster interrupts)
- Wait loops/polling — busy-wait until a raster position or frame boundary

Choosing between IRQ-driven and polled synchronization depends on complexity and timing needs.

## Loading multi-part demos
If a demo is too large to fit in memory, parts are loaded from disk. Existing loader routines are commonly reused rather than reimplemented. An IRQ loader is a loader design that performs disk I/O while keeping interrupts (and thus the demo's timing/interrupt-driven code) running; see "irq_loaders" for expanded details.

## References
- "irq_loaders" — expanded explanation of loading parts from disk without interrupting demo timing
- "graphics_intro" — deeper coverage of graphics primitives (sprites, character mode, bitmap mode)
