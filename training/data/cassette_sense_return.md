# Return cassette sense in Zb (C64 ROM)

**Summary:** Tests the 6510 CPU port $01 for the cassette switch mask $10 using BIT; sets the Z (and V/N) flags per BIT and clears Carry before returning. Uses LDA, BIT, BNE, CLC, RTS to provide cassette sense from $0001.

## Description
This small ROM routine tests the cassette sense bit on the 6510 I/O port ($0001). Operation:

- LDA #$10 — load A with mask $10 (bit 4), the cassette switch bit.
- BIT $01 — perform A & ($01); BIT sets:
  - Z = 1 if (A & $01) == 0, Z = 0 if non-zero (so Z clear indicates cassette sense HIGH).
  - V = bit 6 of memory $01.
  - N = bit 7 of memory $01.
- BNE $F836 — branch if Z = 0 (i.e., if the cassette bit tested HIGH).
- There is a second BIT $01 at $F834 executed only when the branch is not taken (see note below).
- CLC — clear carry before return.
- RTS — return to caller.

Effect on flags on return:
- Z reflects the result of the BIT test (Z clear when $01 & $10 != 0; Z set when $01 & $10 == 0).
- V and N reflect bits 6 and 7 of $01 (as set by the last BIT executed).
- Carry is explicitly cleared (CLC) unconditionally before returning.

Interpretation:
- Callers can use the Z flag to detect the cassette switch state (PLAY/RECORD sense via bit $10).
- Because the routine executes CLC unconditionally, Carry is always 0 on return (contrary to some descriptions that suggest Carry might encode sense).

**[Note: Source may contain an error — routine documentation claims it returns cassette sense in Carry as well, but the code always clears Carry (CLC) before RTS.]**

## Source Code
```asm
.,F82E A9 10    LDA #$10        set the mask for the cassette switch
.,F830 24 01    BIT $01         test the 6510 I/O port
.,F832 D0 02    BNE $F836       branch if cassette sense high
.,F834 24 01    BIT $01         test the 6510 I/O port
.,F836 18       CLC
.,F837 60       RTS
```

## Key Registers
- $0001 - 6510 I/O port - CPU port; bit $10 (mask $10) is used to read cassette switch sense (BIT tests A & $01 with mask $10)

## References
- "wait_for_play_prompt_and_display" — expands on detecting the PLAY switch state
- "wait_for_play_or_record_prompt" — expands on detecting PLAY/RECORD switch state for write operations

## Mnemonics
- BIT
