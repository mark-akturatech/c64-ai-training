# CIA 1 ($DC00-$DCFF) — Keyboard, Joysticks, Paddles, Datasette, FLAG/IRQ

**Summary:** CIA 6526 (CIA1 at $DC00-$DCFF) handles keyboard scanning (Port A drives columns at $DC00, Port B reads rows at $DC01), joystick inputs (Joystick 2 on Port A $DC00, Joystick 1 on Port B $DC01 — bits active low), paddles/datasette connections, and IRQ generation via the FLAG pin (cassette read).

## CIA 1 overview
CIA1 is the Complex Interface Adapter connected at $DC00-$DCFF on the C64 (registers mirrored every 16 bytes; core register set $DC00-$DC0F). Responsibilities on the C64 include:
- Keyboard matrix scanning (8 columns × 8 rows)
- Reading joystick inputs (two 1-player-style ports, bits active low)
- Paddle (analog) inputs and datasette control lines
- Generating IRQs from internal sources (timers, TOD, serial, FLAG) when enabled

## Keyboard scanning (matrix)
- Port A (PRA, $DC00) is used to drive keyboard columns. Port A bits are outputs (active low) when used for scanning.
- Port B (PRB, $DC01) is used to read keyboard rows. Port B bits are inputs (active low).
- Scan procedure (per-column):
  - Write a 0 to the desired column bit in Port A (clear that bit).
  - Read Port B; any row bit reading 0 indicates the key at that row/column intersection is pressed.
- To detect all keys, select each column in turn (clear bit 0..7 individually in PRA) and sample PRB after each selection.
- Joystick and key matrix share port pins; joystick input is read directly from the same port bits (active low) and must be accounted for when scanning.

## Joystick inputs
- Joystick 2 is read from Port A / PRA ($DC00):
  - Bit 0 = Up (active low)
  - Bit 1 = Down (active low)
  - Bit 2 = Left (active low)
  - Bit 3 = Right (active low)
  - Bit 4 = Fire (active low)
- Joystick 1 is read from Port B / PRB ($DC01):
  - Bit 0 = Up (active low)
  - Bit 1 = Down (active low)
  - Bit 2 = Left (active low)
  - Bit 3 = Right (active low)
  - Bit 4 = Fire (active low)
- Note: joystick bits are active low; 0 = active/pressed. When scanning the keyboard, take care to avoid driving columns in a way that masks or distorts joystick reads.

## FLAG pin, cassette read and IRQs
- The CIA FLAG pin is connected to the Cassette Read line on the C64.
- A negative edge on the FLAG pin (cassette read transition) can generate a CIA interrupt if the corresponding FLAG interrupt is enabled in the CIA interrupt control.
- CIA interrupt enabling and status are managed through the CIA interrupt control register (ICR) and control registers (CRA/CRB); enable/acknowledge behaviour is handled via those registers.

## Datasette / paddles
- The cassette (datasette) interface uses the FLAG/Cassette Read connection (see FLAG pin above).
- Paddle inputs and analog timing are handled via CIA mechanisms (potentiometer inputs and timer measurement), but detailed analog read/measurement timing and POT register usage are part of the CIA register set and not expanded here.

## Source Code
```text
CIA1 register map (core 16-byte set mirrored across $DC00-$DCFF):
Offset  Absolute  Name      Purpose
$00     $DC00     PRA       Port A data register (keyboard columns / joystick 2)
$01     $DC01     PRB       Port B data register (keyboard rows / joystick 1)
$02     $DC02     DDRA      Data direction register A
$03     $DC03     DDRB      Data direction register B
$04     $DC04     TALO      Timer A low byte
$05     $DC05     TAHI      Timer A high byte
$06     $DC06     TBLO      Timer B low byte
$07     $DC07     TBHI      Timer B high byte
$08     $DC08     TOD10TH   Time-of-day 1/10s
$09     $DC09     TODSEC    Time-of-day seconds
$0A     $DC0A     TODMIN    Time-of-day minutes
$0B     $DC0B     TODHR     Time-of-day hours / 12-24 control
$0C     $DC0C     SDR       Serial data register
$0D     $DC0D     ICR       Interrupt control / status register
$0E     $DC0E     CRA       Control register A (timers, serial)
$0F     $DC0F     CRB       Control register B (timers, serial, FLAG/CB1/CB2 controls)

Joystick bit mapping (reference):
Port A / PRA ($DC00)  : Bit0 Up, Bit1 Down, Bit2 Left, Bit3 Right, Bit4 Fire (Joystick 2)
Port B / PRB ($DC01)  : Bit0 Up, Bit1 Down, Bit2 Left, Bit3 Right, Bit4 Fire (Joystick 1)
(All joystick bits active low)

Keyboard scanning example (algorithmic, not machine code):
- For each column n = 0..7:
  - Clear bit n in $DC00 (drive that column low)
  - Read $DC01; any row bit = 0 indicates pressed key at (row, column n)
```

## Key Registers
- $DC00-$DC0F - CIA 1 - PRA/PRB (ports), DDRA/DDRB, Timer A/B low/high, TOD registers, SDR, ICR, CRA, CRB (keyboard columns/rows, joystick inputs, timers, interrupts, FLAG)

## References
- "port_a_data_register_pra" — expands on Port A driving keyboard columns and joystick 2
- "port_b_data_register_prb" — expands on Port B reading keyboard rows and joystick 1
- "interrupt_handling" — expands on FLAG pin generating IRQ (ICR / FLAG enable)