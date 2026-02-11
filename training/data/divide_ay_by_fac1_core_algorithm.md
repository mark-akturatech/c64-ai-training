# ROM $BB0F — Divide (AY) / FAC1 (compute quotient into FAC1 from FAC2)

**Summary:** ROM routine at $BB0F unpacks the numerator (AY) into FAC2, checks divide-by-zero, aligns and adjusts exponents, then performs long division of the 4-byte mantissas (FAC2 / FAC1) using compare/shift/subtract loops and accumulates quotient bits into a temporary mantissa; finalizes by creating a FAC1 rounding byte ($70) and jumping to the routine that copies the temp mantissa into FAC1 and normalises. Key zero-page variables used: $61 exponent, $62-$65 FAC1 mantissa, $6A-$6D FAC2 mantissa, temporary quotient bytes at $29+X.

## Overview
This routine implements the core long-division algorithm used by the C64 ROM floating-point routines when dividing the unpacked value in AY (numerator) by FAC1 (denominator). Steps:

- Unpack AY into FAC2 and test for zero (divide-by-zero handler).
- Round FAC1 (denominator) first (JSR $BC1B).
- Compute exponent difference by subtracting FAC1 exponent from zero (via SEC/SBC) and storing in $61; call the accumulator alignment routine (JSR $BAB7) to ensure proper scaling.
- Increment the result exponent ($61); on overflow (wrap to zero) branch to overflow handler.
- Initialize quotient accumulation: X = #$FC (index into temp area via STA $29,X), A = #$01 (quotient-bit accumulator).
- Enter the main compare/shift/subtract loop:
  - Compare FAC2 mantissa bytes to FAC1 mantissa bytes (bytewise equality checks). The compare path handles equal-prefix optimization.
  - Use PHP/PLP to save/restore flag state across ROL/branch/store sequences that shift the quotient accumulator and optionally store bytes into the temp mantissa area.
  - Shift FAC2 left (multiply by 2) using ASL/ROL across the 4 mantissa bytes.
  - If FAC2 >= FAC1 (carry set from the compare), subtract FAC1 from FAC2 across the 4 bytes with SBC chains, preserving compare status in Y/TAY/ TYA as temporary status markers.
  - Loop until all quotient bits have been produced (loop control uses sign/zero/carry flags to repeat).
- After the loop, shift A left 6 times (A << 6) to form the FAC1 rounding byte and save it to $70.
- PLP and JMP to the copy/temp->FAC1 + normalise routine.

The routine contains explicit branches to the divide-by-zero handler (when unpacked AY == 0) and to the overflow handler (when exponent increments produce zero).

## Algorithm details and flag usage
- Exponent arithmetic:
  - LDA #$00 / SEC / SBC $61 computes 0 - FAC1_exponent (two's complement), storing result back into $61. JSR $BAB7 (test_and_adjust_accumulators) aligns FAC1 and FAC2 based on this exponent difference.
  - INC $61 increments the provisional quotient exponent; BEQ to overflow handler if it wrapped to zero.
- Quotient accumulation:
  - The routine uses A as a 1-bit-per-iteration accumulator, initialized to #%00000001. Each iteration the code ROLs A (shifting accumulator left), and depending on carry/branches may INX and store the accumulator byte into the temporary mantissa area via STA $29,X (with X starting at $FC and incrementing).
  - Six ASL instructions at the end shift A left 6 times to convert the low-order accumulator bits into the FAC1 rounding byte (stored at $70).
- Mantissa compare / shift / subtract:
  - The code first does bytewise CPY/CPY compares of FAC2 vs FAC1 from mantissa byte 1..4 to detect equality or inequality early (optimization).
  - PHP/PLP are used to save and restore the status flags across operations that would clobber them (notably ROL shifts).
  - When compare indicates FAC2 >= FAC1, code branches to the subtract sequence which subtracts FAC1 from FAC2 across four bytes using SBC and stores results back into FAC2 bytes ($6A-$6D).
  - FAC2 is multiplied by 2 on each iteration with ASL $6D then ROL $6C/$6B/$6A to propagate carries across bytes.
- Control flow notes:
  - The loop mixes conditional branches based on carry and sign (BCC/BPL/BMI/BCS/BPL) to implement the division iteration and to select between shifting-only loops and compare/subtract loops.
  - Temporary storage of quotient bytes is written via STA $29,X while X is walked upwards from $FC (so the temp area is written downward in memory order when interpreted as X-offsets).

## Source Code
```asm
.,BB0F 20 8C BA JSR $BA8C       unpack memory (AY) into FAC2
.,BB12 F0 76    BEQ $BB8A       if zero go do /0 error
.,BB14 20 1B BC JSR $BC1B       round FAC1
.,BB17 A9 00    LDA #$00        clear A
.,BB19 38       SEC             set carry for subtract
.,BB1A E5 61    SBC $61         subtract FAC1 exponent (2s complement)
.,BB1C 85 61    STA $61         save FAC1 exponent
.,BB1E 20 B7 BA JSR $BAB7       test and adjust accumulators
.,BB21 E6 61    INC $61         increment FAC1 exponent
.,BB23 F0 BA    BEQ $BADF       if zero do overflow error
.,BB25 A2 FC    LDX #$FC        set index to FAC temp
.,BB27 A9 01    LDA #$01        set byte
.,BB29 A4 6A    LDY $6A         get FAC2 mantissa 1
.,BB2B C4 62    CPY $62         compare FAC1 mantissa 1
.,BB2D D0 10    BNE $BB3F       branch if <>
.,BB2F A4 6B    LDY $6B         get FAC2 mantissa 2
.,BB31 C4 63    CPY $63         compare FAC1 mantissa 2
.,BB33 D0 0A    BNE $BB3F       branch if <>
.,BB35 A4 6C    LDY $6C         get FAC2 mantissa 3
.,BB37 C4 64    CPY $64         compare FAC1 mantissa 3
.,BB39 D0 04    BNE $BB3F       branch if <>
.,BB3B A4 6D    LDY $6D         get FAC2 mantissa 4
.,BB3D C4 65    CPY $65         compare FAC1 mantissa 4
.,BB3F 08       PHP             save FAC2-FAC1 compare status
.,BB40 2A       ROL             shift byte
.,BB41 90 09    BCC $BB4C       skip next if no carry
.,BB43 E8       INX             increment index to FAC temp
.,BB44 95 29    STA $29,X       
.,BB46 F0 32    BEQ $BB7A       
.,BB48 10 34    BPL $BB7E       
.,BB4A A9 01    LDA #$01        
.,BB4C 28       PLP             restore FAC2-FAC1 compare status
.,BB4D B0 0E    BCS $BB5D       if FAC2 >= FAC1 then do subtract
                                FAC2 = FAC2*2
.,BB4F 06 6D    ASL $6D         shift FAC2 mantissa 4
.,BB51 26 6C    ROL $6C         shift FAC2 mantissa 3
.,BB53 26 6B    ROL $6B         shift FAC2 mantissa 2
.,BB55 26 6A    ROL $6A         shift FAC2 mantissa 1
.,BB57 B0 E6    BCS $BB3F       loop with no compare
.,BB59 30 CE    BMI $BB29       loop with compare
.,BB5B 10 E2    BPL $BB3F       loop with no compare, branch always
.,BB5D A8       TAY             save FAC2-FAC1 compare status
.,BB5E A5 6D    LDA $6D         get FAC2 mantissa 4
.,BB60 E5 65    SBC $65         subtract FAC1 mantissa 4
.,BB62 85 6D    STA $6D         save FAC2 mantissa 4
.,BB64 A5 6C    LDA $6C         get FAC2 mantissa 3
.,BB66 E5 64    SBC $64         subtract FAC1 mantissa 3
.,BB68 85 6C    STA $6C         save FAC2 mantissa 3
.,BB6A A5 6B    LDA $6B         get FAC2 mantissa 2
.,BB6C E5 63    SBC $63         subtract FAC1 mantissa 2
.,BB6E 85 6B    STA $6B         save FAC2 mantissa 2
.,BB70 A5 6A    LDA $6A         get FAC2 mantissa 1
.,BB72 E5 62    SBC $62         subtract FAC1 mantissa 1
.,BB74 85 6A    STA $6A         save FAC2 mantissa 1
.,BB76 98       TYA             restore FAC2-FAC1 compare status
.,BB77 4C 4F BB JMP $BB4F       
.,BB7A A9 40    LDA #$40        
.,BB7C D0 CE    BNE $BB4C       branch always
                                do A<<6, save as FAC1 rounding byte, normalise and return
.,BB7E 0A       ASL             
.,BB7F 0A       ASL             
.,BB80 0A       ASL             
.,BB81 0A       ASL             
.,BB82 0A       ASL             
.,BB83 0A       ASL             
.,BB84 85 70    STA $70         save FAC1 rounding byte
.,BB86 28       PLP             dump FAC2-FAC1 compare status
.,BB87 4C 8F BB JMP $BB8F       copy temp to FAC1, normalise and return
```

## Key Registers
- $0061 - ROM - FAC1 exponent (working exponent used/updated during division)
- $0062-$0065 - ROM - FAC1 mantissa bytes 1..4 (denominator mantissa)
- $006A-$006D - ROM - FAC2 mantissa bytes 1..4 (numerator mantissa, loaded from AY)
- $0029 - ROM - Temporary quotient storage base (uses STA $29,X with X starting at $FC)
- $0070 - ROM - FAC1 rounding byte (A << 6 saved here before final copy/normalise)

## References
- "unpack_memory_into_fac2" — expands on loading the numerator (AY) into FAC2 before division
- "test_and_adjust_accumulators" — expands on aligning exponents and detecting overflow/underflow during division preparation
- "divide_by_zero_and_copy_temp_to_fac1" — expands on divide-by-zero handling and final copy/normalise of the temporary quotient

## Labels
- FAC1
- FAC2
- FAC1_EXPONENT
- FAC1_ROUND
- TEMP_QUOT
