# MACHINE - B-Series Bank 15 Zero-Page & Low Memory Layout (Bank 15, $0002-$00C7+)

**Summary:** Zero-page and low-memory layout for B-Series Bank 15, covering addresses $0002–$00C7 and beyond. This layout details various system and BASIC interpreter fields, including pointers for PRINT USING, TI$ time elements, USR jump/accumulators, BASIC program boundaries, string management, FOR/NEXT stack, function/descriptor pointers, monitor save vectors, and other working storage.

**Layout**

This section provides a field-by-field map of zero-page and low-memory addresses utilized by the B-Series BASIC/monitor in bank 15. Entries include single-byte flags, accumulators, exponents, two-byte pointers (little-endian), descriptor and function pointers, I/O device/state bytes, and monitor save vectors. Multi-byte pointer/word entries are listed as ranges for their low/high bytes.

**Notes:**

- Multi-byte pointers are stored in little-endian format (low byte first).
- Fields marked "[unused? -wf]" are present in the source but not documented further.
- Some fields are clearly tied to BASIC interpreter operations (line pointers, variable/array area, FOR-stack, string tops/bottoms, accumulators).

## Source Code

```text
$0002-$0003   (2-3)     Unused
$0004-$0005   (4-5)     Unused
$0006-$0007   (6-7)     Unused
$0008         (8)       Unused
$0009-$000B   (9-11)    PRINT USING format pointer
$000C         (12)      Search character
$000D         (13)      Scan-between-quotes flag
$000E         (14)      Input point; number of subscripts
$000F         (15)      Catalog line counter
$0010         (16)      Default DIM flag
$0011         (17)      Type: $FF = string; $00 = integer
$0012         (18)      Type: $80 = integer; $00 = floating point
$0013         (19)      Crunch flag
$0014         (20)      Subscript index
$0015         (21)      INPUT = 0; GET = 64; READ = 152
$0016-$0019   (22-25)   Disk status work values
$001A         (26)      Current I/O device for prompt suppress
$001B-$001C   (27-28)   Integer value
$001D-$001F   (29-31)   Descriptor stack pointers
$0020-$002B   (32-43)   Miscellaneous work pointers
$002C         (44)      [unused? -wf]
$002D-$002E   (45-46)   Start-of-BASIC pointer
$002F-$0030   (47-48)   End-of-BASIC pointer
$0031-$0032   (49-50)   Start-of-Variables pointer
$0033-$0034   (51-52)   End-of-Variables pointer
$0035-$0036   (53-54)   Start-of-Arrays pointer
$0037-$0038   (55-56)   End-of-Arrays pointer
$0039-$003A   (57-58)   Variable work pointer
$003B-$003C   (59-60)   Bottom-of-Strings pointer
$003D-$003E   (61-62)   Utility string pointer
$003F-$0041   (63-65)   Top-of-string memory pointer
$0042-$0043   (66-67)   Current BASIC line number
$0044-$0045   (68-69)   Previous BASIC line number
$0046-$0047   (70-71)   Previous BASIC text pointer
$0048         (72)      [unused? -wf]
$0049-$004A   (73-74)   Data line pointer
$004B-$004C   (75-76)   Data text pointer
$004D-$004E   (77-78)   Input pointer
$004F-$0050   (79-80)   Variable name
$0051-$0053   (81-83)   Variable address
$0054-$0056   (84-86)   For-loop pointer
$0057-$0058   (87-88)   Text pointer save
$0059         (89)      [unused? -wf]
$005A         (90)      Comparison symbol accumulator
$005B-$005D   (91-93)   Function location
$005E-$0060   (94-96)   Working string vector
$0061-$0063   (97-99)   Function jump code
$0064-$006E   (100-110) Work pointers, values
$006F         (111)     Exponent sign
$0070         (112)     Accumulator string prefix
$0071         (113)     Accumulator #1: exponent
$0072-$0075   (114-117) Accumulator #1: mantissa
$0076         (118)     Accumulator #1: sign
$0077         (119)     Series evaluation constant pointer
$0078         (120)     Accumulator #1: high-order (overflow)
$0079         (121)     Accumulator #2: exponent
$007A-$007D   (122-125) Accumulator #2: mantissa
$007E         (126)     Accumulator #2: sign
$007F         (127)     Sign comparison: Accumulator #1 vs #2
$0080         (128)     Accumulator #1: low-order (rounding)
$0081-$0084   (129-132) Series; work pointers
$0085-$0087   (133-135) BASIC text pointer
$0088-$0089   (136-137) Input pointer
$008B-$008E   (139-142) DOS parser work values
$008F         (143)     Error type number
$0090-$0092   (144-146) Pointer to filename
$0093-$0095   (147-149) Pointer: tape buffer; scrolling
$0096-$0098   (150-152) Load end address; end of program
$0099-$009B   (153-155) I/O start address
$009C         (156)     Status word ST
$009D         (157)     Filename length
$009E         (158)     Current logical file
$009F         (159)     Current device
$00A0         (160)     Current secondary address
$00A1         (161)     Input device, normally 0
$00A2         (162)     Output CMD device, normally 3
$00A3-$00A5   (163-165) [unused? -wf]
$00A6-$00A8   (166-168) INBUF
$00A9         (169)     Keyswitch PIA: STOP key, etc.
$00AA         (170)     IEEE deferred flag
$00AB         (171)     IEEE deferred character
$00AC-$00AD   (172-173) Segment transfer routine vector
$00AE-$00B3   (174-179) Monitor register save
$00B4         (180)     Monitor stack pointer save
$00B5         (181)     Monitor bank number save
$00B6         (182)     [unused? -wf]
$00B7-$00C7   (183-199) [unused? -wf]
```

## Key Registers

- $0009-$000B - Zero Page - PRINT USING format pointer
- $000C - Zero Page - Search character
- $000D - Zero Page - Scan-between-quotes flag
- $000E - Zero Page - Input point / number of subscripts
- $000F - Zero Page - Catalog line counter
- $0010 - Zero Page - Default DIM flag
- $0011 - Zero Page - Type flag ($FF=string, $00=integer)
- $0012 - Zero Page - Type flag ($80=integer, $00=floating point)
- $0013 - Zero Page - Crunch flag
- $0014 - Zero Page - Subscript index
- $0015 - Zero Page - Input mode indicator (0/64/152)
- $0016-$0019 - Zero Page - Disk status work values
- $001A - Zero Page - Current I/O device for prompt suppress
- $001B-$001C - Zero Page - Integer value
- $001D-$001F - Zero Page - Descriptor stack pointers
- $0020-$002B - Zero Page - Miscellaneous work pointers
- $002C - Zero Page - [unused? -wf]
- $002D-$002E - Zero Page - Start-of-BASIC pointer
- $002F-$0030 - Zero Page - End-of-BASIC pointer
- $0031-$0032 - Zero Page - Start-of-Variables pointer
- $0033-$0034 - Zero Page - End-of-Variables pointer
- $0035-$0036 - Zero Page - Start-of-Arrays pointer
- $0037-$0038 - Zero Page - End-of-Arrays pointer
- $0039-$003A - Zero Page - Variable work pointer
- $003B-$003C - Zero Page - Bottom-of-Strings pointer
- $003D-$003E - Zero Page - Utility string pointer
- $003F-$0041 - Zero Page - Top-of-string memory pointer
- $0042-$0043 - Zero Page - Current BASIC line number
- $0044-$0045 - Zero Page - Previous BASIC line number
- $0046-$0047 - Zero Page - Previous BASIC text pointer
- $0048 - Zero Page - [unused? -wf]
- $0049-$004A - Zero Page - Data line pointer
- $004B-$004C - Zero Page - Data text pointer
- $004D-$004E - Zero Page - Input pointer
- $004F-$0050 - Zero Page - Variable name
- $0051-$0053 - Zero Page - Variable address
- $0054-$0056 - Zero Page - For-loop pointer
- $0057-$0058 - Zero Page - Text pointer save
- $0059 - Zero Page - [unused? -wf]
- $005A - Zero Page - Comparison symbol accumulator
- $005B-$005D - Zero Page - Function