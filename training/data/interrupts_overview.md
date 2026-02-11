# Introduction to interrupts in demo programming

**Summary:** Interrupts (raster interrupts, NMIs) are essential for precise timing on the C64: use VIC-II raster interrupts (see $D012) or NMIs to eliminate jitter, synchronize effects to scanlines, and implement IRQ-style loaders that stream data without breaking visual timing.

**Interrupts**
Interrupts allow code to run at precise, repeatable points in the video/timing cycle rather than being driven by polling or ad‑hoc delays. For demo work this removes frame-to-frame jitter, keeps music timing steady, and enables effects that must occur on specific scanlines (raster bars, split-screen, sprite multiplexing). Two interrupt types are most relevant to demos: raster interrupts (VIC-II triggered) and NMIs (non-maskable interrupts — high-priority, separate vector).

**Why interrupts for demos**
- Smooth, repeatable timing: an interrupt handler executes at a predictable point each frame/scanline, keeping movement and music in lockstep.
- Reduced jitter: polling (reading $D012 repeatedly) is sensitive to variable code execution time; interrupts avoid that by firing independently of main-loop timing.
- Deterministic scanline effects: placing code in an interrupt that triggers on a given raster line guarantees the effect runs at that line every frame.
- Background loading (IRQ loaders): by performing small, time-sliced I/O work from an interrupt handler, large loads can proceed without freezing or corrupting the display.

**Raster interrupts vs polling**
- Polling $D012 (the VIC-II raster register) is simple but fragile: any interruption or variable work between polls shifts when your code sees the desired raster line, producing jitter.
- Raster interrupts (VIC-II generated) deliver a hardware-triggered event at a chosen scanline so the CPU can run an ISR at exactly that moment (no continuous polling required). Use this for scanline-accurate effects and stable frame timing.
- NMIs are a different class (non-maskable) and are useful where an external or high-priority source must preempt normal execution; demos typically rely on raster interrupts for graphics timing and may use NMIs for loader-related or system-level events depending on design.

**IRQ loaders (concept)**
An IRQ-style loader uses an interrupt to repeatedly perform small pieces of the load/decompression/streaming process so the main demo loop remains responsive and visually stable. Typical characteristics:
- Interrupt handler performs a small, fixed-size chunk of I/O work each invocation.
- Visual timing is preserved because the interrupt is synchronized (often to the raster or frame).
- The main program coordinates buffer management and reassembly while the ISR supplies data steadily.

## Source Code
```assembly
; Example: Setting up a raster interrupt on the C64

    SEI                     ; Disable interrupts
    LDA #<irq_handler       ; Load low byte of IRQ handler address
    STA $0314               ; Store at IRQ vector low byte
    LDA #>irq_handler       ; Load high byte of IRQ handler address
    STA $0315               ; Store at IRQ vector high byte
    LDA #$7F
    STA $DC0D               ; Disable CIA #1 interrupts
    STA $DD0D               ; Disable CIA #2 interrupts
    LDA #$01
    STA $D01A               ; Enable raster interrupt
    LDA #$00
    STA $D012               ; Set raster line to 0
    LDA $D011
    AND #%01111111          ; Clear high bit of raster line
    STA $D011
    CLI                     ; Enable interrupts

irq_handler:
    ; Your interrupt code here
    LDA #$01
    STA $D019               ; Acknowledge the interrupt
    RTI                     ; Return from interrupt
```

## Key Registers
- $D012 - VIC-II - Raster register (low 8 bits of the raster counter)
- $D011 - VIC-II - Control Register 1 (bit 7 is the high bit of the raster counter)
- $D019 - VIC-II - Interrupt Status Register
- $D01A - VIC-II - Interrupt Enable Register
- $0314/$0315 - IRQ vector (low/high byte)
- $0318/$0319 - NMI vector (low/high byte)

## References
- "d012_raster_register" — discussion of polling $D012 vs using raster interrupts
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Other graphics features
- Commodore 64 VIC-II Graphics Guide
- Commodore 64 Programming #9: Interrupts and music
- Interrupts on the Commodore 64 — a very simple example
- How to Set Up and Use NMIs On the Commodore 64

## Labels
- $D012
- $D011
- $D019
- $D01A
- $0314
- $0315
- $0318
- $0319
