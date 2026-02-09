# CIA #1 Port Control — $DC00-$DC03 (Keyboard matrix & Joysticks)

**Summary:** CIA #1 port control registers $DC00-$DC03 on the C64 map the keyboard matrix and the two joysticks. $DC00 = Port A (keyboard matrix & joystick #2), $DC01 = Port B (keyboard rows & joystick #1), $DC02/$DC03 = Port A/B DDRs (data direction registers; 1 = output, 0 = input).

## Port register descriptions
CIA #1 (Complex Interface Adapter) occupies $DC00-$DCFF; the low four registers control the keyboard matrix and joysticks:

- $DC00 — Port A  
  - Used for keyboard matrix lines and joystick #2 inputs/outputs.
- $DC01 — Port B  
  - Used for keyboard matrix rows and joystick #1 inputs/outputs.
- $DC02 — Port A Data Direction Register (DDR)  
  - Selects direction per bit for Port A (1 = output, 0 = input).
- $DC03 — Port B Data Direction Register (DDR)  
  - Selects direction per bit for Port B (1 = output, 0 = input).

These registers are used by the kernel and I/O code to drive/select keyboard columns and read keyboard rows, and to interface the two joystick ports connected to the CIA lines. Detailed keyboard matrix mapping and zero-page port mappings are documented elsewhere.

## Source Code
```text
CIA #1: Complex Interface Adapter ($DC00-$DCFF)

Port Control:

$DC00   Port A                  Keyboard matrix and joystick #2
$DC01   Port B                  Keyboard matrix rows and joystick #1
$DC02   Port A DDR              Data direction register for Port A
$DC03   Port B DDR              Data direction register for Port B
```

## Key Registers
- $DC00-$DC03 - CIA 1 - Port A/Port B and Data Direction Registers (keyboard matrix & joysticks)

## References
- "keyboard_control_and_cursor_state" — expands on keyboard matrix and port mapping in zero page