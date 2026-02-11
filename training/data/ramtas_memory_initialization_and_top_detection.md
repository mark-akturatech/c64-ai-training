# RAMTAS — KERNAL memory size detection and initialization (FD50-FD9A)

**Summary:** Implements KERNAL RAM initialization and top-of-memory detection (labels RAMTAS, RAMTZ0..2, RAMTBT, SIZE), zeros low memory and system/user buffers, allocates tape buffer pointers ($B2/$B3 = TAPE1/TBUFFR), probes RAM with $55/$AA test via indirect pointer at $C1/$C2 (TMP0), and records top-of-memory by calling SETTOP (JSR $FE2D). Sets MEMBOT (MEMSTR) high byte $0282 and HIBASE (screen base) $0288 and returns.

## Description
This code performs three tasks during system startup:

- Zero low memory and a set of system/user buffers:
  - LDA #$00 / TAY initializes Y=0; a loop stores $00 to $0002+Y, $0200+Y and $0300+Y for Y = 0..255 (RAMTZ0 loop). This clears zero page (from $0002), the $0200 page (user buffers/variables) and $0300 page (system/user space) over a full 256-byte span.

- Allocate tape buffer pointer:
  - Loads the 16-bit pointer TBUFFR (low byte $3C, high byte $03 in the listing) into zero-page locations $B2 (low) and $B3 (high), setting TAPE1/TAPE1+1 used by the cassette IRQ/table.

- Detect top-of-RAM and record it:
  - RAMTBT/RAMTZ1/RAMTZ2 implement a probe that steps through memory pages using an indirect pointer in $C1/$C2 (TMP0). Y is used to step within a page; $C2 (high byte) is incremented to move the probe through higher pages.
  - For each tested byte the routine:
    - Loads the current byte via LDA ($C1),Y and saves it in X (TAX).
    - Writes $55, reads back and compares.
    - ROLs A (making $AA), writes $AA, reads back and compares.
    - If either comparison fails, it branches to SIZE (top-of-memory found).
    - If both succeed, restores the original byte (using TXA/STA ($C1),Y), increments Y and repeats; when Y wraps, increments $C2 and continues.
  - When SIZE is reached, it transfers TMP0 into X/Y, clears carry and JSR $FE2D (SETTOP) to record the detected top-of-memory.
  - After SETTOP the routine sets default MEMBOT and HIBASE:
    - Stores #$08 to $0282 (comment: MEMSTR+1 — sets MEMBOT high byte, resulting in MEMBOT = $0800).
    - Stores #$04 to $0288 (HIBASE = $0400, screen base).
  - Returns with RTS.

Behavioral/coding notes:
- The RAM probe preserves original memory contents by saving and restoring the tested byte.
- The probe uses the 16-bit pointer at $C1/$C2 and Y as the page offset; $C2 is seeded with #$03 then incremented before the first test loop iteration (so testing begins from the pointer + high byte = initial +1 — see code order).
- SETTOP is called with TMP0 (pointer) in X/Y and carry clear; SETTOP records the top-of-memory based on this pointer (see SETTOP/GETTOP helpers).

## Source Code
```asm
                                ; RAMTAS - MEMORY SIZE CHECK AND SET
                                ;
.,FD50 A9 00    LDA #$00        RAMTAS LDA #0          ;ZERO LOW MEMORY
.,FD52 A8       TAY                    TAY             ;START AT 0002
.,FD53 99 02 00 STA $0002,Y     RAMTZ0 STA $0002,Y     ;ZERO PAGE
.,FD56 99 00 02 STA $0200,Y            STA $0200,Y     ;USER BUFFERS AND VARS
.,FD59 99 00 03 STA $0300,Y            STA $0300,Y     ;SYSTEM SPACE AND USER SPACE
.,FD5C C8       INY                    INY
.,FD5D D0 F4    BNE $FD53              BNE RAMTZ0
                                ;
                                ;ALLOCATE TAPE BUFFERS
                                ;
.,FD5F A2 3C    LDX #$3C               LDX #<TBUFFR
.,FD61 A0 03    LDY #$03               LDY #>TBUFFR
.,FD63 86 B2    STX $B2                STX TAPE1
.,FD65 84 B3    STY $B3                STY TAPE1+1
                                ;
                                ; SET TOP OF MEMORY
                                ;
                                RAMTBT
.,FD67 A8       TAY                    TAY             ;MOVE $00 TO .Y
.,FD68 A9 03    LDA #$03               LDA #3          ;SET HIGH INITAL INDEX
.,FD6A 85 C2    STA $C2                STA TMP0+1
                                ;
.,FD6C E6 C2    INC $C2         RAMTZ1 INC TMP0+1      ;MOVE INDEX THRU MEMORY
.,FD6E B1 C1    LDA ($C1),Y     RAMTZ2 LDA (TMP0)Y     ;GET PRESENT DATA
.,FD70 AA       TAX                    TAX             ;SAVE IN .X
.,FD71 A9 55    LDA #$55               LDA #$55        ;DO A $55,$AA TEST
.,FD73 91 C1    STA ($C1),Y            STA (TMP0)Y
.,FD75 D1 C1    CMP ($C1),Y            CMP (TMP0)Y
.,FD77 D0 0F    BNE $FD88              BNE SIZE
.,FD79 2A       ROL                    ROL A
.,FD7A 91 C1    STA ($C1),Y            STA (TMP0)Y
.,FD7C D1 C1    CMP ($C1),Y            CMP (TMP0)Y
.,FD7E D0 08    BNE $FD88              BNE SIZE
.,FD80 8A       TXA                    TXA             ;RESTORE OLD DATA
.,FD81 91 C1    STA ($C1),Y            STA (TMP0)Y
.,FD83 C8       INY                    INY
.,FD84 D0 E8    BNE $FD6E              BNE RAMTZ2
.,FD86 F0 E4    BEQ $FD6C              BEQ RAMTZ1
                                ;
.,FD88 98       TYA             SIZE   TYA             ;SET TOP OF MEMORY
.,FD89 AA       TAX                    TAX
.,FD8A A4 C2    LDY $C2                LDY TMP0+1
.,FD8C 18       CLC                    CLC
.,FD8D 20 2D FE JSR $FE2D              JSR SETTOP
.,FD90 A9 08    LDA #$08               LDA #$08        ;SET BOTTOM OF MEMORY
.,FD92 8D 82 02 STA $0282              STA MEMSTR+1    ;ALWAYS AT $0800
.,FD95 A9 04    LDA #$04               LDA #$04        ;SCREEN ALWAYS AT $400
.,FD97 8D 88 02 STA $0288              STA HIBASE      ;SET BASE OF SCREEN
.,FD9A 60       RTS                    RTS
```

## Key Registers
- $B2-$B3 - RAM - TAPE buffer pointer (TAPE1 / TBUFFR) low/high
- $C1-$C2 - RAM - TMP0 pointer used by memory probe (indirect LDA/STA (TMP0),Y)
- $0282 - RAM - MEMSTR+1 (high byte written #$08 to set MEMBOT to $0800)
- $0288 - RAM - HIBASE (screen base high byte written #$04 to set screen at $0400)
- $FD50-$FD9A - ROM - KERNAL routine range for RAMTAS / SETTOP call site

## References
- "system_start_reset_sequence" — expands on RAMTAS being called during startup to size and initialize RAM
- "memtop_gettop_settop_and_membot" — expands on SETTOP/GETTOP helpers and MEMBOT usage
- "cassette_irq_indirect_table" — expands on tape buffer pointers allocated here (TAPE1/TBUFFR) and cassette IRQ handling table

## Labels
- RAMTAS
- TMP0
- TAPE1
- TBUFFR
- MEMSTR
- HIBASE
