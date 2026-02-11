# $0311-$0312 USRADD — Address of the USR Routine (Low Byte First)

**Summary:** $0311-$0312 store the USR vector (low byte, high byte) used by BASIC's USR() function; parameters are passed/returned via FAC1 ($0061-$0066). Conversion helpers are vectored at $0003-$0006; use JMP ($0005) to convert a signed integer back into FAC1.

**Description**
$0311-$0312 contain the two-byte address (low byte first) that BASIC's USR routine will jump to when a USR() call is executed. On a stock system, these bytes are initialized by the KERNAL to point at the BASIC error handler; attempting USR without changing them will produce an ILLEGAL QUANTITY error.

To use USR, you must POKE the low and high bytes of your machine-language routine address into $0311 (low) and $0312 (high). The standard arithmetic to split a 16-bit address AD into bytes is:

HI = INT(AD/256)
LO = AD - (HI * 256)

USR allows passing a numeric parameter and returning a numeric result via the Floating Point Accumulator FAC1 (locations $0061-$0066). When you write X = USR(50) in BASIC, the value 50 is converted to the internal floating point format and placed in FAC1 before the machine routine is called. When the machine routine finishes, BASIC assigns the floating value left in FAC1 to X.

Because working directly with the floating format is inconvenient, the system provides vectored helper routines to convert between FAC1 and a two-byte signed integer:

- The routine vectored at $0003-$0004 converts the floating value in FAC1 to a signed 16-bit integer (range -32768..+32767). After the conversion, the low byte is returned in the Y register and also stored in location 101 ($0065); the high byte is returned in the Accumulator (A). The sign is stored in bit 7 of the high byte.

- To convert a signed 16-bit integer back into FAC1, place the high byte in A and the low byte in Y, then execute an indirect jump through the vector at $0005 using the instruction JMP ($0005). The floating point result will be left in FAC1.

These vectors let you write machine routines that accept a numeric parameter from BASIC and return a numeric result, without implementing floating-point routines yourself.

## Source Code
```basic
REM Example: store machine routine address $C000 (49152) into USR vector
HI = INT(49152 / 256)
LO = 49152 - (HI * 256)
POKE 786, HI    : REM store high byte at $0312 (decimal 786)
POKE 785, LO    : REM store low  byte at $0311 (decimal 785)
```

```basic
REM Example BASIC call passing parameter 50 and receiving result
X = USR(50)
```

```text
FAC1 (Floating Point Accumulator) layout:
Decimal:  97  98  99 100 101 102
Address: $0061 $0062 $0063 $0064 $0065 $0066
```

```asm
; Assembly: convert signed integer in A (high), Y (low) to FAC1:
JMP ($0005)    ; jump indirect through vector at $0005-$0006
```

```text
Vector addresses referenced:
$0003-$0004  - Convert FAC1 -> signed 16-bit (A = high byte, Y/($0065) = low byte)
$0005-$0006  - Convert signed 16-bit (A=high, Y=low) -> FAC1 (use JMP ($0005))
$0311-$0312  - USRADD vector (low byte, high byte)
$0061-$0066  - FAC1 (floating point accumulator)
```

## Key Registers
- $0311-$0312 - RAM / KERNAL vector - USR routine address (low byte then high byte)
- $0061-$0066 - RAM - FAC1 (Floating Point Accumulator)
- $0003-$0004 - RAM / KERNAL vector - FAC1 -> signed 16-bit conversion routine vector
- $0005-$0006 - RAM / KERNAL vector - signed 16-bit -> FAC1 conversion routine vector

## References
- "register_storage_area" — discussion of SYS vs USR and register/FAC usage

## Labels
- USRADD
- FAC1
