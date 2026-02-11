# KERNAL: Directory/name comparison and filename validation (F92C-F9D2)

**Summary:** Routine in the Commodore 64 KERNAL that walks directory/name buffers, compares and validates file-name characters (uses ADC offsets #$30/#$26/#$2C for different character classes), updates zero-page counters ($B0,$B1,$B4,$B6 etc), manipulates timer/IOC CIA1 registers ($DC06/$DC07/$DC0D/$DC0F), and transfers to central exit handler $FEBC or directory handlers at $FA10/$FA60.

## Function overview
This code fragment performs a multi-step filename/directory comparison and validation pass used by the KERNAL filesystem routines:

- Initial setup: reads CIA1 timer bytes and prepares X/Y registers (LDX $DC07 ; LDY #$FF), then performs arithmetic/comparison involving $DC06/$DC07 in a tight loop to produce a value stored into zero page $B1 and other temporaries.
- It stores computed values to system work locations ($B1,$DC06,$DC07,$02A3) and sets up a flag/control byte at $DC0F (LDA #$19 ; STA $DC0F).
- The routine adjusts and compares zero-page counters ($B0,$B1,$B4, $B6 implied by comments) using ADC/SBC and conditional branches to decide whether the current filename candidate fits expected limits (CMP/BCS/BCC).
- Character-class handling: the code adds small immediate offsets to an accumulator (ADC #$30, ADC #$26, ADC #$2C) and compares against $B1 to branch into different handlers — these ADC constants implement mapping/offset adjustments for different character classes used when validating filename characters.
- Bit/shift manipulation: $B1 is shifted/rotated (LSR / ROR repeated) indicating bit-field extraction or multi-byte adjustment.
- Control flags: toggles and stores a byte at $A4 via EOR #$01 and propagates it to $02A4; increments/decrements $A9 based on branching and uses $92 as temporary storage.
- Branch targets: on several conditions the code jumps to directory operation handlers:
  - JMP $FA60 or JMP $FA10 when particular comparisons fail/dispatch is required.
  - When final checks fail or finish, the routine jumps to the centralized exit/cleanup handler at $FEBC (JMP $FEBC).
- Subroutine call: JSR $F8E2 is invoked with X set to #$A6; return value checked via $9B to decide continuation.

## Control flow and notable branches
- $F92C-$F95E: loop that samples CIA1 timer/IO bytes, computes a two-byte style adjustment, and stores results into $B1 and CIA registers.
- $F959-$F960: compares adjusted $B0 + #$3C with $B1; BCS -> $F9AC (early exit/branch).
- $F962-$F96B: conditional dispatch by checking $9C and branching to $FA60 when non-zero.
- $F96D-$F986: character class arithmetic: apply #$30/#$26/#$2C and compare to $B1, with INX increments between classes; failure paths lead to $FA10 handler or continue.
- $F98B-$F9A8: handle $B4 zero/non-zero, store flags to $A8/$A4, modify $A9 based on carry, update $92 and toggle $A4, then branch depending on $A4.
- $F9AC-$F9CE: further checks on $B4 and flags stored in zero page and $02A3/$02A4, possibly clearing $A4 and storing to $02A4; then a JSR to $F8E2 and a conditional loop back to $F988 or continue.
- $F9D2: final unconditional jump to the common exit handler $FEBC.

## Zero-page and variables used (observed)
- $B0, $B1, $B4, $B6 (mentioned in user summary) — used for length/position counters and comparisons.
- $A3, $A4, $A8, $A9 — temporary flags and counters; $A4 toggled with EOR #$01 and mirrored to $02A4.
- $92, $9B, $9C — temporary storage/flags and condition checks.
- $D7 — X stored here at $F9AA.

(These names are the zero-page addresses as used by the KERNAL; the listing itself does not supply symbolic names.)

## Source Code
```asm
.,F92C AE 07 DC LDX $DC07
.,F92F A0 FF    LDY #$FF
.,F931 98       TYA
.,F932 ED 06 DC SBC $DC06
.,F935 EC 07 DC CPX $DC07
.,F938 D0 F2    BNE $F92C
.,F93A 86 B1    STX $B1
.,F93C AA       TAX
.,F93D 8C 06 DC STY $DC06
.,F940 8C 07 DC STY $DC07
.,F943 A9 19    LDA #$19
.,F945 8D 0F DC STA $DC0F
.,F948 AD 0D DC LDA $DC0D
.,F94B 8D A3 02 STA $02A3
.,F94E 98       TYA
.,F94F E5 B1    SBC $B1
.,F951 86 B1    STX $B1
.,F953 4A       LSR
.,F954 66 B1    ROR $B1
.,F956 4A       LSR
.,F957 66 B1    ROR $B1
.,F959 A5 B0    LDA $B0
.,F95B 18       CLC
.,F95C 69 3C    ADC #$3C
.,F95E C5 B1    CMP $B1
.,F960 B0 4A    BCS $F9AC
.,F962 A6 9C    LDX $9C
.,F964 F0 03    BEQ $F969
.,F966 4C 60 FA JMP $FA60
.,F969 A6 A3    LDX $A3
.,F96B 30 1B    BMI $F988
.,F96D A2 00    LDX #$00
.,F96F 69 30    ADC #$30
.,F971 65 B0    ADC $B0
.,F973 C5 B1    CMP $B1
.,F975 B0 1C    BCS $F993
.,F977 E8       INX
.,F978 69 26    ADC #$26
.,F97A 65 B0    ADC $B0
.,F97C C5 B1    CMP $B1
.,F97E B0 17    BCS $F997
.,F980 69 2C    ADC #$2C
.,F982 65 B0    ADC $B0
.,F984 C5 B1    CMP $B1
.,F986 90 03    BCC $F98B
.,F988 4C 10 FA JMP $FA10
.,F98B A5 B4    LDA $B4
.,F98D F0 1D    BEQ $F9AC
.,F98F 85 A8    STA $A8
.,F991 D0 19    BNE $F9AC
.,F993 E6 A9    INC $A9
.,F995 B0 02    BCS $F999
.,F997 C6 A9    DEC $A9
.,F999 38       SEC
.,F99A E9 13    SBC #$13
.,F99C E5 B1    SBC $B1
.,F99E 65 92    ADC $92
.,F9A0 85 92    STA $92
.,F9A2 A5 A4    LDA $A4
.,F9A4 49 01    EOR #$01
.,F9A6 85 A4    STA $A4
.,F9A8 F0 2B    BEQ $F9D5
.,F9AA 86 D7    STX $D7
.,F9AC A5 B4    LDA $B4
.,F9AE F0 22    BEQ $F9D2
.,F9B0 AD A3 02 LDA $02A3
.,F9B3 29 01    AND #$01
.,F9B5 D0 05    BNE $F9BC
.,F9B7 AD A4 02 LDA $02A4
.,F9BA D0 16    BNE $F9D2
.,F9BC A9 00    LDA #$00
.,F9BE 85 A4    STA $A4
.,F9C0 8D A4 02 STA $02A4
.,F9C3 A5 A3    LDA $A3
.,F9C5 10 30    BPL $F9F7
.,F9C7 30 BF    BMI $F988
.,F9C9 A2 A6    LDX #$A6
.,F9CB 20 E2 F8 JSR $F8E2
.,F9CE A5 9B    LDA $9B
.,F9D0 D0 B9    BNE $F98B
.,F9D2 4C BC FE JMP $FEBC
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Timer B and control/interrupt registers used by this routine ($DC06,$DC07,$DC0D,$DC0F are read/written).

## References
- "compute_tape_or_disk_offsets_and_dispatch" — expands on parsing and offset computations that often follow these offset computations
- "handle_duplicate_filename_and_attributes" — expands on further name-handling and collision resolution logic