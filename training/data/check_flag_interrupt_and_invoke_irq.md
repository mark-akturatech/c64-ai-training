# CIA1 ICR FLAG check and IRQ entry (ROM $F91A)

**Summary:** Checks CIA1 Interrupt Control Register ($DC0D) for the FLAG interrupt (mask #$10). If set, pushes a crafted return address (high $F9, low $2A) onto the stack and jumps to the common IRQ entry ($FF43); otherwise clears the interrupt inhibit (CLI) and returns (RTS).

## Description
This small ROM routine polls the CIA1 Interrupt Control Register (ICR) at $DC0D for the FLAG interrupt bit (mask #$10). Behavior:

- Read $DC0D (CIA1 ICR) and AND with #$10 to test the FLAG bit.
- If the FLAG bit is clear, the routine enables interrupts with CLI and returns with RTS.
- If the FLAG bit is set, the code pushes two immediate bytes onto the stack (A = #$F9 then A = #$2A), then performs an unconditional jump to $FF43. The pushed bytes form a crafted return address that the common IRQ-handling entry will use when saving/restoring state and completing the IRQ service sequence.
- The common IRQ entry at $FF43 is used here to centralize IRQ save/state and handling logic (see referenced IRQ-handling chunk).

(No code or register bit-layout is repeated here; the assembly listing is preserved in Source Code for retrieval.)

## Source Code
```asm
.,F91A AD 0D DC LDA $DC0D       read VIA 1 ICR
.,F91D 29 10    AND #$10        mask 000x 0000, FLAG interrupt
.,F91F F0 09    BEQ $F92A       if no FLAG interrupt just exit
                                else first call the IRQ routine
.,F921 A9 F9    LDA #$F9        set the return address high byte
.,F923 48       PHA             push the return address high byte
.,F924 A9 2A    LDA #$2A        set the return address low byte
.,F926 48       PHA             push the return address low byte
.,F927 4C 43 FF JMP $FF43       save the status and do the IRQ routine
.,F92A 58       CLI             enable interrupts
.,F92B 60       RTS             
```

## Key Registers
- $DC00-$DC0F - CIA 1 - timer/port/interrupt registers (ICR at $DC0D)

## References
- "set_tape_timing_constants_prepare_via_timers" — expands on runs after timing constants and timer reads
- "irq_routine_read_t2c_and_compute_difference" — expands on FLAG interrupt handling routes execution to the IRQ routine