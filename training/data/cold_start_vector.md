# Cold Start Vector ($A000-$A001)

**Summary:** Cold Start Vector at $A000-$A001 points to the BASIC initialization routine invoked after OS power-on init; it results in the screen being cleared and the "**** COMMODORE 64 BASIC V2 ****" and BYTES FREE message being printed. See ROM entry 58260 ($E394) for the full initialization sequence and $DD00 (56576) for notes on switching BASIC out so the VIC-II can access the underlying RAM.

## Description
The two-byte Cold Start Vector stored at addresses $A000-$A001 contains the entry address for the routine that initializes BASIC after the Operating System completes its power-on activities. When the OS jumps to this vector the BASIC init routine performs tasks that include clearing the screen and printing the startup banner:

    **** COMMODORE 64 BASIC V2 ****

followed by the BYTES FREE message. For a step-by-step breakdown of what the BASIC initialization does, consult the ROM entry at decimal 58260 ($E394).

When BASIC is not required, it may be switched out so the RAM beneath the BASIC ROM becomes available to the VIC-II for screen graphics; see location 56576 ($DD00) for details on switching out BASIC and related behavior. Warm start (STOP/RESTORE) behavior and BRK-related entry use different vectors (see warm_start_and_brk_behavior).

## Key Registers
- $A000-$A001 - Cold Start Vector - entry address for BASIC initialization routine invoked after OS power-on init
- $DD00 - CIA 2 base - referenced location (56576) for information about switching out BASIC so VIC-II can access RAM underneath

## References
- "58260 ($E394)" — BASIC initialization routine details
- "56576 ($DD00)" — switching out BASIC / VIC-II RAM access
- "warm_start_and_brk_behavior" — warm start and BRK-related vector behavior

## Labels
- COLD_START_VECTOR
