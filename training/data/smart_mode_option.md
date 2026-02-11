# ca65 -s, --smart-mode (.SMART)

**Summary:** In 65816 mode, -s / .SMART makes ca65 track REP/SEP usage and automatically update operand sizes (M/X flags); it warns when an operand cannot be evaluated (e.g., imported symbol). Smart mode cannot trace execution flow and may be incorrect; use .ixx and .axx to set sizes explicitly.

## Description
Smart mode (enabled with -s, --smart-mode or the .SMART pseudo instruction) causes the assembler, when assembling for the 65816 CPU, to monitor REP and SEP instructions and adjust operand sizes accordingly by updating the assumed M (accumulator) and X (index) flag widths. If the assembler cannot evaluate the operand of a REP/SEP instruction (for example because the operand is an imported symbol), it emits a warning.

Beware: the assembler does not perform control-flow analysis. Because it cannot trace execution flow, automatic tracking of REP/SEP may produce false results in some cases (e.g., conditionally executed REP/SEP, separate compilation where flag state crosses module boundaries). When exact control of accumulator/index sizes is required, use .ixx and .axx (set index/accumulator flag sizes) to explicitly declare the current M/X settings.

Smart mode is disabled by default.

## References
- "cpu_type_and_supported_cpus" — 65816 CPU support and related assembler options