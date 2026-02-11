# NMOS 6510 SHA behavior — when SHA reduces to SAX / SAX-like cases

**Summary:** Examples and test notes for NMOS 6510 undocumented SHA opcode showing when it reduces to SAX (SAX = A & X store) for addresses where the high-byte+1 masking yields $FF (e.g., $FE00), and when SHA shows SAX-like behavior for (indirect),Y addressing because the effective high-byte masking is effectively $FF. Includes a short assembly test snippet, test filenames, and simulator links.

**Description**
This chunk documents observed examples and test cases for the undocumented SHA opcode behavior on NMOS 6510 (Commodore 64). The key observations included here (from tests and simulator runs) are:

- SHA can behave identically to SAX (store A & X) for certain effective addresses when the high-byte+1 masking used by SHA collapses to $FF (for example, absolute addresses whose high byte plus one wraps/equals $FF, such as $FE00).
- For indirect,Y addressing modes, SHA may show SAX-like results when the operation that masks or uses (H+1) results in an effective $FF high byte — i.e., the high-byte masking is effectively $FF for that addressing instance.
- SHX (another undocumented opcode) is noted: it would not use the stack (contrast to SHA tests that push/pop flags/accumulator around the store in the example).
- The provided small assembly snippet shows a common test pattern used to preserve flags and the accumulator while exercising a store that depends on the stack/flags/high-byte behavior.

## Source Code
```asm
; Example: SHA reduces to SAX-like behavior when (H+1) yields $FF
PHP
PHA
TXA
AND #$65
STA $6430,Y
PLA
PLP

; save flags and accumulator
; High byte of Address + 1
; restore flags and accumulator
```

```text
Test files referenced:
- CPU/asap/cpu_shx.prg
- Lorenz-2.15/shxay.prg
- CPU/shxy/shxy2.prg
- CPU/shxy/shxy3.prg
- CPU/shxy/shxy4.prg
- CPU/shxy/shx-t2.prg
- CPU/shxy/shxtest.prg
- CPU/shxy/shxy1.prg (page boundary)
- CPU/shxy/shxy5.prg (page boundary)
```

```text
Simulation links (examples used during investigation):
- &{H+1} drop off:
  http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=20&d=a27fa0f39e0211&logmore=rdy&rdy0=15&rdy1=16

- (page boundary crossing anomaly referenced in tests)
```

## References
- "sha_opcode" — expands on basic SHA behavior and &{H+1} masking
- Test filenames above — collection of PRG tests exercising SHX/SHA/SHXY behavior and page-boundary cases

## Mnemonics
- SHA
- SHX
- SAX
