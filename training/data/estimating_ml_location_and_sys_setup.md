# Choosing a Safe Start Address for Machine Language: $0880 (2176)

**Summary:** Guidance for estimating BASIC program size and selecting a safe machine‑language start address ($0880 / 2176) so a BASIC SYS call (SYS 2176) will jump to the ML code without overwriting BASIC. Advises not to run the program yet.

## Guidance
- Estimate BASIC size: the author assumes the BASIC program will occupy less than 127 bytes.
- Base address used: 2049 (decimal) — the BASIC area start (decimal 2049, hex $0801).
- Calculation: 2049 + 127 = 2176 (decimal), which is hex $0880.
- Recommendation: place the machine-language program at $0880 (decimal 2176).
- Make the BASIC driver call use SYS 2176 by changing BASIC line 130 to:
  - SYS 2176
- Warning: Do not run the program yet — this is only a planning/change of the SYS target until the ML code is written and verified.

## References
- "placing_ml_behind_end_of_basic_and_basic_example" — expands on BASIC driver program that will call the ML routine
- "saving_basic_and_preparing_to_write_machine_code" — expands on saving BASIC before adding ML code
