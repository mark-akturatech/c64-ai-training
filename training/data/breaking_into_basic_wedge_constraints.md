# Breaking Into BASIC (wedge)

**Summary:** Describes wedge techniques for intercepting/augmenting BASIC: preserve A/X/Y and flags, avoid slowing BASIC, use direct-mode-only commands or a special prefix character, PET/CBM insertion points CHRGET/CHRGOT, and the VIC-20/C64 BASIC-command hook vector at $0308/$0309.

**Breaking Into BASIC**

This chunk documents the constraints and common insertion points for modifying Commodore BASIC (a "wedge") so you can examine or extend commands without breaking the interpreter.

**Constraints:**
- A, X, Y registers must appear unchanged to BASIC callers: either avoid using them or save/restore them.
- Processor status flags must not be altered (preserve NZVC).
- Do not introduce significant slow-downs in code called frequently by BASIC.

**Performance techniques:**
- Implement extra commands only in direct mode (to avoid overhead during program execution).
- Use a special leading character to identify wedge commands, so normal parsing is unaffected.

**PET/CBM insertion points:**
- Two insertion locations are commonly modified:
  - **CHRGET** (near the beginning): advantages — you may not need to preserve A or status flags here because CHRGOT later restores or fixes state for the normal path.
  - **CHRGOT** (after the LDA that supplies the fetched character): advantages — the character to be tested is available in A, so decision logic is simpler.
- Trade-offs: CHRGET offers more latitude for initial handling without worrying about the A register/flags; CHRGOT gives the character directly but requires strict preservation of registers/flags. Both require careful, exacting work to avoid breaking the interpreter.

**VIC-20 / C64 vector hook:**
- VIC-20 and Commodore 64 provide a vector at $0308/$0309 that is called immediately before each BASIC command is executed. Using this vector lets you intercept control right before command execution — giving much more latitude than inline CHRGET/CHRGOT patches — but you still must preserve registers, flags, and performance characteristics.

**Caveat:**
- Modifying BASIC is an exacting job: correct register/flag preservation, minimal latency, and precise placement are essential. Small mistakes can corrupt interpreter state or significantly slow BASIC.

## Source Code

```assembly
; Example wedge assembly showing safe save/restore of A, X, Y, and flags

; Save registers and flags
PHA             ; Push A onto stack
TXA             ; Transfer X to A
PHA             ; Push A (original X) onto stack
TYA             ; Transfer Y to A
PHA             ; Push A (original Y) onto stack
PHP             ; Push processor status onto stack

; Wedge code here

; Restore registers and flags
PLP             ; Pull processor status from stack
PLA             ; Pull A (original Y) from stack
TAY             ; Transfer A to Y
PLA             ; Pull A (original X) from stack
TAX             ; Transfer A to X
PLA             ; Pull original A from stack
```

```assembly
; Example illustrating use of the $0308/$0309 vector (installation and return convention)

; Install wedge routine
LDA #<WEDGE_ROUTINE
STA $0308
LDA #>WEDGE_ROUTINE
STA $0309

; Wedge routine
WEDGE_ROUTINE:
  PHA             ; Save A
  TXA
  PHA             ; Save X
  TYA
  PHA             ; Save Y
  PHP             ; Save processor status

  ; Wedge code here

  PLP             ; Restore processor status
  PLA
  TAY             ; Restore Y
  PLA
  TAX             ; Restore X
  PLA             ; Restore A
  JMP ($030A)     ; Jump to next BASIC command
```

## Key Registers

- $0073-$007A - CHRGET routine in VIC-20 and Commodore 64
- $0079-$0080 - CHRGOT routine in VIC-20 and Commodore 64
- $0308-$0309 - Kernel/BASIC vector - entry called immediately before each BASIC command (VIC-20 / C64 BASIC hook)

## References

- "infiltrating_basic_wedge_intro_and_CHRGET_location" — expands on CHRGET locations and wedge opportunities
- "txtptr_and_$0308_vector" — expands on using the $0308 vector to intercept commands on VIC-20 / C64