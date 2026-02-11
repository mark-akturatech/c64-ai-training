# SVXT ($92)

**Summary:** SVXT is the KERNAL zero-page timing constant at $0092 (decimal 146), used by the tape read routines to compensate for slight tape speed variations. Search terms: $0092, $92, SVXT, tape timing, KERNAL zero page.

**Description**

SVXT is a single-byte adjustable timing constant stored in the KERNAL zero page at $0092. It is utilized by the KERNAL tape read logic to adjust timing for tape data sampling, allowing compensation for small speed differences between cassette tapes. SVXT is typically used together with the load/verify flag at $0093 in tape-related operations.

**Default Value and Range:** The default value of SVXT is not explicitly documented in the available sources. However, it is known that SVXT is a single-byte value, allowing for a range from 0 to 255. The specific default value set by the KERNAL upon initialization is not specified in the provided references.

**Units and Interpretation:** SVXT is treated as an unsigned byte. The exact units or interpretation (e.g., clock ticks, sample offset) are not detailed in the available sources. It functions as a timing constant for tape operations, but the precise measurement it represents is not specified.

**Usage in KERNAL Code:** The exact locations in the KERNAL code where SVXT is applied, including assembly offsets and routine names, are not specified in the available sources. Therefore, a detailed example of how to change it safely cannot be provided based on the current information.

**Interaction with $0093 (VERCK):** SVXT is typically used together with the load/verify flag at $0093 in tape-related operations. However, the specific details of their interaction and any required sequencing when modifying SVXT are not detailed in the available sources.

(Zero page = first 256 bytes of address space.)

## Key Registers

- $0092 - KERNAL zero page - SVXT: adjustable timing constant for tape reads (compensates tape speed variation)

## References

- "verck_load_verify_flag_0x93" — expands on LOAD/VERIFY behavior often used with tape timing
- "kernal_zero_page_overview_0x90_0xff" — overview of the KERNAL zero-page area containing SVXT

## Labels
- SVXT
