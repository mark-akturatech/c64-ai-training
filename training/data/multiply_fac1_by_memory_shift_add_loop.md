# FAC1 * (memory at AY) multiply — C64 Kernal ROM ($BA28–$BA8B)

**Summary:** Multiply FAC1 by a numeric operand stored at (AY): unpack operand into FAC2 ($6A–$6D), test for zero, normalise exponents (JSR $BAB7), form a 4-byte temporary mantissa ($26–$29 plus rounding byte $70) then perform a bit-loop that conditionally adds FAC2 into the temporary mantissa and shifts (uses LSR/ADC/STA/ROR). Final step copies temp back to FAC1 and returns. Key addresses in this routine: $BA28–$BA8B, FAC1 bytes $62–$65 and rounding $70, FAC2 bytes $6A–$6D, temporary $26–$29.

## Operation
This routine implements FAC1 * operand(at AY) using FAC2 as the unpacked operand and a 4-byte temporary mantissa plus rounding byte. High-level flow:

- JSR $BA8C — unpack memory operand (AY) into FAC2 ($6A–$6D). If the unpacked operand is zero, return immediately (JMP $BA8B / RTS).
- JSR $BAB7 — test and adjust accumulators/exponents (normalise/check overflow/underflow) before multiply.
- Clear the 4-byte temporary mantissa at zero page $26–$29 and prepare the rounding byte at $70.
- Process FAC1 bytes in order: rounding byte $70, mantissa bytes $65, $64, $63, $62. Each byte is processed by the common bit-loop starting at $BA59/$BA5E.
  - At $BA59: if the loaded FAC1 byte = 0, control jumps to $B983 (path that shifts the temporary mantissa left A+8 times — separate routine). If non-zero, execution continues into the shift-and-add inner loop.
  - Inner loop ($BA5E onward):
    - LSR A — shift the loaded FAC1 byte right; carry receives the bit shifted out.
    - ORA #$80 then TAY — set bit7 to mark an 8-iteration counter and copy the marker into Y.
    - BCC skips the add if the shifted-out bit was 0 (carry clear). If carry set:
      - Clear carry (CLC), then ADC chain adds FAC2 bytes ($6D,$6C,$6B,$6A) to the temp mantissa bytes ($29,$28,$27,$26) in little-endian order, storing results back into the temp bytes.
    - After the conditional add, ROR $26,$27,$28,$29,$70 — rotate-right the 4-byte temp mantissa and rounding byte, propagating the carry through the temp across the bytes.
    - TYA / LSR A / BNE loop — restore the marker byte, shift it, and loop until all 8 bits of the original loaded byte have been processed.
- After all FAC1 bytes are processed, JMP $BB8F — copy the temporary mantissa back to FAC1, normalise and return to caller.

This routine therefore implements a classic shift-and-add long-multiplication: for each bit of FAC1 (including rounding byte), if the bit is set add FAC2 (aligned by previous shifts) into the temporary 4-byte accumulator, then shift the accumulator to prepare for the next bit. Use of the rounding byte implements proper rounding/bit-position handling.

## Source Code
```asm
.,BA28 20 8C BA JSR $BA8C       unpack memory (AY) into FAC2
.,BA2B D0 03    BNE $BA30       multiply FAC1 by FAC2 ??
.,BA2D 4C 8B BA JMP $BA8B       exit if zero
.,BA30 20 B7 BA JSR $BAB7       test and adjust accumulators
.,BA33 A9 00    LDA #$00        clear A
.,BA35 85 26    STA $26         clear temp mantissa 1
.,BA37 85 27    STA $27         clear temp mantissa 2
.,BA39 85 28    STA $28         clear temp mantissa 3
.,BA3B 85 29    STA $29         clear temp mantissa 4
.,BA3D A5 70    LDA $70         get FAC1 rounding byte
.,BA3F 20 59 BA JSR $BA59       go do shift/add FAC2
.,BA42 A5 65    LDA $65         get FAC1 mantissa 4
.,BA44 20 59 BA JSR $BA59       go do shift/add FAC2
.,BA47 A5 64    LDA $64         get FAC1 mantissa 3
.,BA49 20 59 BA JSR $BA59       go do shift/add FAC2
.,BA4C A5 63    LDA $63         get FAC1 mantissa 2
.,BA4E 20 59 BA JSR $BA59       go do shift/add FAC2
.,BA51 A5 62    LDA $62         get FAC1 mantissa 1
.,BA53 20 5E BA JSR $BA5E       go do shift/add FAC2
.,BA56 4C 8F BB JMP $BB8F       copy temp to FAC1, normalise and return
.,BA59 D0 03    BNE $BA5E       branch if byte <> zero
.,BA5B 4C 83 B9 JMP $B983       shift FCAtemp << A+8 times
                                else do shift and add
.,BA5E 4A       LSR             shift byte
.,BA5F 09 80    ORA #$80        set top bit (mark for 8 times)
.,BA61 A8       TAY             copy result
.,BA62 90 19    BCC $BA7D       skip next if bit was zero
.,BA64 18       CLC             clear carry for add
.,BA65 A5 29    LDA $29         get temp mantissa 4
.,BA67 65 6D    ADC $6D         add FAC2 mantissa 4
.,BA69 85 29    STA $29         save temp mantissa 4
.,BA6B A5 28    LDA $28         get temp mantissa 3
.,BA6D 65 6C    ADC $6C         add FAC2 mantissa 3
.,BA6F 85 28    STA $28         save temp mantissa 3
.,BA71 A5 27    LDA $27         get temp mantissa 2
.,BA73 65 6B    ADC $6B         add FAC2 mantissa 2
.,BA75 85 27    STA $27         save temp mantissa 2
.,BA77 A5 26    LDA $26         get temp mantissa 1
.,BA79 65 6A    ADC $6A         add FAC2 mantissa 1
.,BA7B 85 26    STA $26         save temp mantissa 1
.,BA7D 66 26    ROR $26         shift temp mantissa 1
.,BA7F 66 27    ROR $27         shift temp mantissa 2
.,BA81 66 28    ROR $28         shift temp mantissa 3
.,BA83 66 29    ROR $29         shift temp mantissa 4
.,BA85 66 70    ROR $70         shift temp rounding byte
.,BA87 98       TYA             get byte back
.,BA88 4A       LSR             shift byte
.,BA89 D0 D6    BNE $BA61       loop if all bits not done
.,BA8B 60       RTS             
```

## References
- "unpack_memory_into_fac2" — expands on unpacking the memory operand into FAC2 before this multiply routine
- "test_and_adjust_accumulators" — expands on normalising exponents and checks before multiply

## Labels
- FAC1
- FAC2
