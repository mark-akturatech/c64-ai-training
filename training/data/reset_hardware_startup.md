# C64 ROM Reset Sequence (Entry at $FCE2)

**Summary:** Reset entry at $FCE2 sets up the stack and CPU flags, scans $8000 for an autostart ROM (JSR $FD02 / JMP ($8000)), restores VIC-II horizontal fine scroll ($D016), initialises SID/CIA/IRQ ($FDA3), runs RAM test ($FD50), restores I/O vectors ($FD15), initialises VIC/screen editor ($FF5B), enables interrupts (CLI) and finally JMPs ($A000) into BASIC.

## Reset sequence
This chunk documents the Commodore 64 ROM hardware reset entry starting at $FCE2. The code sequence:

- LDX #$FF / TXS — set the stack pointer to $FF (initial stack top).
- SEI — disable interrupts while initialization runs.
- CLD — clear decimal mode.
- JSR $FD02 — call the autostart/ROM scanner that checks for an autostart image at $8000.
- BNE skip / JMP ($8000) — if an autostart ROM is found, jump indirectly to the vector at $8000 to run its code; otherwise continue normal init.
- STX $D016 — restore the VIC-II horizontal fine scroll/control register (see note below).
- JSR $FDA3 — initialise SID, CIA, and IRQ handling.
- JSR $FD50 — run RAM test and determine top of available RAM.
- JSR $FD15 — restore default I/O vectors (IRQ/BRK/RESET vectors etc.).
- JSR $FF5B — initialise VIC-II and the screen editor (screen memory, colours, character pointers).
- CLI — re-enable interrupts after initialization is complete.
- JMP ($A000) — indirect jump into BASIC start vector (execute BASIC).

**[Note: Source may contain an error — the comment in the original listing says "read the horizontal fine scroll and control register" but the instruction is STX $D016 (which writes X into $D016).]**

## Source Code
```asm
.,FCE2 A2 FF    LDX #$FF        set X for stack
.,FCE4 78       SEI             disable the interrupts
.,FCE5 9A       TXS             clear stack
.,FCE6 D8       CLD             clear decimal mode
.,FCE7 20 02 FD JSR $FD02       scan for autostart ROM at $8000
.,FCEA D0 03    BNE $FCEF       if not there continue startup
.,FCEC 6C 00 80 JMP ($8000)     else call ROM start code
.,FCEF 8E 16 D0 STX $D016       read the horizontal fine scroll and control register
.,FCF2 20 A3 FD JSR $FDA3       initialise SID, CIA and IRQ
.,FCF5 20 50 FD JSR $FD50       RAM test and find RAM end
.,FCF8 20 15 FD JSR $FD15       restore default I/O vectors
.,FCFB 20 5B FF JSR $FF5B       initialise VIC and screen editor
.,FCFE 58       CLI             enable the interrupts
.,FCFF 6C 00 A0 JMP ($A000)     execute BASIC
```

## Key Registers
- $D016 - VIC-II - Horizontal fine scroll and control register (fine X-scroll, bank/graphics control bits)

## References
- "scan_for_autostart_rom_and_signature" — expands on scanning $8000 for autostart image
- "initialise_sid_cia_and_irq" — expands on initialises chips and IRQs
- "test_ram_and_find_ram_end" — expands on RAM test called during reset