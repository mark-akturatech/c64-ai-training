# MACHINE - VIC-20 detailed memory map (continuation): keyboard buffer, tape pointers, jiffy clock, file tables, cassette buffers, VIC/VIA, and color nybble areas

**Summary:** Continuation of VIC‑20 low memory (zero page / system workspace) showing addresses $0011–$00B3 with BASIC/workspace variables (keyboard/status, tape buffer pointers, jiffy clock, accumulators, file counters), plus notes referencing cassette buffer region $033C–$03FB, character ROM at $8000, VIC 6560 registers at $9000, VIA I/O at $9110–$912F, and color nybble areas at $9400+ and $9600+.

## System workspace overview
This chunk is a continuation of the VIC‑20 low-memory/BASIC workspace map. It lists zero‑page and nearby system variables used by BASIC and the ROM routines: input/READ/GET modes, ATN/comparison flags, BASIC pointers (start-of-BASIC, variables, arrays), temporary string stacks, accumulators for floating-point routines, jiffy clock, serial/tape state and buffers, file counters, and related working storage. These addresses are used by the ROM BASIC interpreter, cassette/tape I/O routines, and the system service vectors.

Do not confuse these with I/O chip registers — these are RAM variables and pointers used by the BASIC/system code. For VIC/VIA/I/O register maps see the referenced chunks (vic_6560_register_map, vic20_via_usage).

## Source Code
```text
Addresses shown in hex (left), decimal index (center), and description (right).

$0011           17         0 = INPUT; $40 = GET; $98 = READ
$0012           18         ATN sign; Comparison evaluation flag
$0013           19         Current I/O prompt flag
$0014-$0015     20-21      Integer value
$0016           22         Pointer:  temporary string stack
$0017-$0018     23-24      Last temporary string vector
$0019-$0021     25-33      Stack for temporary strings
$0022-$0025     34-37      Utility pointer area
$0026-$002A     38-42      Product area for multiplication
$002B-$002C     43-44      Pointer:  start-of-BASIC
$002D-$002E     45-46      Pointer:  start-of-variables
$002F-$0030     47-48      Pointer:  start-of-arrays
$0031-$0032     49-50      Pointer:  end-of-arrays
$0033-$0034     51-52      Pointer:  string-storage (moving down)
$0035-$0036     53-54      Utility string pointer
$0037-$0038     55-56      Pointer:  limit-of-memory
$0039-$003A     57-58      Current BASIC line number
$003B-$003C     59-60      Previous BASIC line number
$003D-$003E     61-62      Pointer:  BASIC statement for CONT

$003F-$0040     63-64      Current DATA line number
$0041-$0042     65-66      Current DATA address
$0043-$0044     67-68      Input vector
$0045-$0046     69-70      Current variable name
$0047-$0048     71-72      Current variable address
$0049-$004A     73-74      Variable pointer for FOR/NEXT
$004B-$004C     75-76      Y-save; op-save; BASIC pointer save
$004D           77         Comparison symbol accumulator
$004E-$0053     78-83      Miscellaneous work area, pointers, and so on
$0054-$0056     84-86      Jump vector for functions
$0057-$0060     87-96      Miscellaneous work area
$0061           97         Accumulator #1:  exponent
$0062-$0065     98-101     Accumulator #1:  mantissa
$0066          102         Accumulator #1:  sign
$0067          103         Series evaluation constant pointer
$0068          104         Accumulator #1:  high-order (overflow)
$0069          105         Accumulator #2:  exponent
$006A-$006D     106-109     Accumulator #2:  mantissa
$006E          110         Accumulator #2:  sign
$006F          111         Sign comparison:  Accumulator #1 vs #2
$0070          112         Accumulator #1:  low-order (rounding)
$0071-$0072     113-114     Cassette buffer length; series pointer
$0073-$008A     115-138     CHRGET subroutine; get BASIC character
$007A-$007B     122-123     BASIC pointer (within above subroutine)
$008B-$008F     139-143     RND seed value
$0090          144         Status word ST
$0091          145         Keyswitch PIA:  STOP and RVS flags
$0092          146         Timing constant for tape
$0093          147         Load = 0; verify = 1
$0094          148         Serial output:  deferred character flag
$0095          149         Serial deferred character
$0096          150         Tape EOT received

$0097          151         Register save
$0098          152         How many open files
$0099          153         Input device, normally 0
$009A          154         Output CMD device, normally 3
$009B          155         Tape character parity
$009C          156         Byte-received flag
$009D          157         Direct = $80; RUN = 0 output control
$009E          158         Tape pass 1 error log/character buffer
$009F          159         Tape pass 2 error log corrected
$00A0-$00A2     160-162     Jiffy clock HML
$00A3          163         Serial bit count; EOI flag
$00A4          164         Cycle count
$00A5          165         Countdown, tape write/bit count
$00A6          166         Tape buffer pointer
$00A7          167         Tape write leader count; read pass; inbit
$00A8          168         Tape write new byte; read error; inbit count
$00A9          169         Write start bit; read bit error; stbit
$00AA          170         Tape scan; Cnt; Load; End/byte assembly
$00AB          171         Write lead length; read checksum; parity
$00AC-$00AD     172-173     Pointer:  tape buffer, scrolling
$00AE-$00AF     174-175     Tape end address; end of program
$00B0-$00B1     176-177     Tape timing constants
$00B2-$00B3     178-179     Pointer:  start of tape buffer
```

## Key Registers
- $0011-$00B3 - RAM - VIC‑20 zero‑page / BASIC workspace variables and system pointers (input modes, comparison flags, BASIC pointers, temp string stacks, accumulators, jiffy clock, tape/cassette pointers and state, file counters)
- $033C-$03FB - RAM - cassette buffer regions (cassette data / buffer area referenced by tape routines)
- $8000 - ROM - Character bitmaps ROM (character generator / CHR ROM location)
- $9000 - VIC 6560 - Base address for VIC 6560 registers (see vic_6560_register_map)
- $9110-$912F - VIA - VIA (6522) I/O area on VIC‑20 for NMI/IRQ interfaces and timers (VIA mapped region)
- $9400+ - RAM - Color nybble area (screen color nybbles starting at $9400)
- $9600+ - RAM - Alternate color nybble area (second color region starting at $9600)

## References
- "vic_6560_register_map" — expands on VIC 6560 register meanings at $9000 range
- "vic20_via_usage" — expands on VIA mapping for VIC-20 at $9110-$912F