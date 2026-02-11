# C64 ROM: SHIFT+C= handling (toggle shift-mode lock at $0291)

**Summary:** 6502 routine in C64 ROM that tests and updates the shift-mode lock byte at zero page $0291 using ORA/AND/STA, compares against enable code #$09, sets an unlock value #$7F when appropriate, and returns via JMP $E6A8 (which restores registers and sets the quote flag).

## Description
This ROM fragment implements the SHIFT+C= control handling by inspecting and conditionally updating a software "shift-mode lock" byte stored at zero page address $0291.

Execution flow (addresses are ROM locations):
- ORA $0291 (EC64) — OR the accumulator with the current shift-mode byte.
- BMI $EC72 (EC67) — branch to the save/store sequence if the negative flag is set (comment in source says "branch always" — see note).
- CMP #$09 (EC69) — compare accumulator with enable code (#$09) used for the [SHIFT][C=] combination.
- BNE $EC5B (EC6B) — if not equal, exit to $EC5B (no change).
- LDA #$7F (EC6D) — load unlock value (#$7F) when the enable condition matched.
- AND $0291 (EC6F) — AND accumulator with the current shift-mode byte.
- STA $0291 (EC72) — store the resulting shift-mode byte back to $0291. Convention in this ROM: $00 = enabled, $80 = locked.
- JMP $E6A8 (EC75) — jump to ROM exit routine that restores registers and sets the quote flag (exit path).

Behavioral notes:
- The code relies on bitwise OR/AND operations with the zero-page byte to compute the new state and store it back to $0291.
- The compare with #$09 gates whether the unlock value (#$7F) is applied; otherwise flow returns without modifying $0291.
- Final jump to $E6A8 is the common restore/exit path (restores registers, sets quote flag).

**[Note: Source may contain an error — the inline comment "go save the value, branch always" next to BMI is contradictory (BMI branches only if the negative flag is set).]**

## Source Code
```asm
.; ROM fragment: SHIFT+C= handling (addresses shown)
.,EC64 0D 91 02    ORA $0291       OR it with the shift mode switch
.,EC67 30 09       BMI $EC72       go save the value, branch always
.,EC69 C9 09       CMP #$09        compare with enable [SHIFT][C=]
.,EC6B D0 EE       BNE $EC5B       exit if not enable [SHIFT][C=]
.,EC6D A9 7F       LDA #$7F        set to unlock shift mode switch
.,EC6F 2D 91 02    AND $0291       AND it with the shift mode switch
.,EC72 8D 91 02    STA $0291       save the shift mode switch $00 = enabled, $80 = locked
.,EC75 4C A8 E6    JMP $E6A8       restore the registers, set the quote flag and exit
```

## Key Registers
- $0291 - Zero page - shift-mode lock byte (software flag). Convention: $00 = enabled, $80 = locked.

## References
- "control_keyboard_table" — expands on control-key mapping used when SHIFT/C= or other control keys are interpreted
- "vicii_initialization_values" — context for screen/keyboard initialization sequence in ROM

## Labels
- SHIFTMODELOCK
