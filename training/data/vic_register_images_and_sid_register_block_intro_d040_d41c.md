# CIA #1 Keyboard/Joystick Ports, VIC-II Mirror Range, and SID Register Introduction

**Summary:** Describes CIA #1 Data Ports A/B ($DC00-$DC01) including the Commodore 64 keyboard matrix and joystick bit meanings, notes VIC-II register mirroring into $D040-$D3FF (every 64 bytes), and introduces the 6581 SID register block at $D400-$D41C (three voices, frequency/pulse/envelope/waveform/filter features).

## CIA #1 Data Ports (Keyboard and Joysticks)
CIA #1 Data Port A ($DC00) and Data Port B ($DC01) are the I/O registers used to read the keyboard matrix and the two joystick ports. The keyboard is an 8×8 matrix wired to these ports; to scan keys you drive columns low on Port A (configured as outputs via the Data Direction Register) and read rows from Port B (inputs). A 0 in a read bit means the corresponding key/switch is pressed; 1 means not pressed.

- Default (Kernal) scanning: an interrupt-driven routine reads the keyboard every 1/60 s and makes results available to the OS. Kernal SCNKEY routine is at $FF9F for manual reads.
- SHIFT LOCK: mechanical latch that holds the left SHIFT closed — not read as a separate key.
- RESTORE: wired to the 6510 NMI line; pressing RESTORE triggers NMI (independent of STOP).

Joystick mapping:
- Controller Port 1 is read from CIA #1 Data Port B ($DC01).
- Controller Port 2 is read from CIA #1 Data Port A ($DC00).
- Joystick switches are read like key switches (0 = pressed, 1 = released). From BASIC you can PEEK and mask to interpret directions; example: S1 = NOT PEEK(56321) AND 15 (reads Controller Port 1).

Direction codes (after masking/NOT as in example):
- 0 = none pressed
- 1 = up
- 2 = down
- 4 = left
- 5 = up + left
- 6 = down + left
- 8 = right
- 9 = up + right
- 10 = down + right
(Combinations 3 and 7 are impossible hardware-wise — e.g. up+down.)

## VIC-II Mirroring ($D040-$D3FF)
The VIC-II register block at $D000-$D02E is only partially decoded by the address logic of the chip; many C64 boards mirror VIC-II registers across a wider range. One common mirror range is $D040-$D3FF where the VIC-II register images repeat every 64 bytes. Accesses to addresses in this mirrored range will act on the corresponding VIC-II register (address modulo 64).

- Effect: reads/writes to $D040+$n will map to the VIC-II register at $D000+$n (for 0 ≤ n < register block size), repeated every 64 bytes up to $D3FF.

## SID (6581) Register Block Introduction ($D400-$D41C)
The MOS 6581 SID at $D400-$D41C provides three independent voices and a programmable filter. Key features summarized:

- Three voices (Voice 1/2/3), each with:
  - Frequency registers (16-bit, coarse/fine)
  - Pulse-width control (12-bit, for pulse waveform)
  - Envelope generator with ADSR controls (Attack, Decay, Sustain, Release)
  - Waveform control bits (triangle, sawtooth, pulse, noise; combinations allowed)
  - Oscillator sync and ring-modulation control bits
- Global/voice controls:
  - Gate bit (turns envelope on/off)
  - Filter routing (voice outputs can be routed to filter)
- Programmable filter:
  - Low-pass, high-pass, band-pass modes (selectable)
  - Cutoff frequency and resonance (Q) controls

For full per-register definitions and bit layouts, see the referenced SID register expansion (not repeated here).

## Source Code
```text
CIA #1 keyboard matrix (write to Port A to select column; read Port B for rows)
Port A = $DC00 (write)  ; Port B = $DC01 (read)
Bit positions shown as columns (Port A selects column LOW to read that column)

WRITE TO PORT A               READ PORT B (56321, $DC01)
56320/$DC00
         Bit 7   Bit 6   Bit 5   Bit 4   Bit 3   Bit 2   Bit 1   Bit 0

Bit 7    STOP    Q       C=      SPACE   2       CTRL    <-      1

Bit 6    /       ^       =       RSHIFT  HOME    ;       *       LIRA

Bit 5    ,       @       :       .       -       L       P       +

Bit 4    N       O       K       M       0       J       I       9

Bit 3    V       U       H       B       8       G       Y       7

Bit 2    X       T       F       C       6       D       R       5

Bit 1    LSHIFT  E       S       Z       4       A       W       3

Bit 0    CRSR DN F5      F3      F1      F7      CRSR RT RETURN  DELETE
```

```basic
10 REM Read joystick 1 (Controller Port 1 via $DC01)
20 S1=NOT PEEK(56321) AND 15
30 REM S1 values: 0 none, 1 up, 2 down, 4 left, 8 right (combinations e.g. 5=up+left)
```

```text
Addresses referenced:
- CIA #1 Data Ports: $DC00 (56320) = Port A (write/select columns), $DC01 (56321) = Port B (read rows)
- Kernal SCNKEY routine: $FF9F (65439)  ; for manual key read
- VIC-II base registers: $D000-$D02E  (mirrored into $D040-$D3FF in 64-byte increments)
- SID base block: $D400-$D41C  (6581 voice/filter registers)
```

## Key Registers
- $DC00-$DC01 - CIA #1 - Data Port A (write/select keyboard/joystick 2), Data Port B (read keyboard/joystick 1)
- $D040-$D3FF - VIC-II - Mirrored VIC-II registers (images of $D000-$D02E repeated every $40/64 bytes)
- $D400-$D41C - SID (6581) - Voice registers (frequency, pulse-width, ADSR), waveform/control, filter registers

## References
- "sid_voice_registers_and_controls" — detailed SID register definitions and bit layouts

## Labels
- SCNKEY
