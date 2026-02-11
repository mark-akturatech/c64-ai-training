# Commodore 64 ROM: RND() Implementation and Seed Handling (FAC1 / LCG / VIA)

**Summary:** RND() implementation in C64 ROM using FAC1, an LCG (multiplier + offset) stored in ROM ($E08D, $E092), three entry paths (n<0 copy FAC1 into seed, n>0 advance LCG, n=0 form value from CIA/VIA timers), VIA timer read path, normalization of FAC1, and final packing of FAC1 into the caller variable via (XY).

## RND() behavior and code flow
This ROM fragment implements the BASIC RND(n) semantics using FAC1 (floating accumulator 1) and a linear congruential generator (LCG) stored in ROM.

- Constants:
  - Multiplier (LCG) stored at ROM $E08D (value shown: 11879546).
  - Offset (LCG) stored at ROM $E092 (value shown: 3.927677739E-8).

- Entry:
  - JSR $BC2B obtains FAC1 sign into A: A=$FF if FAC1 was negative (n<0), A=$01 if positive (n>0). Control then branches on A.
  - If n<0 (BMI), the code copies a byte-swapped FAC1 into the RND seed area (writes FAC1 into memory pointed by $008B with packing routine).
  - If n>0 (BNE), the code advances the LCG (multiply FAC1 by multiplier, add offset).
  - If n==0, the code reads CIA/VIA timers to produce a pseudo-random number:
    - Calls device base address routine (JSR $FFF3), saves pointer in $22/$23.
    - Reads VIA1 Timer1 low/high and Timer2 low/high from I/O area via indirect (Y) addressing and stores them into FAC1 mantissa bytes, then sets exponent and exits to normalization/pack path.

- LCG path:
  - For n>0, the code prepares pointers to multiplier and offset constants, calls convert/multiply and add routines (JSR $BA28, JSR $B867).
  - After computing FAC1 = FAC1 * multiplier + offset, byte-swaps mantissa bytes (to match expected layout), clears sign, saves exponent to $70 (rounding byte), forces exponent to $80, then normalizes FAC1 (JSR $B8D7).

- Finalization:
  - The seed pointer is set to $008B (A=#\$8B, Y=#\$00).
  - FAC1 is packed into memory at (XY) by jumping to the pack routine (JMP $BBD4). This is used both for writing the seed (when n<0) and to return the computed RND value to the BASIC caller.

## Source Code
```asm
.:E08D 98 35 44 7A 00           11879546            multiplier
.:E092 68 28 B1 46 00           3.927677739E-8      offset

                                *** perform RND()
.,E097 20 2B BC JSR $BC2B       get FAC1 sign
                                return A = $FF -ve, A = $01 +ve
.,E09A 30 37    BMI $E0D3       if n<0 copy byte swapped FAC1 into RND() seed
.,E09C D0 20    BNE $E0BE       if n>0 get next number in RND() sequence
                                else n=0 so get the RND() number from VIA 1 timers
.,E09E 20 F3 FF JSR $FFF3       return base address of I/O devices
.,E0A1 86 22    STX $22         save pointer low byte
.,E0A3 84 23    STY $23         save pointer high byte
.,E0A5 A0 04    LDY #$04        set index to T1 low byte
.,E0A7 B1 22    LDA ($22),Y     get T1 low byte
.,E0A9 85 62    STA $62         save FAC1 mantissa 1
.,E0AB C8       INY             increment index
.,E0AC B1 22    LDA ($22),Y     get T1 high byte
.,E0AE 85 64    STA $64         save FAC1 mantissa 3
.,E0B0 A0 08    LDY #$08        set index to T2 low byte
.,E0B2 B1 22    LDA ($22),Y     get T2 low byte
.,E0B4 85 63    STA $63         save FAC1 mantissa 2
.,E0B6 C8       INY             increment index
.,E0B7 B1 22    LDA ($22),Y     get T2 high byte
.,E0B9 85 65    STA $65         save FAC1 mantissa 4
.,E0BB 4C E3 E0 JMP $E0E3       set exponent and exit
.,E0BE A9 8B    LDA #$8B        set seed pointer low address
.,E0C0 A0 00    LDY #$00        set seed pointer high address
.,E0C2 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,E0C5 A9 8D    LDA #$8D        set 11879546 pointer low byte
.,E0C7 A0 E0    LDY #$E0        set 11879546 pointer high byte
.,E0C9 20 28 BA JSR $BA28       do convert AY, FCA1*(AY)
.,E0CC A9 92    LDA #$92        set 3.927677739E-8 pointer low byte
.,E0CE A0 E0    LDY #$E0        set 3.927677739E-8 pointer high byte
.,E0D0 20 67 B8 JSR $B867       add (AY) to FAC1
.,E0D3 A6 65    LDX $65         get FAC1 mantissa 4
.,E0D5 A5 62    LDA $62         get FAC1 mantissa 1
.,E0D7 85 65    STA $65         save FAC1 mantissa 4
.,E0D9 86 62    STX $62         save FAC1 mantissa 1
.,E0DB A6 63    LDX $63         get FAC1 mantissa 2
.,E0DD A5 64    LDA $64         get FAC1 mantissa 3
.,E0DF 85 63    STA $63         save FAC1 mantissa 2
.,E0E1 86 64    STX $64         save FAC1 mantissa 3
.,E0E3 A9 00    LDA #$00        clear byte
.,E0E5 85 66    STA $66         clear FAC1 sign (always +ve)
.,E0E7 A5 61    LDA $61         get FAC1 exponent
.,E0E9 85 70    STA $70         save FAC1 rounding byte
.,E0EB A9 80    LDA #$80        set exponent = $80
.,E0ED 85 61    STA $61         save FAC1 exponent
.,E0EF 20 D7 B8 JSR $B8D7       normalise FAC1
.,E0F2 A2 8B    LDX #$8B        set seed pointer low address
.,E0F4 A0 00    LDY #$00        set seed pointer high address

                                *** pack FAC1 into (XY)
.,E0F6 4C D4 BB JMP $BBD4       pack FAC1 into (XY)
```

## Key Registers
- $E08D - ROM - LCG multiplier (stored constant, listed as 11879546)
- $E092 - ROM - LCG offset (stored constant, listed as 3.927677739E-8)
- $0061 - RAM - FAC1 exponent
- $0062-$0065 - RAM - FAC1 mantissa bytes 1-4
- $0066 - RAM - FAC1 sign (cleared; routine forces positive)
- $0070 - RAM - FAC1 rounding byte (temporary save of exponent)
- $008B - RAM - Seed pointer base (pack/unpack target for RND seed via (XY); high byte $00)

## References
- "fac_to_ascii_conversion_and_numeric_formatting" — expands on FAC1 output formatting and FAC->ASCII helpers

## Labels
- FAC1
