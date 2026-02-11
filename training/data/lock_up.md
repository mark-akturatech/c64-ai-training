# NMOS 6510 — JAM / KIL (permanent CPU halt) description

**Summary:** JAM (also called KIL) refers to certain NMOS 6502/6510 illegal opcodes that permanently halt the CPU: the processor stops executing further cycles, and the address/data buses are left driven as $FF. These opcodes are used in copy‑protection, test cases, and to intentionally lock the machine; behavior can vary across NMOS/CMOS variants.

**JAM / KIL behavior (NMOS 6510)**
- **Effect:** Executing a JAM/KIL opcode causes the CPU to stop fetching, decoding, and executing further instructions. The processor enters a permanent halted state (no further instruction stream progress).
- **Buses:** On many NMOS 6502/6510 implementations, the address and data buses end up showing $FF (high), effectively tri‑stating or pulling lines high in the halted state.
- **Use cases:** Intentionally used for copy‑protection (to make code execution unrecoverable) and in hardware test vectors to check halt behavior.
- **Variant behavior:** Not every undocumented opcode behaves identically on all 6502-family chips. CMOS derivatives (e.g., WDC 65C02) do not necessarily jam on the same opcodes; some illegal opcodes are handled differently or made into defined instructions.

**Complete list of NMOS 6510 JAM/KIL opcodes**
The following opcodes are known to cause the CPU to halt:

- $02
- $12
- $22
- $32
- $42
- $52
- $62
- $72
- $92
- $B2
- $D2
- $F2

([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

**Confirmed behavior per opcode on the Commodore 6510 (NMOS) silicon**
When one of the above opcodes is executed:

- The byte following the opcode is fetched.
- The data and address buses are set to $FF (all 1s).
- Program execution ceases.
- No hardware interrupts will execute.
- Only a reset will restart execution.
- No registers or flags are affected.

([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

**Notes about opcode classification**
- Some undocumented opcodes are functional (e.g., SLO/ASO — shift and OR) and are not JAM; others are true JAM/KIL and deadlock the core.
- Example of non-JAM illegal opcodes (for contrast): opcode $07 (SLO zp) and $17 (SLO zp,X) perform destructive read/modify/write combined operations but do not permanently halt the CPU. The provided source fragment shows:
  - Mnemonic: $07  SLO zp
  - Mnemonic: $17  SLO zp,X
  These are illegal instructions but are not JAM/KIL opcodes.

## References
- ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

## Mnemonics
- KIL
- JAM
