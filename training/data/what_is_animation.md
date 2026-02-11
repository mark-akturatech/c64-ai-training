# Human perception and animation: flicker fusion, screen period, pixel-per-update motion, multiplexing

**Summary:** Flicker fusion frequency (~24 Hz), screen period (1/60 second) and integer-pixel-per-screen-update motion are the fundamental timing concepts for animation on the C64; multiplexing (alternating displays faster than ~24 Hz) can be used for special effects but has constraints on differences between frames and object size/speed.

## What is animation (fundamentals)
A video monitor only displays a sequence of still frames; perceived continuous motion comes from the eye’s flicker fusion frequency. When a sequence of different still images is presented faster than the eye can resolve (about 24 Hz), the separate pictures blend into continuous motion. Therefore changes made faster than ~24 times per second will generally appear fluid to a human viewer.

## Screen period and timing unit
On the C64 the screen is updated 60 times per second (the vertical refresh), so the minimum interval for any visible change is 1/60 second. This 1/60 second interval is treated as the fundamental timing unit for animation and game logic and is referred to here as a "screen." Because updates are discrete:
- Fastest granularity of visible motion = 1 pixel per screen update (or integer multiples).
- To move faster than that, an object must change by more than one pixel per screen update.
- To move slower, an object must remain stationary for some number of screens (skip movement on some updates).

Example numeric fact preserved from source: at one pixel per screen update, an object takes about 5.3 seconds to move from one side of the screen to the other (as given in the source).

## Integer-pixel motion and quantization
Animation is produced by a sequence of still frames, so motion is quantized to the update rate:
- Motion increments are typically integer pixels per screen update to avoid visual jitter from subpixel changes (the VIC-II cannot display subpixel horizontal positions without hardware tricks).
- Slower velocities are achieved by moving the object only on a subset of successive screens (e.g., move every Nth screen).
- Faster velocities are achieved by moving multiple pixels each screen.

## Multiplexing (alternating displays) and constraints
Multiplexing is the technique of showing different displays in alternation at a rate the eye will fuse (the source notes “completely different displays could alternate 30 times per second, and the eye would fuse them”). Practical constraints:
- The combined alternation rate must exceed the viewer’s flicker fusion threshold (≈24 Hz) for the illusion to hold.
- The differences between the alternating screens should be limited — large changes can produce visible flicker or discomfort.
- Best results are achieved with small, fast-moving objects (high temporal frequency, small spatial differences).
- Careful design is required to ensure each alternated frame is visible long enough and that motion across alternated frames remains coherent.

## References
- "tv_display_principles" — frame generation and refresh rate details
- "working_with_interrupts_and_raster" — synchronizing animation updates with raster/interrupts
