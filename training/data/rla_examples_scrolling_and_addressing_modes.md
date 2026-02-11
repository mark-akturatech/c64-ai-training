# NMOS 6510 — Practical RLA examples (scroller and extra ROL addressing modes)

**Summary:** Practical examples using the RLA undocumented opcode on NMOS 6510: (1) replace ROL+LDA+AND+STA with LDA+RLA+STA to save cycles/bytes when compositing a scroller over a background (18 cycles/16 bytes → 14 cycles/12 bytes), and (2) use RLA to emulate ROL with addressing modes ROL lacks (abs,Y ; (zp),Y ; (zp,X)). Note: A and N/Z reflect the AND result.

## Description
RLA combines a memory ROL with an AND into the accumulator: it performs a rotate-left on the addressed memory (the ROL semantics — carry shifts into bit0, high bit shifts to carry), then ANDs the resulting memory value with A, storing the AND result in A and updating N and Z accordingly. Because RLA both modifies memory (the ROL) and changes A (the AND), it can replace a sequence that separately rotates memory, loads it, ANDs with background data, and stores the final composite.

Use cases shown:
- Scrolling text over a fixed background: when the final displayed byte is (ROL scroller byte) AND background byte, you can preload A with the background byte and use RLA on the scroller byte to produce the composite directly into A, then store to the display buffer.
- Simulating ROL with more addressing modes: if clobbering A and the negative/zero flags is acceptable, RLA can be used where ROL lacks addressing modes (for example, abs,Y and indirect indexed modes). The logical AND portion will alter A and influence N/Z.

Caveats:
- RLA changes memory (the ROL) and sets carry as ROL would; it also overwrites A with A & (rotated memory). If the original code relied on A or the N/Z flags after the operation, RLA may not be suitable.
- The examples below show rightmost/top-line byte usage; adjust addressing for your buffer layout.

## Source Code
```asm
; Example: "scroll over a background layer"
; Original (ROL + LDA + AND + STA) — 18 cycles / 16 bytes
; Rightmost byte of top line:
        ROL scrollgfx       ; shift left (with carry)
        LDA scrollgfx
        AND backgroundgfx
        STA buffer

; Replacement using RLA — 14 cycles / 12 bytes
        LDA backgroundgfx
        RLA scrollgfx
        STA buffer

; Explanation:
; - RLA performs ROL on the memory operand, then A := A AND (memory after ROL)
; - A (and N/Z) will be the AND result, ready to STA buffer

; Example: simulate extra addressing modes for ROL using RLA
; (use only when clobbering A and flags is acceptable)
        ; C is shifted into the LSB (ROL semantics)
        RLA abs_addr,Y
        ; like ROL abs_addr,Y

        RLA (zp),Y
        ; like ROL (zp),Y

        RLA (zp,X)
        ; like ROL (zp,X)

; Notes:
; - After RLA, A was changed by the AND portion
; - N and Z flags reflect the AND result
```

## References
- "rla_opcodes_and_addressing_modes" — expands on addressing modes and opcode bytes that enable these usage patterns
- "rla_operation_flags_and_equivalents" — expands on details of the combined ROL+AND behavior exploited by these examples

## Mnemonics
- RLA
