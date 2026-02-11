# TAS (undocumented) — opcode $9B — abs,Y (NMOS 6510)

**Summary:** TAS (also known as XAS or SHS in some documentation) is an undocumented NMOS 6510 opcode at $9B (absolute,Y). It computes A & X, writes a masked value to memory (A & X & {H+1}, where H is the high byte of the effective address), and sets the stack pointer (SP) to A & X. Its behavior depends on the high byte of the address and is unstable with respect to the RDY line and temperature-dependent 'magic constant'.

**Operation and behavior**
- **Primary effect:** Compute M = A & X.
- **Side effects:**
  - Set SP = M (the stack pointer is replaced with A & X).
  - Store to memory: Write M & (H + 1) to the effective address, where H is the high byte of the 16-bit address used by the absolute,Y addressing mode. (Notation in source: A & X & {H+1}.)
- **Addressing:** Absolute,Y (three-byte instruction: opcode + 16-bit address).
- **Timing/size:** Absolute,Y implies 3 bytes; the instruction typically takes 5 cycles, with an additional cycle if a page boundary is crossed. However, due to its undocumented nature, exact cycle counts can vary depending on specific hardware conditions. ([c74project.com](https://c74project.com/wp-content/uploads/2020/04/c74-6502-unstable-opcodes.pdf?utm_source=openai))
- **Instability and the "magic constant":**
  - TAS belongs to the group of undocumented opcodes that involve a chip- and temperature-dependent "magic constant." This constant is unpredictable and may vary with time, temperature, and CPU revision.
  - The magic constant interacts with RDY: Bits 0 and 4 are reported weaker and can drop to 0 during DMA/Bus cycles. Do not rely on any particular constant value; reports of 0xEE/0xEF/0xFF are unreliable. ([c74project.com](https://c74project.com/wp-content/uploads/2020/04/c74-6502-unstable-opcodes.pdf?utm_source=openai))
  - Because of this, TAS is considered truly unstable; use it only in a way that removes the magic constant from critical paths and do not assume it can be read reliably.
- **Important caveat:** Despite some example sequences that push values via the stack instructions, the TAS internal behavior does not actually use the hardware stack in the same way as those examples imply — the source notes that example code "does in many ways not accurately resemble how the TAS opcode works exactly." Treat emulation sequences as approximations, not faithful reproductions.
- **Page-boundary effects:** Several test programs (see References) document differing results when the effective address crosses a page boundary — the H+1 mask and write value can change accordingly.

**Usage notes and examples mentioned in source**
- **Using $FE00 as the target address:** Because the low byte is $00, the H+1 mask becomes equivalent to $FF (low byte AND with $FF), so the memory write becomes effectively M (A & X). In that case, the instruction behaves like a SAX (store A & X) at that address, and SP is still set to A & X. This makes TAS potentially useful to compute A & X into SP, at the cost of trashing SP (you must save/restore it).
- **The source suggests saving/restoring SP around uses where the new SP is reused as a temporary:**
  - Push current SP to memory, do TAS to compute A&X into SP and write a copy, use SP/X as needed, then restore SP.
- **Test files referenced for different behaviors:**
  - General: Lorenz-2.15/shsay.prg
  - {H+1} drop off (magic-constant / RDY interactions): CPU/shs/shsabsy2.prg, CPU/shs/shsabsy3.prg, CPU/shs/shsabsy4.prg
  - Page boundary tests: CPU/shs/shsabsy1.prg, CPU/shs/shsabsy5.prg

**[Note: Source may contain an error — the simple PHA/PLP examples do not faithfully emulate TAS internals; source itself warns about this.]**

## Source Code
```asm
; From source: example fragments and emulation attempts (verbatim)

; flags
PHA
LDA $02
; akku
PLP
; restore flags

; Note in source: The above code does in many ways not accurately resemble how the TAS opcode works
; exactly, memory location $02-$04 would not be altered and the stack would not be used.

; Example sequence showing use of TAS in a larger flow (verbatim, as in source)
TSX
STX
LDA
LDX
TAS
...
TSX
LDY
STY
...
TSX
LDY
STY
...
LDX
TXS

; save stackpointer
temp
GLOBALMASK
LOCALMASK
$FE00,Y
; SAX $FE00,Y stores A & X & ($FE + 1)
; also sets SP = A & X
; get A & X
data0,x
bitmap+0
; get A & X
data1,x
bitmap+1
temp

; restore stackpointer
```

```text
; Notes from source:
; - 'Magic Constant' group: two opcodes combine an immediate and an implied command and
;   involve a highly unstable 'magic constant' dependent on chip/temperature and RDY.
; - The magic constant must be considered random; do not rely on values or reading it.
; - Bits 0 and 4 are weaker and may drop to 0 when DMA starts.
```

## References
- "las_opcode_las_abs_y" — expands on LAS/TAS relationship; covers how LAS/TAS combine AND results with SP or transfer values.

## Mnemonics
- TAS
- XAS
- SHS
