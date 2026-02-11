# FRE — available RAM function (Commodore 64 BASIC)

**Summary:** FRE returns a number indicating how much RAM is available to the BASIC program and its variables; the numeric argument is ignored. If FRE yields a negative value (wrapped 16-bit result), add 65536 to get the correct byte count; recommended expression: PRINT FRE(0) - (FRE(0) < 0)*65536.

## Description
TYPE: Function
FORMAT: FRE(<variable>)

FRE reports the amount of RAM available to the current BASIC program and its variables. The value placed inside the parentheses is not used in the calculation and may be any expression.

If the returned value is negative, treat it as a wrapped 16-bit result and add 65536 to obtain the actual number of free bytes (FRE returns a 16-bit signed value, two's complement). If a program attempts to use more memory than is available, BASIC will produce an OUT OF MEMORY error.

Recommended robust expression (always yields the correct available RAM as an unsigned byte count):
PRINT FRE(0) - (FRE(0) < 0)*65536

## Source Code
```basic
PRINT FRE(0)
10 X = (FRE(K)-1000)/7
950 IF FRE(0) < 100 THEN PRINT "NOT ENOUGH ROOM"

REM Recommended always-correct available RAM expression:
PRINT FRE(0) - (FRE(0) < 0)*65536
```

## References
- "memory_map_and_limits" — how available RAM relates to BASIC memory layout