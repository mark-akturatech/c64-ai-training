# Undocumented store high-byte collision on page-cross (SHA/SHX/SHY/TAS)

**Summary:** Explains why STA (absolute,X / absolute,Y) implements a page-cross "fix-up" (so STA ABX/ABY always takes the full 5 cycles) while several undocumented store opcodes (SHA/SHX/SHY/TAS and relatives) lack that fix-up; describes how the VIC/6502 style buffered reads and the write-timing cause the high-byte/address and the data value to collide when an index addition crosses a page boundary.

**Explanation**

- **Normal absolute-indexed store timing (illustrated by STA abs,X / STA abs,Y):**
  - The 6502 performs address low-byte fetch, adds the index (X or Y), detects a carry (page-cross), increments the high-byte if needed, then performs a dummy/buffered read before the final write. This sequencing separates the address high-byte computation from the final data write so the address and the data value cannot interfere.
  - As a consequence, STA abs,X/abs,Y always includes the "fix-up" cycle that guarantees the correct (possibly incremented) high-byte is used for the store — STA abs,X/abs,Y therefore always behaves consistently and uses the expected 5 cycles.

- **What the undocumented store opcodes do differently:**
  - Illegal store opcodes in the same opcode-family (SHA, SHX, SHY, TAS, also often called the "unstable_address_high_byte_group") perform internal logical operations (for example: store A&X, A&Y, or A&X&<mask>) and place intermediate results onto the data bus during one of the internal read cycles.
  - On these opcodes, the CPU's internal microsequence places the computed store-value onto the data bus in the same cycle that the high-byte of the address is being fetched (or immediately after the high-byte computation), instead of being strictly separated by a dummy cycle as STA does.
  - If adding the index to the low-byte causes a page-cross, the high-byte increment happens as usual — but that incremented high-byte (or the bus-read returning it) can be visible on the data bus at the same time the illegal-opcode logic is computing/placing its store value. The two uses of the bus "collide": the high-byte value and the data-value are both present in related micro-operations and get combined by the undocumented microcode path (commonly via an AND with A&X, or similar), producing an outcome where the stored value depends on the (incremented) high-byte. The result is unstable or surprising stores when a page-cross occurs.
  - In short: undocumented stores often omit the separation fix-up cycle and reuse the same buffered read cycle for both address-high-byte activity and data-value placement, so a page carry changes the high-byte and that high-byte participates in the data computation (or is overwritten by it) — leading to collisions.

- **Practical observable effect (example):**
  - SHA $7133,Y (opcode bytes 9F 33 71) — when Y addition crosses a page boundary, the high-byte is incremented (to $72) and then the implementation ANDs that high-byte (or the bus content) with (A & X), so the value actually written becomes (incremented-high-byte & A & X) rather than just (A & X).
  - The behavior can be reproduced by sequences that force the same bus contents and timing; the following instruction sequence demonstrates the equivalent sequence of bus-value and register operations the undocumented opcode performs internally (this reproduces the collision behavior in explicitly observable instructions).

- **Consequences:**
  - Code that relies on SHA/SHX/SHY/TAS with addresses that may cross pages can write unexpected values or write to the wrong page.
  - STA (documented store) is safe for page-crossing addressing because of the dedicated fix-up cycle; the undocumented stores are not safe and are implementation-dependent.

- **Implementation note:**
  - This is a microcode/timing artifact of the NMOS 6502/6510 family and how bus buffering and read/write timing are implemented. Different 6502-family clones or later CMOS variants may behave differently.

## Source Code
```asm
; Example opcode and an explicit sequence that reproduces the internal bus timing collision
; SHA $7133,Y  -> opcode bytes: 9F 33 71
; When Y addition crosses page, high-byte is incremented then (apparently) ANDed with (A & X)

; Opcode bytes:
.byte $9F, $33, $71    ; SHA $7133,Y

; Equivalent explicit instruction sequence (reproduces the bus/content timing effect):
PHP
PHA
STX $02         ; store X temporarily to memory $0002
AND $02         ; read back saved X (used to build A&X on bus)
AND #$72        ; mask with high-byte value that would be on the bus ($72 example)
STA $7133,Y     ; documented store used here to place computed value with page-indexing
LDX $02
PLA
PLP

; Note: the above sequence is conceptual and demonstrates how the illegal opcode
; reuses read cycles and data-bus contents; it's not a byte-for-byte emulation,
; but reproduces the observed effect by forcing the same bus values at the same times.
```

```text
Timing sketch (conceptual) — abs,Y / abs,X family (cycles numbered loosely):
Cycle 1: opcode fetch
Cycle 2: fetch low-byte of address (address_lo)
Cycle 3: fetch high-byte of address (address_hi) ; add index to low-byte, if carry then address_hi++
Cycle 4: dummy read (documented stores keep this to separate address compute from data) OR data-placement/read for undocumented opcode
Cycle 5: write data to final address (for STA abs,X/Y this is the write cycle)

For documented STA:
 - Cycle 3 performs high-byte fetch and fix-up (increment if carry)
 - Cycle 4 is a dummy read that separates bus activity from the write
 - Cycle 5 does the actual write (value is taken from A)

For undocumented stores (SHA/SHX/...):
 - Cycle 4 may be used to compute/place the store-value on the bus (A&X etc.)
 - If page-cross occurred at Cycle 3, the incremented high-byte and the computed store-value may overlap or be combined, causing the write to depend on the address high-byte (collision).
```

```text
6502 Absolute Indexed Store Timing Diagram (STA abs,X / STA abs,Y):

Cycle | Operation               | Address Bus | Data Bus | Notes
------|-------------------------|-------------|----------|--------------------------------------------
1     | Fetch Opcode            | PC          | Opcode   | Fetch instruction opcode
2     | Fetch Low Byte of Addr  | PC+1        | Addr_Lo  | Fetch low byte of target address
3     | Fetch High Byte of Addr | PC+2        | Addr_Hi  | Fetch high byte of target address
      |                         |             |          | Add index register (X or Y) to Addr_Lo
      |                         |             |          | If carry occurs, increment Addr_Hi
4     | Dummy Read              | Addr+Index  | --       | Dummy read to separate address calc from write
5     | Write Accumulator       | Addr+Index  | A        | Write accumulator to calculated address
```

```text
6502 Undocumented Store Timing Diagram (SHA/SHX/SHY/TAS):

Cycle | Operation               | Address Bus | Data Bus | Notes
------|-------------------------|-------------|----------|--------------------------------------------
1     | Fetch Opcode            | PC          | Opcode   | Fetch instruction opcode
2     | Fetch Low Byte of Addr  | PC+1        | Addr_Lo  | Fetch low byte of target address
3     | Fetch High Byte of Addr | PC+2        | Addr_Hi  | Fetch high byte of target address
      |                         |             |          | Add index register (X or Y) to Addr_Lo
      |                         |             |          | If carry occurs, increment Addr_Hi
4     | Compute Store Value     | Addr+Index  | A & X    | Compute value (e.g., A & X) and place on bus
      |                         |             |          | Potential collision if page-cross occurred
5     | Write Computed Value    | Addr+Index  | A & X    | Write computed value to calculated address
```

In the above diagrams, the timing of the undocumented store instructions (SHA/SHX/SHY/TAS) shows that during Cycle 4, the computed store value is placed on the data bus simultaneously with the address high-byte computation. This overlap can cause the high-byte and data value to interfere, leading to unintended writes when a page boundary is crossed.

## References
- "unstable_address_high_byte_group" — details the same group of undocumented store opcodes and their unstable address-high-byte interactions
- Visual6502.org — provides transistor-level simulation and detailed analysis of the 6502 CPU
- "Visual6502wiki/6502 State Machine" — discusses the internal timing states and micro-operations of the 6502
- "Visual6502wiki/6502 Timing States" — provides insights into the timing states and cycles of the 6502
- "CPU unofficial opcodes" — details the behavior of undocumented opcodes in the 6502

## Mnemonics
- STA
- SHA
- SHX
- SHY
- TAS
