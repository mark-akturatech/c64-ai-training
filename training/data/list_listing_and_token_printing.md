# LIST ($A69C)

**Summary:** Routine at $A69C implements the BASIC LIST command: it saves the range of program lines to be printed into pointers at $005F-$0060 and $0014-$0015, then prints those lines while translating one-byte BASIC tokens back to ASCII text.

## Description
This routine performs the LIST command for BASIC programs. Its operation is twofold:

- Save the range of lines to be listed into two zero-page pointer locations:
  - Pointer A: $005F-$0060 (bytes 95–96 decimal)
  - Pointer B: $0014-$0015 (bytes 20–21 decimal)
  These pointers hold the low/high addresses used by the LIST routine to know where to start and stop printing.

- Iterate through the program lines in memory from the start pointer to the end pointer and output each line in textual form. During output the routine converts single-byte BASIC tokens (the tokenized internal representation used by BASIC) back into their ASCII keyword equivalents so the listing appears as human-readable BASIC source.

This routine refers to the token-to-ASCII conversion functionality handled elsewhere (see referenced chunk "qplop_token_to_ascii" for the token expansion details used during LIST).

## Key Registers
- $0014-$0015 - Zero page pointer (bytes 20–21 decimal) used to store part of the LIST range
- $005F-$0060 - Zero page pointer (bytes 95–96 decimal) used to store part of the LIST range

## References
- "qplop_token_to_ascii" — expands on how QPLOP converts one-byte BASIC tokens back to ASCII for LIST
