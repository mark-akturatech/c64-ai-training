# GETSPA — Allocate Space for String ($B4F4)

**Summary:** Routine GETSPA at $B4F4 checks whether the requested number of bytes for a string are available in free memory; if not, it invokes garbage collection and retries the allocation. Searchable terms: $B4F4, GETSPA, string allocation, garbage collection.

**Description**

GETSPA is a memory-allocation helper used when a string needs space reserved. The caller passes the amount of space required to GETSPA; the routine checks the available free memory and, if that amount is not available, triggers the string garbage-collection process and retries the allocation. If space is then available, the allocation proceeds; if not, an "OUT OF MEMORY" error is generated.

**Calling Convention:**

- **Input:** The number of bytes required is passed in the X register.
- **Output:** On successful allocation, the starting address of the allocated space is returned in the A and Y registers (A = low byte, Y = high byte). If allocation fails after garbage collection, an "OUT OF MEMORY" error is generated.

**Side Effects:**

- **Registers:** The A, X, and Y registers are modified. The status register is affected.
- **Memory:** The routine may invoke garbage collection, which can move strings in memory and update string descriptors accordingly.

**Garbage Collection:**

If sufficient space is not available, GETSPA calls the garbage collection routine at $B526. This routine compacts the string storage area by removing unused strings and consolidating free space. The garbage collection process can be time-consuming, especially when many strings are in use, as it involves scanning and potentially moving numerous strings in memory.

**String Storage Details:**

- **Alignment:** Strings are stored contiguously in the string heap, growing downward from the top of available memory.
- **Bookkeeping:** Each string is referenced by a descriptor containing its length and a pointer to its location in the string heap. The garbage collection process updates these descriptors as needed.

## Key Registers

- **A Register:** Low byte of the allocated space address upon successful allocation.
- **X Register:** Input register containing the number of bytes requested.
- **Y Register:** High byte of the allocated space address upon successful allocation.

## References

- "garbag_string_garbage_collection_overview" — expands on the garbage collector GETSPA invokes when space is insufficient
- "strlit_scan_and_setup" — shows callers that invoke GETSPA to reserve space for string literals

## Labels
- GETSPA
