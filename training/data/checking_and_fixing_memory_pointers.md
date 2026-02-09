# Fixing Pointers: inspect and edit SOV with the monitor .M

**Summary:** Use the machine monitor .M command to display pointer ranges (e.g., .M 002B 003A or .M 0028 0037) and verify the start-of-variables (SOV) pointer before running mixed ML/BASIC programs; incorrect pointer bytes can be edited in-place and committed by pressing RETURN.

## How to inspect and fix pointers
Use the built-in machine monitor .M command to dump the zero-page/system pointer area and check that pointer values (including the start-of-variables pointer) are valid for your platform:

- VIC/64/PLUS/4: display the pointer range with
  .M 002B 003A
- PET/CBM: display the pointer range with
  .M 0028 0037

If a pointer is incorrect, move the monitor cursor back to the byte(s), type the correct hex values to overwrite them, and press RETURN to commit the changes. Always confirm the SOV (start-of-variables) pointer is set to a sound value before running any combinations of machine-language and BASIC code, and especially after loading/saving or relocating code.

## Key Registers
- $002B-$003A - Zero page/system RAM - pointer and BASIC/KERNAL variable area (use .M 002B 003A on VIC/64/PLUS/4)
- $0028-$0037 - Zero page/system RAM - pointer and BASIC/KERNAL variable area (use .M 0028 0037 on PET/CBM)

## References
- "monitor_save_command_format_and_load_relocation" — expands on checking SOV after loads and saves