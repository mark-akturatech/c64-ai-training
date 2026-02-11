# $0302-$0303 IMAIN — Vector to the Main BASIC Program Loop

**Summary:** $0302-$0303 (IMAIN) is a RAM-stored pointer/vector to the main BASIC program loop in the KERNAL/BASIC area; it points to $A483 (decimal 42115) and is used when the machine is in direct (READY) mode to execute statements or store program lines.

## Description
IMAIN is a two-byte vector located at $0302-$0303 that contains the address of the main BASIC program loop. When the C64 is in direct (READY) mode, this routine is the active handler: it executes entered BASIC statements or stores them as program lines. The vector value referenced here is $A483 (42115), the entry point for the BASIC main loop used for immediate/direct command processing.

## Key Registers
- $0302-$0303 - RAM - IMAIN: vector to the main BASIC program loop (points to $A483 / 42115)

## References
- "basic_indirect_vector_table" — BASIC indirect vectors overview

## Labels
- IMAIN
