# CIA1 Data Port B: Keyboard vs Joystick 1 (keyboard/joystick confusion)

**Summary:** CIA1 Data Port B ($DC01) shares lines with the keyboard matrix and joystick 1; this can cause false joystick readings to appear as keypresses (and vice versa). Workarounds: temporarily disable the CIA key-scan/interrupts (POKE 56333,127 / POKE 56320,255 ; restore with POKE 56333,129) or clear the keyboard buffer (POKE 198,0). Many programs avoid the conflict by using controller port 2 (CIA2).

## Problem
CIA #1 is used for the keyboard matrix and for reads from joystick port 1. Because the same CIA port lines are multiplexed for both functions, a joystick movement or fire-button can be interpreted as a keypress, and keyboard activity can produce spurious joystick bits. Mistaking the keyboard for the joystick can be addressed; mistaking the joystick for a keypress is harder because there is no single "turn off joystick" control.

## Solutions
- Temporarily disable the CIA key-scan/interrupt activity around the joystick read, then restore it. The original sequence (decimal addresses) is:
  - POKE 56333,127 : POKE 56320,255  (do joystick read(s))
  - POKE 56333,129  (restore)
  - (56333 = $DC0D, CIA1 Interrupt Control Register; 56320 = $DC00, CIA1 Port A)
- Simpler alternative in some cases: clear the keyboard buffer immediately after reading the joystick to remove false key events:
  - POKE 198,0
- To avoid the problem entirely, many commercial titles read joystick 1 from controller port 2 (CIA2) instead of port 1 (CIA1).

## Source Code
```basic
10 REM Disable keyscan/interrupts, then read joystick, then restore
20 POKE 56333,127 : POKE 56320,255
30 REM read joystick here, e.g. STICK = PEEK(56321)
40 POKE 56333,129
50 REM Alternatively clear keyboard buffer after reading joystick
60 POKE 198,0

REM Notes:
REM 56333 = $DC0D (CIA1 ICR), 56320 = $DC00 (CIA1 Port A)
```

## Key Registers
- $DC00-$DC0F - CIA 1 - keyboard matrix, joystick 1 (Data Port A/B, DDRs, ICR, timers)
- $DD00-$DD0F - CIA 2 - controller port 2 (used by many programs to avoid CIA1 conflict)

## References
- "reading_joystick_fire_buttons" — expands on reading joystick trigger bits
- "ciaicr_interrupt_control" — expands on manipulating CIA interrupt mask while disabling keyscan