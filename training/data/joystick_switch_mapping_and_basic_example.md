# Joystick wiring to CIA port bits ($DC00/$DC01) — C64

**Summary:** Joystick switches (Up, Down, Left, Right, Fire) are wired to the lower 5 bits of CIA port data ($DC00 / $DC01). Read with PEEK(56320) / PEEK(56321) (CIA1 port A/B), bits are 1 when open and 0 when closed; common BASIC bit masks shown.

## Mapping and behaviour
The five joystick switches are sampled on the lower 5 bits of the CIA port byte at $DC00 (decimal 56320) for joystick 1 and $DC01 (decimal 56321) for joystick 2. Each switch pulls its bit low when pressed (closed); the bit reads 1 when the switch is open (no press).

Canonical bit-to-switch mapping (bit mask values shown in decimal and hex):
- Bit 0 = 1 (mask 1 / $01)  — Right
- Bit 1 = 2 (mask 2 / $02)  — Left
- Bit 2 = 4 (mask 4 / $04)  — Down
- Bit 3 = 8 (mask 8 / $08)  — Up
- Bit 4 = 16 (mask 16 / $10) — Fire

So a value of 31 ($1F) means no switches pressed; a value with any of the above bits cleared to 0 indicates the corresponding direction/button is pressed.

Reading notes:
- Use PEEK(56320) to read joystick port 1; use PEEK(56321) to read joystick port 2.
- Mask with AND 31 (decimal) or AND $1F to isolate the five joystick bits: value = PEEK(addr) AND 31.
- Test a direction/button by checking if (value AND mask) = 0 (pressed) or <> 0 (released).

## Source Code
```basic
10 REM SIMPLE JOYSTICK READER FOR JOYSTICK 1 (PEEK(56320))
20 A = PEEK(56320) AND 31   : REM mask lower 5 bits
30 IF A AND 1 = 0 THEN PRINT "RIGHT"
40 IF A AND 2 = 0 THEN PRINT "LEFT"
50 IF A AND 4 = 0 THEN PRINT "DOWN"
60 IF A AND 8 = 0 THEN PRINT "UP"
70 IF A AND 16 = 0 THEN PRINT "FIRE"
80 GOTO 20
```

```basic
10 REM JOYSTICK POLL SUBROUTINE (CALL JREAD)
20 REM RETURNS J% = bitfield (0=pressed) in bits 0-4, use masks 1,2,4,8,16
30 REM For joystick 1: addr = 56320, joystick 2: addr = 56321
100 JREAD:
110 A = PEEK(56320) AND 31  : REM change to 56321 for joystick 2
120 J% = A
130 RETURN
```

```text
Register reference (extract):
$DC00 (56320) - CIA1 Port A - joystick 1 inputs on bits 0-4 (LSB..bit4)
$DC01 (56321) - CIA1 Port B - joystick 2 inputs on bits 0-4 (LSB..bit4)
Bits: b0=Right (1), b1=Left (2), b2=Down (4), b3=Up (8), b4=Fire (16)
Note: bits read '1' when switch open, '0' when switch closed (active low).
```

## Key Registers
- $DC00-$DC01 - CIA1 - Joystick inputs (lower 5 bits: Right, Left, Down, Up, Fire) — read via PEEK(56320)/PEEK(56321)

## References
- "joystick_examples_basic_and_assembly" — BASIC and assembly joystick examples

## Labels
- $DC00
- $DC01
