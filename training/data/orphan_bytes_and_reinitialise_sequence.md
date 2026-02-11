# E599–E59D: orphan NOP then JSR $E5A0 (VIC init) and JMP $E566 (cursor-home)

**Summary:** Small C64 ROM sequence at $E599–$E59D: a single-byte NOP (identified as an orphan byte), a JSR to $E5A0 which initializes the VIC-II chip registers, followed by a JMP to $E566 which homes the cursor and computes line pointers.

## Description
This snippet appears to be a short reinitialisation/entry path in the ROM. Sequence:
- $E599 contains an apparent orphan byte encoded as EA (NOP). The original disassembly flags this as unexpected ("huh").
- $E59A performs JSR $E5A0 — the VIC initialization routine (labelled initialise_vic_chip_registers in related documentation).
- $E59D performs JMP $E566 — the cursor-home routine (labelled home_cursor_and_compute_line_pointers in related documentation).

No additional register-level details are present in this snippet; the code simply branches to the two longer routines responsible for VIC setup and cursor/line pointer computation.

## Source Code
```asm
.; E599–E59D: small entry/re-init sequence
.,E599 EA       NOP             ; huh (apparent orphan byte)
.,E59A 20 A0 E5 JSR $E5A0       ; initialise_vic_chip_registers
.,E59D 4C 66 E5 JMP $E566       ; home_cursor_and_compute_line_pointers
```

## References
- "initialise_vic_chip_registers" — expands on calls performed by the VIC init routine at $E5A0  
- "home_cursor_and_compute_line_pointers" — expands on the cursor-home routine at $E566