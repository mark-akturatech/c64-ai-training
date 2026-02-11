# SINGLE SECTOR 20 ERROR — Create single-sector DOS error 20

**Summary:** Procedure summary for producing a DOS "20" error on a single disk sector (single-sector), requires the preceding sector to be intact and takes track/sector as parameters; searchable tokens included: single-sector, DOS error 20, track/sector, LDA/STA, $D012, VIC-II.

## How to Create a 20 Error on a Single Sector
Purpose: produce a DOS error 20 that affects a single sector only.

Limitations:
- The preceding sector must be intact (unchanged). Creation method depends on a correct preceding sector state.

Parameters:
- Track number (which track contains the target sector)
- Sector number (the target sector to make return error 20)

Cross-reference:
- See the annotation for a single-sector 21 error (covers a similar single-sector manipulation and its annotation).

SINGLE SECTOR 20 ERROR

(Short, focused description retained exactly as in source: method requires track and sector parameters and the preceding sector intact; implementation examples are available in referenced BASIC and assembly listings.)

## References
- "basic_driver_listing_single_sector_20_error" — BASIC driver implementation for creating the 20 error  
- "asm_source_listing_single_sector_20_error" — Machine-code source listing that performs the sector rewrite  
- "source_annotation_single_sector_20_error" — Explanatory annotation describing limitations and method