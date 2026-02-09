# NMOS 6510 — ANE / LAX (#imm) instability notes and real-world examples

**Summary:** Notes on the undocumented ANE/LAX (#imm) behavior on NMOS 6510/6502 variants: opcode $AB (LAX #imm) semantics, chip-/temperature-/RDY-dependent "magic constant" corruption, safe uses, emulation compromise ($EF/$EE), and known real-world uses (Ocean/Imagine loader, Mastertronic burner, Turrican 3, Wizball). Includes test filenames and a visual6502 simulation link.

## LAX #imm (also referenced as ANX/ANE variants)
Operation and opcode (from source):
- Opcode: $AB
- Mnemonic: LAX #imm
- Effect (as given): A,X = (A | {CONST}) & #{imm}
- Size: 2
- Cycles: 2

Description:
- The undocumented opcode combines LDA, LDX and TAX-like behavior: it ORs the accumulator with a chip-dependent CONST, ANDs that result with the immediate operand, and stores the result into both A and X.
- The internal CONST is not stable across chips, temperatures, or RDY state. Common observed values include $EE, $00, $FF and others; different NMOS die/conditions produce different CONST.
- Bits 0 and 4 are weaker than other bits on some dies and may drop to 0 (for example during the first cycle of DMA when RDY is pulled low).
- The opcode's decode enables both accumulator output and feed-output-to-input paths, producing a race between bus signals and sometimes allowing accumulator contents to be merged with the data-bus value (hence the formula above).
- Because CONST can be non-zero, behavior can be unpredictable unless the code ensures the CONST is masked out (see Safe uses below).

## Instability details and causes
- CONST depends on chip/temperature and can change with RDY line behavior.
- The instability arises from simultaneous enabling of internal bus drivers (output accumulator) and connecting the output bus back to the input; polarity/inversion and timing of these signals can produce a race that samples either the accumulator or the data bus (or a mix) depending on silicon/conditions.
- Practical consequence: using LAX #imm with arbitrary immediate values or with arbitrary accumulator contents is unsafe unless the code intentionally neutralizes the magic constant.

## Safe uses and emulation advice
Safe usages (as stated in source):
- ANE/LAX #0 (immediate zero) to clear A (and X): the immediate masks out CONST.
- Using ANE/LAX to compute X AND immediate when A = $FF: when A is $FF the (A | CONST) equals $FF so CONST is irrelevant, and the AND with immediate behaves deterministically.
- More generally: safe if all bits that may be 0 in A are 0 in the immediate (so CONST can't set extra bits).

Emulation compromise (from source):
- To emulate the magic constant behavior across differing RDY-cycle conditions use $EF for "regular cycles" and $EE when emulating RDY cycles — recommended as a practical compromise in emulators to match observed behavior across titles.

Warnings:
- Do not use LAX #imm with any immediate other than 0, or when A = $FF, unless you have guaranteed the CONST effect is masked (see above).
- Some software (see Real-world usage) uses this opcode in unstable ways; emulators should take care to reproduce the correct behavior for each title if aiming for cycle-accurate compatibility.

## Real-world usage (known titles / loaders)
- Ocean / Imagine loader — known to use ANE/LAX variants.
- Mastertronic burner — known use.
- Turrican 3 — known use.
- Wizball — discovered to use LAX #imm in an unstable way (location: $B58B, used after pressing fire on the "get ready" screen and during gameplay). This is a documented surprising example of fragile use in a popular game.

## Tests and simulations (test files, references)
- Test code / general:
  - CPU/asap/cpu_anx.prg
  - Lorenz-2.15/lxab.prg
- Temperature dependency tests:
  - general/ane-lax/ane-lax.prg
- RDY-line dependency tests:
  - CPU/lax/lax.prg
  - CPU/lax/laxborder.prg
  - CPU/lax/lax-none.prg
- Simulation link:
  - visual6502 JSSim: http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=13&d=a200a900abffea

## Source Code
```asm
; Opcode header (verbatim from source)
; Opc.    $AB
; Mnemonic LAX #imm
; Function: A,X = (A | {CONST}) & #{imm}
; Size: 2
; Cycles: 2

; Example usage shown in source:
LAX #{IMM}
; AB {IMM}
```

```text
Test filenames (from source):
- CPU/asap/cpu_anx.prg
- Lorenz-2.15/lxab.prg
- general/ane-lax/ane-lax.prg
- CPU/lax/lax.prg
- CPU/lax/laxborder.prg
- CPU/lax/lax-none.prg
```

```text
Simulation:
- visual6502 JSSim: http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=13&d=a200a900abffea
```

## Key Registers
(omitted — this chunk documents opcode behavior, not specific hardware registers)

## References
- "ane_opcode_and_description" — expands on undocumented ANE details and magic-constant behavior