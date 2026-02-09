# MACHINE - 6567/6569 VIC-II chip specifications: video modes, sprites, raster interrupts, memory banking, color modes, and screen organization for C64

**Summary:** VIC-II (6566/6567/6569 family) video controller details: character/bitmap/multicolor modes, movable object blocks (MOBs / sprites), raster interrupts, memory pointer banking (VM13-VM10, CB13-CB11), color registers, register addresses ($D000-$D02E), and DMA/refresh/bus timing behavior.

## Character display and memory addressing
The VIC-II supports a character-display mode where the VIDEO MATRIX contains 1000 8-bit CHARACTER POINTERs and 4-bit color nybbles (video matrix must be 12 bits wide). Character pointers are translated to character dot data in a 2K (2048-byte) CHARACTER BASE area. The video matrix is 25 rows × 40 columns (1000 entries). VM13-VM10 (register $D018 bits) provide the 4 MSB of the video-matrix base; CB13-CB11 (register $D018 bits) provide the 3 MSB of the character-base address.

Character pointer addressing (14-bit outputs by VIC-II):
A13..A00 = VM13 VM12 VM11 VM10 VC9 VC8 VC7 VC6 VC5 VC4 VC3 VC2 VC1 VC0

Character data addressing (14-bit):
A13..A00 = CB13 CB12 CB11 D7 D6 D5 D4 D3 D2 D1 D0 RC2 RC1 RC0
- D7..D0 is the character pointer fetched from the video matrix
- RC2..RC0 is the internal 3-bit raster counter selecting the row (0..7) within the 8×8 character

Character regions display as 25×40 characters by default.

## Character modes

Standard Character Mode (BMM=0, MCM=0, ECM=0)
- Each character is 8×8 dots; each bit=1 displays the character’s foreground color (4-bit color nybble), bit=0 displays common Background #0 (register $D021).
- One foreground per character (16 choices), single background shared.

Multi-Color Character Mode (MCM=1, BMM=0, ECM=0)
- If color nybble MSB=0, that character acts like standard mode (allows mixing).
- If color nybble MSB=1, each character byte is interpreted as bit-pairs (00,01,10,11) selecting one of four colors:
  - 00 -> Background #0 ($D021)
  - 01 -> Background #1 ($D022)
  - 10 -> Background #2 ($D023)
  - 11 -> color by 3 LSBs of character color nybble
- Effective resolution: 4×8 subcolumns (horizontal pixels doubled).

Extended Color Mode (ECM=1, BMM=MCM=0)
- 8×8 resolution retained.
- Character pointer bits 7..6 select background per-character:
  - 00 -> Background #0 ($D021)
  - 01 -> Background #1 ($D022)
  - 10 -> Background #2 ($D023)
  - 11 -> Background #3 ($D024)
- Only 64 unique character definitions available (top two bits used for per-character background). Note: ECM and MCM must not both be set.

## Bit Map modes

Bit Map Mode (BMM=1)
- One-to-one memory bit → pixel mapping. Display resolution 320×200 (standard bitmap).
- Video matrix entries are used as color/attribute pointers; display base constructed from CB13 and VCx, RCx (see Source Code for address formula).

Standard Bitmap (BMM=1, MCM=0)
- Each fetched byte provides 8 pixels; the byte’s upper nybble selects color for bits=1, lower nybble selects color for bits=0 (two colors per 8×8 block).

Multi-Color Bitmap (BMM=1, MCM=1)
- Each two-bit pair selects:
  - 00 -> Background #0 ($D021)
  - 01 -> Upper nybble of video matrix pointer
  - 10 -> Lower nybble of video matrix pointer
  - 11 -> Video-matrix color nybble (CB11..CB8)
- Horizontal resolution halved (160×200) due to two-bit groups and doubled horizontal pixel size.
- Up to 3 independently selected colors per 8×8 block plus background.

## Movable Object Blocks (MOBs / sprites)

General
- Up to 8 MOBs; each MOB defined by 63 consecutive bytes in memory (24×21 pixel array).
- MOB pointers are stored in the last 8 entries of the video matrix (video matrix locations 1016..1023 relative to VM base).
- MOB data is fetched when Y position matches current raster; internal counters step through the 63 bytes and display 3 bytes per raster line.

Enable & Position
- Each MOB has an enable bit (MnE) in register $D015.
- X/Y positions are stored with 9-bit horizontal resolution (512 positions; MSB X8 in $D010) and 8-bit vertical resolution (256 positions). Position refers to upper-left corner.
- Visible X: 23..347 ($017..$157), visible Y: 50..249 ($32..$F9) (device coordinate conventions).

Color & Multicolor
- Each MOB has its own 4-bit color register.
- Standard mode (MnMC=0): bit=0 transparent, bit=1 uses MOB color.
- Multi-color MOB (MnMC=1): data interpreted as bit-pairs:
  - 00 -> Transparent
  - 01 -> MOB Multicolor #0 (register $D025)
  - 10 -> MOB Color (per-MOB register $D027..$D02E)
  - 11 -> MOB Multicolor #1 (register $D026)
- Multicolor MOB effective resolution: 12×21 (horizontal doubled), up to 3 MOB colors plus transparency; MM0/MM1 are shared globals.

Magnification
- Individual horizontal and vertical 2× expansion bits available per MOB (registers $D017/$D01D bits). No resolution increase—dots are scaled.

Priority and collisions
- MOB display priority vs playfield controlled by MnDP bits in $D01B: MnDP=0 (MOB in front), MnDP=1 (MOB behind foreground, visible only over background #0 or multicolor pair 01).
- MOB vs MOB ordering fixed: MOB0 highest priority, MOB7 lowest. On overlap, lower-number MOB is displayed.
- Collision registers:
  - MOB–MOB collision bits (set per MOB) in $D01E (sprite-sprite collision). Read clears register.
  - MOB–DATA collision bits in $D01F (sprite-background collision). Read clears register.
- Collision latches set on first collision; further collisions won't set the interrupt latch until cleared by reading the register.

MOB memory addressing (14-bit):
A13..A00 = MP7..MP0 MC5..MC0
- MPx = MOB pointer bits (from the video matrix)
- MCx = internal MOB byte counter bits
- MOB pointers are fetched at end of each raster, MOB data fetches begin when Y position equals current raster.

## Bus sharing, DMA and DRAM refresh

System interface and bus timing
- VIC-II performs most memory accesses during Phase 1 (processor idle) using AEC to disable CPU address drivers so video accesses are transparent to the CPU; system Phase 2 (1 MHz) defines a 500 ns memory cycle.
- Some operations require Phase 2 access (e.g., character pointer fetches and MOB data fetches). BA is asserted to halt the CPU and allow VIC to perform required Phase 2 accesses: character pointer fetches require 40 consecutive Phase 2 cycles every 8 raster lines; MOB fetches follow the pattern: Phase1 pointer, Phase2 byte1, Phase1 byte2, Phase2 byte3.

Dynamic RAM refresh
- Built-in refresh controller refreshes 5 row addresses per raster line (transparent during Phase 1). Generates /RAS and /CAS for each Phase 2 and each video access.

Reset and control
- RES bit in control register ($D016) suspends chip operation when set; set to 0 for normal operation.

## Other features: blanking, display window, scrolling, light pen, raster, interrupts

Screen blanking
- DEN bit (register $D011) controls screen blanking. DEN=0 blanks display to exterior color ($D020) and allows only Phase 1 memory accesses (CPU more available); MOB fetches still occur unless sprites disabled.

Row/Column select
- RSEL ($D011) and CSEL ($D016) may reduce display window:
  - RSEL=1 -> 25 rows; RSEL=0 -> 24 rows
  - CSEL=1 -> 40 columns; CSEL=0 -> 38 columns
- Small window useful for scrolling.

Scrolling
- Horizontal (X2..X0) in $D016 and vertical (Y2..Y0) in $D011 register provide up to one-character (8-pixel / 8-row) fine scroll offsets.

Light pen
- Light pen latches current screen position on negative edge into LPX ($D013) 8 MSB bits and LPY ($D014) 8 bits; LPX provides 8 MSB of 9-bit X position (2 pixel resolution). Light pen latch only once per frame.

Raster register & interrupts
- Raster register low 8 bits in $D012; the MSB (RC8) is in $D011.
- Write raster value for internal raster compare; when equals current raster, the raster interrupt latch (IRST) is set.
- Interrupt register $D019 holds latches (IRST, IMMC, IMDC, ILP). Interrupt enable in $D01A enables /IRQ output when corresponding latch set. Latches cleared only by writing 1 to the latch bit (allows selective clearing).

## Source Code
```text
CHARACTER POINTER ADDRESS (14 bits)
A13 A12 A11 A10 A09 A08 A07 A06 A05 A04 A03 A02 A01 A00
VM13 VM12 VM11 VM10 VC9 VC8 VC7 VC6 VC5 VC4 VC3 VC2 VC1 VC0

CHARACTER DATA ADDRESS (14 bits)
A13 A12 A11 A10 A09 A08 A07 A06 A05 A04 A03 A02 A01 A00
CB13 CB12 CB11 D7  D6  D5  D4  D3  D2  D1  D0  RC2 RC1 RC0

BIT-PAIR COLOR INTERPRETATION (Multi-color Character)
00 -> Background #0 ($D021)
01 -> Background #1 ($D022)
10 -> Background #2 ($D023)
11 -> color by 3 LSB of color nybble

BIT-PAIR COLOR INTERPRETATION (Multi-color Bitmap)
00 -> Background #0 ($D021)
01 -> Upper nybble of video matrix pointer
10 -> Lower nybble of video matrix pointer
11 -> Video matrix color nybble (CB11..CB8)

MOB DISPLAY BLOCK (63 bytes)
Bytes 00..62 displayed as 24x21 dot array (3 bytes per raster line, 21 raster lines)

MOB MEMORY ADDRESSING (14 bits)
A13 A12 A11 A10 A09 A08 A07 A06 A05 A04 A03 A02 A01 A00
MP7 MP6 MP5 MP4 MP3 MP2 MP1 MP0 MC5 MC4 MC3 MC2 MC1 MC0

REGISTER MAP (offsets $00..$2E; add $D000 for C64 absolute addresses)
Offset Hex | Name / bits (DB7..DB0)                 | Description
$00        | M0X7..M0X0                             | Sprite 0 X-position (low 8)
$01        | M0Y7..M0Y0                             | Sprite 0 Y-position
$02        | M1X7..M1X0                             | Sprite 1 X-position
$03        | M1Y7..M1Y0                             | Sprite 1 Y-position
$04        | M2X7..M2X0                             | Sprite 2 X-position
$05        | M2Y7..M2Y0                             | Sprite 2 Y-position
$06        | M3X7..M3X0                             | Sprite 3 X-position
$07        | M3Y7..M3Y0                             | Sprite 3 Y-position
$08        | M4X7..M4X0                             | Sprite 4 X-position
$09        | M4Y7..M4Y0                             | Sprite 4 Y-position
$0A        | M5X7..M5X0                             | Sprite 5 X-position
$0B        | M5Y7..M5Y0                             | Sprite 5 Y-position
$0C        | M6X7..M6X0                             | Sprite 6 X-position
$0D        | M6Y7..M6Y0                             | Sprite 6 Y-position
$0E        | M7X7..M7X0                             | Sprite 7 X-position
$0F        | M7Y7..M7Y0                             | Sprite 7 Y-position
$10        | M7X8..M0X8                             | MSB of X-position for sprites
$11        | RC8 ECM BMM DEN RSEL Y2 Y1 Y0         | Control / raster MSB / flags
$12        | RC7..RC0                               | Raster register low 8 bits
$13        | LPX8 LPX7..LPX1                        | Light pen X (8 MSB)
$14        | LPY7..LPY0                             | Light pen Y
$15        | M7E..M0E                               | Sprite enable bits
$16        | - - RES MCM CSEL X2 X1 X0             | Control register : RES/MCM/CSEL/X-scroll
$17        | M7YE..M0YE                             | Sprite Y-expand bits
$18        | VM13 VM12 VM11 VM10 CB13 CB12 CB11 -  | Memory pointers (VM13-VM10, CB13-CB11)
$19        | IRQ - - - - ILP IMMC IMBC IRST        | Interrupt status latches
$1A        | - - - - ELP EMMC EMBC ERST            | Interrupt enables
$1B        | M7DP..M0DP                             | Sprite (MOB) display priority bits
$1C        | M7MC..M0MC                             | Sprite multicolor select bits
$1D        | M7XE..M0XE                             | Sprite X-expand bits
$1E        | M7M..M0M                               | Sprite–Sprite collision bits (read clears)
$1F        | M7D..M0D                               | Sprite–Background collision bits (read clears)
$20        | - - - - EC3 EC2 EC1 EC0                | Exterior (border) color
$21        | - - - - B0C3 B0C2 B0C1 B0C0           | Background #0 color
$22        | - - - - B1C3 B1C2 B1C1 B1C0           | Background #1 color
$23        | - - - - B2C3 B2C2 B2C1 B2C0           | Background #2 color
$24        | - - - - B3C3 B3C2 B3C1 B3C0           | Background #3 color
$25        | - - - - MM03 MM02 MM01 MM00           | MOB Multicolor #0
$26        | - - - - MM13 MM12 MM11 MM10           | MOB Multicolor #1
$27        | - - - - M0C3 M0C2 M0C1 M0C0           | MOB 0 color
$28        | - - - - M1C3 M1C2 M1C1 M1C0           | MOB 1 color
$29        | - - - - M2C3 M2C2 M2C1 M2C0           | MOB 2 color
$2A        | - - - - M3C3 M3C2 M3C1 M3C0           | MOB 3 color
$2B        | - - - - M4C3 M4C2 M4C1 M4C0           | MOB 4 color
$2C        | - - - - M5C3 M5C2 M5C1 M5C0           | MOB 5 color
$2D        | - - - - M6C3 M6C2 M6C1 M6C0           | MOB 6 color
$2E        | - - - - M7C3 M7C2 M7C1 M7C0           | MOB 7 color

NOTE: Add base $D000 to the offsets above to get C64 absolute addresses (e.g. $D012 = raster low byte).

COLOR CODES (4-bit, D3..D0)
D3 D2 D1 D0 | Hex | Dec | Color
0  0  0  0  | 0   | 0   | Black
0  0  0  1  | 1   | 1   | White
0  0  1  0  | 2   | 2   | Red
0  0  1  1  | 3   | 3   | Cyan
0  1  0  0  | 4   | 4   | Purple
0  1  0  1  | 5   | 5   | Green
0  1  1  0  | 6   | 6   | Blue
0  1  1  1  | 7   | 7   | Yellow
1  0  0  0  | 8   | 8   | Orange
1  0  0  1  | 9   | 9   | Brown
1  0  1  0  | A   |10   | Light Red
1  0  1  1  | B   |11   | Dark Gray
1  1  0  0  | C   |12   | Medium Gray
1  1  0  1  | D   |13   | Light Green
1  1  1  0  | E   |14   | Light Blue
1  1  1  1  | F   |15   | Light Gray
```

**[Note: Source may contain an error — original register table’s hex labels from offset $1A onward were duplicated/misaligned; the register map in Source Code above is corrected to standard VIC-II offsets $00..$2E (add $D000).]**

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0..7 X and Y low-byte positions
- $D010 - VIC-II - Sprite X MSB bits (MSB of X-position for sprites)
- $D011 - VIC-II - Control/reg: RC8 (raster MSB), ECM, BMM, DEN, RSEL, Y2..Y0 (vertical scroll)
- $D012 - VIC-II - Raster register low 8 bits
- $D013-$D014 - VIC-II - Light pen X (MSB) and Y registers
- $D015 - VIC-II - Sprite (MOB) enable bits
- $D016 - VIC-II - Control/reg: RES, MCM, CSEL, X2..X0 (horizontal scroll)
- $D017 - VIC-II - Sprite Y-expand bits
- $D018 - VIC-II - Memory pointers: VM13..VM10 (video matrix base), CB13..CB11 (character base)
- $D019 - VIC-II - Interrupt status latches (IRST, IMMC, IMDC, ILP)
- $D01A - VIC-II - Interrupt enable bits (ERST, EMMC, EMDC, ELP)
- $D01B - VIC-II - Sprite vs playfield priority bits (MOB-DATA priority)
- $D01C - VIC-II - Sprite multicolor select bits
- $D01D - VIC-II - Sprite X-expand bits
- $D01E - VIC-II - Sprite–Sprite collision register (read clears)
- $D01F - VIC-II - Sprite–Background collision register (read clears)
- $D020 - VIC-II - Exterior/border color
- $D021-$D024 - VIC-II - Background colors #0..#3
- $D025-$D026 - VIC-II - MOB multicolor registers (MM0, MM1)
- $D027-$D02E - VIC-II - MOB (sprite) color registers 0..7

## References
- None provided in source.