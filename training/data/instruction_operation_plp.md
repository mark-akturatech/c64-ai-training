# PLP (Pull Processor Status) — pseudocode and implementation notes

**Summary:** PLP pops a byte from the hardware stack ($0100 + S) and restores the processor status register (SR / P) using SET_SR; related terms: PULL, SET_SR, stack pointer (S), processor status flags (N V - B D I Z C), opcode $28, 4 cycles.

**Operation**
PLP (Pull Processor Status) restores the processor status from the stack. The minimal pseudocode from the source:

    src = PULL();
    SET_SR((src));

- **PULL:** Increment the 8-bit stack pointer S, then read the byte at $0100 + S and return it. (Stack grows downward on push; pop increments S then reads.)
- **SET_SR:** Copy the pulled byte into the internal status register P but handle the break/unused bits per 6502 behavior:
  - **Bit layout:** N (0x80), V (0x40), unused (0x20), B (0x10), D (0x08), I (0x04), Z (0x02), C (0x01).
  - **Handling of Break (B) and unused bits:**
    - The Break (B) bit (bit 4, 0x10) is set when the processor pushes the status register onto the stack during a BRK instruction or an interrupt. However, the internal processor status register does not store the B bit; it is used only during the interrupt sequence to distinguish between a BRK instruction and a hardware interrupt. Therefore, when pulling the status register with PLP, the B bit should be cleared. ([syncopate.us](https://syncopate.us/articles/2024/b29c?utm_source=openai))
    - The unused bit (bit 5, 0x20) is typically read as 1. ([syncopate.us](https://syncopate.us/articles/2024/b29c?utm_source=openai))
    - Emulators and reference implementations typically force the unused bit to 1 and clear the Break flag bit in the internal P. That is, P = (pulled_value & ~0x10) | 0x20.
  - **SET_SR must also update any per-flag variables (N, V, D, I, Z, C) used by the emulator core so subsequent operations observe the new flags.** For example, PLP can clear/set the I flag, enabling/disabling IRQs.

**Effects and notes:**
- PLP affects N, V, D, I, Z, C as loaded from the pulled byte.
- The Break (B) bit is a software flag used when pushing (PHP) and is handled specially; the internal processor status typically does not keep B as a hardware state.
- The unused bit (bit 5) is normally read as 1.
- **Opcode:** $28, **Addressing:** implied, **Bytes:** 1, **Cycles:** 4. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))
- PLP typically restores whatever PHP previously pushed (PHP pushes P with B set), but SET_SR must mask/force bits as above.

## Source Code
```c
/* Suggested emulator implementation (C-like pseudocode). */

/* Read from RAM (implementation-specific) */
uint8_t read_ram(uint16_t addr);

/* 8-bit stack pointer register S, 8-bit processor status P */
/* Flag variables (optional per-emulator): N_flag, V_flag, D_flag, I_flag, Z_flag, C_flag */

static inline uint8_t PULL(void) {
    /* Increment stack pointer, then read from $0100 + S */
    S = (uint8_t)(S + 1);
    return read_ram(0x0100 | S);
}

/* SET_SR: load pulled byte into P, but:
   - Clear Break flag bit (0x10)
   - Force unused bit (0x20) = 1
   - Update per-flag state if emulator tracks them separately */
static inline void SET_SR(uint8_t v) {
    P = (uint8_t)((v & ~0x10) | 0x20);  /* mask out B, force unused bit */

    /* update per-flag booleans if emulator tracks them separately */
    N_flag = (P & 0x80) ? 1 : 0;
    V_flag = (P & 0x40) ? 1 : 0;
    D_flag = (P & 0x08) ? 1 : 0;
    I_flag = (P & 0x04) ? 1 : 0;
    Z_flag = (P & 0x02) ? 1 : 0;
    C_flag = (P & 0x01) ? 1 : 0;
}

/* PLP opcode handler (opcode $28, 4 cycles) */
case 0x28:
{
    uint8_t src = PULL();
    SET_SR(src);
    cycles_remaining -= 4;
}
break;
```

## References
- "instruction_tables_plp" — expands on PLP opcode and timing details
- ([syncopate.us](https://syncopate.us/articles/2024/b29c?utm_source=openai))
- ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## Mnemonics
- PLP
