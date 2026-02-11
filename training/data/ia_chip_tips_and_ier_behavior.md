# IA chip interrupt quirks (IER, read vs write semantics)

**Summary:** Many IA/6526-style registers (interrupt enable/status) behave differently on read vs write; the IER often uses the high bit to select “set” vs “clear” behavior. Example C64 use: store $7F to $DC0D to disable interrupts, store $81 to re-enable. Avoid careless POKE-based disables — keyboard and other I/O can be affected.

**Read vs write semantics (concise)**
- Several IA-chip registers present different meanings for reads and writes: a read typically returns status/flags set by hardware events; a write often performs actions (clear flags, arm/disarm sources, toggle control bits).
- Interrupt flags are commonly cleared by writing specific values rather than by writing zero; the written bits may be interpreted as “clear these flags” or “set these flags” depending on a control bit.
- The IER (Interrupt Enable Register) convention used by many IA-style chips: the high bit of the written byte selects the operation:
  - high bit = 1: the low 7 bits are “enable these interrupts” (set bits).
  - high bit = 0: the low 7 bits are “disable these interrupts” (clear bits).
- This makes values like $7F (binary 0 1111111) act as “clear/disable these seven interrupt-enables”, while $81 (binary 1 0000001) acts as “set/enable bit0”.
- Because of the inverted/typed action, stores that look like they would “turn bits on” may in fact clear them when the high bit is 0; read the chip’s spec carefully.

**Practical caution**
- Disabling interrupts by direct POKE/STA can have system-wide effects (keyboard scanning, CIA timers, serial bus handling). On a running C64, turning off interrupts carelessly can disable keyboard input and other system services.
- When changing IER bits, prefer:
  - read-modify-write sequences that preserve unrelated bits, or
  - perform changes while the system is in a controlled state (e.g., in a known interrupt-safe context).
- Verify exact register offset for your machine (C64 vs VIC-20 vs PET) before writing; different models map IA chip registers differently.

## Source Code
```basic
10 REM C64 example (decimal addresses)
20 POKE 56333,127  : REM POKE $DC0D, $7F  (disable interrupts)
30 POKE 56333,129  : REM POKE $DC0D, $81  (re-enable interrupts)
```

```asm
; Assembler example (C64)
    LDA #$7F
    STA $DC0D      ; store $7F to CIA IER to disable interrupts

    LDA #$81
    STA $DC0D      ; store $81 to re-enable specific interrupt(s)
```

## Key Registers
- $DC0D - CIA 1 Interrupt Enable Register (IER)

## References
- "interrupts_intro_and_irq_vectors" — Addresses and POKE examples for disabling interrupts

## Labels
- IER
