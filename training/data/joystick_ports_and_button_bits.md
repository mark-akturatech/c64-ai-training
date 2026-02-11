# Joysticks (CIA1 $DC00-$DC03)

**Summary:** Joystick input on the C64 is read via CIA1 port A registers $DC00-$DC03 (JOY1, JOY2, DDRA, DDRB). Configure DDRA/DDRB as inputs ($00); joystick bits are active-low (cleared when pressed). Typical handling: complement/NOT the port byte then mask (AND #$0F) to get a 4-bit direction value; treat the fire button (bit 4) separately.

**Behavior and usage**
- Configure the two joystick ports as inputs by writing $00 to DDRA and DDRB ($DC02, $DC03).
- Read joystick state from JOY1 ($DC00) or JOY2 ($DC01).
- All joystick lines are active-low: a pressed contact pulls the corresponding bit to 0.
- Bits:
  - Lower nibble (bits 0–3) represent the directional switches. If two of the lower bits are clear simultaneously, the joystick is on a diagonal (angle).
  - Bit 4 (value $10) is the fire button; it is cleared when the button is pressed and normally handled separately.
- Common processing sequence:
  1. Read the port (LDA $DC00 or LDA $DC01).
  2. Invert the accumulator (NOT) or EOR #$FF to make pressed directions = 1.
  3. Mask the upper nibble (AND #$0F) so the result is a 4-bit direction value (0–15); handle fire separately by testing bit 4 before/after masking as needed.
- You will usually mask unused upper bits (bits 5–7) and handle the fire button separately; do not use the raw port byte directly as a table index without masking/inversion.

## Source Code
```asm
; Example (from source)
; READ THE JOYSTICK PORT
LDA $DC00       ; JOY1
NOT             ; complement the accumulator (turn active-low -> active-high)
AND #$0F        ; mask upper bits (keep 4-bit direction)
; Result: A = 4-bit direction value (bits 0-3)
; Fire button is bit 4 of the original port (cleared when pressed)
```

```text
Bit-to-Direction Mapping Table:

Bit | Direction
----|----------
 0  | Up
 1  | Down
 2  | Left
 3  | Right
 4  | Fire

Note: Bits are active-low; a pressed direction or fire button results in a 0.
```

## Key Registers
- $DC00-$DC03 - CIA1 - JOY1 ($DC00), JOY2 ($DC01), DDRA ($DC02), DDRB ($DC03): joystick port data and data-direction registers for both ports

## References
- "hardware_scrolling_and_registers" — expands on example uses of bit masking similar to joystick handling
- Commodore 64 Programmer's Reference Guide: Input/Output Guide - The Game Ports
- C64-Wiki: Control Port
- C64-Wiki: Joystick

## Labels
- JOY1
- JOY2
- DDRA
- DDRB
