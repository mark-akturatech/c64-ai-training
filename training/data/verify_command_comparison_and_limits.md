# VERIFY command (BASIC)

**Summary:** The VERIFY command performs a byte-by-byte comparison between a program in memory and a file on disk, including BASIC line links; requires a device number (device#). Known limitation:VERIFY can fail when the program was saved/loaded on machines with different memory configurations (e.g., VIC‑20 5K vs 8K) because line links differ.

## Description
VERIFY compares the program currently in RAM to the program stored on the specified disk device, comparing every byte and including BASIC line link pointers. You must supply a device number; without device# the command is invalid.

Behavior notes:
- Comparison is exact: any difference in bytes (code, data, or line link pointers) causes VERIFY to report a mismatch.
- BASIC line links are included in the comparison; these pointers can differ between machines or memory configurations, so identical source listings can still fail VERIFY if memory layout changed between SAVE and LOAD.

Format:
VERIFY name$, device#

Example limitation (illustrative, from source):
- A program SAVEd from a 5K VIC‑20 and then LOADed on an 8K machine may not VERIFY correctly because the line links point to different memory locations.

## References
- "load_command_syntax_and_examples" — expands on VERIFY checks and differences arising from different LOAD behaviors