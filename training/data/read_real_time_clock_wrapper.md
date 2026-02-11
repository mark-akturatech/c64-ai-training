# ROM wrapper at $FFDE — JMP to $F6DD (read real time clock)

**Summary:** ROM vector at $FFDE contains a JMP to $F6DD — a wrapper entry for the real time clock routine. The routine at $F6DD returns the time in jiffies in AXY (A = least significant byte).

**Description**
This ROM entry is a single-instruction wrapper. Invoking the routine at $FFDE transfers execution to $F6DD, which implements the "read real time clock" service. The service returns the current time measured in jiffies across the registers A:XY, with the accumulator holding the least significant byte.

The routine at $F6DD reads the system's real-time clock, which is maintained by an interrupt routine that updates the clock every 1/60th of a second. The clock's value is stored in three consecutive zero-page locations:

- $A0: Most significant byte
- $A1: Middle byte
- $A2: Least significant byte

The routine disables interrupts to ensure a consistent read of the multi-byte clock value. It then loads the values from these memory locations into the Y, X, and A registers, respectively, and re-enables interrupts before returning.

## Source Code
```asm
.,FFDE 4C DD F6    JMP $F6DD       ; read real time clock

; Implementation of the real_time_clock routine at $F6DD
F6DD 78          SEI             ; Disable interrupts
F6DE A5 A2       LDA $A2         ; Load least significant byte into A
F6E0 A6 A1       LDX $A1         ; Load middle byte into X
F6E2 A4 A0       LDY $A0         ; Load most significant byte into Y
F6E4 58          CLI             ; Enable interrupts
F6E5 60          RTS             ; Return from subroutine
```

## Key Registers
- $FFDE - ROM - wrapper JMP to $F6DD (read real time clock)
- $F6DD - ROM - real_time_clock routine

## References
- "real_time_clock" — F6DD read routine
- Commodore 64 KERNAL API documentation
- Commodore 64 Programmer's Reference Guide