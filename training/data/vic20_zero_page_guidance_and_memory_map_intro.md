# VIC-20 Zero Page: Available Areas, Reserved Locations, and Memory Map

**Summary:** This document provides detailed information on the VIC-20's zero-page memory, including safe temporary work areas, critical system locations to avoid modifying, and a comprehensive memory map. It also includes definitions for specific entries such as the RND seed values and the ST entry at $0090.

**Available Zero-Page Work Areas (Safe for Temporary Use)**

The following zero-page ranges are available for temporary use. It's recommended to copy and restore their original contents if needed:

- **$00FC–$00FF**: General-purpose temporary storage.
- **$0022–$002A**: Utility pointer area and product area for multiplication.
- **$004E–$0053**: Available work area.
- **$0057–$0060**: Available work area.

These areas can be used for transient buffers or short-lived scratch space.

**Zero-Page Locations to Avoid Modifying (Critical System/BASIC Data)**

The following zero-page locations are critical to the operating system or BASIC and should not be modified unless their behavior and contents are fully restored:

- **$0013**: Current I/O prompt flag.
- **$0016–$0018**: Temporary string stack pointer and last temporary string vector.
- **$002B–$0038**: Pointers to the start of BASIC, variables, arrays, and string storage.
- **$003A**: Utility string pointer.
- **$0053–$0054**: Pointer to the limit of memory.
- **$0068**: Floating point accumulator #2.
- **$0073–$008A**: CHRGET subroutine region; used by ROM routines.
- **$0090–$009A**: Status word (ST), number of open files, input and output device numbers.
- **$00A0–$00A2**: Jiffy clock (3-byte).
- **$00B8–$00BA**: Number of characters in filename, current secondary address, current device number.
- **$00C5–$00F4**: Keyboard buffer, screen line link table, and other system-critical data.

Modifying these locations without restoring their state may crash BASIC or ROM routines.

**Notable System Entries and Vectors (Memory Map)**

Below is a detailed memory map of the VIC-20's zero page, including system vectors and interpreter flags:

- **$0000–$0002**: USR jump vector.
- **$0003–$0004**: Float-to-fixed vector.
- **$0005–$0006**: Fixed-to-float vector.
- **$0007**: Search character.
- **$0008**: Scan-quotes flag.
- **$0009**: TAB column save.
- **$000A**: Load/verify flag (0 = LOAD; 1 = VERIFY).
- **$000B**: Input buffer pointer; number of subscripts.
- **$000C**: Default DIM flag.
- **$000D**: Type flag ($FF = string; $00 = numeric).
- **$000E**: Type flag ($80 = integer; $00 = floating point).
- **$000F**: DATA scan; LIST quote; memory flag.
- **$0010**: Subscript/FNx flag.
- **$0011**: Input mode flag (0 = INPUT; $40 = GET; $98 = READ).
- **$0012**: ATN sign/comparison evaluation flag.
- **$0013**: Current I/O prompt flag.
- **$0014–$0015**: Integer value.
- **$0016**: Pointer to temporary string stack.
- **$0017–$0018**: Last temporary string vector.
- **$0019–$0021**: Stack for temporary strings.
- **$0022–$0025**: Utility pointer area.
- **$0026–$002A**: Product area for multiplication.
- **$002B–$002C**: Pointer to start of BASIC.
- **$002D–$002E**: Pointer to start of variables.
- **$002F–$0030**: Pointer to start of arrays.
- **$0031–$0032**: Pointer to end of arrays.
- **$0033–$0034**: Pointer to string storage (moving down).
- **$0035–$0036**: Utility string pointer.
- **$0037–$0038**: Pointer to limit of memory.
- **$0039**: Current GOSUB stack pointer.
- **$003A**: Utility pointer.
- **$003B–$003C**: Pointer to current line.
- **$003D–$003E**: Pointer to current statement.
- **$003F–$0040**: Pointer to current character.
- **$0041–$0042**: Pointer to end of statement.
- **$0043–$0044**: Jump vector for INPUT statement.
- **$0045–$0046**: Jump vector for GET statement.
- **$0047–$0048**: Jump vector for FOR statement.
- **$0049–$004A**: Jump vector for NEXT statement.
- **$004B–$004C**: Jump vector for GOSUB statement.
- **$004D**: Current DATA item type.
- **$004E–$0053**: Available work area.
- **$0054–$0055**: Pointer to current DATA item.
- **$0056**: Current DATA item length.
- **$0057–$0060**: Available work area.
- **$0061–$0066**: Floating point accumulator #1 for calculations.
- **$0067**: Floating point sign.
- **$0068–$006E**: Floating point accumulator #2.
- **$006F**: Floating point sign.
- **$0070–$0072**: Floating point work area.
- **$0073–$008A**: CHRGET subroutine region; used by ROM routines.
- **$008B–$008C**: Pointer to current DATA item.
- **$008D–$008E**: Pointer to end of DATA.
- **$008F**: Current DATA item type.
- **$0090**: Status word (ST).
- **$0091–$0092**: Pointer to current line.
- **$0093–$0094**: Pointer to current statement.
- **$0095–$0096**: Pointer to current character.
- **$0097–$0098**: Pointer to end of statement.
- **$0099**: Device number for input (normally 0 for keyboard).
- **$009A**: Output (CMD) device (normally 3 for screen).
- **$009B–$009C**: Pointer to start of variables.
- **$009D–$009E**: Pointer to start of arrays.

## Labels
- USR
- ST
- CHRGET
