# RAMTAS: INIT SYSTEM CONSTANTS ($FD50) — KERNAL entry vectored from $FF87

**Summary:** KERNAL RAMTAS (vector $FF87) initializes system constants: clears RAM pages $0000, $0200 and $0300, sets cassette/tape buffer pointer ($033C via zero page $B2/$B3), probes RAM starting at $0400 by writing test patterns #$55/#$AA (restoring original bytes), then calls $FE2D to set MEMTOP and stores bottom-of-memory and bottom-of-screen pointers at $0282 and $0288.

## Description
This routine performs early system initialization used by the C64 KERNAL:

- Clears three 256-byte pages: $0000-$00FF, $0200-$02FF and $0300-$03FF by storing 0 into each byte (uses indirect indexed stores with Y looping 0..255).
- Initializes the cassette buffer pointer to $033C by storing $3C into $B2 and $03 into $B3 (zero page variables TAPE1/TAPE2).
- Performs a memory test starting at $0400 upward to determine the RAM/ROM boundary:
  - For each tested address the routine:
    - Loads the original byte (LDA ($C1),Y) and saves it in X (TAX).
    - Writes #$55 and reads it back (STA ($C1),Y; CMP ($C1),Y).
    - If the read does not match #$55, the test stops (ROM hit).
    - ROL the accumulator (ROL) turning #$55 -> #$AA, writes #$AA and verifies similarly.
    - Restores the original byte (TXA; STA ($C1),Y).
  - The pointer used for the test is the zero-page indirect pointer at $C1/$C2 (this routine increments $C2 before testing; the pointer is expected to address $0400 at start).
  - Y is used as the page offset and is incremented each test. When Y wraps from $FF to $00, a new page is stepped by control flow (BEQ/branch).
- After the memory probe exits on ROM detection, the routine sets MEMTOP by JSR $FE2D (X and Y hold the boundary address when called).
- Sets system pointers:
  - $0282 := $0800 (bottom of memory pointer)
  - $0288 := $0400 (bottom of screen pointer)
- Returns to caller (RTS).

Behavioral notes preserved from source:
- The routine restores original RAM contents after each test write.
- The test stops as soon as the written value cannot be read back (indicating ROM).
- X and Y are used to pass the discovered top-of-memory address into the FE2D routine.

## Source Code
```asm
.,FD50 A9 00    LDA #$00
.,FD52 A8       TAY
.,FD53 99 02 00 STA $0002,Y     Fill pages 0,2,3 with zeros
.,FD56 99 00 02 STA $0200,Y
.,FD59 99 00 03 STA $0300,Y
.,FD5C C8       INY
.,FD5D D0 F4    BNE $FD53       all 256 bytes
.,FD5F A2 3C    LDX #$3C
.,FD61 A0 03    LDY #$03        Set tapebuffer to $033c
.,FD63 86 B2    STX $B2         Variables TAPE1 is used.
.,FD65 84 B3    STY $B3
.,FD67 A8       TAY
.,FD68 A9 03    LDA #$03
.,FD6A 85 C2    STA $C2
.,FD6C E6 C2    INC $C2
.,FD6E B1 C1    LDA ($C1),Y     Perform memorytest. Starting at $0400 and upwards.
.,FD70 AA       TAX             Store temporary in X-reg
.,FD71 A9 55    LDA #$55
.,FD73 91 C1    STA ($C1),Y     Write #$55 into memory
.,FD75 D1 C1    CMP ($C1),Y     and compare.
.,FD77 D0 0F    BNE $FD88       if not equal... ROM
.,FD79 2A       ROL
.,FD7A 91 C1    STA ($C1),Y     Write #$AA into same memory
.,FD7C D1 C1    CMP ($C1),Y     and compare again.
.,FD7E D0 08    BNE $FD88       if not equal... ROM
.,FD80 8A       TXA
.,FD81 91 C1    STA ($C1),Y     Restore stored value
.,FD83 C8       INY
.,FD84 D0 E8    BNE $FD6E       Next memorypos
.,FD86 F0 E4    BEQ $FD6C       New page in memory
.,FD88 98       TYA             The memorytest always exits when reaching a ROM
.,FD89 AA       TAX
.,FD8A A4 C2    LDY $C2
.,FD8C 18       CLC
.,FD8D 20 2D FE JSR $FE2D       Set top of memory. X and Y holds address.
.,FD90 A9 08    LDA #$08
.,FD92 8D 82 02 STA $0282       Set pointer to bottom of memory ($0800)
.,FD95 A9 04    LDA #$04
.,FD97 8D 88 02 STA $0288       Set pointer to bottom of screen ($0400)
.,FD9A 60       RTS
```

## Key Registers
- $FF87 - KERNAL vector (RAMTAS entry) — vectored to this routine
- $0000-$00FF - RAM page 0 — cleared to $00
- $0200-$02FF - RAM page 2 — cleared to $00
- $0300-$03FF - RAM page 3 — cleared to $00
- $033C - Tape buffer start (set via zero page $B3/$B2 to $03/$3C)
- $B2 - Zero page - low byte of tape buffer pointer (set to $3C)
- $B3 - Zero page - high byte of tape buffer pointer (set to $03)
- $C1-$C2 - Zero page indirect pointer used for memory test (expected to point at $0400 at start)
- $0282 - System pointer "bottom of memory" (stored $0800)
- $0288 - System pointer "bottom of screen" (stored $0400)

## References
- "memtop_read_set_top_of_memory" — expands on FE2D called here to set top of memory

## Labels
- RAMTAS
- TAPE1
- TAPE2
