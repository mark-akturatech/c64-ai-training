# Commodore 64 — Memory Map (part 3): Stack, KERNAL tables, VICSCN, BASIC/Cartridge/ROM regions

**Summary:** High-level Commodore 64 memory segmentation and a detailed list of low-memory KERNAL/BASIC vectors and variables ($0100-$03FF region), VIC screen memory (VICSCN $0400-$07FF), BASIC program space ($0800-$9FFF), Cartridge/BASIC/KERNAL ROM ranges ($8000-$BFFF, $E000-$FFFF), and I/O / Color RAM / Char ROM region ($D000-$DFFF).

## Memory segmentation (high level)
- $0100-$01FF — Stack area (256 bytes, 6502 stack page).
- $0200 — System input buffer (keyboard buffer start).
- $028F-$033F (and nearby) — Low-memory KERNAL/BASIC variables, vectors, RS‑232 images, and control flags (see detailed table).
- $033C-$03FB — Tape I/O buffer (TBUFFR).
- $0400-$07FF — VICSCN: 1 KB screen memory (Video matrix 25 lines × 40 columns; sprite pointers at $07F8-$07FF).
- $0800-$9FFF — Normal BASIC program space (typical RAM area for BASIC programs).
- $8000-$9FFF — Cartridge ROM area (example: VSP cartridge ROM occupies $8000-$9FFF, 8 KB).
- $A000-$BFFF — BASIC ROM (8 KB) — can be RAM in some expansions/configurations.
- $C000-$CFFF — RAM page (4 KB).
- $D000-$DFFF — I/O devices, Color RAM, and Character Generator ROM/RAM (4 KB).
- $E000-$FFFF — KERNAL ROM (8 KB) — can be RAM in some expansions/configurations.

## Low-memory KERNAL/BASIC vectors and variables (overview)
This chunk lists zero-page / low-memory vectors and KERNAL tables used by BASIC and machine-language interfacing, including:
- Keyboard setup and MODE flags ($028F-$0292).
- RS-232 (6551) control/state images and baud-timing variables ($0293-$029E).
- Temporary storage for tape I/O and PAL/NTSC flag ($029F-$02A6).
- A sequence of KERNAL/BASIC vectors used to dispatch BASIC functions and KERNAL entry points (IERROR, IMAIN, ICRNCH, etc.) in the $0300s.
- Storage for CPU register snapshots used by BASIC-to-machine-language facilities (SAREG, SXREG, SYREG, SPREG).
- USR/USRPOK/USRADD user-call hook field.
- Vectors for interrupts (CINV/CBINV/NMINV).
- KERNAL routine vectors (IOpen, IClose, IChkIn, IChkOut, IClrChn, IBasin, IBsout, IStop, IGetIn, IClAll, ILoad, ISave).
- Tape buffer region (TBUFFR $033C-$03FB).
- VICSCN mapping and sprite pointer area within $0400-$07FF.

The full, exact list of labels, addresses, decimal locations and short descriptions is provided in the Source Code section for precise lookup and retrieval.

## Source Code
```text
  LABEL   HEX     DECIMAL LOCATION  DESCRIPTION
---------------------------------------------------------------
  KEYLOG  028F-0290     655-656    Vector: Keyboard Table Setup
  MODE    0291          657        Flag: $00=Disable SHIFT Keys, $80=Enable
  AUTODN  0292          658        Flag: Auto Scroll Down, 0 = ON
  M51CTR  0293          659        RS-232: 6551 Control Register Image
  MS1CDR  0294          660        RS-232: 6551 Command Register Image
  M51AJB  0295-0296     661-662    RS-232 Non-Standard BPS (Time/2-100) USA
  RSSTAT  0297          663        RS-232: 6551 Status Register Image
  BITNUM  0298          664        RS-232 Number of Bits Left to Send
  BAUDOF  0299-029A     665-666    RS-232 Baud Rate: Full Bit Time (us)
  RIDBE   029B          667        RS-232 Index to End of Input Buffer
  RIDBS   029C          668        RS-232 Start of Input Buffer (Page)
  RODBS   029D          669        RS-232 Start of Output Buffer (Page)
  RODBE   029E          670        RS-232 Index to End of Output Buffer
  IRQTMP  029F-02A0     671-672    Holds IRQ Vector During Tape I/O
  ENABL   02A1          673        RS-232 Enables
          02A2          674        TOD Sense During Cassette I/O
          02A3          675        Temp Storage For Cassette Read
          02A4          676        Temp D1 IRQ Indicator For Cassette Read
          02A5          677        Temp For Line Index
          02A6          678        PAL/NTSC Flag, 0= NTSC, 1 = PAL
          02A7-02FF     679-767    Unused
  IERROR  0300-0301     768-769    Vector: Print BASIC Error Message
  IMAIN   0302-0303     770-771    Vector: BASIC Warm Start
  ICRNCH  0304-0305     772-773    Vector: Tokenize BASIC Text
  IQPLOP  0306-0307     774-775    Vector: BASIC Text LIST
  IGONE   0308-0309     776-777    Vector: BASIC Char. Dispatch
  IEVAL   030A-030B     778-779    Vector: BASIC Token Evaluation
  SAREG   030C          780        Storage for 6502 .A Register
  SXREG   030D          781        Storage for 6502 .X Register
  SYREG   030E          782        Storage for 6502 .Y Register
  SPREG   030F          783        Storage for 6502 .SP Register

  USRPOK  0310          784        USR Function Jump Instr (4C)
  USRADD  0311-0312     785-786    USR Address Low Byte / High Byte
          0313          787        Unused
  CINV    0314-0315     788-789    Vector: Hardware Interrupt
  CBINV   0316-0317     790-791    Vector: BRK Instr. Interrupt
  NMINV   0318-0319     792-793    Vector: Non-Maskable Interrupt
  IOPEN   031A-031B     794-795    KERNAL OPEN Routine Vector
  ICLOSE  031C-031D     796-797    KERNAL CLOSE Routine Vector
  ICHKIN  031E-031F     798-799    KERNAL CHKIN Routine
  ICKOUT  0320-0321     800-801    KERNAL CHKOUT Routine
  ICLRCH  0322-0323     802-803    KERNAL CLRCHN Routine Vector
  IBASIN  0324-0325     804-805    KERNAL CHRIN Routine
  IBSOUT  0326-0327     806-807    KERNAL CHROUT Routine
  ISTOP   0328-0329     808-809    KERNAL STOP Routine Vector
  IGETIN  032A-032B     810-811    KERNAL GETIN Routine
  ICLALL  032C-032D     812-813    KERNAL CLALL Routine Vector
  USRCMD  032E-032F     814-815    User-Defined Vector
  ILOAD   0330-0331     816-817    KERNAL LOAD Routine
  ISAVE   0332-0333     818-819    KERNAL SAVE Routine Vector
          0334-033B     820-827    Unused
  TBUFFR  033C-03FB     828-1019   Tape I/O Buffer
          03FC-03FF    1020-1023   Unused
  VICSCN  0400-07FF    1024-2047   1024 Byte Screen Memory Area

          0400-07E7    1024-2023   Video Matrix: 25 Lines X 40 Columns
          07F8-07FF    2040-2047   Sprite Data Pointers

          0800-9FFF   2048-40959   Normal BASIC Program Space
          8000-9FFF  32768-40959   VSP Cartridge ROM - 8192 Bytes
          A000-BFFF  40960-49151   BASIC ROM - 8192 Bytes (or 8K RAM)
          C000-CFFF  49152-53247   RAM - 4096 Bytes
          D000-DFFF  53248-57343   Input/Output Devices and
                                     Color RAM or Character Generator ROM
                                     or RAM - 4096 Bytes
          E000-FFFF  57344-65535   KERNAL ROM - 8192 Bytes (or 8K RAM)
```

## Key Registers
- $0100-$01FF - 6502 Stack page (stack area).
- $0200 - System input buffer (keyboard buffer start).
- $028F-$02FF - KERNAL/BASIC low-memory variables and RS-232 images (keyboard vector, MODE, RS‑232 control/status/baud, PAL/NTSC flag).
- $0300-$0333 - KERNAL and BASIC vectors (IERROR, IMAIN, ICRNCH, ... ILOAD, ISAVE).
- $033C-$03FB - Tape I/O buffer (TBUFFR).
- $0400-$07FF - VICSCN: Screen RAM (Video matrix 25×40) and sprite pointers at $07F8-$07FF.
- $0800-$9FFF - BASIC program area (RAM) / Cartridge ROM overlap at $8000-$9FFF for 8KB cartridges.
- $8000-$9FFF - Cartridge ROM area (example: VSP cartridge).
- $A000-$BFFF - BASIC ROM (8 KB) or switchable RAM.
- $C000-$CFFF - RAM page (4 KB).
- $D000-$DFFF - I/O devices, Color RAM, Character ROM/RAM (VIC-II and peripheral registers live in this range).
- $E000-$FFFF - KERNAL ROM (8 KB) or switchable RAM.

## References
- "vic_registers_overview" — expands on VIC screen memory area and VIC-II registers mapped into $D000-$D02E and the VICSCN region.

## Labels
- IOPEN
- ICLOSE
- ICHKIN
- ICKOUT
- IBASIN
- IBSOUT
- TBUFFR
- VICSCN
