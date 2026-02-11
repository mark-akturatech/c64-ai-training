# KERNAL $FF84 — Initialise SID, CIA and IRQ (unused)

**Summary:** KERNAL entry at $FF84 intended to initialise the SID chip, CIA timers/interrupts, and the IRQ line; marked unused in this ROM. Searchable terms: $FF84, KERNAL, SID, CIA, IRQ, $D400, $DC00, $DD00.

**Description**
This KERNAL routine (entry point $FF84) is documented in the ROM listing as "initialise SID, CIA and IRQ" but is marked unused in this ROM image. Its stated purpose is to perform early hardware setup for:

- The SID sound chip (initialise SID registers),
- The 6526 CIAs (timer and interrupt configuration),
- The CPU IRQ line (configure/clear IRQs).

The ROM does not call or otherwise reference this entry in the provided listing; it appears to be an available but unused initialisation hook. For related interrupt and real-time clock behaviour driven by CIA timers, see the referenced "ffea_increment_realtime_clock" chunk.

## Source Code
```assembly
; IOINIT - Initialize I/O devices
; Entry point: $FF84
; This routine initializes the SID chip, CIA timers/interrupts, and the IRQ line.

IOINIT:
    SEI             ; Disable interrupts
    LDA #$00
    STA $D418       ; Set SID volume to 0
    LDA #$7F
    STA $DC0D       ; Disable all CIA 1 interrupts
    STA $DD0D       ; Disable all CIA 2 interrupts
    LDA #$01
    STA $DC0E       ; Start Timer A in CIA 1
    STA $DD0E       ; Start Timer A in CIA 2
    CLI             ; Enable interrupts
    RTS
```

## Key Registers
- $FF84 - KERNAL - Initialise SID, CIA and IRQ (entry point; marked unused)
- $D400-$D418 - SID - Voice registers and filter/control (SID base registers)
- $DC00-$DC0F - CIA1 - Timers, TOD, interrupt control (system timer/IRQ source)
- $DD00-$DD0F - CIA2 - Timers, I/O and serial control (secondary CIA)

## References
- "ffea_increment_realtime_clock" — expands on KERNAL interrupt clock handling via CIA timers

## Labels
- IOINIT
