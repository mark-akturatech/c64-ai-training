# PET Original ROM — Zero-Page Guide ("Great Zero-Page Hunt")

**Summary:** PET (Original ROM) zero-page map and warnings for critical zero-page locations ($0003, $0005, $0064-$0067, $007A-$0087, $0089, $00A2-$00A3, $00B7, $00C2-$00D9, $00E0-$00E2, $00F5). Includes USR jump, input buffer ($000A-$0059), pointer locations, descriptor stack, numeric accumulators, and other PET BASIC zero-page allocations.

## The Great Zero-Page Hunt
This chunk documents PET (Original ROM) zero-page allocations and highlights locations that are critical to the operating system and BASIC — do not modify these unless you know how to restore original contents.

Critical zero-page locations NOT to modify (from source):
- $0003, $0005, $0064-$0067, $007A-$0087, $0089, $00A2-$00A3, $00B7, $00C2-$00D9, $00E0-$00E2, $00F5

Common safe area often reused by user programs:
- High part of the input buffer: $0040-$0059 (commonly used for temporary storage when long input lines are present)

Reminder:
- When you see a reference to a POKE or PEEK location in documentation or programs, check it against this map to verify whether the location is safe to use or critical to the ROM/BASIC.

## Memory Map (description)
This chunk contains the PET zero-page memory map entries from $0000 upward through the accumulators and mantissas shown in the original listing. The full address-to-purpose table is in the Source Code section below.

## Source Code
```text
Hex         Decimal       Description
-------------------------------------------------------------------
0000-0002       0-2       USR jump
0003            3         Current I/O-prompt suppress
0005            5         Cursor control position
0008-0009       8-9       Integer value (for SYS, GOTO, and so on)
000A-0059      10-89      Input buffer
005A           90         Search character
005B           91         Scan-between-quotes flag
005C           92         Input buffer pointer; number of subscripts
005D           93         Default DIM flag
005E           94         Type:  FF = string; 00 = numeric
005F           95         Type:  80 = integer; 00 = floating point
0060           96         Flag:  DATA scan; LIST quote; memory
0061           97         Subscript flag; FNx flag
0062           98         0 = INPUT; $40 = GET; $98 = READ
0063           99         ATN sign; Comparison evaluation flag
0064          100         Input flag (suppress output)
0065-0067     101-103     Pointers for descriptor stack

0068-0070     104-112     Descriptor stack (temporary strings)
0071-0074     113-116     Utility pointer area
0075-0078     117-120     Product area for multiplication
0079          121         [unused?  not listed in original text. -wf]
007A-007B     122-123     Pointer:  start-of-BASIC
007C-007D     124-125     Pointer:  start-of-variables
007E-007F     126-127     Pointer:  start-of-arrays
0080-0081     128-129     Pointer:  end-of-arrays
0082-0083     130-131     Pointer:  string-storage (moving down)
0084-0085     132-133     Utility string pointer
0086-0087     134-135     Pointer:  limit-of-memory
0088-0089     136-137     Current BASIC line number
008A-008B     138-139     Previous BASIC line number
008C-008D     140-141     Pointer:  BASIC statement for CONT
008E-008F     142-143     Current DATA line number
0090-0091     144-145     Current DATA address
0092-0093     146-147     Input vector
0094-0095     148-149     Current variable name
0096-0097     150-151     Current variable address
0098-0099     152-153     Variable pointer for FOR/NEXT
009A-009B     154-155     Y-save; op-save; BASIC pointer save
009C          156         Comparison symbol accumulator
009D-00A2     157-162     Miscellaneous work area, pointers, and so on
00A3-00A5     163-165     Jump vector for functions
00A6-00AF     166-175     Miscellaneous numeric work area
00B0          176         Accumulator #1:  exponent
00B1-00B4     177-180     Accumulator #1:  mantissa
00B5          181         Accumulator #1:  sign
00B6          182         Series evaluation constant pointer
00B7          183         Accumulator #1:  high-order (overflow)
00B8          184         Accumulator #2:  exponent
00B9-00BC     185-188     Accumulator #2:  mantissa
```

## Key Registers
- $0000-$00BC - Zero Page - PET Original ROM zero-page allocations (USR jump, input buffer, descriptor stack, pointers, numeric accumulators, etc.)
- $0003 - Zero Page - Current I/O-prompt suppress (CRITICAL)
- $0005 - Zero Page - Cursor control position (CRITICAL)
- $000A-$0059 - Zero Page - Input buffer (commonly reused by user programs)
- $0064-$0067 - Zero Page - Pointers for descriptor stack (CRITICAL)
- $007A-$0087 - Zero Page - Pointers: start-of-BASIC, variables, arrays, end-of-arrays, string storage, limit-of-memory (CRITICAL)
- $0089 - Zero Page - Current BASIC line number (CRITICAL)
- $00A2-$00A3 - Zero Page - Misc work area and jump vector for functions (CRITICAL)
- $00B7 - Zero Page - Accumulator #1 high-order / overflow (CRITICAL)
- $00C2-$00D9 - Zero Page - (covered in continuation maps; referenced as critical in source)
- $00E0-$00E2 - Zero Page - (covered in continuation maps; referenced as critical in source)
- $00F5 - Zero Page - (marked critical in source)

## References
- "pet_original_memory_map_part2" — continuation of PET memory map (more addresses)