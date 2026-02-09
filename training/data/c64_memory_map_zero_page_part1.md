# MACHINE - Commodore 64 memory map — zero page and low memory ($0000-$00AD)

**Summary:** Zero page and low-memory map for the Commodore 64 showing addresses $0000-$00AD with BASIC internals (input buffer pointers, DIM flag, type flags, DATA scanning flags, variable/array pointers), floating/packed conversion vectors, CHRGET routine area ($0073-$008A), RND seed ($008B-$008F), status word ST ($0090), jiffy clock ($00A0-$00A2), and tape/serial control and buffers.

## Overview
This chunk enumerates zero-page and low-memory allocations used by the C64 BASIC ROM and kernel for runtime state and temporary storage. It includes:
- Processor vectors used by BASIC for float↔fixed conversion.
- BASIC workspace pointers (start-of-BASIC, start-of-variables, start/end-of-arrays, string storage pointers).
- Execution state: current and previous BASIC line numbers, DATA line/address, CONT statement pointer, input vector and input buffer pointer.
- Type and mode flags (string vs numeric, integer vs floating, INPUT/GET/READ modes, DIM/default flags).
- Arithmetic accumulators and temporary work areas used by BASIC floating-point routines (exponent, mantissa, sign, overflow/rounding).
- CHRGET character-get routine area and embedded BASIC pointer.
- Random seed (RND), status word (ST), keyboard/tape/serial control bytes and small tape buffer pointer/indices.
- Jiffy clock triple ($00A0-$00A2) — high/mid/low bytes (HML).

This document preserves address-level assignments; a full byte-by-byte table is included in Source Code for copy/paste reference.

## Source Code
```text
Hex         Decimal       Description
-------------------------------------------------------------------
0000            0         Chip directional register
0001            1         Chip I/O; memory and tape control
0002            2         [unused; not listed in original text. -wf]
0003-0004       3-4       Float-fixed vector
0005-0006       5-6       Fixed-float vector
0007            7         Search character
0008            8         Scan-quotes flag
0009            9         TAB column save
000A           10         0 = LOAD; 1 = VERIFY
000B           11         Input buffer pointer; number of subscripts
000C           12         Default DIM flag
000D           13         Type:  FF = string; 00 = numeric
000E           14         Type:  80 = integer; 00 = floating point
000F           15         DATA scan; LIST quote; memory flag
0010           16         Subscript/FNx flag
0011           17         0 = INPUT; $40 = GET; $98 = READ
0012           18         ATN sign; Comparison evaluation flag
0013           19         Current I/O prompt flag
0014-0015      20-21      Integer value
0016           22         Pointer:  temporary string stack
0017-0018      23-24      Last temporary string vector
0019-0021      25-33      Stack for temporary strings
0022-0025      34-37      Utility pointer area
0026-002A      38-42      Product area for multiplication
002B-002C      43-44      Pointer:  start-of-BASIC
002D-002E      45-46      Pointer:  start-of-variables
002F-0030      47-48      Pointer:  start-of-arrays
0031-0032      49-50      Pointer:  end-of-arrays
0033-0034      51-52      Pointer:  string-storage (moving down)
0035-0036      53-54      Utility string pointer
0037-0038      55-56      Pointer:  limit-of-memory
0039-003A      57-58      Current BASIC line number
003B-003C      59-60      Previous BASIC line number
003D-003E      61-62      Pointer:  BASIC statement for CONT
003F-0040      63-64      Current DATA line number
0041-0042      65-66      Current DATA address
0043-0044      67-68      Input vector
0045-0046      69-70      Current variable name
0047-0048      71-72      Current variable address
0049-004A      73-74      Variable pointer for FOR/NEXT
004B-004C      75-76      Y-save; op-save; BASIC pointer save
004D           77         Comparison symbol accumulator
004E-0053      78-83      Miscellaneous work area, pointers, and so on
0054-0056      84-86      Jump vector for functions
0057-0060      87-96      Miscellaneous work area
0061           97         Accumulator #1:  exponent
0062-0065      98-101     Accumulator #1:  mantissa
0066          102         Accumulator #1:  sign
0067          103         Series evaluation constant pointer
0068          104         Accumulator #1:  high-order (overflow)
0069          105         Accumulator #2:  exponent
006A-006D     106-109     Accumulator #2:  mantissa
006E          110         Accumulator #2:  sign
006F          111         Sign comparison:  Accumulator #1 vs #2
0070          112         Accumulator #1:  low-order (rounding)
0071-0072     113-114     Cassette buffer length; series pointer
0073-008A     115-138     CHRGET subroutine; get BASIC character
007A-007B     122-123     BASIC pointer (within above subroutine)
008B-008F     139-143     RND seed value
0090          144         Status word ST
0091          145         Keyswitch PIA:  STOP and RVS flags
0092          146         Timing constant for tape
0093          147         Load = 0; verify = 1
0094          148         Serial output:  deferred character flag
0095          149         Serial deferred character
0096          150         Tape EOT received
0097          151         Register save
0098          152         How many open files
0099          153         Input device, normally 0
009A          154         Output CMD device, normally 3
009B          155         Tape character parity
009C          156         Byte-received flag
009D          157         Direct = $80; RUN = 0 output control
009E          158         Tape pass 1 error log/character buffer
009F          159         Tape pass 2 error log corrected
00A0-00A2     160-162     Jiffy clock HML
00A3          163         Serial bit count; EOI flag
00A4          164         Cycle count
00A5          165         Countdown, tape write/bit count
00A6          166         Tape buffer pointer
00A7          167         Tape write leader count; read pass; inbit
00A8          168         Tape write new byte; read error; inbit count
00A9          169         Write start bit; read bit error; stbit
00AA          170         Tape scan; Cnt; Load; End/byte assembly
00AB          171         Write lead length; read checksum; parity
00AC-00AD     172-173     Pointer:  tape buffer, scrolling
```

## Key Registers
- $0000-$0001 - Zero Page - Chip directional register; Chip I/O, memory and tape control
- $0003-$0006 - Zero Page - FLOAT↔FIX vectors (float-fixed and fixed-float)
- $0007-$0013 - Zero Page - Character/scan/type/mode flags (search char, scan-quotes, TAB col, LOAD/VERIFY, input buffer pointer, DIM, type flags, DATA/quote/memory flag)
- $0014-$0015 - Zero Page - Integer value (16-bit)
- $0016-$0025 - Zero Page - Temporary string stack area and utility pointers
- $0026-$002A - Zero Page - Multiplication product area
- $002B-$0036 - Zero Page - BASIC region pointers (start-of-BASIC, start-of-variables, start-of-arrays, end-of-arrays, string-storage pointer, utility string pointer)
- $0037-$003E - Zero Page - Memory limit pointer; current/previous BASIC line pointers; CONT statement pointer
- $003F-$0046 - Zero Page - DATA line/address and input vector/current variable name
- $0047-$004C - Zero Page - Current variable address; FOR/NEXT variable pointer; Y-save/op-save/BASIC pointer save
- $004D-$0060 - Zero Page - Comparison accumulator and miscellaneous work/jump vectors
- $0061-$0070 - Zero Page - Accumulator #1 fields (exponent, mantissa, sign, overflow/rounding) and series eval pointer
- $0069-$006E - Zero Page - Accumulator #2 fields (exponent, mantissa, sign) and sign-compare byte ($006F)
- $0071-$0072 - Zero Page - Cassette buffer length; series pointer
- $0073-$008A - Zero Page - CHRGET subroutine area (BASIC character input routine)
- $008B-$008F - Zero Page - RND seed value
- $0090-$009F - Zero Page - Status word ST; keyswitch PIA flags; tape timing and control; serial deferred char; tape EOT; register saves; open files; I/O device bytes; parity and receive flags; output control
- $00A0-$00A2 - Zero Page - Jiffy clock (H-M-L bytes)
- $00A3-$00AD - Zero Page - Serial/tape cycle counts, tape buffer pointer, tape write/read control and checksums, pointer to tape buffer/scrolling

## References
- "c64_zero_page_overview" — expands on safe/unsafe zero-page locations and usage conventions