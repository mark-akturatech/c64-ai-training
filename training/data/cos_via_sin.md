# COS: PERFORM COS (KERNAL wrapper using SIN + pi/2)

**Summary:** KERNAL COS wrapper that converts COS(x) to SIN(x+pi/2) by loading the 5-byte floating-point constant pointer for pi/2 at $E2E0 into A/Y and calling the floating-point addition routine (JSR $B867) to add pi/2 to fac#1 before the SIN call. Searchable terms: $E2E0, $B867, fac#1, LDA, LDY, JSR, COS, SIN.

## Description
This routine implements COS(x) by using the identity COS(x) = SIN(x + pi/2). It prepares the argument (fac#1) for the SIN routine by adding the floating-point constant pi/2 to fac#1. The code loads the two address bytes for the pi/2 constant ($E2E0) into A and Y, then calls the KERNAL floating-point addition routine at $B867 which adds the 5-byte floating-point value at (A/Y) to the floating-point accumulator fac#1. After this addition, execution continues to the SIN implementation (see referenced chunks).

## Source Code
```asm
                                *** COS: PERFORM COS
                                This routine manipulates the input COS to be calculated
                                with SIN. COS(X) = SIN(X+pi/2), where  X is in radians. We
                                use it as Fac#1=SIN(fac#1+pi/2), ie pi/2 is added to fac#1
                                and the following SIN is performed.
.,E264 A9 E0    LDA #$E0        set address to pi/2
.,E266 A0 E2    LDY #$E2        at $e2e0
.,E268 20 67 B8 JSR $B867       add fltp at (A/Y) to fac#1
```

## Key Registers
- (omitted) — this chunk documents code addresses and data pointers, not hardware I/O registers

## References
- "sin_routine_sequence" — expands on the SIN implementation called after pi/2 is added
- "pi2_trig_constants_table" — contains the pi/2 floating-point constant stored at $E2E0 used by this routine