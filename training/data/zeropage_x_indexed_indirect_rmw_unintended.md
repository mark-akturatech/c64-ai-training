# NMOS 6510 — Undocumented RMW at (ZP,X): C3,E3,23,63,03,43 (DCP/ISC/RLA/RRA/SLO/SRE)

**Summary:** NMOS 6510 (6502-family) unintended read-modify-write behavior for Zeropage X indexed indirect addressing ((zp,X)). Undocumented 2‑byte, 8‑cycle opcodes C3,E3,23,63,03,43 implement illegal instructions DCP/ISC/RLA/RRA/SLO/SRE and perform additional dummy read/write cycles compared with the legal (zp,X) 6‑cycle loads.

**Description**
These NMOS 6510 undocumented opcodes use the Zeropage,X indexed-indirect addressing mode ((zp,X)) but behave as R‑M‑W instructions (read-modify-write), adding extra bus cycles compared to legal (zp,X) loads and stores. The sequence begins like the legal (zp,X) sequence (fetch opcode, fetch operand, fetch zero-page pointer low/high), then accesses the effective absolute address and performs the R‑M‑W sequence (read value, dummy write, final modified write). This results in an 8‑cycle total for these 2‑byte opcodes on NMOS 6510 silicon; behavior may differ on CMOS variants (65C02) or emulators that do not model NMOS quirks.

Opcodes and common undocumented instruction names:
- $C3 — DCP (DEC then CMP) (undocumented)
- $E3 — ISC (INC then SBC) (undocumented)
- $23 — RLA (ROL then AND) (undocumented)
- $63 — RRA (ROR then ADC) (undocumented)
- $03 — SLO (ASL then ORA) (undocumented)
- $43 — SRE (LSR then EOR) (undocumented)

Behavioral summary:
- Instruction length: 2 bytes (opcode + zp operand)
- Total cycles (NMOS 6510 observed): 8 cycles (read-modify-write variant)
- Related legal mode: Zeropage X Indexed Indirect ((zp,X)) for loads/stores is 2 bytes, 6 cycles
- The extra cycles implement the dummy read/write(s) required for R‑M‑W semantics on the NMOS 6502 core.

Caveats:
- The original source contained a partial/truncated per-cycle table for the legal 6‑cycle form; the R‑M‑W 8‑cycle per-cycle trace is available from the visual6502 simulation snapshot linked below. Where the source was unclear or truncated, the general R‑M‑W pattern (read value, dummy write, write modified value) is used — consult the simulation for exact address- and data-bus activity on each cycle.
- These opcodes are undocumented/illegal; rely on silicon behavior (NMOS 6502) rather than official instruction set guarantees.

## Source Code
```text
Undocumented opcodes (2 bytes, 8 cycles observed on NMOS 6510):
C3, E3, 23, 63, 03, 43  ->  DCP, ISC, RLA, RRA, SLO, SRE

Related legal mode: Zeropage X Indexed Indirect ((zp,X))

Legal (zp,X) addressing mode (2 bytes, 6 cycles) — corrected canonical per-cycle summary:
Cycle 1: Address bus = PC         — Opcode fetch (Read)
Cycle 2: Address bus = PC + 1     — Zero-page operand fetch (Read) ; operand = ZP
Cycle 3: Address bus = ZP         — Read: pointer low byte (Read)
Cycle 4: Address bus = ZP + 1     — Read: pointer high byte (Read)
Cycle 5: Address bus = (Pointer Low + X) & $FF  — Read: effective address low byte (Read)
Cycle 6: Address bus = (Pointer Low + X + 1) & $FF — Read: effective address high byte (Read)

Undocumented R-M-W (zp,X) observed pattern (NMOS 6510; 2 bytes, 8 cycles) — generalized sequence:
Cycle 1: PC               — Opcode fetch (R)
Cycle 2: PC + 1           — Zero-page operand fetch (R)
Cycle 3: ZP               — Read pointer low from zero page (R)
Cycle 4: ZP + 1           — Read pointer high from zero page (R)
Cycle 5: (Pointer Low + X) & $FF   — Read effective address low byte (R)
Cycle 6: (Pointer Low + X + 1) & $FF — Read effective address high byte (R)
Cycle 7: Effective address — Read value to be modified (R)
Cycle 8: Effective address — Dummy write of the same value (W)  (part of R-M-W)
Cycle 9: Effective address — Write modified value (W)         (final result)

**Important:** exact address/data bus contents for cycles 7–9 and the final dummy activity vary by opcode and by NMOS microcode timing — consult the visual6502 simulator trace (link above) for cycle-accurate bus-level details for each opcode.
```

## References
- "zeropage_x_indexed_indirect_legal" — expands on the related legal (non‑RMW) (zp,X) addressing mode and canonical 6‑cycle sequence
- visual6502 simulation snapshot (embedded in Source Code link) — provides cycle-accurate bus traces for the undocumented opcodes on NMOS silicon (use the provided URL)

## Mnemonics
- DCP
- DCM
- ISC
- ISB
- INS
- RLA
- RRA
- SLO
- ASO
- SRE
- LSE
