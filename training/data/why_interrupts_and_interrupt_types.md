# Why use interrupts (C‑64 demos)

**Summary:** Interrupts (VIC‑II raster, sprite‑collision; CIA timer; NMI; IRQ vectoring at $FFFE/$FFFA) let a demo perform stable, low‑jitter timing and background tasks without polling — used for raster‑timing, sprite handling, and IRQ‑loaders that stream data while the display runs.

**What is an interrupt?**
An interrupt is a hardware signal that temporarily pauses the CPU's current program flow and transfers execution to a predefined handler (the interrupt routine). Conceptually like an alarm clock: you set WHEN the interrupt should occur and WHAT the CPU should do then. Until the interrupt fires, the CPU continues its normal work.

On the C‑64 interrupts are used to:
- schedule precise code at specific raster lines (VIC‑II),
- respond to CIA timer expiries,
- detect sprite collisions or other VIC events,
- handle non‑maskable events (NMI, e.g. RESTORE).

Using interrupts avoids tight polling loops and yields stable timing and flicker‑free updates.

**Why demos use interrupts**
- Stable timing: raster interrupts execute at a known raster line each frame, providing frame‑accurate updates (for splits, color changes, sprite multiplexing).
- Less CPU waste: CIAs can generate timed interrupts so code runs only when needed instead of constantly polling timers.
- Complex background work: IRQ‑loaders use interrupts to load/decompress data from disk or tape in small chunks between visible rendering, letting large demos stream content without breaking the display.
- Hardware events: VIC sprite‑collision interrupts let you react precisely to collisions, useful for effects or synchronization.

It is possible to write demos without interrupts (disable CIA interrupts and avoid jitter), but interrupts give control and scalability required for larger, polished demos. Most demo authors rely primarily on raster interrupts.

**Types of interrupts on the C‑64 (overview)**
- VIC‑II raster interrupt — most commonly used for per‑scanline/frame timing and display split effects.
- VIC‑II sprite collision interrupts — fire on sprite‑to‑sprite or sprite‑to‑background collisions.
- CIA timer interrupts (CIA1 and CIA2) — programmable countdown timers that can generate IRQs on expiration; useful for periodic work not tied to the raster.
- NMI (Non‑Maskable Interrupt) — triggered by the RESTORE key (and combinations like RUN/STOP+RESTORE); NMI cannot be disabled by the CPU and may disrupt a demo if not handled.
- IRQ (maskable) — the standard maskable interrupt line used by VIC and CIAs; handler installed via the IRQ vector.

**Practical notes / pitfalls (from source)**
- You can avoid jitter by disabling CIA interrupts if you do not want them, but that limits capabilities.
- Raster interrupts are the primary tool for display timing in demos.
- IRQ‑loaders are essential if your demo exceeds RAM and need to stream data — they rely on interrupts to load in the background without corrupting the visible display.
- The RESTORE (NMI) key combination can "kill" a demo if the demo does not preserve or handle the NMI vector/stack properly; demos should account for NMIs if they expect to remain robust.

## Source Code
```text
; VIC-II Control Register 1 ($D011)
; Bit layout:
; 7 6 5 4 3 2 1 0
; | | | | | | | |
; | | | | | | +-- YSCROLL: Vertical fine scrolling (0-7)
; | | | | | +---- RSEL: Row select (0=24 rows, 1=25 rows)
; | | | | +------ DEN: Display enable (0=screen off, 1=screen on)
; | | | +-------- BMM: Bitmap mode (0=off, 1=on)
; | | +---------- ECM: Extended color mode (0=off, 1=on)
; | +------------ Unused
; +-------------- RST8: Most significant bit of raster line (0-1)

; VIC-II Raster Register ($D012)
; Bit layout:
; 7 6 5 4 3 2 1 0
; | | | | | | | |
; +--+--+--+--+--+--+--+-- Raster line (0-255)

; VIC-II Interrupt Flag Register ($D019)
; Bit layout:
; 7 6 5 4 3 2 1 0
; | | | | | | | |
; | | | | | | | +-- IRQ: Raster compare interrupt flag (1=interrupt occurred)
; | | | | | | +---- MC: Sprite-background collision interrupt flag (1=interrupt occurred)
; | | | | | +------ SC: Sprite-sprite collision interrupt flag (1=interrupt occurred)
; | | | | +-------- LP: Light pen interrupt flag (1=interrupt occurred)
; | | | +---------- Unused
; | | +------------ Unused
; | +-------------- Unused
; +---------------- IRQ: Interrupt request flag (1=any interrupt occurred)

; VIC-II Interrupt Enable Register ($D01A)
; Bit layout:
; 7 6 5 4 3 2 1 0
; | | | | | | | |
; | | | | | | | +-- ER: Enable raster compare interrupt (1=enabled)
; | | | | | | +---- EMC: Enable sprite-background collision interrupt (1=enabled)
; | | | | | +------ ESC: Enable sprite-sprite collision interrupt (1=enabled)
; | | | | +-------- ELP: Enable light pen interrupt (1=enabled)
; | | | +---------- Unused
; | | +------------ Unused
; | +-------------- Unused
; +---------------- IRQ: Interrupt enable flag (1=any interrupt enabled)

; CIA Timer Control Registers ($DC0E, $DC0F for CIA1; $DD0E, $DD0F for CIA2)
; Bit layout:
; 7 6 5 4 3 2 1 0
; | | | | | | | |
; | | | | | | | +-- START: Start/stop timer (1=start, 0=stop)
; | | | | | | +---- PBON: Timer output on PB6 (1=enabled, 0=disabled)
; | | | | | +------ OUTMODE: Timer output mode (1=toggle, 0=pulse)
; | | | | +-------- RUNMODE: Timer run mode (1=one-shot, 0=continuous)
; | | | +---------- FORCELOAD: Force load timer (1=load)
; | | +------------ INMODE: Input mode (1=external CNT, 0=system clock)
; | +-------------- SPMODE: Serial port mode (1=output, 0=input)
; +---------------- TODIN: Time-of-day clock frequency (1=50Hz, 0=60Hz)
```

## Key Registers
- $D000-$D02E - VIC‑II - VIC registers (raster counter at $D012, interrupt flag $D019, interrupt enable $D01A, control $D011 for MSB of raster)
- $DC00-$DC0F - CIA1 - timers, control and interrupt registers (CIA1 often used for joystick scanning, timekeeping and IRQs)
- $DD00-$DD0F - CIA2 - timers, control and interrupt registers (CIA2 commonly used for disk/tape timing and IRQs)
- $FFFA-$FFFF - CPU - interrupt vectors (NMI vector $FFFA/$FFFB, RESET $FFFC/$FFFD, IRQ/BRK $FFFE/$FFFF)

## References
- "irq_loaders" — expands on use of interrupts by loaders and streaming data techniques

## Labels
- D011
- D012
- D019
- D01A
- DC0E
- DC0F
- DD0E
- DD0F
