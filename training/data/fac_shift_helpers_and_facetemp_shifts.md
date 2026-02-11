# FAC shift helpers — shift FACtemp / FACX mantissas (ROM $B983-$B9BB)

**Summary:** Routines at $B983–$B9BB perform byte- and bit-level shifts of FACtemp / FACX mantissas for exponent alignment during floating-point arithmetic. Uses repeated 8-byte moves (byte-rotation loop) and per-bit ROR chains with rounding via a FAC1 rounding byte; instructions include LDX/LDY/STA/ASL/ROR/ADC/SBC.

## Description
This ROM fragment implements helpers used when aligning mantissas between FAC registers (FACX / FAC1 / FACtemp) before arithmetic (addition/subtraction). High-level behavior:

- Entry (B983): set X = $25 to address the FACtemp/FACX workspace via indexed zero-page addressing ($01,X .. $04,X).
- Perform an 8-bit (byte) rotation/move sequence copying FACX bytes up by one byte and injecting FAC1 overflow byte into FACX byte 1. The original FACX byte 4 is saved into zero-page $70 as a FAC1 rounding byte.
- Loop control computes repeated 8-bit shifts using ADC #$08 / SBC #$08 to determine whether to perform another 8-byte move (branch back to B985).
- Remaining bit shifts (0..7) are handled by:
  - Loading the saved FAC1 rounding byte (LDA $70) and testing carry to decide whether to apply rounding logic.
  - If rounding path taken: ASL on FACX byte1, with conditional INC to force setting bit7 as needed, then two RORs on byte1 to correct/introduce carry.
  - A per-bit ROR chain: ROR $02,X; ROR $03,X; ROR $04,X; then ROR on the rounding byte, effectively rotating right across the multi-byte mantissa.
  - Y (exponent-difference counter) is incremented each iteration; loop repeats until the adjustment count completes.
- Exit clears C (CLC) and returns (RTS).

Behavioral/coding notes:
- The routine uses zero-page temporaries $70 and $68 for rounding/overflow handling.
- Index X is fixed to $25 at entry to address mantissa bytes via $nn,X addressing modes.
- The routine is invoked as part of FAC alignment during floating-point add/sub routines (see cross-reference).

## Source Code
```asm
.,B983 A2 25    LDX #$25        set the offset to FACtemp
.,B985 B4 04    LDY $04,X       get FACX mantissa 4
.,B987 84 70    STY $70         save as FAC1 rounding byte
.,B989 B4 03    LDY $03,X       get FACX mantissa 3
.,B98B 94 04    STY $04,X       save FACX mantissa 4
.,B98D B4 02    LDY $02,X       get FACX mantissa 2
.,B98F 94 03    STY $03,X       save FACX mantissa 3
.,B991 B4 01    LDY $01,X       get FACX mantissa 1
.,B993 94 02    STY $02,X       save FACX mantissa 2
.,B995 A4 68    LDY $68         get FAC1 overflow byte
.,B997 94 01    STY $01,X       save FACX mantissa 1
                                shift FACX -A times right (> 8 shifts)
.,B999 69 08    ADC #$08        add 8 to shift count
.,B99B 30 E8    BMI $B985       go do 8 shift if still -ve
.,B99D F0 E6    BEQ $B985       go do 8 shift if zero
.,B99F E9 08    SBC #$08        else subtract 8 again
.,B9A1 A8       TAY             save count to Y
.,B9A2 A5 70    LDA $70         get FAC1 rounding byte
.,B9A4 B0 14    BCS $B9BA       
.,B9A6 16 01    ASL $01,X       shift FACX mantissa 1
.,B9A8 90 02    BCC $B9AC       branch if +ve
.,B9AA F6 01    INC $01,X       this sets b7 eventually
.,B9AC 76 01    ROR $01,X       shift FACX mantissa 1 (correct for ASL)
.,B9AE 76 01    ROR $01,X       shift FACX mantissa 1 (put carry in b7)
                                shift FACX Y times right
.,B9B0 76 02    ROR $02,X       shift FACX mantissa 2
.,B9B2 76 03    ROR $03,X       shift FACX mantissa 3
.,B9B4 76 04    ROR $04,X       shift FACX mantissa 4
.,B9B6 6A       ROR             shift FACX rounding byte
.,B9B7 C8       INY             increment exponent diff
.,B9B8 D0 EC    BNE $B9A6       branch if range adjust not complete
.,B9BA 18       CLC             just clear it
.,B9BB 60       RTS             
```

## Key Registers
- $B983-$B9BB - ROM - FAC shift helper routines (entry point $B983)
- $0001-$0004 - Zero page - FACX/FACtemp mantissa bytes accessed via indexed addressing ($01,X..$04,X)
- $0068 - Zero page - FAC1 overflow/auxiliary byte (loaded at $B995)
- $0070 - Zero page - FAC1 rounding byte temporary storage (saved at $B987)

## References
- "fac_rounding_and_arithmetic_entry_points" — covers calls to shift FAC2 or FAC1 mantissas during addition/subtraction