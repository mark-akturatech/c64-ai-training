# Zero-page pointer setup for SSQ/DSQ square tables (indexed-indirect (ptr),Y)

**Summary:** Zero-page initialization routine that stores high bytes into four zero-page pointers (PSLO, PSHI, PDLO, PDHI) for two precomputed square tables (SSQ and DSQ). Tables must be page-aligned so subsequent indexed-indirect lookups using (PSLO),Y / (PDLO),Y work correctly.

**Initialization routine**
The provided setup stores the high-byte (page number) of each table address into the high byte slot of a zero-page pointer pair. It assumes the tables are page-aligned (low byte = $00) so lookups via indexed-indirect (ptr),Y do not need to update the low byte.

- Pointers are in zero page: PSLO/PSLO+1, PSHI/PSHI+1, PDLO/PDLO+1, PDHI/PDHI+1 (low/high bytes).
- The code stores only the high byte into each pointer's +1 field so the pointer can reference a page base; page alignment keeps the low byte constant.
- This preparation is required before using (PSLO),Y style table lookups by an accumulator/index consumer routine.

(Short parenthetical: page-aligned = table address low byte = $00, so high byte is the page.)

## Source Code
```asm
        LDA #SSQLO/256
        STA PSLO+1
        LDA #SSQHI/256
        STA PSHI+1
        LDA #DSQLO/256
        STA PDLO+1
        LDA #DSQHI/256
        STA PDHI+1
```

## References
- "table_lookup_multiply_routine" — expands on consuming these pointers to compute product using the precomputed tables

## Labels
- PSLO
- PSHI
- PDLO
- PDHI
