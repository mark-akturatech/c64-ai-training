# KERNAL helper: JSR $F7D0; INC $A6; LDY $A6; CPY #$C0; RTS ($F80D-$F816)

**Summary:** Short Commodore 64 KERNAL helper that calls $F7D0, increments zero-page counter $A6, loads Y from $A6, and compares Y with #$C0 (CPY #$C0). Searchable terms: $F7D0, $A6, JSR, INC, LDY, CPY, RTS.

## Description
This routine performs a small sequence used as a counter increment + bound check helper:

- JSR $F7D0 — calls an external subroutine at $F7D0 before performing the increment/check.
- INC $A6 — increments the zero-page byte at $A6 (single-byte zero-page addressing).
- LDY $A6 — loads the incremented value into the Y register (zero-page indirect load into index register).
- CPY #$C0 — compares Y with immediate value $C0 (decimal 192), setting processor flags (Carry/Zero/Negative) accordingly.
- RTS — return from subroutine; Y remains as loaded from $A6 and flags reflect the CPY result.

Typical use: increment a zero-page counter and test whether it reached/passed the $C0 bound; caller inspects processor flags or return to determine next action.

## Source Code
```asm
.,F80D 20 D0 F7    JSR $F7D0
.,F810 E6 A6       INC $A6
.,F812 A4 A6       LDY $A6
.,F814 C0 C0       CPY #$C0
.,F816 60          RTS
```

## References
- "compare_indirect_buffers" — expands on use in multi-step comparisons and loops
- "wait_for_device_ready_and_handle_flags" — expands on part of higher-level control flows