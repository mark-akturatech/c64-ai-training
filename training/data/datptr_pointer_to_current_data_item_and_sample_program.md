# DATPTR ($41-$42) — Pointer to Address of Current DATA Item

**Summary:** DATPTR at $0041-$0042 is the two-byte pointer (address within the BASIC program text) that indicates where the next DATA item will be READ from; RESTORE resets it to the BASIC program start pointer at $002B. Demonstrates using PEEK/POKE to save and restore DATPTR so DATA statements can be read in an arbitrary order.

## Description
DATPTR ($41-$42 decimal, $0041-$0042 hex) contains the address (not the line number) inside the BASIC program text where the current DATA item is being read. A RESTORE resets DATPTR to the BASIC program start pointer stored at location 43 (decimal) / $2B (hex).

The included BASIC example shows the technique: the program saves the two bytes of a statement address (via PEEK) into variables, then POKEs those saved bytes into DATPTR before a READ to cause BASIC to pull DATA from a different DATA statement (i.e., reorder DATA reads). The sample uses decimal addresses in PEEK/POKE (BASIC's PEEK/POKE arguments are decimal by convention in listings).

This allows reading DATA statements in arbitrary order by manipulating DATPTR directly; RESTORE returns the pointer to the program start pointer at $002B.

## Source Code
```basic
10 A1=PEEK(61):A2=PEEK(62)
20 DATA THIS DATA WILL BE USED SECOND
30 B1=PEEK(61):B2=PEEK(62)
40 DATA THIS DATA WILL BE USED FIRST
50 C1=PEEK(61):C2=PEEK(62)
60 DATA THIS DATA WILL BE USED THIRD
70 POKE 65,B1:POKE 66,B2:READ A$:PRINT A$
80 POKE 65,A1:POKE 66,A2:READ A$:PRINT A$
90 POKE 65,C1:POKE 66,C2:READ A$:PRINT A$
```

## Key Registers
- $0041-$0042 - BASIC - DATPTR: pointer to the address within the BASIC program text where DATA is currently being READ.
- $002B - BASIC - BASIC program start pointer (RESTORE sets DATPTR to this address).

## References
- "datlin_current_data_line_number" — expands on DATLIN; provides the DATA line number used in error reporting when DATPTR points to DATA content
- "inpptr_input_source_pointer_for_get_read_input" — expands on INPPTR; similar pointer indicating the source of input (DATA statements or input buffer)

## Labels
- DATPTR
