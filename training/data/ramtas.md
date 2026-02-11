# RAMTAS ($FF87)

**Summary:** KERNAL entry RAMTAS at vector $FF87 (real address $FD50) clears RAM ranges $0002-$0101 and $0200-$03FF, performs a memory test, and configures the BASIC workspace and the datasette buffer at $033C. No input/output parameters; uses registers A, X, Y.

**Description**
RAMTAS is a KERNAL routine accessed via the vector at $FF87, which points to the routine's actual address at $FD50. Its functions include:

- **Clearing RAM:** Sets memory locations $0002-$0101 and $0200-$03FF to $00.
- **Memory Test:** Performs a nondestructive test starting at $0400, writing and verifying the value $55. The test continues until a non-RAM location is detected, typically at $A000 where the BASIC ROM begins.
- **Configuring BASIC Workspace:** Sets the start of BASIC program text to $0800 and the screen memory base to $0400.
- **Datasette Buffer:** Sets the datasette buffer pointer to $033C.
- **Registers Used:** Utilizes registers A, X, and Y during its operation.
- **No Parameters or Return Values:** The routine does not take input parameters or return explicit values.

The memory test involves writing the value $55 to each location and verifying it. If the value is read back correctly, the location is considered RAM; otherwise, the test stops, and the first non-RAM address is used to set the top of memory pointer. The bottom of memory is set to $0800, and the screen memory base is set to $0400. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

The routine also clears specific memory ranges by writing $00 to each location. This includes zero page locations $0002-$00FF and memory from $0200-$03FF. ([manualmachine.com](https://manualmachine.com/misc8bitbooks/vic20andcommodore64toolkitkernal/28530756-a/?utm_source=openai))

No additional side effects beyond the listed memory ranges are documented. The routine does not alter system vectors or other zero page entries beyond those specified.

The routine does not provide explicit return values or status indicators to signal the success or failure of the memory test. It is designed to set up the system memory configuration during initialization without returning status information.

## References
- "memtop" — expands on BASIC workspace upper boundary (MEMTOP $FF99)
- "membot" — expands on BASIC workspace lower boundary (MEMBOT $FF9C)

## Labels
- RAMTAS
