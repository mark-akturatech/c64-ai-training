# CIA #2 Timer Registers ($DD04-$DD07)

**Summary:** $DD04-$DD07 are the CIA (6526) #2 Timer A and Timer B low/high bytes (16-bit little-endian timer latches). The C64 OS uses CIA #2 timers for RS-232 send/receive timing; the Serial Bus uses CIA #1 Timer B.

## Description
These four consecutive registers hold the low and high bytes for CIA #2 Timer A and Timer B. Each timer is programmed by writing the low byte and high byte to the corresponding pair of registers, forming a 16-bit timer value (low byte first).

The entry for CIA #1 timer registers at $DC04-$DC07 contains the detailed description of timer operation and control bits; the same timer mechanism applies to CIA #2. Control and start/stop behavior for each timer are defined in the CIA control registers (see related control-register documentation).

Operational notes from the OS:
- The Commodore 64 Operating System uses CIA #2 Timers A and B primarily for RS-232 send and receive timing.
- The Serial Bus timing routines use CIA #1 Timer B (not CIA #2).

(See referenced chunks for exact control-bit definitions and examples.)

## Key Registers
- $DD04-$DD07 - CIA #2 - Timer A low, Timer A high, Timer B low, Timer B high (16-bit timer latches, low byte first)

## References
- "dd04_dd07_timer_registers_list" — expands on exact register names and addresses for each timer byte  
- "dd0e_ci2cra_control_register_a" — expands on Control bits relating to starting, mode, and input source for Timer A  
- Note in source: "See Location Range 56324-56327 ($DC04-$DC07)" — CIA #1 timer register entry (detailed timer operation)