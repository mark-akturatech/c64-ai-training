# $DC00 CIAPRA — CIA #1 Data Port Register A (Keyboard / Joystick / Paddle select)

**Summary:** $DC00 (CIA1 Data Port A) selects keyboard matrix columns and also provides joystick 2 directions and paddle/fire button select bits; bits 6–7 choose which paddles the SID reads (Port A vs Port B). Includes keyboard column selects, joystick-2 directional inputs, and paddle fire inputs; related SID paddle registers: $D419-$D41A.

## Description
CIA #1 Data Port A is used for keyboard matrix column selection and multiplexed gameport/paddle inputs. Writing/reading this port affects which keyboard column is selected for row reads, and certain bits reflect joystick 2 directions and paddle fire switches. Bits 6 and 7 additionally act as selectors that determine whether the SID reads paddle values from Port A or Port B (see SID paddle registers $D419-$D41A for analog potentiometer capture).

The per-bit mapping is provided in the reference register map below.

## Source Code
```text
$DC00        CIAPRA       Data Port Register A

                     Bit 0  Select to read keyboard column 0.
                            Read joystick 2 up direction
                     Bit 1  Select to read keyboard column 1.
                            Read joystick 2 down direction
                     Bit 2  Select to read keyboard column 2.
                            Read joystick 2 left direction.
                            Read paddle 1 fire button
                     Bit 3  Select to read keyboard column 3.
                            Read joystick 2 right direction.
                            Read paddle 2 fire button
                     Bit 4  Select to read keyboard column 4.
                            Read joystick 2 fire button
                     Bit 5  Select to read keyboard column 5
                     Bit 6  Select to read keyboard column 6.
                            Select to read paddles on Port A or B
                     Bit 7  Select to read keyboard column 7.
                            Select to read paddles on Port A or B
```

## Key Registers
- $DC00 - CIA 1 - Data Port A (keyboard column selects, joystick 2 directions, paddle/fire select; controls which paddles SID reads)

## References
- "cia1_data_ports_keyboard_matrix_and_layout" — expands on writing column selects and reading rows
- "potx_poty_register_labels" — expands on Paddle inputs read via SID registers ($D419-$D41A) after selecting port via CIA

## Labels
- CIAPRA
