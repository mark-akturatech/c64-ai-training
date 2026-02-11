# FONE — five-byte floating point constant (value 1) at $B9BC

**Summary:** FONE is a five-byte floating-point constant stored at $B9BC (decimal 47548) in the ROM/BASIC image; it represents the numeric value 1 and is used by the floating-point routines and as the default STEP for FOR statements.

**Description**
FONE is a stored 5-byte floating-point representation of 1.0 used by the Commodore BASIC floating-point arithmetic routines and supplied as the default STEP value for FOR...NEXT loops. The label/address given in the source is $B9BC (decimal 47548) in the ROM image; the entry is intended as the multiplicative identity for FP routines and as a readily available constant for interpreter operations.

The five-byte sequence at $B9BC is:

- **$81**: Exponent byte
- **$00**: Mantissa byte 1
- **$00**: Mantissa byte 2
- **$00**: Mantissa byte 3
- **$00**: Mantissa byte 4

This sequence represents the floating-point value 1.0 in the Commodore 64's internal format.

In the ROM disassembly, FONE is defined as follows:


FONE is referenced in the ROM at address $A78B, where it is loaded into the Floating Point Accumulator (FAC) as the default STEP value for FOR...NEXT loops:


## Source Code

```assembly
.B9BC 81 00 00 00 00   ; FONE: Floating-point constant 1.0
```

```assembly
.A78B A9 BC       LDA #$BC   ; Load low byte of FONE address
.A78D A0 B9       LDY #$B9   ; Load high byte of FONE address
.A78F 20 A2 BB    JSR $BBA2  ; Call MOVFM to load FONE into FAC
```

```assembly
.B9BC 81 00 00 00 00   ; FONE: Floating-point constant 1.0
```

## Key Registers
- $B9BC - ROM/BASIC - five-byte floating-point constant FONE (value 1), used by floating-point routines and as default FOR STEP

## References
- "fout_constants_tables" — expands on other floating point constants (1/2, powers tables) used by FP routines
- "fmultiplication_internals" — expands on use as a multiplicative identity in arithmetic routines

## Labels
- FONE
