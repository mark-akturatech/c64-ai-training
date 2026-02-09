# 1541 Block-Read Buffers and OPEN "#buffer#" Syntax

**Summary:** Describes the 1541 block-read (U1) → memory-read (M-R) workflow where a block-read loads a track/sector into one of four 256-byte RAM buffers; explains OPEN 2,8,2,"#" (DOS-selected buffer) and the explicit buffer selection syntax OPEN file#,device#,channel#,"#buffer#" (buffer# 0–3).

## Workflow
- Typical sequence: issue a block-read command (U1) first, then issue a memory-read command (M-R) to access the data.
- A block-read (U1) transfers the data recorded on a specified track and sector into one of four 256-byte RAM pages. Each 256-byte page is called a buffer.
- When opening a direct-access data channel to the 1541 using OPEN 2,8,2,"#", DOS selects one of the four buffers arbitrarily as the workspace for that channel.
- If you only use GET# or PRINT# on that channel, you do not need to know which buffer DOS chose.
- Buffer selection matters when issuing a memory-read (M-R) command (M-R reads from the buffer chosen for the channel).
- You may explicitly select which buffer to use in the direct-access OPEN statement by providing "#buffer#" as the fourth parameter; valid buffer numbers are 0 through 3.

## Source Code
```basic
' Syntax for explicit buffer selection in OPEN:
OPEN file#, device#, channel#, "#buffer#"

' Example:
OPEN 2,8,2,"#0"   ' select buffer 0 for file# 2, device 8, channel 2
```

## Key Registers
- (omitted — this chunk documents DOS buffer selection and OPEN syntax, not hardware registers)

## References
- "buffer_address_map_1541" — expands on the actual memory address ranges for each 256-byte buffer and reserved regions
- "memory_read_parameters_and_defaults" — explains the M-R parameters and defaults used to read from the selected buffer or other memory areas