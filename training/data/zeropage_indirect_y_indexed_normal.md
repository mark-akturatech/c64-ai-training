# NMOS 6510 — Zeropage Indirect ,Y and Indexed-Indirect ,X per‑cycle behaviour (non‑RMW reads; STA write differences)

**Summary:** Per‑cycle memory access sequence for NMOS 6510 (6502 family) Zeropage Indirect Y ((zp),Y) for normal non‑RMW read instructions (ADC/STA/AND/CMP/EOR/LDA/ORA/SBC/LAX etc.), and the corresponding notes for Zeropage X Indexed Indirect ((zp,X)). Includes opcode/operand/pointer fetch order, dummy/corrected read, and where extra cycles are inserted for page crosses or writes.

**(zp),Y — Indirect Y (non‑RMW read instructions)**

Description:
- Effective address is formed by loading a 16‑bit base address from a zero page pointer at the supplied zero page offset (operand), then adding the Y register to the low byte (AAL + Y), possibly carrying into the high byte (AAH).
- Cycles for normal non‑RMW read instructions (LDA, ADC, AND, EOR, ORA, SBC, CMP, LAX): 5 cycles total; add 1 cycle if the AAL+Y addition crosses a page boundary (i.e., low byte carry into high).
- STA (zp),Y (a write) requires one additional cycle compared to the read variants (baseline 6 cycles) and still adds another cycle if the page is crossed (baseline 6 + page‑cross = 7).
- The sequence always reads the pointer low and pointer high from zero page (wrap at $FF), then performs a dummy/corrected access before the final data read or write. The dummy/corrected access is used to compute the corrected effective address when Y is added; if there is a page carry an extra cycle is inserted.

Brief cycle semantics (conceptual):
1. Fetch opcode (PC) — R
2. Fetch operand (PC+1) — the zero page pointer offset — R
3. Read at zero page offset (DO) — fetch pointer low (AAL) — R
4. Read at zero page offset+1 (DO+1 wrap) — fetch pointer high (AAH) — R
5. Dummy/corrected read using <AAH,AAL+Y> (effective address computed with Y) — R (this can be a dummy read)
6. Data access: final read from <AAH,AAL+Y> (R) for read instructions; or final write to <AAH,AAL+Y> (W) for STA. If page cross occurred the cycle count includes an extra cycle inserted between steps 5 and 6 (so reads become 6 cycles, STA becomes 7).

Common timings (NMOS 6510/6502):
- LDA/ADC/AND/EOR/ORA/SBC/CMP/LAX (zp),Y: 5 cycles; +1 if page crossed.
- STA (zp),Y: 6 cycles; +1 if page crossed.

**(zp,X) — Indexed Indirect (Zeropage X Indexed Indirect)**

Description:
- Indexed‑Indirect (operand,X) forms an address by adding X to the zero page operand (wrap at $FF), then reading the 16‑bit pointer from that zero page location and the following byte. The fetched pointer is the effective address; no page‑cross extra cycle can occur because the final address is taken directly from zero page pointer bytes.
- Typical cycle counts for read instructions (LDA, ADC, AND, EOR, ORA, SBC, CMP, LAX): 6 cycles total.
- STA (zp,X) (write) uses the same base number of cycles (6) for the write; no page‑cross extra cycle applies because the effective address is read from zero page.

High level cycle flow for (zp,X) reads:
1. Opcode fetch (PC)
2. Fetch zero page base operand (PC+1)
3. Dummy read at zero page (operand + X) & $FF (fetching pointer low; some models show this as a dummy)
4. Read pointer low from zero page ((operand + X) & $FF)
5. Read pointer high from zero page ((operand + X + 1) & $FF)
6. Final data read from effective address (constructed from pointer low/high)

Note: exact dummy/read micro‑cycle naming can differ in documentation, but overall 6 cycles for read instructions is the standard NMOS count.

## Source Code
```text
; Per‑cycle table (condensed reference extracted from source)
; (zp),Y — normal non‑RMW reads (ADC/AND/EOR/LDA/ORA/SBC/CMP/LAX)
; STA (zp),Y is a write variant that adds one extra cycle (baseline 6) and still
; adds +1 if a page boundary is crossed when adding Y.

Cycle | Address Bus        | Data Bus / Comment                  | R/W
1     | PC                 | Opcode fetch                        | R
2     | PC + 1             | Zero page operand (pointer offset)  | R
3     | DO (operand)       | Byte at zero page offset (pointer low, AAL) | R
4     | DO + 1 (wrap)      | Byte at zero page offset+1 (pointer high, AAH) | R
5(*)  | <AAH, AAL + Y>     | Dummy / corrected read of effective address low (AAL+Y) | R
6     | <AAH, AAL + Y>     | Final data read (R) or write (W) (STA uses W) | R / W

(*) If AAL+Y crosses page, an additional cycle is inserted (reads: 5->6; STA: 6->7).

; Zeropage Indexed Indirect (zp,X) — typical read sequence (6 cycles)
Cycle | Address Bus                     | Comment
1     | PC                              | Opcode fetch
2     | PC + 1                          | Zero page base operand
3     | (operand + X) & $FF             | Dummy / read (zero page) for pointer low
4     | (operand + X) & $FF             | Pointer low (AAL)
5     | (operand + X + 1) & $FF         | Pointer high (AAH)
6     | <AAH, AAL>                      | Final data read (no page‑cross extra cycle possible)
```

## References
- "zeropage_indirect_y_indexed_rmw_unintended" — expands on unintended R‑M‑W variants and related timing/cycle similarities