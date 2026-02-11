# Kick Assembler: .segmentdef "dest" Parameter and Fill Byte

**Summary:** Details the `.segmentdef` directive in Kick Assembler, focusing on the `dest` parameter for assigning destination identifiers to segments and the `fill` parameter for setting fill bytes. These parameters assist in organizing code for debugging and memory management. Keywords: Kick Assembler, .segmentdef, dest, fill, debugger, DISKDRIVE, BANK1.

**Description**

- **.segmentdef Directive Syntax:**
  The `.segmentdef` directive defines a segment with optional parameters enclosed in square brackets. The general syntax is:

  Parameters can include `dest`, `fill`, `fillByte`, `min`, `max`, `hide`, among others.

- **`dest` Parameter:**
  Assigns an informational destination name to a segment, such as "DISKDRIVE" or "BANK1". This is intended for external tools like debuggers to organize debug data. The assembler itself does not impose semantics on this value. ([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))

- **`fill` and `fillByte` Parameters:**
  - `fill`: When set, fills unused bytes between `min` and `max` addresses with a specified fill byte.
  - `fillByte`: Specifies the value of the fill byte; defaults to $00 if not set. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html?utm_source=openai))

- **Usage Example:**
  Defining a segment with a destination and fill parameters:

  In this example, `DataSegment` is tagged with the destination "DISKDRIVE", has a memory range from $1000 to $2000, and fills unused bytes with $FF.

- **Clarification on `X` and `hide` Tokens:**
  - `X`: Indicates that the parameter is applicable to intermediate segments.
  - `hide`: When set, the segment is hidden in memory dumps. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html?utm_source=openai))

- **Version Support:**
  The `dest` parameter is supported in Kick Assembler version 5.x and later. Its semantics are primarily for external tools like debuggers to interpret and organize debug data. ([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))

## Source Code

  ```
  .segmentdef SegmentName [parameter1=value1, parameter2=value2, ...]
  ```

  ```
  .segmentdef DataSegment [dest="DISKDRIVE", min=$1000, max=$2000, fill, fillByte=$FF]
  ```

```assembly
.segmentdef DataSegment [dest="DISKDRIVE", min=$1000, max=$2000, fill, fillByte=$FF]

.segment DataSegment
*=$1000
.byte 1, 2, 3
```

In this code, `DataSegment` is defined with a destination "DISKDRIVE", a memory range from $1000 to $2000, and fills unused bytes with $FF. The segment starts at $1000 and contains the bytes 1, 2, and 3.

## References

- ([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))
- ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html?utm_source=openai))
