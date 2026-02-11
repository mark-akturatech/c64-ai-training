# Sprite Horizontal Expansion & Collision ($D01D-$D01F) and SID Filter / Paddle Registers ($D415-$D41A)

**Summary:** Details of VIC-II sprite horizontal expansion ($D01D) and sprite collision latches ($D01E sprite–sprite, $D01F sprite–foreground) including read-clear behavior and collision rules; SID filter registers CUTLO/CUTHI/RESON/SIGVOL ($D415-$D418) with cutoff-frequency calculation and resonance/volume bit layouts; game paddle input registers ($D419-$D41A) and CIA1 ($DC00) paddle-port selection note.

**Sprite Horizontal Expansion and Collision Detection**
- **Sprite Horizontal Expansion ($D01D):** Each bit in this register corresponds to one of the eight hardware sprites; when a sprite's bit is set to 1, its displayed width is doubled (horizontal expansion). The bit-to-sprite mapping is as follows:
  - Bit 0 → Sprite 0
  - Bit 1 → Sprite 1
  - Bit 2 → Sprite 2
  - Bit 3 → Sprite 3
  - Bit 4 → Sprite 4
  - Bit 5 → Sprite 5
  - Bit 6 → Sprite 6
  - Bit 7 → Sprite 7

- **Sprite–Sprite Collision Latch ($D01E):** This register indicates collisions between sprites. Each bit corresponds to a sprite; if a bit is set to 1, that sprite has collided with another sprite. The bit-to-sprite mapping is:
  - Bit 0 → Sprite 0
  - Bit 1 → Sprite 1
  - Bit 2 → Sprite 2
  - Bit 3 → Sprite 3
  - Bit 4 → Sprite 4
  - Bit 5 → Sprite 5
  - Bit 6 → Sprite 6
  - Bit 7 → Sprite 7

- **Sprite–Foreground Collision Latch ($D01F):** This register indicates collisions between sprites and the background. Each bit corresponds to a sprite; if a bit is set to 1, that sprite has collided with the background. The bit-to-sprite mapping is the same as for $D01E.

- **Collision Rules:**
  - Only nonzero shape pixels (“1” bits) count as solid for collision detection. Zero bits are transparent and do not collide.
  - In multicolor mode, the two-bit pair value 01 is treated as background (transparent) and does not cause collisions; other multicolor bit-pair values that produce visible sprite color do count.
  - Collisions are detected independent of on-screen clipping: they can occur while the sprite pixels are off-screen or covered by border areas, and the collision latch will still be set.
  - Reading $D01E or $D01F clears the latched collision bits (read-to-clear).

- **Use-Case Notes:**
  - To test for collisions, poll the appropriate register and respond; subsequent reads will see only new collisions after the last read.

**SID Filter Registers and Cutoff Frequency**
- **Filter Cutoff Frequency:**
  - The SID filter cutoff is an 11-bit value composed of:
    - **CUTLO ($D415):** Low 3 bits of cutoff (bits 0–2).
    - **CUTHI ($D416):** High byte of cutoff (bits 3–10).
  - To form the 11-bit register value: multiply the CUTHI (high byte) value by 8, then add CUTLO & 0x07 (low three bits). This yields 0–2047 discrete cutoff steps.
  - **Frequency Approximation:**
    - FREQUENCY = (REGISTER_VALUE * 5.8) + 30 Hz
    - This maps the 2048 steps roughly from 30 Hz up to ~12 kHz.

- **Filter Resonance and Routing:**
  - **RESON ($D417):**
    - Bits 0–3: Voice routing through filter
      - Bit 0 = Voice 1 through filter (1 = yes)
      - Bit 1 = Voice 2 through filter
      - Bit 2 = Voice 3 through filter
      - Bit 3 = External input through filter (pin 5 AV port)
    - Bits 4–7: Resonance control (0–15). 0 = no resonance, 15 = max resonance (peaks frequencies near cutoff).

- **Volume and Filter Type:**
  - **SIGVOL ($D418):**
    - Bits 0–3: Output volume (0–15)
    - Bit 4: Low-pass enable (1 = on)
    - Bit 5: Band-pass enable (1 = on)
    - Bit 6: High-pass enable (1 = on)
    - Bit 7: Disconnect output of voice 3 (1 = voice 3 off; allows oscillator use without audible output)

- **Notes:**
  - At least one voice must be routed through the filter (via $D417) for filter modes to affect sound.
  - Multiple filter types (LP/BP/HP) can be enabled simultaneously, but the SID only uses a single cutoff frequency value.

**Game Paddle Inputs (SID $D419-$D41A) and CIA1 Selection**
- **Paddle Input Registers:**
  - $D419–$D41A are SID registers used to read paddle A/D values (0–255) for the paddles connected to joystick controller ports 1 and 2.
  - Each paddle is an analog potentiometer; the SID contains A/D converters that return 0 (minimum resistance) to 255 (maximum resistance).

- **Port Selection:**
  - To select which controller port is read, software must write a two-bit pair into CIA1 Data Port A ($DC00):
    - Write bit-pair = 01 (value 64) to select paddles on Controller Port 1.
    - Write bit-pair = 10 (value 128) to select paddles on Controller Port 2.

- **Caveat:**
  - $DC00 is also used for keyboard scanning by the IRQ-driven keyboard routine (runs ~60 Hz). Because the system IRQ and STOP-key routines frequently write $DC00, selections written from BASIC may be overwritten. To reliably select paddles from BASIC, disable the keyboard IRQ first (example: POKE 56333,127) before writing the port select and reading $D419/$D41A.

## Source Code
```text
SID Filter and Cutoff description (reference):

These registers, you must multiply the value in the high byte by 8,
and add the value of the low three bits. The range of cutoff
frequencies represented by these 2048 values stretches from 30 Hz to
about 12,000 Hz. The exact frequency may be calculated with the
formula:

FREQUENCY = (REGISTER VALUE * 5.8) + 30 Hz

54293         $D415          CUTLO
Bits 0-2:  Low portion of filter cutoff frequency
Bits 3-4:  Unused
Bits 5-7:  Unused

54294         $D416          CUTHI
Filter Cutoff Frequency (high byte)

54295         $D417          RESON
Bit 0:  Filter the output of voice 1?  1 = yes
Bit 1:  Filter the output of voice 2?  1 = yes
Bit 2:  Filter the output of voice 3?  1 = yes
Bit 3:  Filter the output from the external input?  1 = yes
Bits 4-7:  Select filter resonance 0-15

54296         $D418          SIGVOL
Bits 0-3:  Select output volume (0-15)
Bit 4:  Select low-pass filter, 1 = low-pass on
Bit 5:  Select band-pass filter, 1 = band-pass on
Bit 6:  Select high-pass filter, 1 = high-pass on
Bit 7:  Disconnect output of voice 3, 1 = voice 3 off

Location Range: 54297-54298 ($D419-$D41A)
Game Paddle Inputs
These registers return 0-255 for paddle positions. To select port:
Write to CIA1 Data Port A (56320, $DC00): bit-pair 01 (value 64) = port1, 10 (value 128) = port2.
```

## Key Registers
- $D01D-$D01F - VIC-II - Sprite horizontal expansion ($D01D) and collision latches (sprite–sprite $D01E, sprite–foreground $D01F; read-to-clear)
- $D415-$D418 - SID (base $D400) - CUTLO, CUTHI, RESON, SIGVOL (filter cutoff, resonance, filter type, volume)
- $D419-$D41A - SID - Game paddle A/D input registers (paddle values 0–255)
- $DC00 - CIA1 - Data Port A (keyboard scanning / paddle-port selection bits)

## References
- "sprite_position_registers_and_horizontal_msb" — expands on collision detection independent of onscreen position

## Labels
- CUTLO
- CUTHI
- RESON
- SIGVOL
