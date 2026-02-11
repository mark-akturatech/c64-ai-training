# Extract 16-bit V% via (zp),Y and multiply by 4 (ASL/ROL)

**Summary:** Assembles at $0880 a short machine-language snippet that uses indirect Y addressing (LDA ($2D),Y) to extract the two bytes of a 16-bit integer variable V% and store them into workspace addresses $033C-$033F; then multiplies the 16-bit value by four using two ASL/ROL pairs on the low/high bytes.

## Description
This chunk shows a minimal routine assembled at $0880 that:

- Uses LDA ($2D),Y to read from the 16-bit variable V% via the zero-page pointer at $2D (indirect,Y).
- With Y = #$02 the first LDA fetches the high byte; with Y = #$03 the second LDA fetches the low byte (per the source example).
- Each fetched byte is stored twice: high byte to $033C and $033E, low byte to $033D and $033F (the duplicate copies are available for later use, e.g., adding the original back to compute times-five as hinted in references).
- Multiplies the 16-bit little-endian value in $033D/$033C by four using two successive shift-and-rotate sequences: ASL the low byte then ROL the high byte, repeated twice. This shifts the 16-bit word left by 2 bits (x4). The code does not perform overflow checks — the source notes this caveat.

The source suggests the extraction/storing sequence could be made more compact by more effective use of indexing (not shown here).

## Source Code
```asm
        .A 0880  LDY #$02
        .A 0882  LDA ($2D),Y
        .A 0884  STA $033C
        .A 0887  STA $033E
        .A 088A  LDY #$03
        .A 088C  LDA ($2D),Y
        .A 088E  STA $033D
        .A 0891  STA $033F

        .A 0894  ASL $033D
        .A 0897  ROL $033C
        .A 089A  ASL $033D
        .A 089D  ROL $033C
```

## References
- "adding_x4_to_original_to_get_x5" — expands on adding the original copies to produce times-five
- "placing_ml_behind_end_of_basic_and_basic_example" — expands on the BASIC program that calls this ML routine
