# Editor/Assembler Package (Method)

**Summary:** Use an on-C64 editor/assembler package (editor/assembler) to enter and assemble machine code; provides easier entry and debugging than a machine language monitor and DATA statements, but shares the same disadvantage of needing to load assembled machine code from tape/disk when returning to BASIC.

## Description
Advantages:
- Similar benefits to using a machine language monitor: direct entry and single-step/debugging facilities for machine code.
- Programs are generally easier to enter (editor + assembler workflow) compared with manual monitor entry.

Disadvantages:
- Same practical drawback as a machine language monitor: assembled machine code must be saved and reloaded from tape or disk when restarting BASIC or powering up the machine.
- Does not remove the requirement to manage binary program storage/transfer outside BASIC.

Note: Both editor/assembler packages and machine language monitors provide better entry/debugging than using DATA statements for machine code.

## References
- "machine_monitor_method" — expands on the machine language monitor method and compares its entry/debugging workflow to editor/assembler packages
