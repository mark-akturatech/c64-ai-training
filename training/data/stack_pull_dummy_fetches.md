# NMOS 6510 — PLA / PLP (Pull) cycle behaviour

**Summary:** NMOS 6510 PLA (0x68) and PLP (0x28) take 4 CPU cycles and perform dummy memory fetches: an initial opcode fetch, a dummy fetch from PC+1, a dummy stack read (while the stack pointer is adjusted), and a final stack read which supplies the pulled byte (A or P). Stack lives at $0100-$01FF.

## Cycle-by-cycle description
- Cycle count: 4 cycles (NMOS 6510) for both PLA and PLP.
- Stack addressing: stack page is $01 — stack byte address = $0100 + S (S is the 8-bit stack pointer).
- General micro-sequence:
  1. Cycle 1 — Opcode fetch: memory read at PC (instruction opcode), PC increments.
  2. Cycle 2 — Dummy read from PC (PC+0 after increment, i.e., the next instruction byte): a bus read occurs but the value is not used by the instruction. This is a standard "dummy fetch" for implied addressing modes.
  3. Cycle 3 — Dummy stack read: the CPU increments the stack pointer (S := S + 1) and performs a read from the stack page at the resulting address. This read is a dummy/read-only internal cycle (value not transferred to the destination register yet).
  4. Cycle 4 — Actual stack read and transfer: the CPU reads from $0100 + S again (same effective address as cycle 3) and transfers the fetched byte into the destination:
     - PLA: load into A; update N and Z flags based on loaded value.
     - PLP: load into P (processor status). (Behavior of B/unimplemented bits follows NMOS conventions — the pulled value supplies processor flags; emulators/implementations may mask or force the unused bit(s) as appropriate.)
- Important: both cycles 3 and 4 perform memory reads from the stack page. Peripherals and bus-timed hardware will observe these dummy and real reads; they are significant for cycle-exact code and bus contention.

Notes
- These instructions perform reads only; there are no dummy writes associated with PLA/PLP. By contrast, Read-Modify-Write (R-M-W) instructions perform a read, then a dummy write of the unmodified value, then a final write of the modified value (see R-M-W instruction lists for examples).
- For timing-sensitive code (IRQ/ raster-tied hardware), be aware that the cycle-2 dummy fetch returns the next instruction byte and that both cycle-3 and cycle-4 read the stack page.
- Both PLA and PLP consume two stack reads (one dummy, one transfer) and one dummy fetch of the next opcode byte in addition to the opcode fetch — total of 4 memory accesses.

## Source Code
```text
PLA / PLP reference (NMOS 6510)

Opcodes:
  PLA  = $68
  PLP  = $28

Stack page:
  Addresses $0100-$01FF
  Stack byte address = $0100 + S

Microcycle summary (per cycle):
  Cycle 1: Read [PC]            ; opcode fetch, PC -> PC+1
  Cycle 2: Read [PC] (dummy)    ; dummy fetch of next instruction byte
  Cycle 3: Increment S; Read [$0100 + S] (dummy)
  Cycle 4: Read [$0100 + S]; Transfer -> A (PLA) or P (PLP)

Flags (PLA/PLP):
  PLA: sets N and Z from pulled value.
  PLP: loads P from pulled value (implementation-dependent handling of B/unused bits).

Example (conceptual):
  .asm
  lda #$AA
  pha        ; push $AA to stack
  pla        ; pulls into A (final cycle returns $AA)
```

## Key Registers
- $0100-$01FF - 6510 - Stack page (reads on PLA/PLP; SP arithmetic uses these addresses)

## References
- "stack_rts_dummy_fetches" — expands on RTS/RTI and their similar dummy stack fetch behaviour.

## Mnemonics
- PLA
- PLP
