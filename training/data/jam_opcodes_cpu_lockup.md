# NMOS 6510 JAM (KIL/HLT/CIM/CRP) opcodes

**Summary:** Undocumented NMOS 6510 opcodes that permanently lock the CPU on execution (bytes $42, $52, $62, $72, $92, $B2, $D2, $F2). Execution behavior: next byte is fetched, data and address buses driven to $FF, CPU stops (no interrupts), and only a reset restarts execution; leaves no register or flag trace. Example use: halt demo with minimal code (writes to $D418 then JAM). Visual6502 JSSim link included.

## Description
The listed opcode bytes are undocumented "JAM" instructions on NMOS 6510 implementations (also referred to in various sources as KIL/HLT/CIM/CRP). Their observed behavior:

- Opcode bytes: $42, $52, $62, $72, $92, $B2, $D2, $F2.
- On execution the CPU will fetch the byte immediately following the opcode (one additional fetch occurs).
- After that fetch, the CPU drives the data and address buses to $FF (all 1s).
- Program execution ceases; the CPU is locked up and will not execute further instructions.
- Hardware interrupts (IRQ, NMI) do not run while the CPU is jammed.
- Only a hardware reset will restart CPU execution.
- The jam operation leaves no visible trace: registers (A, X, Y, SP) and processor status flags are not modified by an observable effect.

These opcodes are often used in tiny demos or constrained situations to stop execution with minimal bytes. Note that only the CPU stops — other chips (VIC-II, SID, CIAs, etc.) keep running.

## Source Code
```text
Undocumented JAM opcode bytes:
$42
$52
$62
$72
$92
$B2
$D2
$F2

Operation (as observed):
- The byte following the opcode is fetched.
- Data and address buses are set to $FF.
- Program execution ceases; IRQ/NMI do not run.
- Only RESET restarts execution.
- No registers or flags show any change.
```

```asm
; Minimal example to stop execution (example from source)
; Keep in mind only the CPU will stop — other chips continue.
        LDA #0
        STA $D418
        .byte $F2    ; one of the JAM opcodes (example)
;02
```

```text
Test code reference: CPU/cpujam/cpujamXX.prg

Simulation (visual6502 JSSim):
http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=12&d=027fff00&loglevel=4
```

## References
- "unstable_opcodes_unstable_address_high_byte_group" — continues with the next section "Unstable Opcodes" describing other classes of undocumented opcodes.

## Mnemonics
- JAM
- KIL
- HLT
- CIM
- CRP
