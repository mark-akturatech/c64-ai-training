# ca65 Users Guide: -v, --verbose option

**Summary:** The ca65 assembler option `-v` / `--verbose` increases assembler verbosity and can be repeated to request more verbose output; primarily intended for debugging. See "debug_mode_switch" for differences between verbosity and full debug mode.

## Description
Increase the assembler's verbosity level. Use the short form `-v` or the long form `--verbose`. The option may be given more than once to request progressively more verbose output. This is usually only required when diagnosing assembler behavior or for debugging purposes.

(See "debug_mode_switch" for the distinction between verbosity levels and full debug mode.)

## References
- "debug_mode_switch" — expands on verbosity vs. full debug mode