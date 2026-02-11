# 6502: Multiply two bytes using square-table trick

**Summary:** 6502 assembly routine that multiplies two bytes using table lookups of squares: caller places one operand in A and the other in Y; routine uses (a+y)^2/4 - (y-a)^2/4 = a*y and returns the 16-bit product in A (high) and X (low). Uses zero-page pointer indirection (addr),Y and precomputed square tables.

## Description
This routine implements multiplication by using the algebraic identity:
(a+y)^2 - (y-a)^2 = 4*a*y
By storing precomputed values of square/4 in read-only tables and using indexed-indirect loads, the routine computes the product with two table lookups and two byte subtractions.

Calling convention
- Inputs: A = operand a, Y = operand y (index)
- Outputs: A = product high byte, X = product low byte

Operation summary
- STA PSLO/PSHI: set the zero-page pointer used to index the "(a+y)^2/4" table by A.
- EOR #$FF; STA PDLO/PDHI: store -A-1 into the other zero-page pointer used with the "(-a+y)^2/4" table (index by -A-1).
- LDA (PSLO),Y: load low byte of (a+y)^2/4 using indexed-indirect addressing.
- SEC; SBC (PDLO),Y: subtract low byte of (-a+y)^2/4 (with borrow), result low stored in X after TAX.
- LDA (PSHI),Y; SBC (PDHI),Y: subtract high bytes to produce final high byte of product in A.
- Final product = (A,X) => 16-bit a*y

Performance
- Worst-case roughly 38 cycles when a page-cross occurs on the (pointer),Y indexing (timing depends on page crosses and memory access).

Prerequisites
- Precomputed tables: square/4 lookup tables must exist for “(a+y)^2/4” and “(-a+y)^2/4” and zero-page pointer pairs PSLO/PSHI and PDLO/PDHI must be arranged as expected. See referenced topics for pointer setup and table layout.
- Uses (zp),Y addressing mode; Y is used as the index into the per-A table entries.

Caveat
- This chunk preserves the original pointer-store sequence as given by the source. For details on how PSLO/PSHI and PDLO/PDHI are initialized to point into the tables, consult "pointer_setup_for_square_tables".

## Source Code
```asm
        ; Caller: A = operand a, Y = operand y
        ; Leaves product in A (high) and X (low)

        STA PSLO     ; Index into sum table by A
        STA PSHI
        EOR #$FF
        STA PDLO     ; Index into diff table by -A-1
        STA PDHI
        LDA (PSLO),Y ; Get (a+y)^2/4 (lo byte)
        SEC
        SBC (PDLO),Y ; Subtract (-a+y)^2/4 (lo byte)
        TAX          ; Save it (low byte of product)
        LDA (PSHI),Y ; Get (a+y)^2/4 (hi byte)
        SBC (PDHI),Y ; Subtract (-a+y)^2/4 (hi byte)
        ; Result: A = high byte, X = low byte of a*y
```

## References
- "pointer_setup_for_square_tables" — expands on table pointer initialization
- "table_lookup_tradeoffs_for_speed" — expands on tradeoff explanation
