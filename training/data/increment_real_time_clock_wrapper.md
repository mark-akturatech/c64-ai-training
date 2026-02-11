# KERNAL: Increment Real Time Clock Wrapper at $FFEA

**Summary:** KERNAL entry at $FFEA is a JMP to $F69B that increments the real time clock (RTC). Called from the system IRQ every 1/60s; user programs that handle IRQs must call this routine to keep the clock and STOP key behavior updated.

## Description
This ROM entry is a minimal wrapper that transfers execution to the RTC increment routine. The wrapper exists so other code (notably the KERNAL IRQ handler) can call a fixed vector ($FFEA) to update the system clock once per 1/60th of a second.

Behavior and usage notes:
- The instruction at $FFEA performs an absolute JMP to $F69B where the actual clock increment implementation resides.
- The KERNAL's normal IRQ handler calls this entry every 1/60s to advance the real time clock.
- If a user program replaces or services interrupts itself (handles IRQs), it must explicitly call this routine to keep the system clock advancing.
- The source comments also note that the STOP key routine must be invoked if the STOP key is to remain functional (STOP handling is part of KERNAL interrupt-related housekeeping).

(IRQ = hardware interrupt.)

## Source Code
```asm
; KERNAL ROM wrapper: JMP to real-time-clock increment routine
; Address  Bytes       Instruction
; $FFEA    4C 9B F6   JMP $F69B    ; increment real time clock

.,FFEA  4C 9B F6    JMP $F69B       ; increment real time clock
```

## References
- "real_time_clock" — expands on the clock increment implementation at $F69B (external)
