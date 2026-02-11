# $DC01 — CIAPRB (CIA 1 Data Port Register B)

**Summary:** $DC01 (CIAPRB) on CIA1 is the C64 Data Port Register B used to read keyboard matrix rows (0–7), joystick 1 directions, and paddle fire buttons; bits 6 and 7 can also be configured as timer-driven toggle/pulse outputs for Timer A and Timer B.

## Description
CIAPRB ($DC01) presents the state of Port B lines on CIA1. On a stock C64 these lines are wired into the keyboard matrix rows and joystick/paddle lines so that reading $DC01 returns the sampled inputs for keyboard row 0–7 and joystick 1 / paddle fire switches as shown in the bit map. Bits 6 and 7 have dual use: they normally read keyboard row 6/7 but can be driven by CIA timers to produce toggled or pulsed outputs (Timer A -> bit 6, Timer B -> bit 7).

For the complementary Port A mapping (columns, drive lines), see the companion CIAPRA register documentation.

## Source Code
```text
$DC01        CIAPRB       Data Port Register B

                     0    Read keyboard row 0.
                          Read joystick 1 up direction
                     1    Read keyboard row 1.
                          Read joystick 1 down direction
                     2    Read keyboard row 2.
                          Read joystick 1 left direction.
                          Read paddle 1 fire button
                     3    Read keyboard row 3.
                          Read joystick 1 right direction.
                          Read paddle 2 fire button
                     4    Read keyboard row 4.
                          Read joystick 1 fire button
                     5    Read keyboard row 5
                     6    Read keyboard row 6.
                          Toggle or pulse data output for Timer A
                     7    Read keyboard row 7.
                          Toggle or pulse data output for Timer B
```

## Key Registers
- $DC01 - CIA 1 - Data Port Register B (keyboard rows 0–7, joystick 1 directions, paddle fire buttons, Timer A/B toggle outputs on bits 6/7)

## References
- "ciapra_data_port_register_a" — companion port A mapping for keyboard matrix and joystick mapping

## Labels
- CIAPRB
