# C64 joystick & paddle I/O (CIA1 ports, SID POTX, keyboard-matrix conflicts)

**Summary:** Joystick switches read from CIA#1 data ports ($DC00/$DC01, decimal 56320/56321) return logic 0 when pressed; use bit masks (AND/NOT) in BASIC to decode directions and fire. SID paddle reads use POTX ($D419) and are selected by CIA#1 Port A bits (conflicts with keyboard column scanning); workarounds include disabling keyscan via POKE 56333,127 and using Controller Port 2.

**Overview and mappings**
- Controller Port 1 is read from CIA#1 Data Port B ($DC01, decimal 56321). Controller Port 2 is read from CIA#1 Data Port A ($DC00, decimal 56320).
- Joysticks are 5 simple switches: up, down, left, right, fire. Switches pull their bit to 0 when pressed; unpressed = 1.
- Common C64 bit mapping on the CIA#1 data port(s):
  - Bit 0 = Up
  - Bit 1 = Down
  - Bit 2 = Left
  - Bit 3 = Right
  - Bit 4 = Fire
  (A pressed direction/test: (PEEK(port) AND bitmask) == 0)
- Typical BASIC convenience: invert and mask the lower 4 direction bits to give small numeric direction codes:
  - S = NOT PEEK(port) AND 15 → 1=up, 2=down, 4=left, 8=right (combinations add)
- Fire button test: the fire bit is bit 4 (value 16). (PEEK(port) AND 16) will be 0 when pressed.

**Keyboard matrix and SID paddle conflicts**
- CIA#1 Data Port A ($DC00) is used by the keyboard-scanning routine to select keyboard columns. The keyboard scan repeatedly writes different values to Port A; that interferes with any code that needs stable Port A bits (for example, selecting paddles).
- SID paddle selection (which pair of paddles are read by the SID registers) is controlled via CIA#1 Port A bits:
  - Bit 7 = 1 and Bit 6 = 0 → SID reads paddles on Controller Port 1
  - Bit 7 = 0 and Bit 6 = 1 → SID reads paddles on Controller Port 2
- Because the keyboard scan overwrites Port A, to get a reliable paddle read you must stop the keyscan from changing Port A (disable the IRQ/keyscan) and explicitly set Port A to the desired value; then read POTX/POTY from the SID.
- Similarly, because Port B is used by the keyboard matrix as well, joystick directions can be mistaken for keypresses and vice versa. Many software titles avoid the ambiguity by using Controller Port 2.

**Workarounds and examples**
- Disable keyscan temporarily, set Port A (or Port B) for joystick/paddle reading, then restore keyscan. Example sequence shown in source (restore values shown):
  - POKE 56333,127  (disable keyscan — example value from source)
  - POKE 56320,255  (set CIA#1 Port A to all 1s / safe value)
  - read joystick/paddles (PEEK/POT read)
  - POKE 56333,129  (restore keyscan)
- Simpler alternatives:
  - Read joystick from Controller Port 2 to avoid the keyboard conflict.
  - Clear keyboard buffer after reading joystick with POKE 198,0 (may be sufficient for some cases).
- SID paddle read register: POTX at $D419 (decimal 54297). Read POTX/POTY after selecting the desired paddle set via Port A bits.

## Source Code
```basic
' Read joystick in Controller Port 1 (CIA#1 Port B = $DC01 = 56321)
S1 = NOT PEEK(56321) AND 15   ' S1: 1=up,2=down,4=left,8=right (combinations add)

' Read joystick in Controller Port 2 (CIA#1 Port A = $DC00 = 56320)
S2 = NOT PEEK(56320) AND 15

' Read fire button for Controller Port 1 (returns 0 if pressed, 1 if not)
T1 = (PEEK(56321) AND 16) / 16

' Example keyscan-disable / read sequence (from source)
POKE 56333,127
POKE 56320,255
' ... perform reads (PEEK(56320) / PEEK(56321) / READ SID POTX $D419) ...
POKE 56333,129

' Alternative: clear keyboard buffer after read
POKE 198,0
```

```text
Direction numeric mapping after inversion (S = NOT PEEK(port) AND 15)
 0   none pressed
 1   up
 2   down
 4   left
 5   up + left
 6   down + left
 8   right
 9   up + right
10   down + right
(Note: 3 and 7 are impossible combinations: up+down or up+down+left etc.)
```

```text
Addresses referenced (decimal / hex)
 56320 = $DC00  (CIA#1 Data Port A)
 56321 = $DC01  (CIA#1 Data Port B)
 56333 = $DC0D  (used in example to disable/restore keyscan)
 54297 = $D419  (SID POTX — paddle X read)
```

## Key Registers
- $DC00-$DC0F - CIA#1 - Data Port A/B, keyboard matrix, joystick reads (Controller Port 2 reads from Port A $DC00, Controller Port 1 reads from Port B $DC01)
- $D419 - SID - POTX (paddle X read register; used to read paddles after selecting which port via CIA#1 Port A bits)

## References
- "cia1_data_ports_keyboard_matrix_and_layout" — expands on where joystick bits are read within the keyboard matrix
- "cia_serial_and_timer_outputs" — expands on how timers can be used to toggle Port B outputs as alternative uses