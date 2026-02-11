# ca65: --large-alignment option

**Summary:** Disable warnings about a large combined alignment in the ca65 assembler; related to the .ALIGN directive and alignment-related warnings.

## Description
The --large-alignment option tells ca65 to suppress warnings about a large combined alignment. See the discussion of the .ALIGN directive for further information on how alignments are calculated and when these warnings are emitted.

For other alignment-related warnings and finer-grained control, consult the related warn_align_waste_option documentation.

## References
- "warn_align_waste_option" — expands on other alignment-related warnings