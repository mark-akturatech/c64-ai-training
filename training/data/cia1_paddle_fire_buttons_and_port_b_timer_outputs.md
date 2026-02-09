# CIA1 paddle fire buttons and timer-driven Port B outputs

**Summary:** Explains how paddle fire buttons are read via CIA #1 Data Ports ($DC00/$DC01) at bits 2 and 3 (0 = pressed), controller port mapping (Port B = Controller Port 1, Port A = Controller Port 2), and how Timer A/B can be used to drive/toggle Port B bits 6/7 via Control Registers ($DC0E/$DC0F).

## Paddle fire buttons and SID/CIA division of labor
- Analog paddle positions are read through the SID-related mechanism, but the digital paddle fire buttons are read from CIA #1 data ports.
- Controller Port 1 fire buttons are read at CIA #1 Data Port B ($DC01 / 56321 decimal). Controller Port 2 fire buttons are read at CIA #1 Data Port A ($DC00 / 56320 decimal).
- In each Data Port the fire buttons share the same lines as joystick left/right: Bit 2 and Bit 3. The bit logic is active-low: a pressed button reads as 0, released reads as 1.
- Although only two paddle analog values can be sampled at once by the SID, all four paddle fire buttons can always be read via the CIA data ports (see the BASIC game paddle input reference at $D419 / 54297 for the BASIC statements historically used to read them).

## Timer-driven outputs on Port B (alternate to interrupts)
- CIA #1 Data Port B can be used as a normal input port for joysticks/paddles, but bits 6 and 7 of Port B can also serve as timer-driven outputs.
- By configuring Timer A or Timer B control registers (Control Register A / Control Register B at $DC0E/$DC0F) you can prevent the timer from generating an interrupt and instead have it change the state of a corresponding Port B output bit:
  - Timer A -> Port B bit 6
  - Timer B -> Port B bit 7
- Timer A (CRA) supports modes where it will either pulse the output on bit 6 for one machine cycle or toggle that bit (flip 0↔1) each time the timer underflows. Timer B (CRB) provides the equivalent behavior for bit 7.
- These timer-output modes are selected via the timer control register bits (see the timer control register descriptions in the CIA register map).

## Source Code
```text
CIA #1 register map ($DC00-$DC0F)

Address  Name    Purpose
$DC00   PRA     Port A Data Register (Controller Port 2 inputs/outputs)
$DC01   PRB     Port B Data Register (Controller Port 1 inputs/outputs)
$DC02   DDRA    Data Direction Register A (1 = output)
$DC03   DDRB    Data Direction Register B (1 = output)
$DC04   TALO    Timer A low byte
$DC05   TAHI    Timer A high byte
$DC06   TBLO    Timer B low byte
$DC07   TBHI    Timer B high byte
$DC08   TOD0    Time-of-day / TOD 1/10 second
$DC09   TOD1    Time-of-day seconds
$DC0A   TOD2    Time-of-day minutes
$DC0B   TOD3    Time-of-day hours + control bits
$DC0C   SDR     Serial Data Register
$DC0D   ICR     Interrupt Control Register
$DC0E   CRA     Control Register A (Timer A control, start/one-shot/interrupt/mode)
$DC0F   CRB     Control Register B (Timer B control, same fields for Timer B)

Relevant port bit semantics (CIA #1 PRA/PRB):
- Bit 0: general-purpose I/O / joystick/fire mapping (chip/card dependent)
- Bit 1: general-purpose / joystick mapping
- Bit 2: joystick left / paddle fire (active-low: 0 = pressed)
- Bit 3: joystick right / paddle fire (active-low: 0 = pressed)
- Bit 4: joystick up / paddle other line
- Bit 5: joystick down / paddle other line
- Bit 6: Port B only — can be driven by Timer A when configured (pulse or toggle modes)
- Bit 7: Port B only — can be driven by Timer B when configured (pulse or toggle modes)

Notes:
- The timer-to-port output behavior is selected in CRA/CRB; timers can be set to run without causing an ICR interrupt and instead produce pulses/toggles on PRB bit 6/7.
- Fire-button logic: read PRx, then test bits 2 and 3; a 0 in the respective bit indicates the button is depressed.

Reference addresses mentioned in text:
- $D419 (decimal 54297) — referenced as the BASIC game paddle input description location for example BASIC statements (see original reference).
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Data Ports A/B, DDRs, Timer A/B low+high, TOD, SDR, ICR, CRA, CRB

## References
- "game_paddle_inputs_and_sid_paddle_reading" — combined use of SID and CIA for paddles & fire buttons
- "dc04_dc07_timers" — timer registers and modes to toggle/pulse port bits (CRA/CRB)