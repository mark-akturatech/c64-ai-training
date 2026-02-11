# 6502 Addressing Mode — Indirect Indexed ((aa), Y)

**Summary:** Indirect Indexed addressing (syntax: (aa),Y) uses a one‑byte zero page pointer to a 16‑bit base address stored at aa/aa+1, then adds the Y register to that 16‑bit address to produce the effective address. Searchable terms: (aa),Y, zero page pointer, Y register, indirect indexed.

## Operation
- Operand: a single zero page byte "aa" (one‑byte address in the zero page).
- Fetch pointer: read the low byte from memory[aa] and the high byte from memory[aa+1] to form a 16‑bit base address (low + 256*high).
- Add index: add the Y register to that 16‑bit base address to get the final effective address.
- Access: read from or write to the computed effective address (depending on the instruction).
- Summary phrase: "Find the address and then add the offset."

Example behavior described by the source:
- If $A5 contains $28 and $A6 contains $77, and Y = $08, then LDA ($A5),Y computes $7728 + $08 = $7730 and loads A from $7730.

Contrast:
- Indexed Indirect (aka (aa,X)) is the opposite flow: add X to the zero page pointer first, then fetch the 16‑bit address ("add then find"); (aa),Y does "find then add".

## Source Code
```asm
; Example (from source)
; zero page:
; $A5 = $28   ; low byte
; $A6 = $77   ; high byte

        LDY #$08
        LDA ($A5),Y    ; Effective address = $7728 + $08 = $7730
```

```text
Memory summary:
$A5: $28   ; pointer low
$A6: $77   ; pointer high
Y  : $08
Base address = $7728
Effective address = $7728 + $08 = $7730
```

## References
- "indexed_indirect_x" — contrast: Indexed Indirect (add then find) using X.
- "zero_page_addressing" — details on using zero page addresses as pointers.
