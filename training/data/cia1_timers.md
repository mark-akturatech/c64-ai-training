# CIA #1 Timers — $DC04-$DC07

**Summary:** CIA #1 contains two 16-bit timers used for system timing and interrupts: Timer A at $DC04-$DC05 and Timer B at $DC06-$DC07. These are read/write 16-bit counters (low byte then high byte) used by the OS and programs for timed events and IRQ/level signalling.

## Description
CIA #1 provides two independent 16-bit counters:
- Timer A — $DC04 (low), $DC05 (high): 16-bit read/write timer/counter frequently used for periodic interrupts and timing.
- Timer B — $DC06 (low), $DC07 (high): 16-bit read/write timer/counter used for additional timing or event counting and interrupts.

Both timers can be started, stopped, loaded, and configured via the CIA control registers (see related documentation). They generate interrupt requests when they underflow (count from $0000 to $FFFF) if interrupts are enabled. (Low byte then high byte)

## Source Code
```text
Timers:

$DC04-$DC05  Timer A            16-bit timer counter (read/write)
$DC06-$DC07  Timer B            16-bit timer counter (read/write)
```

## Key Registers
- $DC04-$DC05 - CIA 1 - Timer A 16-bit counter (low byte at $DC04, high byte at $DC05)
- $DC06-$DC07 - CIA 1 - Timer B 16-bit counter (low byte at $DC06, high byte at $DC07)

## References
- "cia1_port_control" — expands on CIA#1 port/timer interactions