# RESTOR (KERNAL $FF8A)

**Summary:** KERNAL routine RESTOR at $FF8A (65418) restores the default system and interrupt vectors in RAM used by KERNAL and BASIC. Use the KERNAL VECTOR routine to read or alter individual vectors before calling RESTOR.

**Function**
Function Name: RESTOR  
Call address: $FF8A (hex) / 65418 (decimal)  
Purpose: Restore default system and interrupt vectors used by KERNAL and BASIC back to their original values in RAM.  
Preparatory routines: None  
Error returns: None  
Stack requirements: 2 bytes  
Registers affected: A, X, Y

**Description**
RESTOR writes the default contents for all system and interrupt vectors (the two-byte pointer locations in zero page/IO area used by KERNAL and BASIC routines) into RAM. This returns vector pointers to their original KERNAL/BASIC defaults. For reading or modifying individual vectors before restoring, use the KERNAL VECTOR routine.

The vectors restored by RESTOR are located in memory addresses $0314 to $0333 and their default values are:

- **$0314-$0315 (788-789):** Hardware IRQ Interrupt Address  
  Default: $EA31

- **$0316-$0317 (790-791):** BRK Instruction Interrupt Address  
  Default: $F32F

- **$0318-$0319 (792-793):** Non-Maskable Interrupt (NMI) Address  
  Default: $FE47

- **$031A-$031B (794-795):** KERNAL OPEN Routine Vector  
  Default: $F34A

- **$031C-$031D (796-797):** KERNAL CLOSE Routine Vector  
  Default: $F291

- **$031E-$031F (798-799):** KERNAL CHKIN Routine Vector  
  Default: $F20E

- **$0320-$0321 (800-801):** KERNAL CHKOUT Routine Vector  
  Default: $F250

- **$0322-$0323 (802-803):** KERNAL CLRCHN Routine Vector  
  Default: $F333

- **$0324-$0325 (804-805):** KERNAL CHRIN Routine Vector  
  Default: $F1CA

- **$0326-$0327 (806-807):** KERNAL CHROUT Routine Vector  
  Default: $F1E3

- **$0328-$0329 (808-809):** KERNAL STOP Routine Vector  
  Default: $F6ED

- **$032A-$032B (810-811):** KERNAL GETIN Routine Vector  
  Default: $F13E

- **$032C-$032D (812-813):** KERNAL CLALL Routine Vector  
  Default: $F32F

- **$032E-$032F (814-815):** User-Defined Vector  
  Default: $0000 (unused)

- **$0330-$0331 (816-817):** KERNAL LOAD Routine Vector  
  Default: $F4A5

- **$0332-$0333 (818-819):** KERNAL SAVE Routine Vector  
  Default: $F5ED

These vectors are critical for the proper functioning of system routines and interrupts. Modifying them allows customization of system behavior, but improper changes can lead to system instability. Therefore, it's recommended to use the VECTOR routine to manage these vectors safely.

**How to use:**
1) Call this routine (no parameters required).  
Example call: JSR RESTOR

## Source Code
```asm
; Example usage
        JSR RESTOR        ; call KERNAL RESTOR at $FF8A (65418)
; Equivalent absolute call:
        JSR $FF8A
```

## References
- "vector_kernal_routine" — Use VECTOR to read/alter vectors before calling RESTOR

## Labels
- RESTOR
