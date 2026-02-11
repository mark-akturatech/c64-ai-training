# KERNAL: Duplicate-name detection and attribute adjustment routine ($F9D5-$FA5D)

**Summary:** Disassembly of a Commodore 64 KERNAL routine (addresses $F9D5–$FA5D) that implements duplicate-name detection, file-attribute bit toggling, counter adjustments ($A3,$A8,$A9 shown), temporary/status byte updates ($92,$96,$9B,$B4,$B5,$B6,$9C,...), name checksum accumulation, and final exit via JMP $FEBC or continued iteration via JSR $F8E2.

## Behavior and control flow
- Entry tests and status clearing:
  - The routine begins with a test of $92 (temporary/status flag). If $92 is zero it clears it and continues; negative flag paths adjust a temporary counter $B0 (DEC/INC $B0) to reflect sign conditions.
- Comparison/loop control:
  - Compares X with $D7 and branches; several branches lead to iterative processing or an immediate jump to KERNAL exit at $FEBC.
- Duplicate-name checksum/update:
  - The checksum accumulator in zero page $9B is updated by loading X into A (TXA), EOR with $9B, and storing back to $9B (TXA; EOR $9B; STA $9B). This is the per-byte/name checksum mechanism used during name validation.
- Attribute and counter updates:
  - The code decrements $A3 (DEC $A3) as part of a counter loop. It later reads/combines $A8 and $A9 (LDA $A8; ORA $A9; STA $B6) to produce an attribute/status mask in $B6.
  - Several zero-page temporaries are used: $B0, $B1, $B4, $B5, $BF, $BD, $B1, $B4, $B5 and $9C — $9C gets incremented (INC $9C) as a record or byte counter.
- Index/address arithmetic before subroutine call:
  - A short sequence computes an index using $B1 and $B0 with borrow/carry handling: SEC; SBC $B1; ADC $B0; ASL; TAX. The result in X is used by JSR $F8E2 to perform a lookup/operation (JSR $F8E2 is called twice in this routine).
- Peripheral write side-effects:
  - The routine writes $81 to $DC0D and later writes $01 to $DC0D (STA $DC0D). $DC0D is CIA1's Interrupt Control Register — these writes likely toggle or acknowledge CIA interrupts or control bits during directory/name processing.
- Exit/continuation:
  - Successful completion and finalization path ends with JMP $FEBC. Other paths loop/continue into additional validation or resolution via JSR $F8E2 and branches back into the routine.

## Source Code
```asm
.,F9D5 A5 92    LDA $92
.,F9D7 F0 07    BEQ $F9E0
.,F9D9 30 03    BMI $F9DE
.,F9DB C6 B0    DEC $B0
.:F9DD 2C       .BYTE $2C
.,F9DE E6 B0    INC $B0
.,F9E0 A9 00    LDA #$00
.,F9E2 85 92    STA $92
.,F9E4 E4 D7    CPX $D7
.,F9E6 D0 0F    BNE $F9F7
.,F9E8 8A       TXA
.,F9E9 D0 A0    BNE $F98B
.,F9EB A5 A9    LDA $A9
.,F9ED 30 BD    BMI $F9AC
.,F9EF C9 10    CMP #$10
.,F9F1 90 B9    BCC $F9AC
.,F9F3 85 96    STA $96
.,F9F5 B0 B5    BCS $F9AC
.,F9F7 8A       TXA
.,F9F8 45 9B    EOR $9B
.,F9FA 85 9B    STA $9B
.,F9FC A5 B4    LDA $B4
.,F9FE F0 D2    BEQ $F9D2
.,FA00 C6 A3    DEC $A3
.,FA02 30 C5    BMI $F9C9
.,FA04 46 D7    LSR $D7
.,FA06 66 BF    ROR $BF
.,FA08 A2 DA    LDX #$DA
.,FA0A 20 E2 F8 JSR $F8E2
.,FA0D 4C BC FE JMP $FEBC
.,FA10 A5 96    LDA $96
.,FA12 F0 04    BEQ $FA18
.,FA14 A5 B4    LDA $B4
.,FA16 F0 07    BEQ $FA1F
.,FA18 A5 A3    LDA $A3
.,FA1A 30 03    BMI $FA1F
.,FA1C 4C 97 F9 JMP $F997
.,FA1F 46 B1    LSR $B1
.,FA21 A9 93    LDA #$93
.,FA23 38       SEC
.,FA24 E5 B1    SBC $B1
.,FA26 65 B0    ADC $B0
.,FA28 0A       ASL
.,FA29 AA       TAX
.,FA2A 20 E2 F8 JSR $F8E2
.,FA2D E6 9C    INC $9C
.,FA2F A5 B4    LDA $B4
.,FA31 D0 11    BNE $FA44
.,FA33 A5 96    LDA $96
.,FA35 F0 26    BEQ $FA5D
.,FA37 85 A8    STA $A8
.,FA39 A9 00    LDA #$00
.,FA3B 85 96    STA $96
.,FA3D A9 81    LDA #$81
.,FA3F 8D 0D DC STA $DC0D
.,FA42 85 B4    STA $B4
.,FA44 A5 96    LDA $96
.,FA46 85 B5    STA $B5
.,FA48 F0 09    BEQ $FA53
.,FA4A A9 00    LDA #$00
.,FA4C 85 B4    STA $B4
.,FA4E A9 01    LDA #$01
.,FA50 8D 0D DC STA $DC0D
.,FA53 A5 BF    LDA $BF
.,FA55 85 BD    STA $BD
.,FA57 A5 A8    LDA $A8
.,FA59 05 A9    ORA $A9
.,FA5B 85 B6    STA $B6
.,FA5D 4C BC FE JMP $FEBC
```

## Key Registers
- $DC0D - CIA1 - Interrupt Control Register (ICR). Written with $81 and later $01 in this routine.

## References
- "parse_and_validate_filename_entries" — expands on continuation and refinement of name validation
- "copy_name_to_directory_and_write_to_buffer" — expands on on success, name data is copied into directory buffers