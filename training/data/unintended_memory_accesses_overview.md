# NMOS 6510 — unintended memory accesses and dummy bus cycles

**Summary:** The 6502/6510 always performs at least one memory access per instruction cycle (opcode fetch from PC); many instructions perform additional reads/writes (operand fetches, effective-address reads, dummy reads/writes). Dummy cycles (reads or writes whose data is not used by the CPU) can trigger side effects on memory-mapped I/O ($Dxxx), and those dummy accesses are often (ab)used for cycle-exact tricks and hardware effects.

**Overview**
Every 6502/6510 instruction execution begins with an opcode fetch (a memory read from the address in PC, then PC increments). After the opcode fetch, the CPU performs whatever additional bus cycles that instruction’s addressing mode and operation require — low/high address byte fetches, data reads, data writes, and sometimes “dummy” cycles. Dummy cycles are bus transactions where the CPU performs a read or write but does not use the fetched data (or the write is a write of an unmodified/temporary value). On NMOS 6502 variants (including the 6510 in the C64), those dummy cycles still drive the address and data bus and therefore can interact with memory-mapped I/O.

**Typical bus-cycle patterns and dummy accesses (summary)**
- **Opcode fetch**  
  - Always: read from PC (opcode). PC increments.
- **Immediate addressing**  
  - Opcode fetch, read immediate operand (from PC).
- **Absolute / Zero page addressing (read)**  
  - Opcode fetch, read low byte (PC), read high byte (PC), read data at effective address.
- **Absolute / Zero page addressing (write)**  
  - Opcode fetch, read low, read high, then write data to effective address.
- **Indexed addressing with page crossing**  
  - May include an extra dummy read (or fetch) when index addition crosses a page boundary (address low contains carry into high byte); this results in an extra memory access.
- **Indirect and (Indirect,X)/(Indirect),Y pointer modes**  
  - Pointer dereference causes one or more extra reads (pointer low/high fetches) and in some variants a dummy read cycle while the high byte is fetched or while the pointer is incremented/adjusted.
- **Read-Modify-Write (R-M-W) instructions (e.g., INC, DEC, ASL, LSR, ROL, ROR on memory)**  
  - NMOS 6502 bus behaviour: after the opcode and address-byte fetches, the CPU performs a read from the target memory location, then it performs a write cycle that writes the fetched (original) value back (a dummy write), and finally the modified value is written back in a further write cycle. In practice, this results in two write cycles to the same address around the operation — the first write is the dummy write of the original data, the second writes the new result.
- **Branches**  
  - Branch taken and/or page crossing cause extra fetch cycles (and may perform dummy fetches during the additional cycles).
- **Stack and implied mode instructions**  
  - Push/pop, PHP/PLA, JSR/RTS produce reads/writes to the stack area; stack cycles are genuine memory accesses (not treated specially by bus).

**Side effects when targeting memory-mapped I/O**
- Memory-mapped I/O registers on the C64 (VIC-II, SID, CIAs, user cartridges, glue logic) can have read- or write-side effects (e.g., latching, clearing, acknowledging, incrementing, or toggling internal state). Because dummy cycles still drive address and data lines, they can:
  - Trigger hardware on a dummy write (even though CPU intends it as a temporary/dummy write).
  - Cause reads of I/O registers whose read operation has side effects (e.g., clearing a flag, acknowledging an interrupt).
- Practical consequence: a single CPU instruction can cause multiple visible hardware transactions (reads/writes) against the same I/O address because of dummy cycles. This is important when an instruction inadvertently targets an I/O register (for example, through a pointer or computed effective address).

**(Ab)uses and common uses**
- **Deliberate timing tricks:** use known dummy cycles to align CPU bus activity with raster lines or to create precisely timed pulses to peripherals.
- **Triggering multiple writes in one instruction:** R-M-W instructions perform a dummy write followed by the final write — this can be exploited where a peripheral reacts to the first write differently than the second.
- **Reading side-effectful registers at specific cycles:** some code deliberately sequences pointer/index addressing to make the CPU perform a dummy read at the exact scanline cycle where the hardware puts useful data on the bus.
- **Cycle-exact synchronization:** dummy cycles are part of the precise cycle count of instructions and are used in demos and drivers to meet timing constraints (e.g., shaping IRQ timing, raster effects).

**Caveats and warnings**
- Do not assume dummy cycles are harmless on hardware with memory-mapped side effects — code that works with RAM may misbehave when the same addresses map to I/O.
- The exact bus sequence (which cycles are dummy, which are real reads/writes, and how many cycles an instruction consumes) can be NMOS-specific; some CMOS 65C02 variants changed behavior for certain addressing modes and RMW sequences. Code that relies on NMOS dummy cycles may not behave identically on other 6502-family chips.
- Page-crossing and pointer modes introduce extra cycles that can make an address target an I/O register for a different cycle than intended.

## Source Code
```text
; Example: Read-Modify-Write (R-M-W) instruction (e.g., INC $D020)
; This demonstrates the bus cycles and potential side effects on memory-mapped I/O.

; Assembly instruction
INC $D020

; Bus cycle breakdown:
; Cycle 1: Fetch opcode (INC) from memory at address PC.
; Cycle 2: Fetch low byte of address ($20) from memory at address PC+1.
; Cycle 3: Fetch high byte of address ($D0) from memory at address PC+2.
; Cycle 4: Read from effective address $D020 (original value read).
; Cycle 5: Dummy write to $D020 (original value written back).
; Cycle 6: Write to $D020 (incremented value written).

; Note: The dummy write in Cycle 5 can trigger side effects in the hardware mapped at $D020.
```

## Key Registers
- **$D020**: VIC-II Border Color Register

## References
- "read_modify_write_dummy_write_behavior" — expands on dummy writes in R-M-W instructions

## Mnemonics
- INC
- DEC
- ASL
- LSR
- ROL
- ROR
