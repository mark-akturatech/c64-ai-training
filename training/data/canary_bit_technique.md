# Minimal C64 Datasette get_byte — canary-bit technique

**Summary:** Canary-bit method for a C64 datasette get_byte routine: initialize the accumulator with a 0 in bit7 (LDA #%01111111 / $7F) and shift incoming bits in with ROR so the canary (0) is shifted into the carry after 8 data bits, signaling completion without an explicit counter. Search terms: canary bit, get_byte, ROR, carry flag, LDA #%01111111.

## Description
This chunk documents the "canary bit" technique used by minimal cassette/get_byte routines to detect when 8 bits have been shifted in without maintaining a separate bit counter.

- Initialization: load the accumulator with %01111111 (hex $7F). That places a single 0 in bit7 and ones in bits6..0 — the single zero is the canary.
- Per-bit operation: for each incoming serial bit, arrange for the bit to be placed into the processor Carry, then execute ROR A. ROR shifts the accumulator right one bit: Carry -> bit7, bit0 -> Carry. Each ROR thus shifts the contents of A one position toward bit0; the canary (original bit7=0) moves right one position per ROR.
- Completion detection: after exactly 8 RORs the original canary bit has been shifted out of A into the processor Carry. Test the Carry (BCC/BCS) to detect the canary (carry = 0). Because the accumulator initially contains only a single zero bit, the first time the Carry reads zero after an ROR indicates that the canary has emerged — i.e., eight bits were shifted in. This removes the need for an explicit 0–7 counter.

Important machine-level details preserved:
- LDA #%01111111 = load accumulator with single zero in bit7 (value $7F).
- ROR shifts Carry into bit7 and shifts old bit0 into Carry; after 8 RORs the original bit7 reaches Carry.
- Use of the processor Carry flag (BCC/BCS) to detect canary out.

Caveats:
- The routine assumes the incoming serial bit is sampled and placed into the processor Carry prior to each ROR (sampling routine not shown here).
- Any initial state of the processor Carry before the first ROR must be controlled only if the sampling technique requires it; the canary detection relies on the single zero seeded into A, not the prior carry.

## Source Code
```asm
; Minimal illustration of the canary-bit pattern used by get_byte.
; (Sampling routine to set Carry is not shown; it must set C = incoming_bit.)

    ; initialize canary (bit7 = 0, bits6..0 = 1)
    LDA #%01111111      ; A = $7F

bit_in_loop:
    ; <code to sample one incoming bit and set C accordingly>
    ; e.g. JSR READ_BIT   ; READ_BIT must set Carry = incoming_bit

    ROR A               ; shift Carry into bit7, shift old bit0 into Carry
    BCC got_canary      ; Carry = 0 => canary emerged => 8 bits have been shifted in

    ; otherwise continue looping for next incoming bit
    JMP bit_in_loop

got_canary:
    ; now A holds the assembled byte (with bits shifted in)
    ; Carry contains the canary (zero) — use BCC/BCS decision already made
```

## Key Registers
- (none)

## References
- "get_byte_routine" — expands on mechanics of stopping after 8 bits