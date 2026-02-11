# Commodore 64 Memory Map (Part 1): Zero Page $0000-$0096

**Summary:** Zero-page map and labels for $0000-$0096 including 6510 I/O registers ($0000,$0001), convert vectors (ADRAY1/ADRAY2 $0003-$0006), CHRGET ($0073-$008A) and early BASIC zero-page workspace pointers (INDEX, TXTTAB, VARTAB, TXTPTR, etc.).

## Zero-page layout and key variables
This chunk documents the beginning of the C64 zero page used by BASIC/KERNAL: the 6510 on-chip data-direction and I/O port at $0000/$0001, jump vectors for float/integer conversions, single-byte flags, utility pointers and the BASIC/Floating-Point workspace through $0096. Included labels cover temporary storage areas (TEMPST, TEMPF1-3), floating-point accumulators (FACEXP, FACHO, FACSGN, etc.), the CHRGET routine entry and related text pointers (TXTPTR/TXTTAB), variable/array table pointers (VARTAB/ARYTAB), and control flags used by BASIC input/scan routines.

(The Source Code section below reproduces the original table for precise addresses and descriptions.)

## Source Code
```text
COMMODORE 64 MEMORY MAP

             HEX        DECIMAL
   LABEL   ADDRESS      LOCATION               DESCRIPTION
  -------------------------------------------------------------------------

  D6510   $0000            0        6510 On-Chip Data-Direction Register
  R6510   $0001            1        6510 On-Chip 8-Bit Input/Output Register
          $0002            2        Unused
  ADRAY1  $0003-$0004       3-4      Jump Vector: Convert Floating-Integer

  ADRAY2  $0005-$0006       5-6      Jump Vector: Convert Integer--Floating
  CHARAC  $0007            7        Search Character
  ENDCHR  $0008            8        Flag: Scan for Quote at End of String
  TRMPOS  $0009            9        Screen Column From Last TAB
  VERCK   $000A           10        Flag: 0 = Load, 1 = Verify
  COUNT   $000B           11        Input Buffer Pointer / No. of Subscripts
  DIMFLG  $000C           12        Flag: Default Array DiMension
  VALTYP  $000D           13        Data Type: $FF = String, $00 = Numeric
  INTFLG  $000E           14        Data Type: $80 = Integer, $00 = Floating
  GARBFL  $000F           15        Flag: DATA scan/LIST quote/Garbage Coll
  SUBFLG  $0010           16        Flag: Subscript Ref / User Function Call
  INPFLG  $0011           17        Flag: $00 = INPUT, $40 = GET, $98 = READ
  TANSGN  $0012           18        Flag TAN sign / Comparison Result
          $0013           19        Flag: INPUT Prompt
  LINNUM  $0014-$0015     20-21     Temp: Integer Value
  TEMPPT  $0016           22        Pointer Temporary String
  LASTPT  $0017-$0018     23-24     Last Temp String Address
  TEMPST  $0019-$0021     25-33     Stack for Temporary Strings
  INDEX   $0022-$0025     34-37     Utility Pointer Area

  INDEX1  $0022-$0023     34-35     First Utility Pointer.
  INDEX2  $0024-$0025     36-37     Second Utility Pointer.

  RESHO   $0026-$002A     38-42     Floating-Point Product of Multiply
  TXTTAB  $002B-$002C     43-44     Pointer: Start of BASIC Text
  VARTAB  $002D-$002E     45-46     Pointer: Start of BASIC Variables
  ARYTAB  $002F-$0030     47-48     Pointer: Start of BASIC Arrays
  STREND  $0031-$0032     49-50     Pointer End of BASIC Arrays (+1)
  FRETOP  $0033-$0034     51-52     Pointer: Bottom of String Storage
  FRESPC  $0035-$0036     53-54     Utility String Pointer
  MEMSIZ  $0037-$0038     55-56     Pointer: Highest Address Used by BASIC
  CURLIN  $0039-$003A     57-58     Current BASIC Line Number
  OLDLIN  $003B-$003C     59-60     Previous BASIC Line Number
  OLDTXT  $003D-$003E     61-62     Pointer: BASIC Statement for CONT
  DATLIN  $003F-$0040     63-64     Current DATA Line Number
  DATPTR  $0041-$0042     65-66     Pointer: Current DATA Item Address
  INPPTR  $0043-$0044     67-68     Vector: INPUT Routine
  VARNAM  $0045-$0046     69-70     Current BASIC Variable Name

  VARPNT  $0047-$0048     71-72     Pointer: Current BASIC Variable Data
  FORPNT  $0049-$004A     73-74     Pointer: Index Variable for FOR/NEXT
          $004B-$0060     75-96     Temp Pointer / Data Area

  VARTXT  $004B-$004C     75-76     Temporary storage for TXTPTR during READ, INPUT and GET.
  OPMASK  $004D           77        Mask used during FRMEVL.
  TEMPF3  $004E-$0052     78-82     Temporary storage for FLPT value.
  FOUR6   $0053           83        Length of String Variable during Garbage collection.
  JMPER   $0054-$0056     84-86     Jump Vector used in Function Evaluation - JMP followed by Address.
  TEMPF1  $0057-$005B     87-91     Temporary storage for FLPT value.
  TEMPF2  $005C-$0060     92-96     Temporary storage for FLPT value.
  FACEXP  $0061           97        Floating-Point Accumulator #1: Exponent
  FACHO   $0062-$0065     98-101    Floating Accum. #1: Mantissa
  FACSGN  $0066          102        Floating Accum. #1: Sign
  SGNFLG  $0067          103        Pointer: Series Evaluation Constant
  BITS    $0068          104        Floating Accum. #1: Overflow Digit
  ARGEXP  $0069          105        Floating-Point Accumulator #2: Exponent
  ARGHO   $006A-$006D     106-109    Floating Accum. #2: Mantissa
  ARGSGN  $006E          110        Floating-Point Accum. #2: Sign
  ARISGN  $006F          111        Sign Comparison Result: Accum. #1 vs #2
  FACOV   $0070          112        Floating Accum. #1: Low-Order (Rounding)
  FBUFPT  $0071-$0072     113-114    Pointer: Cassette Buffer
  CHRGET  $0073-$008A     115-138    Subroutine: Get Next Byte of BASIC Text

  CHRGOT  $0079          121        Entry to Get Same Byte of Text Again
  TXTPTR  $007A-$007B     122-123    Pointer: Current Byte of BASIC Text

  RNDX    $008B-$008F     139-143    Floating RND Function Seed Value
  STATUS  $0090          144        Kernal I/O Status Word: ST
  STKEY   $0091          145        Flag: STOP key / RVS key
  SVXT    $0092          146        Timing Constant for Tape
  VERCK   $0093          147        Flag: 0 = Load, 1 = Verify
  C3PO    $0094          148        Flag: Serial Bus-Output Char. Buffered
  BSOUR   $0095          149        Buffered Character for Serial Bus
  SYNO    $0096          150        Cassette Sync No.
```

## Key Registers
- $0000 - Zero Page - 6510 On-Chip Data-Direction Register (D6510)
- $0001 - Zero Page - 6510 On-Chip 8-Bit I/O Register (R6510)
- $0003-$0004 - Zero Page - Jump Vector: Convert Floating->Integer (ADRAY1)
- $0005-$0006 - Zero Page - Jump Vector: Convert Integer->Floating (ADRAY2)
- $0007 - Zero Page - Search Character (CHARAC)
- $0008 - Zero Page - Flag: Scan for Quote at End of String (ENDCHR)
- $0009 - Zero Page - Screen Column From Last TAB (TRMPOS)
- $000A - Zero Page - Flag: 0 = Load, 1 = Verify (VERCK)
- $000B - Zero Page - Input Buffer Pointer / No. of Subscripts (COUNT)
- $000C - Zero Page - Flag: Default Array Dimension (DIMFLG)
- $000D - Zero Page - Data Type: $FF = String, $00 = Numeric (VALTYP)
- $000E - Zero Page - Data Type Flag: $80 = Integer, $00 = Floating (INTFLG)
- $000F - Zero Page - Flag: DATA scan / LIST quote / Garbage Collection (GARBFL)
- $0010 - Zero Page - Flag: Subscript Ref / User Function Call (SUBFLG)
- $0011 - Zero Page - Input Mode Flag ($00=INPUT,$40=GET,$98=READ) (INPFLG)
- $0012 - Zero Page - TAN sign / Comparison Result flag (TANSGN)
- $0014-$0015 - Zero Page - Temp: Integer Value (LINNUM)
- $0016 - Zero Page - Pointer Temporary String (TEMPPT)
- $0017-$0018 - Zero Page - Last Temp String Address (LASTPT)
- $0019-$0021 - Zero Page - Stack for Temporary Strings (TEMPST)
- $0022-$0025 - Zero Page - Utility Pointer Area (INDEX)
- $0026-$002A - Zero Page - Floating-Point Product of Multiply (RESHO)
- $002B-$002C - Zero Page - Pointer: Start of BASIC Text (TXTTAB)
- $002D-$002E - Zero Page - Pointer: Start of BASIC Variables (VARTAB)
- $002F-$0030 - Zero Page - Pointer: Start of BASIC Arrays (ARYTAB)
- $0031-$0032 - Zero Page - Pointer End of BASIC Arrays (+1) (STREND)
- $0033-$0034 - Zero Page - Pointer: Bottom of String Storage (FRETOP)
- $0035-$0036 - Zero Page - Utility String Pointer (FRESPC)
- $0037-$0038 - Zero Page - Pointer: Highest Address Used by BASIC (MEMSIZ)
- $0039-$003A - Zero Page - Current BASIC Line Number (CURLIN)
- $003B-$003C - Zero Page - Previous BASIC Line Number (OLDLIN)
- $003D-$003E - Zero Page - Pointer: BASIC Statement for CONT (OLDTXT)
- $003F-$0040 - Zero Page - Current DATA Line Number (DATLIN)
- $0041-$0042 - Zero Page - Pointer: Current DATA Item Address (DATPTR)
- $0043-$0044 - Zero Page - Vector: INPUT Routine (INPPTR)
- $0045-$0046 - Zero Page - Current BASIC Variable Name (VARNAM)
- $0047-$0048 - Zero Page - Pointer: Current BASIC Variable Data (VARPNT)
- $0049-$004A - Zero Page - Pointer: Index Variable for FOR/NEXT (FORPNT)
- $004B-$0060 - Zero Page - Temp Pointer / Data Area (includes VARTXT, OPMASK, TEMPF3, FOUR6, JMPER, TEMPF1, TEMPF2)
- $0061 - Zero Page - Floating-Point Accumulator #1: Exponent (FACEXP)
- $0062-$0065 - Zero Page - Floating Accum. #1: Mantissa (FACHO)
- $0066 - Zero Page - Floating Accum. #1: Sign (FACSGN)
- $0067 - Zero Page - Pointer: Series Evaluation Constant (SGNFLG)
- $0068 - Zero Page - Floating Accum. #1: Overflow Digit (BITS)
- $0069 - Zero Page - Floating-Point Accumulator #2: Exponent (ARGEXP)
- $006A-$006D - Zero Page - Floating Accum. #2: Mantissa (ARGHO)
- $006E - Zero Page - Floating Accum. #2: Sign (ARGSGN)
- $006F - Zero Page - Sign Comparison Result: Accum. #1 vs #2 (ARISGN)
- $0070 - Zero Page - Floating Accum. #1 Low-Order (Rounding) (FACOV)
- $0071-$0072 - Zero Page - Pointer: Cassette Buffer (FBUFPT)
- $0073-$008A - Zero Page - Subroutine: Get Next Byte of BASIC Text (CHRGET)
- $0079 - Zero Page - Entry to Get Same Byte of Text Again (CHRGOT)
- $007A-$007B - Zero Page - Pointer: Current Byte of BASIC Text (TXTPTR)
- $008B-$008F - Zero Page - Floating RND Function Seed Value (RNDX)
- $0090 - Zero Page - Kernal I/O Status Word: ST (STATUS)
- $0091 - Zero Page - Flag: STOP key / RVS key (STKEY)
- $0092 - Zero Page - Timing Constant for Tape (SVXT)
- $0093 - Zero Page - Flag: 0 = Load, 1 = Verify (VERCK)
- $0094 - Zero Page - Flag: Serial Bus-Output Char. Buffered (C3PO)
- $0095 - Zero Page - Buffered Character for Serial Bus (BSOUR)
- $0096 - Zero Page - Cassette Sync No. (SYNO)

## References
- "memory_map_part2_zero_page_continued" — continues zero-page variable listings and floating-point workspace

## Labels
- D6510
- R6510
- ADRAY1
- ADRAY2
- CHRGET
