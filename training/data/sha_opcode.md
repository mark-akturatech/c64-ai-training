# 6510 SHA (AXA/AHX/TEA) and SHX opcodes — $93 / $9F / $9E

**Summary:** 6510 undocumented SHA opcodes ($93 = SHA (zp),Y and $9F = SHA abs,Y) store (A & X & {H+1}) into memory; SHX ($9E = SHX abs,Y) stores (X & {H+1}). Covers addressing behavior, RDY instabilities, page-boundary interaction, examples, test filenames, and emulation notes.

**Operation**

**SHA (undocumented group, sometimes called AXA/AHX/TEA variants):**

- **Effect:** Store (A & X & {H+1}) into the effective memory location.
- **Addressing modes:**
  - $93 — SHA (zp),Y  (indirect,Y)
  - $9F — SHA abs,Y   (absolute,Y)
- **{H+1} Definition:** {H+1} denotes the high byte of the effective address (after adding Y) plus one; this high-byte value is ANDed into the stored result in addition to A & X.

**SHX (related undocumented opcode):**

- **Opcode:** $9E
- **Mnemonic:** SHX abs,Y
- **Function:** Store (X & {H+1}) into the effective memory location (absolute,Y addressing).
- **Size:** 3 bytes
- **Cycles:** 5 (notes below on instability)
- **Example form:** SHX $6430,Y

**Notes:**

- When the high byte of the effective address equals $FF (e.g., using $FE00 as base address), {H+1} becomes $00 + $1 -> $FF due to integer wrap behavior, producing a mask of $FF (effectively no extra masking). Thus, SHA degenerates to SAX-like behavior (i.e., store A & X).
- SHA does not modify zero page pointer bytes such as $02 when used with indirect addressing — the opcode does not use the stack.

**Instabilities and Timing Behavior**

- **RDY Line Sensitivity:** The ANDing with {H+1} is not purely atomic: the masking by {H+1} may be lost (drop off) if the RDY line is driven low during specific internal cycles of the instruction. For SHX, this can happen during the 4th cycle. For SHA, similar cycle-sensitive behavior is observed, but the exact cycle number is not specified.
- **Page-Boundary Crossing:** On a page-boundary crossing (when adding Y to the low byte of the address wraps the low byte), the CPU increments the high byte of the target address as normal, and that incremented high byte is then ANDed with A & X (i.e., {H+1} is computed after page crossing).
- **Behavioral Effect Summary:**
  - No page cross: stored value = A & X & (original high byte + 1)
  - Page cross: high byte is incremented, stored value = A & X & (incremented high byte + 1)
  - If RDY is pulled low at sensitive cycle(s), the {H+1} masking may not be applied (resulting in a store equivalent to different behavior, e.g., SAX).

**Examples and Equivalences**

- **When the effective high byte is $FE (base address $FE00), {H+1} = $FF, so SHA acts like a SAX (store A & X):**
  - SHA $FE00,Y  ; behaves as SAX $FE00,Y
- **Indirect example (zp pointer set to $FE00) also degenerates to SAX when the high byte is $FE:**
  - LDA #$FE
  - STA $03
  - LDA #$00
  - STA $02
  - ...
  - SHA ($02),Y  ; behaves as SAX ($02),Y

**Equivalent Instruction Sequences (Emulation):**

To emulate the SHA instruction, which stores (A & X & {H+1}) into memory, the following sequence can be used:


This sequence replicates the behavior of SHA by combining A, X, and {H+1} through stack operations and logical ANDs.

**Test Programs:**

- **General SHA tests:**
  - Lorenz-2.15/shaay.prg
  - Lorenz-2.15/shaiy.prg
- **Tests for {H+1} drop-off behavior:**
  - CPU/sha/shazpy2.prg
  - CPU/sha/shazpy3.prg
  - CPU/sha/shaabsy2.prg
  - CPU/sha/shaabsy3.prg
  - CPU/sha/shazpy4.prg
  - CPU/sha/shaabsy4.prg
- **Page-boundary tests:**
  - CPU/sha/shazpy1.prg
  - CPU/sha/shaabsy1.prg
  - CPU/sha/shazpy5.prg
  - CPU/sha/shaabsy5.prg

## Source Code

```assembly
PHP                 ; Push processor status to stack
PHA                 ; Push accumulator to stack
TXA                 ; Transfer X to A
AND $nnnn           ; AND with high byte of effective address + 1
TAX                 ; Transfer result back to X
PLA                 ; Pull accumulator from stack
AND X               ; AND accumulator with X
STA $nnnn           ; Store result into memory
PLP                 ; Pull processor status from stack
```


```assembly
; Example: SHA becomes SAX when high byte is $FE (abs,Y)
SHA $FE00,Y        ; SHA behaves as SAX $FE00,Y

; Example: indirect pointer set to $FE00 then SHA (becomes SAX)
LDA #$FE
STA $03
LDA #$00
STA $02
...
SHA ($02),Y        ; SHA behaves as SAX ($02),Y

; SHX example
;9E 30 64
SHX $6430,Y         ; store X & {H+1} at $6430 + Y

; Emulation sequence for SHA
PHP                 ; Push processor status to stack
PHA                 ; Push accumulator to stack
TXA                 ; Transfer X to A
AND $nnnn           ; AND with high byte of effective address + 1
TAX                 ; Transfer result back to X
PLA                 ; Pull accumulator from stack
AND X               ; AND accumulator with X
STA $nnnn           ; Store result into memory
PLP                 ; Pull processor status from stack
```

```text
; Test files referenced:
Lorenz-2.15/shaay.prg
Lorenz-2.15/shaiy.prg
CPU/sha/shazpy1.prg
CPU/sha/shazpy2.prg
CPU/sha/shazpy3.prg
CPU/sha/shazpy4.prg
CPU/sha/shazpy5.prg
CPU/sha/shaabsy1.prg
CPU/sha/shaabsy2.prg
CPU/sha/shaabsy3.prg
CPU/sha/shaabsy4.prg
CPU/sha/shaabsy5.prg
```

## References

- "unstable_address_high_byte_group" — expands on the group containing SHA/SHX opcodes and their RDY/page-boundary instabilities
- "Lorenz-2.15/shaay.prg" — general SHA (abs,Y) tests
- "Lorenz-2.15/shaiy.prg" — general SHA (indirect,Y) tests
- "CPU/sha/..." test files — specific tests for {H+1} drop-off and page-boundary cases (see names listed in Source Code)

## Mnemonics
- SHA
- AXA
- AHX
- TEA
- SHX
