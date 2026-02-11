# NMOS 6510 — TAS (SHS) Sync Examples

**Summary:** Describes the illegal TAS (also known as SHS) opcode behavior on the NMOS 6510 processor. This opcode sets the stack pointer to the bitwise AND of the accumulator and the X register (SP ← A & X) and writes the value A & X & (H+1) to memory, where H is the high byte of the absolute address operand. The document details its cycle count, documented instabilities (such as RDY line interaction and page-crossing behavior), and how these behaviors are utilized to synchronize to a stable cycle for raster-timed loops (per-line and per-frame synchronization techniques).

**Function and Encoding Summary**

- **Opcode:** 9B
- **Mnemonic:** TAS (also known as SHS)
- **Size:** 3 bytes
- **Cycles:** 5
- **Basic Effect:** SP = A & X; memory at (addr + Y) ← (A & X & (H+1)), where H is the high byte of the absolute address operand. If adding Y to the target address causes a page boundary crossing, the high byte of the target address is incremented (as normal for absolute,Y addressing) and that incremented high byte is used in the final AND with (A & X).
- **Operation:** This opcode ANDs the contents of the A and X registers (without changing A or X) and transfers the result to the stack pointer. It then ANDs that result with the contents of the high byte of the target address of the operand + 1 and stores that final result in memory.

**Behavior and Instabilities (Important for Timing/Sync Use)**

- **Memory Write Value:** The value written to memory is A & X & (H+1) (i.e., ANDed with the high byte of the target address plus 1).
- **Stack Pointer Update:** The stack pointer is set to A & X (SP ← A & X).
- **Page-Crossing Behavior:** If adding Y to the target address causes a page boundary crossing, the high byte of the target address is incremented (as normal for absolute,Y addressing) and that incremented high byte is used in the final AND with (A & X).
- **RDY Line Interaction:** The value written is ANDed with (H+1) except when the RDY line goes low in the 4th cycle — this RDY timing instability is exploited to obtain writes at a precisely timed cycle.

**Typical Usage Notes for Raster-Timed Synchronization**

- **Register Initialization:** Initialize A and X to the mask/value you want placed into SP and used for the write; the code relies on SP and the written memory matching A & X.
- **Address Preparation:** Prepare the target address high byte (H) so that (H+1) yields the desired masking behavior when ANDed with (A & X).
- **Memory Write and Read:** Use the write produced by TAS (SHS), then immediately read that memory location to observe the written value; differences caused by RDY held low in the 4th cycle provide a reliably timed event to break out of a loop at a precise raster position (used for per-line or per-frame sync).
- **Page-Crossing Consideration:** When using Y-indexed forms, be aware that page-crossing adds 1 to the high byte before the final AND — this influences the final value written and thus must be part of the initialization plan.

## Source Code

```asm
; Example opcode encoding:
; TAS $7700,Y
; 9B 00 77

; Equivalent instruction sequence. This saves flags/A/X, computes A & X,
; stores it to memory (AND with high-byte+1), and restores registers.
; (comments added for clarity)
PHP             ; save flags
STA $03         ; save A
PLA             ; restore flags
STA $02         ; save A again
STX $04         ; save X
LDA $03         ; restore A from $03
AND $04         ; A ← A & X (value to put into SP and used in memory AND)
TAX             ; X ← A (save A & X into X)
AND #$78        ; additional immediate AND #$78 — specific example mask
STA $7700,Y     ; store (A & X & (H+1)) to target (with Y)
TXS             ; SP ← X  ; (X now contains A & X)

; restore flags, A, X
LDX $04
LDA $03
```

```asm
; Short form:
TAS $7700,Y     ; opcode bytes: 9B 00 77
```

## Key Registers

- **A (Accumulator):** Used in the AND operation with X.
- **X (Index Register X):** Used in the AND operation with A.
- **SP (Stack Pointer):** Set to the result of A & X.

## References

- "shy_opcode" — expands on instabilities used to derive sync behavior and opcode variants.

**Note:** The opcode 9B is commonly referred to as TAS (Transfer A and X to Stack Pointer and Store), but it is also known by the alias SHS in some documentation. The mnemonic SHY is associated with a different opcode (9C) and should not be confused with TAS.

## Mnemonics
- TAS
- SHS
