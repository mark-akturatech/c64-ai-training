# ca65: --warn-align-waste

**Summary:** The ca65 assembler option `--warn-align-waste` causes warnings when alignment requirements force the assembler to emit fill bytes; useful for detecting alignment-related code size increases and unexpected padding.

## Description
When `--warn-align-waste` is enabled, the assembler will generate a warning any time an alignment operation (for example to satisfy a `.align`, `.even`, or other alignment/section placement) results in the emission of one or more fill bytes to advance the location counter. The warning signals that alignment constraints produced padding bytes (wasted space), allowing the developer to review alignment choices or data layout.

This option only affects diagnostics (warnings); it does not change alignment behavior or emitted code. Control of alignment-related warnings may be expanded or suppressed via the related toggle documented under "large_alignment_warning_toggle".

## References
- "large_alignment_warning_toggle" — expands on suppressing or enabling alignment-related warnings
