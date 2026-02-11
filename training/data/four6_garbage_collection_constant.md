# Definition of FOUR6 ($53)

**Summary:** FOUR6 at address $53 (decimal 83) is a BASIC low-RAM constant used by the garbage-collection routines to indicate whether a three- or seven-byte string descriptor is being collected. Searchable terms: $53, FOUR6, garbage-collection, BASIC workspace, string descriptor.

## Description
FOUR6 is a single-byte constant stored in the BASIC low-RAM workspace at address $53 (hex) / 83 (decimal). The garbage-collection routines consult this constant to determine whether the current string descriptor being collected is a three-byte descriptor or a seven-byte descriptor.

Context: this constant lives in the low-RAM BASIC workspace (see BASIC numeric/work area overview for adjacent workspace layout and related constants).

## Key Registers
- $0053 - BASIC low-RAM - FOUR6 constant: indicates whether a three-byte or seven-byte string descriptor is being collected

## References
- "basic_numeric_work_area_overview" — overview of the low-RAM BASIC workspace and related constants

## Labels
- FOUR6
