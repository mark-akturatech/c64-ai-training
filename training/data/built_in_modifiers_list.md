# Kick Assembler: BasicUpstart Modifier and Memory Map Example

**Summary:** Kick Assembler's built-in `BasicUpstart` modifier inserts a BASIC upstart block pointing to a specified address. This example demonstrates a memory map with a BASIC block at $0801 and a `ZeroPage_Code` segment at $0010. It also illustrates placing external data (e.g., a SID file) at an alternate address using the assembler origin directive (`*=`).

**BasicUpstart Modifier**

The `BasicUpstart` is a built-in segment modifier that accepts the parameter `_start`. When applied, it adds a memory block containing a BASIC "upstart" program that points to the address specified in `_start`. This creates the standard C64 BASIC header/loader bytes at a chosen location (commonly $0801), enabling the assembled program to be launched by the BASIC interpreter or via a standard autostart mechanism.

**Notes:**

- Modifier name: `BasicUpstart`
- Parameter name: `_start`
- Effect: Adds a memory block with a BASIC upstart program pointing to the specified address

**Exact Byte Sequence of the BASIC Upstart Block:**

The `BasicUpstart` modifier generates the following byte sequence at the specified start address (commonly $0801):

| Address | Byte Sequence | Description                         |
|---------|---------------|-------------------------------------|
| $0801   | 0C 08         | Pointer to next line (line at $080C)|
| $0803   | 0A 00         | Line number 10                      |
| $0805   | 9E            | Token for 'SYS'                     |
| $0806   | 34 30 39 36   | '4096' in PETSCII                   |
| $080A   | 00            | End of line marker                  |
| $080B   | 00            | End of program marker               |

This sequence corresponds to the BASIC line:


This line, when executed, calls the machine code routine starting at address 4096 ($1000).

**Syntax Example for Applying the BasicUpstart Modifier:**

To apply the `BasicUpstart` modifier to a segment, use the following syntax:


In this example:

- The `.file` directive specifies the output file name and the segment to include.
- The `.segment` directive defines the `Code` segment starting at $8000, applying the `BasicUpstart` modifier with the `_start` parameter set to $8000.
- The code within the segment increments the border color register and loops indefinitely.

This setup ensures that the assembled program includes a BASIC upstart that points to the machine code at $8000.

**Memory Map Example**

The example memory map includes two segments: a Default (BASIC) segment placed at $0801 and a `ZeroPage_Code` segment placed at $0010. The listing indicates the assembled ranges for each segment, including a BASIC End marker.

- Default-segment (BASIC) occupies $0801-$080C and $080E-$0824 (BASIC End)
- `ZeroPage_Code`-segment occupies $0010-$0015

Since the bytes are supplied through an intermediate segment, all intermediate parameters can be used. This means that when data is provided via an intermediate/temporary segment, segment parameters (such as start address overrides) can be applied to control final placement and relocation.

**Example Usage:**

Using the origin directive to place a binary/SID file at an alternate address:


This directive sets the assembly origin to $8000 and labels the segment as "Music Data," allowing the inclusion of external data at this specific address.

## Source Code

```
10 SYS 4096
```

```assembly
.file [name="test.prg", segments="Code"]
.segment Code [start=$8000, modify="BasicUpstart", _start=$8000]
    inc $d020
    jmp *-3
```

```assembly
*=$8000 "Music Data"
```


```text
Segments

Memory Map
---------Default-segment:
$0801-$080C Basic
$080E-$0824 Basic End
ZeroPage_Code-segment:
$0010-$0015 ZeroPage_Code

Since the bytes are supplied through an intermediate segment all intermediate parameters can be used. In the
following example, a sid file is placed at an alternative address:
*=$8000 "Music Data"
```

## References

- [Kick Assembler Manual: Segment Modifiers](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s13.html)
- [Kick Assembler Manual: Special Features - Basic Upstart Program](https://theweb.dk/KickAssembler/webhelp/content/ch14s02.html)