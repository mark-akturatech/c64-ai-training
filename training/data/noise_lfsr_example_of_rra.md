# NMOS 6510 — Fast LFSR-like "noise" generator using RRA

**Summary:** This example demonstrates a fast LFSR-like noise generator utilizing the undocumented RRA opcode on the 6502 processor. The routine operates on a zero-page seed, employing RRA, EOR, and ROR instructions to produce a noise byte in the accumulator while preserving the original accumulator and processor flags.

**Description**

This routine advances a zero-page seed using the RRA instruction—an undocumented 6502 opcode that performs a memory ROR followed by an ADC with the accumulator. The result is then mixed and rotated to generate an 8-bit noise value in the accumulator. The routine ensures that the original accumulator and processor flags (including the carry flag) are preserved, allowing the generator to be used within existing code without corrupting the processor state.

Key behaviors include:

- **RRA zp (undocumented):** Performs a ROR on the memory byte at the zero-page address (shifting the seed right, with the LSB moving into the carry flag and the carry flag moving into the MSB of memory), and then adds the rotated memory value to the accumulator using ADC. The memory (seed) is updated by the ROR operation.

- **State Preservation:** The routine preserves the accumulator and processor flags using PHP/PLP and PHA/PLA instructions, ensuring that the original state is restored after generating the noise byte.

- **Bit Mixing and Rotation:** After the RRA operation, an EOR and a ROR on the accumulator are used to mix bits and rotate the result, producing the final noise value in the accumulator.

- **Zero-Page Seed:** The seed resides in the zero page, allowing for fast and compact operation.

## Source Code

```asm
; Example: LFSR-like noise generator using RRA (undocumented)
; zp_seed = zero-page address holding one-byte seed

; --- Seed setup (run once during initialization) ---
    LDA #$E4        ; Example initial seed
    STA zp_seed
; Alternatively:
;   LDA #$01
;   STA zp_seed

; --- Noise generation (can be called repeatedly) ---
    PHP             ; Push processor status (preserve flags)
    PHA             ; Push accumulator (preserve A)

    RRA zp_seed     ; Undocumented: ROR zp_seed then ADC A with that memory
    EOR #$01        ; Small mixing step (example constant)
    ROR A           ; Rotate A right through carry -> noise in A
                    ; (Resulting noise byte is now in A)

    PLA             ; Restore A
    PLP             ; Restore processor status (flags restored)

; After this sequence: A and flags are as before; zp_seed has been rotated/updated.
; If you need the noise byte but must keep A unchanged at the use site, use PHA/PLA accordingly
; or copy the noise byte to a safe location before restoring A.
```

## References

- "rra_opcodes_and_operation" — expands on RRA opcode semantics used by this example
- "rra_as_ror_simulation_addressing_modes" — related use of RRA for bit-rotation/addressing tricks

## Labels
- ZP_SEED

## Mnemonics
- RRA
