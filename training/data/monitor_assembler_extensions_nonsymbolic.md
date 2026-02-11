# Monitor assembler extensions (.A)

**Summary:** Many machine-language monitors provide an assemble command (commonly ".A") and can be extended with monitor extension programs (e.g. Supermon); built-in PET/CBM monitors lack .A unless extended. These assemblers are nonsymbolic — you must supply numeric addresses (for example CHROUT is $FFD2).

## Monitor assemble command (.A)
Most machine-language monitors include an assemble command (often entered as ".A") that lets you type mnemonic source directly into memory without hand-encoding opcodes. This saves the manual translation step and placing bytes into RAM by hand.

Notable points:
- PET/CBM built-in monitors do not include an .A assemble command by default; they can be extended by loading a monitor-extension program such as Supermon to add assembling capabilities.
- The Commodore PLUS/4 series ships with an extended monitor that includes an .A command built in.
- These tiny monitor assemblers are typically nonsymbolic: they do not support labels or symbol resolution. Any place the assembler expects an address you must type the absolute numeric address (hex or decimal depending on the monitor). For example, typing a subroutine address by name (CHROUT) will not work — you must use the numeric vector $FFD2.

## Key Registers
- $FFD2 - KERNAL - CHROUT (character output routine entry vector)

## References
- "print_project_building_H_program" — expands on assembling the tiny printing program using the monitor  
- "assembling_using_monitor_example" — expands on example .A command usage and behavior

## Labels
- CHROUT
