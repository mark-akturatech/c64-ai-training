# USR Vector (USRPOK/USRADD) and FAC1 Parameter Passing

**Summary:** Addresses $0310 (USRPOK) and $0311-$0312 (USRADD) hold the JMP opcode and target address used by BASIC's USR function; FAC1 ($0061-$0066) is used to pass a floating-point parameter into and out of the machine-language routine. Vectored conversion routines at $0003-$0006 convert between FAC1 and two-byte signed integers.

## USR vector and parameter passing
USRPOK ($0310) contains the first byte of the machine-language JMP used when BASIC executes a USR call (documented as $4C — the 6510 JMP opcode). USRADD ($0311-$0312) holds the low and high bytes (low first) of the address to jump to when USR is executed. By default the vector points to the BASIC error handler so an uninitialized USR causes an ILLEGAL QUANTITY error.

To make USR call your routine you must POKE the low and high bytes of your routine address into USRADD. The USR function differs from SYS in that you can pass a numeric parameter into the routine and return a numeric result via FAC1:

- Calling X = USR(50) places the numeric parameter 50 (in floating-point format) into FAC1 ($0061-$0066) before jumping to the address pointed at by USRADD.
- When the machine-language routine finishes, BASIC reads FAC1 and assigns it to X (the floating-point return value).

Conversion between FAC1 (floating point) and a two-byte signed integer is normally done by the vectored routines referenced at locations $0003-$0006:
- The routine at the vector documented as "locations 3-4" converts FAC1 to a signed two-byte integer: low byte ends up in the Y register (and in memory location $0065), high byte in the Accumulator (A). The signed range is -32768..+32767 (high-byte bit 7 = sign).
- To return a value from a machine routine via FAC1, place the high byte in A and the low byte in Y, then JMP through the vector at "locations 5-6" (i.e. use JMP ($0005)). That routine converts the signed two-byte integer in A/Y into floating-point and leaves the result in FAC1.

**[Note: Source may contain an error — the decimal value given for USRPOK (67) does not match the hex opcode $4C (decimal 76).]**

## Source Code
```basic
REM Example: POKE USRADD for routine at 49152 ($C000)
HI = INT(49152/256)
LO = 49152 - (HI*256)
POKE 786, HI        : REM POKE high byte into $0312
POKE 785, LO        : REM POKE low byte into $0311
REM Then in BASIC:
X = USR(50)         : REM places 50 (floating point) into FAC1 ($0061-$0066)
```

```text
Address byte-splitting formula (as given):
HI = INT(AD/256)
LO = AD - (HI * 256)

Example for AD = 49152 ($C000):
HI = INT(49152/256) = 192
LO = 49152 - (192*256) = 0
POKE 786,192 : POKE 785,0
```

```text
Notes from source:
- USRPOK (784 / $0310): Jump Instruction for User Function (documented $4C)
- USRADD (785-786 / $0311-$0312): Address of USR Routine (Low Byte First)
- FAC1 area: 97-102 ($0061-$0066)
- Conversion vectors: locations 3-4 (FAC1 -> signed 2-byte), locations 5-6 (signed 2-byte -> FAC1)
```

## Key Registers
- $0310 - USRPOK - JMP opcode used by BASIC USR
- $0311-$0312 - USRADD - Low/High bytes of target address for USR (low byte first)
- $0003-$0006 - BASIC/KERNAL vectors - conversion routines for FAC1 <-> signed 2-byte integer
- $0061-$0066 - FAC1 - Floating-point accumulator used to pass parameter into and out of USR

## References
- "register_storage_area_for_sys_and_usr" — expands on SYS register storage and FAC1 usage in USR calls

## Labels
- USRPOK
- USRADD
- FAC1
