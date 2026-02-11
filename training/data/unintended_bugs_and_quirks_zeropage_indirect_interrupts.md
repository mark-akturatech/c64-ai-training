# NMOS 6510 — Unintended bugs and quirks

**Summary:** Describes 6502/6510 zero-page indexed and indirect addressing page-wrap behaviour (indexed zeropage wrap, indirect JMP wrap), interrupt behaviour with respect to processor flags (decimal flag not changed by interrupts), and the Break (B) flag semantics and how to distinguish BRK vs hardware interrupts using the pushed status byte.

## Zeropage addressing modes & page wraps
Indexed zero-page addressing (e.g. LDA $FF,X) and zero-page indirect addressing forms wrap inside the zero page; they never cross into the next 256-byte page. When the zero-page pointer low-byte wraps from $FF to $00, the high-byte is taken from $0000 (not $0100). This applies to both direct indexed zero-page accesses and indirect zero-page loads/stores that fetch a 16-bit pointer from two consecutive zero-page bytes.

Practical effect:
- LDX #$01
  LDA $FF,X
  — fetches from $0000 (not $0100).

For zero-page indirect addressing sequences that read a 16-bit pointer (low then high byte), the high byte is fetched from the wrapped address:
- LDA ($FF),Y
- LDX #$00
  LDA ($FF,X)
- LDX #$FF
  LDA ($00,X)
All of the above will load the low byte from $00FF and the high byte from $0000 (so the constructed 16-bit pointer wraps within the zero page).

## Indirect addressing mode & page wraps
The indirect addressing mode used by JMP (JMP (addr)) wraps within the indirect page when the low byte of the pointer is $FF: the processor fetches the low byte from addr and the high byte from addr & $FF00 (the start of the same page) because the program-counter high (PCH) is not incremented across the page boundary for this fetch.

Example:
- JMP ($C0FF)
  — fetches low byte from $C0FF and high byte from $C000 (not $C100).

(The effect: indirect JMP pointers that cross a page boundary will use the high-byte from the beginning of the same 256-byte page.)

## Interrupts do not affect Flags
When an IRQ or NMI fires, the CPU pushes a copy of the processor status register onto the stack so the interrupt handler can later restore it. The CPU does not modify the decimal flag (D) or otherwise "prepare" decimal mode for the handler — the D flag remains whatever the interrupted code left it as. Therefore, interrupt handlers that use binary/decimal-sensitive instructions must explicitly set or clear the decimal flag as required; the hardware interrupt does not implicitly clear D.

## The Break (B) flag and distinguishing BRK vs hardware interrupts
The B flag is a software-visible bit in the status-byte copy pushed to the stack, but it is not a true persistent CPU status bit. PHP or other instructions that push the status will store a copy with the B bit set. Because of this, using PHP/PLA inside an interrupt handler cannot distinguish a BRK (software interrupt) from a hardware interrupt — PHP will show B=1 regardless.

To detect whether the cause was a BRK instruction or a hardware interrupt, examine the status byte that the CPU pushed onto the stack at interrupt entry (the pushed copy made by the hardware when entering the interrupt vector). The conventional, correct rule is:
- Hardware interrupts (IRQ or NMI) result in the pushed status byte having B = 0.
- A BRK instruction causes the CPU to push a status byte with B = 1.

**[Note: Source may contain an internal contradiction about which case yields B=0 vs B=1. The rule stated above (hardware → B=0; BRK → B=1) matches 6502/6510 behavior used to distinguish BRK from IRQ/NMI.]**

## Source Code
```asm
; Zero-page indexed wrap example
        LDX #$01
        LDA $FF,X     ; fetches from $0000, not $0100

; Zero-page indirect pointer wrap examples
        LDA ($FF),Y   ; low from $00FF, high from $0000
        LDX #$00
        LDA ($FF,X)   ; low from $00FF, high from $0000
        LDX #$FF
        LDA ($00,X)   ; low from $00FF, high from $0000

; Indirect JMP page-wrap example
        JMP ($C0FF)   ; low byte from $C0FF, high byte from $C000
```

```text
; Stack/pushed-status note (visual reference)
; On interrupt entry the CPU pushes (from high->low):
;   PCH  (return PC high)
;   PCL  (return PC low)
;   P    (processor status copy)  ; for IRQ/NMI: pushed P has B=0 ; for BRK: pushed P has B=1
```

## References
- "zp_indirect_y_rmw_cycle_timeline" — expands on related cycle behaviour for R-M-W opcodes and zero-page/indirect timing quirks
- "opcode_naming_in_different_assemblers_matrix" — expands on opcode names and assembler differences (appendix)

## Mnemonics
- LDA
- JMP
- BRK
- PHP
