# SID Voice 1 Registers ($D400-$D404) and CIA#1 Fire/Joystick Reads

**Summary:** This document details the SID voice 1 registers ($D400–$D404), including the 16-bit frequency registers (FRELO1/FREHI1), the 12-bit pulse width registers (PWLO1/PWHI1), and the Voice 1 Control Register ($D404). It provides the frequency formula, explains the pulse width to duty cycle relationship, and offers a BASIC PEEK example for reading fire button states. Additionally, it discusses the ambiguity in CIA#1 Data Port B when reading keyboard and joystick inputs.

**SID Voice 1: Frequency, Pulse Width, Control**

The SID chip's voice 1 utilizes the following registers:

- **FRELO1 ($D400) and FREHI1 ($D401):** These registers form a 16-bit value that sets the oscillator frequency for voice 1. The frequency is calculated using the formula:


  Where `REGISTER_VALUE` is the combined 16-bit value from FRELO1 and FREHI1, and `CLOCK` is the system clock frequency.

- **PWLO1 ($D402) and PWHI1 ($D403):** These registers combine to form a 12-bit pulse width value, determining the duty cycle of the pulse waveform. The allocation is as follows:

  - **PWLO1 ($D402):** Bits 0–7 (least significant byte)
  - **PWHI1 ($D403):** Bits 0–3 (most significant nibble)

  The pulse width value ranges from 0 to 4095, corresponding to a duty cycle from 0% to 100%.

- **Voice 1 Control Register ($D404):** This register controls various aspects of voice 1, including gating, synchronization, modulation, testing, and waveform selection. The bit allocation is as follows:


**Reading Fire Buttons and Joystick/Keyboard Conflict**

To read the state of a joystick fire button in BASIC, you can PEEK the CIA#1 Data Port B and mask the result to isolate bit 4. The following example demonstrates this:


In this code, `T1` will be 0 when the button is pressed and 1 when it is not.

It's important to note that CIA#1 Data Port B is shared between keyboard scanning and joystick 1 inputs. This overlap can lead to ambiguity, as pressing certain keys or moving the joystick can affect the same bits, making it challenging to distinguish between keyboard and joystick inputs.

## Source Code

  ```
  FREQUENCY = REGISTER_VALUE * CLOCK / 16777216
  ```

  ```
  Bit 7: Noise Waveform (1 = enable)
  Bit 6: Pulse Waveform (1 = enable)
  Bit 5: Sawtooth Waveform (1 = enable)
  Bit 4: Triangle Waveform (1 = enable)
  Bit 3: Test (1 = enable test mode)
  Bit 2: Ring Modulation (1 = enable)
  Bit 1: Synchronization (1 = enable)
  Bit 0: Gate (1 = start attack/decay/sustain cycle; 0 = start release cycle)
  ```

```basic
10 REM Read fire button
20 T1 = (PEEK(56321) AND 16) / 16
30 PRINT T1
```


```text
SID Registers (Voice 1)
$D400 - FRELO1    ; Frequency low byte (voice 1)
$D401 - FREHI1    ; Frequency high byte (voice 1)
$D402 - PWLO1     ; Pulse width low byte (voice 1)
$D403 - PWHI1     ; Pulse width high byte (voice 1)
$D404 - CON1      ; Voice 1 control register (gate/sync/ring/test/wave select)

Frequency Formula
FREQUENCY = REGISTER_VALUE * CLOCK / 16777216

Pulse Width
- 12-bit value across PWLO1/PWHI1 selecting pulse duty (higher → longer high time)
```

```basic
10 REM Read fire button
20 T1 = (PEEK(56321) AND 16) / 16
30 PRINT T1
```

```text
CIA#1 Relevant Addresses (Decimal and Hex)
56320 = $DC00  ; CIA#1 base (Data Port A)
56321 = $DC01  ; CIA#1 Data Port B (used for keyboard + joystick 1)
```

## Key Registers

- **$D400–$D404:** SID Voice 1 registers, including frequency (FRELO1/FREHI1), pulse width (PWLO1/PWHI1), and control register (CON1).
- **$DC00–$DC0F:** CIA#1 I/O registers, including Data Ports, timers, and IRQ control. Notably, Data Port B ($DC01 / 56321) is used for keyboard scanning and joystick 1 inputs.

## References

- "sid_envelope_controls_and_adsr" — expands on ADSR/envelope registers and control for each SID voice

## Labels
- FRELO1
- FREHI1
- PWLO1
- PWHI1
- CON1
