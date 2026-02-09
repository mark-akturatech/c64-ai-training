# 6510 Architecture (Block-level)

**Summary:** Block-level description of the 6510 internal registers: program counter (high/low bytes), accumulator (A), index registers X and Y, stack pointer (stack page $0100-$01FF, SP initialized to $FF), and status register flags (C, Z, I, D, B, V, N). Notes that the Commodore 64 exposes hardware registers as memory-mapped locations.

## 6510 Architecture
- Program Counter (PC): the 16-bit program counter outputs its high and low bytes on the address lines whenever the CPU performs a memory access. The PC selects the next instruction/address on the system bus.

- Accumulator (A): the primary data register. Most data passing through the system flows through A; nearly all arithmetic and logical operations (except the single-byte increment/decrement instructions) operate on A. Typical flow: read memory → load/modify in A → store back to memory.

- Index Registers (X and Y): X and Y move and manipulate data similarly to A and are commonly used as index registers for addressing arrays. They are not interchangeable: specific instructions require X or Y.

- Stack Pointer (SP) and Stack memory:
  - The 6510 uses a hardware stack residing at memory page $0100–$01FF.  
  - The SP contains the low-byte offset into that page and points to the next empty location on the stack.  
  - By convention the SP is initialized to $FF at program start (top of stack).  
  - The processor implements the stack as $0100 + SP (SP used as an index from the page base).

- Status Register (P): an 8-bit condition register whose bits reflect processor state and control some behavior. Bits are:
  - C — Carry
  - Z — Zero
  - I — Interrupt Disable (IRQ mask)
  - D — Decimal Mode
  - B — Break Command
  - V — Overflow
  - N — Negative
  Some of these bits can be changed under software control (via flag-modifying instructions).

- Memory-mapped hardware: On the Commodore 64, hardware registers are mapped into the system memory map; to the 6510 they appear as ordinary memory locations, so accesses to hardware registers and ordinary RAM use the same bus/addressing mechanisms.

## Key Registers
- $0100-$01FF - CPU stack page - stack memory used by the 6510; SP holds offset into this page (SP typically initialized to $FF)

## References
- "assembly_syntax_labels_comments" — expands on how registers are used by instructions  
- "interrupts_overview_purpose" — expands on status register flags and interrupts (IRQ/NMI)