# Kick Assembler — Labels, Arguments Labels, Multi-Labels, '*' and .zp

**Summary:** Label declarations end with ':' and are referenced without the colon; Kick Assembler supports labels-in-arguments (for self-modifying code), multi-labels (prefixed with '!') navigated with '+' and '-', the current-location symbol '*' for PC-relative arithmetic, and a .zp directive to force labels to be treated as zeropage. The assembler treats unresolved forward labels as two‑byte addresses unless marked with .zp, and .zp currently has limitations with macros/pseudocommands.

## Label syntax
- Declare a label with a trailing colon: `name:`
- Refer to the label elsewhere without the colon: `jmp name`
- Example:
  - loop declaration:
    - loop:
      inc $d020
      inc $d021
      jmp loop

## Labels in arguments (self-modifying code)
- Labels may appear in instruction operands (arguments) — useful for self-modifying code where a label-like value is embedded in data or constructed addresses.
- Example pattern (storing X register then using it as an immediate byte later):
  - stx tmpX
    ...
  - ldx tmpX:#$00
- This allows assembling code that later modifies its own operand bytes.

## Multi-labels (!) and navigation with '+' and '-'
- Multi-labels start with `!` and can be declared multiple times with the same base name: `!name:`
- When referencing a multi-label, append `+` to refer to the next instance, or `-` to refer to the previous instance:
  - `!loop-` — previous instance of `!loop`
  - `!+` — next `!` label
- Multiple pluses/minuses skip more instances: `!+++` refers to the third subsequent instance.
- Examples:
  - Two-instance loop using `!loop-` to branch to the previous instance:
    - !loop:
      ...
    - !loop:
      ldx #100
      inc $d020
      dex
      bne !loop- ; branches to previous instance
  - Using anonymous multi-labels (`!:`) and `!+` to jump over code:
    - ldx #10
      !loop:
      !:
      jmp !+ ; jumps over the next two nops to the next `!` label
      nop
      nop
      jmp !+ ; jumps over the next two nops to the next `!` label
      nop
      nop
      !:
      dex
      bne !loop- ; jumps to previous `!loop`

## Current memory location: '*'
- `*` evaluates to the current program counter (current memory location).
- You can use `*` in branches/addresses and arithmetic with it, e.g. `jmp *-6`.
- Example equivalence:
  - Using `*`:
    - jmp *
      inc $d020
      inc $d021
      jmp *-6
  - Same using labels:
    - this:
      jmp this
      !loop:
      inc $d020
      inc $d021
      jmp !loop-

## Zeropage labels: .zp directive and assembler behavior
- If the assembler encounters a forward reference to a label that is not yet resolved, it will assume a two-byte absolute address by default (even if that label later is placed in zeropage).
- Use the `.zp` directive to mark labels as zeropage (so zeropage addressing forms are used even for late-resolved labels).
- Example:
  - lda zpReg1
    sta zpReg2
    *=$10 virtual
    .zp {
      zpReg1: .byte 0
      zpReg2: .byte 0
    }
- Note: `.zp` switches the assembler's expectation so `lda zpReg1`/`sta zpReg2` will be assembled in zeropage form even if `zpReg1`/`zpReg2` are defined after use.

## Caveats and limitations
- The assembler assumes unresolved forward labels are two-byte unless explicitly placed in a `.zp` block.
- **.zp limitation:** The `.zp` directive currently does not handle macros or pseudocommands called within the `{}` block; labels defined inside macros invoked in the `.zp` block will have the label form determined by the macro (not necessarily zeropage).
- Applying multiple `+`/`-` on multi-label references skips that many label instances (e.g., `!+++`).

## Source Code
```asm
; Basic label example
loop:
    inc $d020
    inc $d021
    jmp loop

; Label in argument (self-modifying pattern)
    stx tmpX
    ...
    ldx tmpX:#$00

; Multi-labels example
!loop:
...
!loop:
    ldx #100
    inc $d020
    dex
    bne !loop- // Jumps to the previous instance of !loop

; Anonymous multi-labels and skipping with !+
    ldx #10
!loop:
!:
    jmp !+ // Jumps over the two next nops to the ! label
    nop
    nop
    jmp !+ // Jumps over the two next nops to the ! label
    nop
    nop
!:
    dex
    bne !loop- // Jumps to the previous !loop label

; Multiple '+' skipping
!:
!:
!:
    jmp !+++ // Jumps to the third '!' label
    nop
    nop
; <- here!

; Using '*' for current location
    jmp *
    inc $d020
    inc $d021
    jmp *-6

; .zp example: forces zeropage addressing for later-resolved labels
    lda zpReg1
    sta zpReg2
    *=$10 virtual
    .zp {
    zpReg1: .byte 0
    zpReg2: .byte 0
    }
```

## References
- "scopes_and_namespaces_scopes" — expands on label visibility and scope rules (Chapter 4/9)
- "memory_directives_and_pc_management" — expands on interaction with program counter and memory blocks (*)