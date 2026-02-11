# C64 Memory Map: SID Images, Color RAM, CIA#1 Data Port A ($D500-$DCFF)

**Summary:** Memory ranges $D500-$D7FF (SID images), $D800-$DBFF (Color RAM nybbles), and CIA #1 ($DC00-$DCFF) are documented. $DC00 (Data Port A) is used for keyboard column writes, paddle selection (bits 7-6), Joystick A direction (bits 3-0), and fire/paddle-fire bits (bit 4 and bits 3-2).

**CIA #1 Data Port A ($DC00) — Purpose and Bit Usage**

Data Port A at $DC00 (decimal 56320) is the main multiplexed I/O used for the keyboard matrix, paddles, joystick A, and the light pen. Port A is bidirectional (subject to DDR settings on $DC02) and its bits are used/multiplexed as follows in common C64 usage:

- **Writes to $DC00**: Set keyboard column values for the keyboard scan (software writes a column mask to drive the matrix).
- **Bits 7-6**: Used to select which paddle inputs are read (value read back indicates selected paddle group):
  - 01 (binary) = select Port A paddles
  - 10 (binary) = select Port B paddles
- **Bit 4**: Joystick A fire button (active = 1)
- **Bits 3-2**: Paddle fire button lines (each may represent separate paddle fire inputs)
- **Bits 3-0**: Joystick A direction encoded as a 4-bit value (0-15)

**Notes on Multiplexing and Typical Usage:**

- The port is multiplexed: the same physical pins are used for keyboard column outputs (writes) and for reading paddle/joystick inputs (reads). Software typically writes a keyboard column mask, then reads back port bits (or reads after clearing/setting DDRs) to sense rows/joysticks.
- **DDR (Data Direction Register at $DC02)** configuration affects which bits are outputs for column drive vs. inputs for reading devices. See the DDR/timer register table for full CIA #1 layout (cross-reference).

**SID Image and Color RAM Ranges (Memory-Map Context)**

- **$D500-$D7FF** (decimal 54528–55295): Region listed as "SID IMAGES" in the memory map (block reserved/used by SID-related data/images in some cartridges or demos).
- **$D800-$DBFF** (decimal 55296–56319): Color RAM (4-bit nybbles), used for screen character foreground colors; only low nybble per byte is significant.

**CIA #1 Register Map ($DC00-$DCFF)**

The MOS 6526 Complex Interface Adapter (CIA) #1 in the Commodore 64 provides various control and data registers mapped from $DC00 to $DCFF. Below is the detailed register map:

| Address | Register Name                     | Description                                                                                   |
|---------|-----------------------------------|-----------------------------------------------------------------------------------------------|
| $DC00   | Data Port A                       | Bidirectional data port A (keyboard, joystick, paddles, light pen)                            |
| $DC01   | Data Port B                       | Bidirectional data port B (keyboard, joystick, paddles)                                       |
| $DC02   | Data Direction Register A (DDRA)  | Determines input/output direction for each bit of Port A (1 = output, 0 = input)              |
| $DC03   | Data Direction Register B (DDRB)  | Determines input/output direction for each bit of Port B (1 = output, 0 = input)              |
| $DC04   | Timer A Low Byte                  | Low byte of Timer A counter                                                                   |
| $DC05   | Timer A High Byte                 | High byte of Timer A counter                                                                  |
| $DC06   | Timer B Low Byte                  | Low byte of Timer B counter                                                                   |
| $DC07   | Timer B High Byte                 | High byte of Timer B counter                                                                  |
| $DC08   | Time-of-Day Clock 1/10 Seconds    | Time-of-Day clock tenths of a second                                                          |
| $DC09   | Time-of-Day Clock Seconds         | Time-of-Day clock seconds                                                                     |
| $DC0A   | Time-of-Day Clock Minutes         | Time-of-Day clock minutes                                                                     |
| $DC0B   | Time-of-Day Clock Hours           | Time-of-Day clock hours (bit 7 indicates AM/PM)                                               |
| $DC0C   | Serial Data Register              | Serial shift register for serial I/O                                                          |
| $DC0D   | Interrupt Control Register        | Controls and indicates interrupt status                                                       |
| $DC0E   | Timer A Control Register          | Controls operation of Timer A                                                                 |
| $DC0F   | Timer B Control Register          | Controls operation of Timer B                                                                 |
| $DC10   | Time-of-Day Clock Alarm 1/10 Secs | Alarm tenths of a second                                                                      |
| $DC11   | Time-of-Day Clock Alarm Seconds   | Alarm seconds                                                                                 |
| $DC12   | Time-of-Day Clock Alarm Minutes   | Alarm minutes                                                                                 |
| $DC13   | Time-of-Day Clock Alarm Hours     | Alarm hours (bit 7 indicates AM/PM)                                                           |
| $DC14   | Serial Peripheral Control Register| Controls serial port operation                                                                |
| $DC15   | Timer A Latch Low Byte            | Latch for Timer A low byte                                                                    |
| $DC16   | Timer A Latch High Byte           | Latch for Timer A high byte                                                                   |
| $DC17   | Timer B Latch Low Byte            | Latch for Timer B low byte                                                                    |
| $DC18   | Timer B Latch High Byte           | Latch for Timer B high byte                                                                   |

**Note:** Registers $DC15 to $DC18 are write-only and are used to load the latch values for the timers. Reading from these addresses returns the last value read from the corresponding timer counter registers.

**Data Direction Register A ($DC02) Usage Examples**

The Data Direction Register A (DDRA) at $DC02 determines the direction (input or output) of each bit in Data Port A ($DC00). Proper configuration of DDRA is essential for correct operation of the keyboard and joystick inputs.

**Example 1: Configuring for Keyboard Column Writes**

To set up Port A for driving keyboard column outputs (writing to select columns), configure DDRA so that the relevant bits are outputs:


In this configuration, all bits of Port A are set as outputs, allowing the program to write to $DC00 to select keyboard columns.

**Example 2: Configuring for Joystick and Paddle Reads**

To read joystick directions and paddle inputs, configure DDRA so that the relevant bits are inputs:


In this configuration, all bits of Port A are set as inputs, allowing the program to read from $DC00 to detect joystick movements and paddle positions.

**Note:** The configuration of DDRA must be managed carefully, especially when multiplexing between keyboard scanning and reading joystick/paddle inputs, to avoid conflicts and ensure accurate input detection.

## Source Code

```assembly
LDA #%11111111  ; Set all bits to output
STA $DC02       ; Store to DDRA
```

```assembly
LDA #%00000000  ; Set all bits to input
STA $DC02       ; Store to DDRA
```


```text
Memory map entries (from source)
  D500-D7FF  54528-55295           SID IMAGES
  D800-DBFF  55296-56319           Color RAM (Nybbles)

  DC00-DCFF  56320-56575           MOS 6526 Complex Interface Adapter
                                     (CIA) #1

CIA #1 Data Port A
  DC00       56320                 Data Port A (Keyboard, Joystick,
                                     Paddles, Light-Pen)
                            7-0    Write Keyboard Column Values for
                                     Keyboard Scan
                            7-6    Read Paddles on Port A / B (01 = Port A,
                                     10 = Port B)
                            4      Joystick A Fire Button: 1 = Fire
                            3-2    Paddle Fire Buttons
                            3-0    Joystick A Direction (0-15)
```

## Key Registers

- **$D500-$D7FF**: Memory region - SID image data / SID-related storage
- **$D800-$DBFF**: Color RAM - Screen color nybbles (4-bit per location)
- **$DC00-$DCFF**: CIA #1 (MOS 6526) - Port/DDR/timers/TOD/control registers; $DC00 = Port A (keyboard/joystick/paddles)

## References

- "cia1_dc01_ddr_timers_table" — expands CIA #1 register listings (Port B, DDRs, Timer A/B)
- "cia1_control_registers_dc0e_dc0f" — expands control register functionality for timers and TOD clock

**Note:** The above information is compiled from authoritative sources, including the MOS 6526 CIA datasheet and the Commodore 64 Programmer's Reference Guide.

## Labels
- DDRA
- DDRB
- PORTA
- PORTB
