# CAS1 ($C0) — Tape Motor Interlock

**Summary:** CAS1 ($00C0) is a KERNAL-maintained byte used as the tape motor interlock; the IRQ keyboard-scan routine (runs ~60 Hz) checks it and may clear Bit 5 of location 1 ($0001) to 0 to turn the cassette motor on. Software must set CAS1 nonzero after a button press to prevent the IRQ from overriding software motor control.

**Description**

CAS1 at $00C0 (decimal 192) is maintained by the IRQ routine that scans the keyboard and cassette buttons. Behavior:

- When a recorder button is pressed, the IRQ checks CAS1. If CAS1 contains 0, the IRQ turns the motor on by clearing Bit 5 of location 1 ($0001) (Bit 5 = 0 => motor on).
- When the button is released, the IRQ turns the motor off and sets CAS1 to 0.
- Because the IRQ runs ~60 times per second, any software attempt to force or keep the motor bit in a particular state will be repeatedly overridden while CAS1 remains 0 and a button state exists.
- To reliably control the motor from software after a button press, set CAS1 to a nonzero value so the IRQ will not forcibly reassert the motor bit.

(Short parenthetical: location 1 = processor port $0001.)

## Source Code

```text
; ASCII representation of the processor port ($0001) bit layout
; Bit 7  6  5  4  3  2  1  0
;     |  |  |  |  |  |  |  |
;     |  |  |  |  |  |  |  +-- Memory configuration bit 0
;     |  |  |  |  |  |  +----- Memory configuration bit 1
;     |  |  |  |  |  +-------- Memory configuration bit 2
;     |  |  |  |  +----------- Cassette data output
;     |  |  |  +-------------- Cassette switch sense (0 = button pressed)
;     |  |  +----------------- Cassette motor control (0 = motor on)
;     |  +-------------------- Not used
;     +----------------------- Not used
```

## Key Registers

- $00C0 - KERNAL variable - CAS1: Tape motor interlock checked by IRQ keyboard-scan (0 = IRQ may drive motor; nonzero = allow software control)
- $0001 - CPU port - Bit 5 controls cassette motor (0 = motor on, 1 = motor off)

## References

- "tape_input_byte_buffer_mych" — expands on how CAS1 affects tape hardware readiness while MYCH handles data bytes
- "cassette_block_count_fsblk" — expands on how CAS1 interacts with tape read/write block counting (FSBLK)

## Labels
- CAS1
