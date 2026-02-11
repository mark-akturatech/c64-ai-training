# FAC pack/unpack helpers (FAC1/FAC2) — fully commented C64 ROM disassembly

**Summary:** Routines to unpack 5-byte FAC values from memory into FAC1 ($61-$66), pack FAC1 back into memory/variables/(XY) (addresses like $5C, $57 or variable pointers), copy FAC2<->FAC1, and low-level byte-store/rounding helpers; uses zero-page pointers ($22/$23), FAC1 bytes ($60-$66), FAC2 bytes ($68-$6E) and rounding byte $70. Contains assembly entry addresses ($BBA2-$BC1A) and JSR to rounding routine $BC1B.

## Overview and byte layout
These routines implement the FAC (floating accumulator) load/store and copy helpers used by the ROM numeric routines. FAC1 and FAC2 are stored in zero page as multi-byte fields:

- FAC1 uses zero page addresses $60-$66 (six bytes visible to these routines):
  - $61 — FAC1 exponent (stored as the first byte read when unpacking)
  - $62 — FAC1 mantissa byte 1 (contains the normal/hidden bit after unpack)
  - $63 — FAC1 mantissa byte 2
  - $64 — FAC1 mantissa byte 3
  - $65 — FAC1 mantissa byte 4
  - $66 — FAC1 sign (bit 7 contains sign)
- FAC2 uses $68-$6E with a compatible layout; FAC2 sign is read/written at $6E.
- $70 is used as FAC1 rounding/auxiliary byte and is cleared by many helpers.

Key behaviors:
- Unpack from memory pointer (indirect (AY) using zero page $22/$23) reads 5 bytes (exponent + 4 mantissa bytes with sign encoded in the second byte) and stores them into FAC1 fields. The second byte's sign bit is saved into $66 and the mantissa1 saved to $62 has the hidden/normal bit set (ORA #$80).
- Pack routines call the rounding subroutine ($BC1B) before writing FAC1 back to memory or variables.
- Packing to destination uses an (XY) indirect store via zero page pointer ($22/$23) with Y used as index to store the 5 bytes in the correct order.
- Copy FAC2->FAC1 copies the absolute value of FAC2 into FAC1 but preserves sign into FAC1 $66; copying uses indexed moves (LDA $68,X -> STA $60,X).
- Copy FAC1->FAC2 first rounds FAC1 then copies 6 bytes (including sign) from FAC1 to FAC2 (LDA $60,X -> STA $68,X with X starting at #$06).

Caveats / notable operations:
- When unpacking, after saving the second byte into $66 (sign), the code ORs the accumulator with #$80 before saving into $62; this sets the top bit of mantissa1 (the normal/hidden bit) in FAC1's internal format.
- When packing mantissa1 back to memory, the code combines sign and mantissa bits via LDA $66 / ORA #$7F / AND $62 to produce the stored second byte (this masks/merges sign and mantissa bits — see raw sequence in Source Code).
- All packing to memory uses the zero-page pointer pair $22/$23 as the (XY) destination.

## Routine summaries (entry points)
- $BBA2 — Unpack memory (AY) into FAC1: saves indirect pointer ($22/$23), reads 5 bytes via (ptr),Y starting at Y=#$04 down to #$00, stores mantissa4->$65 ... exponent->$61, sets normal bit in mantissa1 ($62) and saves sign into $66, clears rounding byte $70.
- $BBC7 / $BBCA — Pack FAC1 into memory: entry at $BBC7 sets pointer low to $5C (pack into $5C), $BBCA sets pointer low to $57 (pack into $57). Both eventually go to generic pack-into-(XY).
- $BBD0 — Pack FAC1 into variable pointer: loads pointer low/high from zero page $49/$4A then falls into generic pack-into-(XY).
- $BBD4 — Generic pack-into-(XY): JSR $BC1B (round FAC1), save pointer into $22/$23, then store FAC1 bytes to destination via STA ($22),Y with Y descending from #$04 to #$00; clears rounding byte $70 and RTS.
- $BBFC — Copy FAC2 -> FAC1: load FAC2 sign ($6E) into $66 (FAC1 sign), then copy 6 bytes from $68..$6D into $60..$65 (X=#$05 down to #$00), clear rounding byte $70, RTS.
- $BC0C — Pack (round) and copy FAC1 -> FAC2: JSR $BC1B to round FAC1, then copy 6 bytes from $60..$66 to $68..$6E (X=#$06 down to #$01?), clear rounding byte $70, RTS.

## Source Code
```asm
                                *** unpack memory (AY) into FAC1
.,BBA2 85 22    STA $22         save pointer low byte
.,BBA4 84 23    STY $23         save pointer high byte
.,BBA6 A0 04    LDY #$04        5 bytes to do
.,BBA8 B1 22    LDA ($22),Y     get fifth byte
.,BBAA 85 65    STA $65         save FAC1 mantissa 4
.,BBAC 88       DEY             decrement index
.,BBAD B1 22    LDA ($22),Y     get fourth byte
.,BBAF 85 64    STA $64         save FAC1 mantissa 3
.,BBB1 88       DEY             decrement index
.,BBB2 B1 22    LDA ($22),Y     get third byte
.,BBB4 85 63    STA $63         save FAC1 mantissa 2
.,BBB6 88       DEY             decrement index
.,BBB7 B1 22    LDA ($22),Y     get second byte
.,BBB9 85 66    STA $66         save FAC1 sign (b7)
.,BBBB 09 80    ORA #$80        set 1xxx xxxx (add normal bit)
.,BBBD 85 62    STA $62         save FAC1 mantissa 1
.,BBBF 88       DEY             decrement index
.,BBC0 B1 22    LDA ($22),Y     get first byte (exponent)
.,BBC2 85 61    STA $61         save FAC1 exponent
.,BBC4 84 70    STY $70         clear FAC1 rounding byte
.,BBC6 60       RTS             

                                *** pack FAC1 into $5C
.,BBC7 A2 5C    LDX #$5C        set pointer low byte
.:BBC9 2C       .BYTE $2C       makes next line BIT $57A2

                                *** pack FAC1 into $57
.,BBCA A2 57    LDX #$57        set pointer low byte
.,BBCC A0 00    LDY #$00        set pointer high byte
.,BBCE F0 04    BEQ $BBD4       pack FAC1 into (XY) and return, branch always

                                *** pack FAC1 into variable pointer
.,BBD0 A6 49    LDX $49         get destination pointer low byte
.,BBD2 A4 4A    LDY $4A         get destination pointer high byte

                                *** pack FAC1 into (XY)
.,BBD4 20 1B BC JSR $BC1B       round FAC1
.,BBD7 86 22    STX $22         save pointer low byte
.,BBD9 84 23    STY $23         save pointer high byte
.,BBDB A0 04    LDY #$04        set index
.,BBDD A5 65    LDA $65         get FAC1 mantissa 4
.,BBDF 91 22    STA ($22),Y     store in destination
.,BBE1 88       DEY             decrement index
.,BBE2 A5 64    LDA $64         get FAC1 mantissa 3
.,BBE4 91 22    STA ($22),Y     store in destination
.,BBE6 88       DEY             decrement index
.,BBE7 A5 63    LDA $63         get FAC1 mantissa 2
.,BBE9 91 22    STA ($22),Y     store in destination
.,BBEB 88       DEY             decrement index
.,BBEC A5 66    LDA $66         get FAC1 sign (b7)
.,BBEE 09 7F    ORA #$7F        set bits x111 1111
.,BBF0 25 62    AND $62         AND in FAC1 mantissa 1
.,BBF2 91 22    STA ($22),Y     store in destination
.,BBF4 88       DEY             decrement index
.,BBF5 A5 61    LDA $61         get FAC1 exponent
.,BBF7 91 22    STA ($22),Y     store in destination
.,BBF9 84 70    STY $70         clear FAC1 rounding byte
.,BBFB 60       RTS             

                                *** copy FAC2 to FAC1
.,BBFC A5 6E    LDA $6E         get FAC2 sign (b7)
                                save FAC1 sign and copy ABS(FAC2) to FAC1
.,BBFE 85 66    STA $66         save FAC1 sign (b7)
.,BC00 A2 05    LDX #$05        5 bytes to copy
.,BC02 B5 68    LDA $68,X       get byte from FAC2,X
.,BC04 95 60    STA $60,X       save byte at FAC1,X
.,BC06 CA       DEX             decrement count
.,BC07 D0 F9    BNE $BC02       loop if not all done
.,BC09 86 70    STX $70         clear FAC1 rounding byte
.,BC0B 60       RTS             

                                *** round and copy FAC1 to FAC2
.,BC0C 20 1B BC JSR $BC1B       round FAC1
                                copy FAC1 to FAC2
.,BC0F A2 06    LDX #$06        6 bytes to copy
.,BC11 B5 60    LDA $60,X       get byte from FAC1,X
.,BC13 95 68    STA $68,X       save byte at FAC2,X
.,BC15 CA       DEX             decrement count
.,BC16 D0 F9    BNE $BC11       loop if not all done
.,BC18 86 70    STX $70         clear FAC1 rounding byte
.,BC1A 60       RTS             
```

## Key Registers
- $60-$66 - FAC1 - FAC1 bytes (internal FAC representation; exponent $61, mantissa bytes $62-$65, sign $66)
- $68-$6E - FAC2 - FAC2 bytes (compatible layout; sign at $6E)
- $70 - FAC1 rounding/auxiliary byte (cleared by multiple helpers)
- $22-$23 - Zero page pointer (used as (XY) destination/source for indirect loads/stores in these helpers)
- $49-$4A - Variable pointer (used by pack-into-variable routine to supply pointer to destination)
- Entry point addresses (for reference, not registers): $BBA2, $BBC7, $BBCA, $BBD0, $BBD4, $BBFC, $BC0C, $BC1A

## References
- "multiply_divide_and_accumulator_algorithms" — expands on how these helpers are invoked to load/store FACs before numeric operations
- "fac_sign_abs_int_conversion_and_shifts" — expands on copy/round helpers used before integer conversions

## Labels
- FAC1
- FAC2
- FAC1_ROUND
