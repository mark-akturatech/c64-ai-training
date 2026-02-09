# BASIC RAM vector area (BASIC autostart vectors)

**Summary:** Describes the BASIC RAM vector area at $0300-$0332 and how turbo tape loaders modify these RAM-based vectors (via the indirect vector table) to autostart a CBM file after loading.

## Description
Several important BASIC routines are vectored through RAM; the pointers for these routines live in the BASIC RAM vector area. Vectors to all of these routines can be found in the indirect vector table. Turbo loaders change those vectors in RAM so that, when a CBM file finishes loading, execution branches into the loader code instead of the original BASIC routines — this technique is called "AUTOSTART".

The example byte dump below shows the BASIC RAM vector area beginning at $0300 (truncated in the source).

## Source Code
```text
; *****************************
; * BASIC RAM vector area (3) *
; *****************************
0300  8B 03 01 E3
0302  A7 02
...
0332  ED F5

; (3) Several important BASIC routines are vectored through RAM. Vectors
;     to all of these routines can be found in the indirect vector table.
;     The turbo loader changes those vectors to execute itself when the
;     CBM file is fully loaded (this is called "AUTOSTART").
```

## Key Registers
- $0300-$0332 - RAM - BASIC indirect vector table (BASIC routine vectors; targets for autostart patching)

## References
- "nonirq_cbm_header_block_listing" — expands on Copying vectors to RAM to prevent re-execution after load