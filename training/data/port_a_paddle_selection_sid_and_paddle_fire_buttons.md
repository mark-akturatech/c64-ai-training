# CIA #1 Data Port A — Paddle selection for SID and paddle fire-button inputs

**Summary:** CIA #1 Data Port A ($DC00 / 56320) controls which joystick port the SID paddle registers read (POTX at $D419), and together with CIA #1 Data Port B ($DC01 / 56321) provides the paddle fire-button bits (bits 2 and 3). Key terms: $DC00, $DC01, CIA 1, SID POTX $D419, paddle selection (bits 7/6), fire buttons (bits 2/3), keyscan IRQ conflict.

## Function
- Port A (CIA #1 Data Port A, $DC00) contains the control bits that select which pair of paddles the SID reads. Because the SID provides only two paddle position registers, bits in CIA #1 Data Port A switch the SID input between Controller Port 1 and Controller Port 2.
  - Bit 7 = 1 and Bit 6 = 0 → SID reads paddles on Controller Port 1.
  - Bit 7 = 0 and Bit 6 = 1 → SID reads paddles on Controller Port 2.
- The SID paddle position register for reading is POTX at $D419 (decimal 54297). Use POTX to sample the analog paddle values after selecting the desired controller port via CIA #1 Port A.
- Fire (trigger) buttons for paddles are read from the CIA ports:
  - Controller Port 1 fire buttons → CIA #1 Data Port B ($DC01 / 56321).
  - Controller Port 2 fire buttons → CIA #1 Data Port A ($DC00 / 56320).
- Fire-button bits are Bits 2 and 3 of the respective CIA data port; a bit reads 0 when the corresponding button is pressed, 1 when released. (These bits are the same physical lines used for joystick left/right switches.)
- Important interaction: the system keyboard key-scan routine writes varying values to CIA #1 Data Port A to select keyboard columns. That routine commonly leaves the last column value which may coincide with the setting that selects paddles on Controller Port 1. Therefore, to reliably read paddle positions you must disable the key-scan IRQ (stop the keyboard column writes) and explicitly set Bits 7/6 to the desired selection before sampling POTX.

## Source Code
```text
Register / Address summary (reference):

CIA #1 Data Port A
  - Address: $DC00 (decimal 56320)
  - Role: Data Port A; also used to select which joystick port SID reads via Bits 7 and 6.
  - Bits of interest:
      Bit 7 = 1, Bit 6 = 0  => SID reads paddles on Controller Port 1
      Bit 7 = 0, Bit 6 = 1  => SID reads paddles on Controller Port 2
      Bit 3 = joystick right / fire? (reads 0 when pressed)
      Bit 2 = joystick left  / fire? (reads 0 when pressed)
    (Original source: fire buttons for Port 2 are read here; bits read 0 when pressed)

CIA #1 Data Port B
  - Address: $DC01 (decimal 56321)
  - Role: Data Port B; fire buttons for paddles on Controller Port 1 read here.
  - Bits of interest:
      Bit 3 = joystick right / fire? (reads 0 when pressed)
      Bit 2 = joystick left  / fire? (reads 0 when pressed)

SID POTX
  - Address: $D419 (decimal 54297)
  - Role: SID paddle X-axis analog input read (POTX). Sample POTX after selecting controller port via CIA #1 Data Port A bits 7/6.

Notes:
- Fire-button bits (Bits 2 and 3) behave active-low: 0 = pressed, 1 = released.
- Because the keyboard key-scan writes CIA #1 Data Port A continuously, read sequence for paddles:
    1) Disable key-scan IRQ / stop key-scan writes to CIA #1 Port A.
    2) Write desired bits (Bit7/Bit6) to CIA #1 Port A to select controller port.
    3) Read SID POTX ($D419) for paddle positions.
    4) Re-enable key-scan IRQ if needed.
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Data Port A/B and CIA #1 registers (Data Port A $DC00 used for SID paddle selection and Port 2 fire buttons; Data Port B $DC01 used for Port 1 fire buttons)
- $D419 - SID - POTX (paddle position read register used after selecting joystick port via CIA #1 Port A)

## References
- "sid_potx_paddle_input" — expands on SID POTX register used to read paddle positions ($D419 / 54297)
- "reading_joystick_fire_buttons" — expands on reading joystick trigger bits at CIA ports ($DC00/$DC01)

## Labels
- POTX
- CIA1_PRA
- CIA1_PRB
