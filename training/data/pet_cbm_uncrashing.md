# MACHINE - PET/CBM Uncrashing Procedure (Later Models)

**Summary:** Procedure to recover from system crashes on later-model Commodore PET/CBM computers by utilizing hardware modifications involving the Parallel User Port (PUP) and the system's reset circuitry.

**Procedure**

Original ROM PETs cannot be uncrashed using this method. Later PET/CBM models can be recovered from a crash with the following hardware additions:

**Hardware Required:**

- A toggle switch wired between the Parallel User Port (PUP) diagnostic-sense line (pin 5) and ground (PUP pin 12).
- A momentary pushbutton that connects to the system's reset line, preferably triggering the power-on reset one-shot circuit (often a 555 timer) via a resistor to avoid directly shorting the reset node.

**Step-by-Step:**

1. **Install the Toggle Switch:**
   - Connect one terminal of the toggle switch to PUP pin 5 (diagnostic sense).
   - Connect the other terminal to PUP pin 12 (ground).

2. **Install the Momentary Pushbutton:**
   - Identify the reset one-shot circuit on the PET/CBM motherboard.
   - Locate the trigger input of the 555 timer (pin 2).
   - Connect one terminal of the pushbutton to this trigger input through a series resistor (recommended value: 10 kΩ).
   - Connect the other terminal of the pushbutton to ground.

3. **Uncrashing Procedure:**
   - Set the toggle switch to the ON position (connecting diagnostic-sense to ground).
   - Press and release the momentary pushbutton to trigger the reset one-shot.
   - The machine should enter the machine-language monitor.

4. **Return to BASIC:**
   - Set the toggle switch to the OFF position (disconnecting diagnostic-sense from ground).
   - In the monitor, type `.X` and press RETURN to return to BASIC.
   - Once in BASIC, issue the command `CLR` or type `.;` followed by RETURN.

5. **Post-Recovery:**
   - Investigate any issues promptly.
   - Reset the computer to its normal operating state.

**Notes and Warnings**

- **Technical Expertise Required:** Modifying the PET/CBM hardware requires familiarity with the motherboard and safe handling of electronic components. Seek assistance from someone experienced in computer hardware modifications.
- **Reset Circuit Details:** Later-model PET/CBM computers utilize a 555 timer configured as a monostable multivibrator (one-shot) for the power-on reset circuit. The 555 timer's pinout is as follows:
  - Pin 1: Ground
  - Pin 2: Trigger
  - Pin 3: Output
  - Pin 4: Reset
  - Pin 5: Control Voltage
  - Pin 6: Threshold
  - Pin 7: Discharge
  - Pin 8: VCC
- **Resistor Value:** A 10 kΩ resistor is recommended between the pushbutton and the 555 timer's trigger input to prevent directly shorting the reset line.
- **Model Compatibility:** This uncrashing procedure is applicable to later PET/CBM models equipped with the 555 timer reset circuit. Original ROM PETs lack this circuitry and cannot be uncrashed using this method.
- **System Stability:** After recovery, the system may remain unstable until the `CLR` or `.;` + RETURN sequence is performed, followed by resetting the computer to its normal state.

## Source Code

```text
Wiring Diagram:

Parallel User Port (PUP) Connector:
  +-------------------------------+
  |  1  2  3  4  5  6  7  8  9 10 |
  | 11 12 13 14 15 16 17 18 19 20 |
  +-------------------------------+

Toggle Switch:
  - One terminal to PUP pin 5 (Diagnostic Sense)
  - Other terminal to PUP pin 12 (Ground)

Momentary Pushbutton:
  - One terminal to 555 Timer Pin 2 (Trigger) via 10 kΩ resistor
  - Other terminal to Ground

555 Timer Pinout:
  +--------+
  | 1  2  3 |
  | 4  5  6 |
  | 7  8    |
  +--------+
  Pins:
  1 - GND
  2 - Trigger
  3 - Output
  4 - Reset
  5 - Control Voltage
  6 - Threshold
  7 - Discharge
  8 - VCC
```

## Key Registers

- **PUP Pin 5:** Diagnostic Sense Line
- **PUP Pin 12:** Ground
- **555 Timer Pin 2:** Trigger Input

## References

- "uncrashing_overview" — General uncrashing strategies and broader context
- Commodore PET 8032 Schematic Diagram
- 555 Timer IC Datasheet