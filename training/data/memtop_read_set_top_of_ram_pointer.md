# MEMTOP — Read/Set Top-of-RAM Pointer ($FE25 / 65061)

**Summary:** MEMTOP is a KERNAL routine at $FE25 (decimal 65061), callable via the jump table entry $FF99 (65433). With Carry set, it loads the top-of-RAM pointer into X/Y; with Carry clear, it stores the pointer from X/Y.

**Description**
- **Routine name/entry:** MEMTOP ($FE25). Jump-table entry: $FF99 (decimal 65433).
- **Purpose:** Read or set the system top-of-RAM pointer used by the KERNAL and some programs to know the highest usable RAM address.
- **Calling convention:**
  - **Carry = 1 (set):** MEMTOP returns the top-of-RAM pointer in the X and Y registers (X = low byte, Y = high byte).
  - **Carry = 0 (clear):** MEMTOP sets the system top-of-RAM pointer from X/Y (X = low byte, Y = high byte).
- **Invocation:** Call via `JSR $FE25` or via the documented jump table `JSR $FF99`. Set or clear the processor Carry flag (`SEC`/`CLC`) before the `JSR` to select behavior.
- **Scope:** Documented KERNAL entry — intended for programs to query or modify the top-of-RAM pointer used by system routines and memory-management conventions.

**Implementation Details**
- **Top-of-RAM Pointer Location:** The top-of-RAM pointer is stored at memory locations $0283-$0284 (643-644 decimal). ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))
- **Register Preservation:** The MEMTOP routine affects the X and Y registers as they are used to return or set the top-of-RAM pointer. The Accumulator (A) and status flags, other than the Carry flag used for input, are preserved. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))
- **Processor Flags on Return:** The Carry flag is used to determine the operation (read or set) and is not modified by the routine. Other processor flags remain unchanged.
- **Edge-Case Behavior:**
  - **Invalid Pointers:** Setting the top-of-RAM pointer to an invalid address (e.g., below the bottom-of-RAM pointer or within I/O or ROM areas) can lead to system instability or crashes. The routine does not perform validation of the pointer value.
  - **Alignment Constraints:** There are no specific alignment constraints enforced by the routine; however, aligning the top-of-RAM pointer to page boundaries (multiples of 256 bytes) is a common practice to avoid fragmentation.
  - **Interaction with ROM Shadowing or I/O Memory:** Care must be taken when setting the top-of-RAM pointer to avoid overlapping with memory-mapped I/O regions ($D000-$DFFF) or ROM areas ($A000-$BFFF for BASIC ROM, $E000-$FFFF for KERNAL ROM). Overlapping these regions can cause unpredictable behavior.

## References
- "ramtas_ram_test_and_memory_pointers" — RAMTAS RAM test and how top-of-RAM pointer is initialized
- "membot_read_set_bottom_of_ram_pointer" — MEMBOT routine (complementary bottom-of-RAM pointer routine)

## Labels
- MEMTOP
