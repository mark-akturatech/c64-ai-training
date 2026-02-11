# VIC-20 Interrupt Project (Unexpanded)

**Summary:** Demonstrates a small VIC-20 interrupt handler that reads a byte from $0091 (keyboard/IO), stores it to screen memory at $1E00, and chains to the IRQ link at $03A0. Shows copying link bytes between $0314/$0315 and $03A0/$03A1, installing a new link (SEI/STA/CLI), and restoring the original vector; includes SYS 836 (enable) and SYS 861 (disable) notes.

## Description
This chunk contains an assembly example for an unexpanded VIC-20 that:

- The interrupt handler at $033C reads the byte at $0091 and writes it to screen RAM at $1E00, then JMPs to the IRQ link at $03A0 to preserve normal interrupt chaining.
- Provides a short routine to copy the bytes at $0314/$0315 into $03A0/$03A1 (placing the current link address into the IRQ-link vector).
- Shows the "fire up" sequence to install a new interrupt handler address into $0314/$0315 using SEI/STA/CLI and an RTS.
- Shows the restore sequence to copy back the saved $03A0/$03A1 into $0314/$0315 (again using SEI/CLI/RTS).
- Notes that SYS 836 invokes the new interrupt code and SYS 861 turns it off, and warns about the common white-on-white display problem.

All addresses and code match the original listing; no extra behaviour is implied beyond the assembled instructions shown.

## Source Code
```asm
.A 033C  LDA $91
.A 033E  STA $1E00
.A 0341  JMP ($03A0)

To place the link address into $03A0/1:

.A 0344  LDA $0314
.A 0347  STA $03A0
.A 034A  LDA $0315
.A 034D  STA $03A1

To fire up the program:

.A 0350  SEI
.A 0351  LDA #$3C
.A 0353  STA $0314
.A 0356  LDA #$03
.A 0358  STA $0315
.A 035B  CLI
.A 035C  RTS

To restore the original interrupt:

.A 035D  SEI
.A 035E  LDA $03A0
.A 0361  STA $0314
.A 0364  LDA $03A1
.A 0367  STA $0315
.A 036A  CLI
.A 036B  RTS
```

## Key Registers
- $0091 - I/O - keyboard/serial input byte (source reads from this location)
- $1E00 - RAM - VIC-20 screen memory base (unexpanded screen location where character is stored)
- $03A0-$03A1 - Vector bytes - IRQ link JMP/Tail (handler chain target)
- $0314-$0315 - Vector bytes - link/source address that is copied to/from $03A0/$03A1 to install the handler

## References
- "exercise_ch7_interrupt_pet" — PET/CBM variant of the interrupt project (expands on PET version)