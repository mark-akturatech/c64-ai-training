# CIA 1 — Data Port Register A ($DC00) & Data Port Register B ($DC01) bit functions

**Summary:** CIAPRA ($DC00) and CIAPRB ($DC01) on CIA 1 map keyboard matrix columns/rows, joystick 1/2 directions and fire buttons, paddle fire buttons, and Timer A/B data outputs; useful terms: $DC00, $DC01, CIA‑1, keyboard matrix, joystick, paddles, Timer A/B. (DDR — Data Direction Register — controls per‑bit input/output.)

## Bit functions
This chunk documents the bit-by-bit functions for CIA 1 Data Port A and B only. CIAPRA bits are primarily used to select keyboard columns and read joystick 2 and paddle fire buttons; CIAPRB bits are used to read keyboard rows and joystick 1 and to present Timer A/B output pulses on port lines.

- CIAPRA ($DC00)
  - Bits 0–7 correspond to keyboard column selects (used to scan the keyboard matrix) and, when read, return joystick 2 directions and paddle fire buttons as shown below. Bits 6–7 also select which paddle set (port A or B) the SID reads.
- CIAPRB ($DC01)
  - Bits 0–7 correspond to keyboard rows (the other half of the matrix) and, when read, return joystick 1 directions and paddle fire buttons as shown below. Bits 6 and 7 can be used as timer output lines (Timer A and Timer B respectively) to toggle or pulse data output on Port B.

Note: per-bit direction (input/output) is controlled by the CIA Data Direction Registers (DDRs) — see CIA DDRs for details (not duplicated here).

## Source Code
```text
56320   $DC00   CIAPRA
Data Port Register A

Bit 0:  Select to read keyboard column 0
        Read joystick 2 up direction
Bit 1:  Select to read keyboard column 1
        Read joystick 2 down direction
Bit 2:  Select to read keyboard column 2
        Read joystick 2 left direction
        Read paddle 1 fire button
Bit 3:  Select to read keyboard column 3
        Read joystick 2 right direction
        Read paddle 2 fire button
Bit 4:  Select to read keyboard column 4
        Read joystick 2 fire button
Bit 5:  Select to read keyboard column 5
Bit 6:  Select to read keyboard column 6
        Select to read paddles on Port A or B
Bit 7:  Select to read keyboard column 7
        Select to read paddles on Port A or B


56321   $DC01   CIAPRB
Data Port Register B

Bit 0:  Read keyboard row 0
        Read joystick 1 up direction
Bit 1:  Read keyboard row 1
        Read joystick 1 down direction
Bit 2:  Read keyboard row 2
        Read joystick 1 left direction
        Read paddle 1 fire button
Bit 3:  Read keyboard row 3
        Read joystick 1 right direction
        Read paddle 2 fire button
Bit 4:  Read keyboard row 4
        Read joystick 1 fire button
Bit 5:  Read keyboard row 5
Bit 6:  Read keyboard row 6
        Toggle or pulse data output for Timer A
Bit 7:  Read keyboard row 7
        Toggle or pulse data output for Timer B
```

## Key Registers
- $DC00-$DC01 - CIA 1 - Data Port A (CIAPRA) and Data Port B (CIAPRB): keyboard columns/rows, joystick 2/1, paddle fire buttons, Timer A/B outputs (Port B bits 6/7)

## References
- "reading_joystick_fire_buttons" — examples reading joystick buttons using PEEK on these ports  
- "data_port_b_timer_output" — Timer A/B outputs on Data Port B bits 6 and 7