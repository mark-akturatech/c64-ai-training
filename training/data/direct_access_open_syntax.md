# OPEN (direct-access) — C64 to 1541

**Summary:** Syntax and examples for opening a direct-access data channel between the C64 and the 1541 disk drive using OPEN file#, device#, channel#, "#" — covers logical file number (1–127), device number (8), and secondary address / channel (2–14). Explains that direct-access commands reference the channel number while GET#/INPUT#/PRINT# use the logical file number.

## Syntax and behavior
The direct-access OPEN statement establishes a communication link between the C64 and a 1541 disk drive.

- SYNTAX: OPEN file#, device#, channel#, "#"
  - file# — logical file number on the C64 side (1 to 127)
  - device# — device number (1541 is 8)
  - channel# — secondary address on the 1541 side (2 to 14)

- Examples:
  - OPEN 2,8,2,"#" — opens logical file 2 on C64, device 8, channel (secondary address) 2 on the 1541
  - OPEN 1,8,14,"#" — opens logical file 1 on C64, device 8, channel 14 on the 1541

- Important distinctions:
  - The channel (secondary address) is referenced only by direct-access commands (for example, a block-read command — "Ul" as shown in the source). 
  - Data read/write I/O from the BASIC side always uses the logical file number: GET# file#, INPUT# file#, PRINT# file#.
  - The logical file number and the channel number are independent and do not have to match; any similarity is only mnemonic.

## Source Code
```basic
REM Direct-access OPEN syntax and examples
OPEN 2,8,2,"#"
OPEN 1,8,14,"#"

REM Notes:
REM file# = logical file number (1-127)
REM device# = 8
REM channel# = secondary address on 1541 (2-14)
```

## References
- "direct_access_command_list" — expands on use of the channel number in direct-access commands such as Ul, U2, B-P
