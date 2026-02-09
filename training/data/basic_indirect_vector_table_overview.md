# BASIC Indirect Vector Table (Locations 768-779 / $0300-$030B)

**Summary:** Describes the BASIC indirect vector table in RAM at $0300-$030B (decimal 768–779), how vectors are initialized to point past ROM JMP instructions (JMP ($0300)), why vectored BASIC routines (error handler, token LISTing, token execution, etc.) improve cross-machine compatibility, and how changing these RAM vectors enables preprocessing and adding new BASIC commands.

## Description
Several important BASIC routines in the C64 are reached through RAM-based indirect vectors stored at $0300–$030B. Instead of executing a direct JMP into ROM, the ROM contains an instruction such as JMP ($0300). On power-up the system initializes the RAM vector at $0300 to contain the address of the instruction immediately following that JMP in ROM, so execution continues as if the JMP were not present.

Example: the BASIC error-message routine begins at $A437 (42039). ROM contains JMP ($0300) at that entry point; the indirect vector at $0300 is initialized to $A43A (42042), the instruction immediately after JMP ($0300), so control continues normally.

Using these RAM vectors provides two main benefits:
- Portability: Programs can call important BASIC routines without hardcoding ROM addresses that differ between machines. For example, the routine that LISTs the ASCII text of the single-byte BASIC token currently in A is vectored at decimal 774 ($0306). The BASIC expression QP=PEEK(774)+256*PEEK(775) yields the current address of that routine on any machine that uses this vector layout.
- Extensibility/hooking: Because vectors live in RAM, you can change them to redirect execution to your own preprocessing or extended routines before optionally jumping to the original ROM code. This is how you can add or modify BASIC behavior without rewriting ROM.

## Behavior and use cases
- Initialization: On power-up each vector is loaded with the two-byte address pointing to the instruction after the ROM's JMP (i.e., the ROM expects an indirect vector and the vector contains the "next" address).
- Compatibility: Vectored calls hide ROM absolute addresses; code that reads the two-byte vector will find the correct entry point across VIC/64/other machines.
- Extending BASIC (high-level steps required):
  1. Modify the routine that converts ASCII program text to tokenized program format (so new keywords are tokenized on entry).
  2. Change the routine that executes tokens so your new token performs the desired action.
  3. Change the routine that converts tokens back to ASCII (LIST) so the new token is printed correctly.
  4. Optionally alter the error-message routine to add messages for the new keyword.
- Practical hooking: Redirect the appropriate vector(s) to point at your preprocessing code in RAM; your code can then invoke the original ROM address (saved elsewhere) if desired.

**[Note: Source may contain an error — the original text used short hex forms like $300; this document normalizes to 4-digit $0300-$030B for clarity.]**

## Key Registers
- $0300-$030B - RAM - BASIC indirect vector table (vectors for key BASIC routines such as the error handler, token execution, token LISTing, tokenization, etc.)

## References
- "basic_vectors_768_779_entries" — Specific vectors (IERROR, IMAIN, ICRNCH, IQPLOP, etc.) are listed in the following entries