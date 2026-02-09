# CIA #1 — $DC01 Data Port B and $DC02-$DC07 (DDR A/B, Timer A/B)

**Summary:** CIA #1 registers $DC01 (Data Port B — keyboard rows, joystick 1, paddles, Timer A/B outputs), $DC02/$DC03 (Data Direction Registers Port A/B), and $DC04-$DC07 (Timer A low/high, Timer B low/high). Includes C64 absolute addresses and brief role mapping for keyboard scanning and game port 1.

## Description
CIA #1 Port B ($DC01) is the primary input for the C64 keyboard row reads and Game Port 1 (joystick 1 and paddles). The same Port B pins also present the Timer A and Timer B pulse/toggle outputs when configured. Ports A/B each have a corresponding Data Direction Register (DDR) at $DC02/$DC03 that control input/output direction. Timers A and B are 16-bit (low/high) little-endian at $DC04/$DC07.

- Port B is used by the keyboard matrix scan: the currently driven keyboard row is read back on Data Port B.
- Game Port 1 signals (joystick 1 directions and fire, paddle fire) share Port B bits.
- Timer outputs appear on specific Port B bit(s) when configured as timer output mode.

(For full bit mappings and register offsets, see the Source Code section.)

## Source Code
```text
   HEX      DECIMAL        BITS                 DESCRIPTION
  -------------------------------------------------------------------------

  DC01       56321                 Data Port B (Keyboard, Joystick,
                                     Paddles): Game Port 1
                            7-0    Read Keyboard Row Values for Keyboard
                                     Scan
                            7      Timer B Toggle/Pulse Output
                            6      Timer A: Toggle/Pulse Output
                            4      Joystick 1 Fire Button: 1 = Fire
                            3-2    Paddle Fire Buttons
                            3-0    Joystick 1 Direction

  DC02       56322                 Data Direction Register - Port A (56320)
  DC03       56323                 Data Direction Register - Port B (56321)
  DC04       56324                 Timer A: Low-Byte
  DC05       56325                 Timer A: High-Byte
  DC06       56326                 Timer B: Low-Byte
  DC07       56327                 Timer B: High-Byte
```

## Key Registers
- $DC01-$DC07 - CIA #1 - Data Port B (keyboard/joystick/paddles/timer outputs), DDR A/B, Timer A low/high, Timer B low/high

## References
- "color_ram_and_cia1_dc00_port_a" — expands on Port A and general CIA #1 mapping
- "cia1_time_of_day_and_interrupts" — expands on time-of-day, serial buffer and interrupt control registers