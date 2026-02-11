# --warnings-as-errors

**Summary:** ca65 command-line option --warnings-as-errors — elevate any assembler warnings to errors so that assembly fails if any warnings are produced.

## Description
When ca65 is invoked with the --warnings-as-errors option, any warning emitted by the assembler is treated as an error. If any warnings occur during assembly, an error will be generated and the assembly will fail (non-success exit).

## References
- "warning_level_option" — expands on fine-tuning warning behavior and consequences
