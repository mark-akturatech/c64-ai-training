# BASIC DELAY subroutine (lines 1100–1170)

**Summary:** BASIC subroutine that prompts the user to "PRESS RETURN TO CONTINUE", implements a key-wait loop using GET and CHR$(13) (Enter/Return) detection, conditionally skips the wait based on flag variables (C and SRW), prints "OK" and RETURNs to the caller.

## Description
This subroutine pauses program execution until the user presses RETURN (Enter). It first prints the prompt, then checks the flags C and SRW: if C=0 and SRW<>1 the routine skips waiting and continues immediately to print "OK" and return. Otherwise it enters a key-wait loop which polls the keyboard with GET and accepts only CHR$(13) (the RETURN key) to proceed. After detecting RETURN it prints "OK" and returns to the caller.

**[Note: Source may contain OCR/transcription errors; code below has been reconstructed to standard C64 BASIC patterns where lines appeared corrupted. See the original OCR below in the Source Code section.]**

## Source Code
```basic
1100 REM DELAY
1110 PRINT "  <DOWN> PRESS RETURN TO CONTINUE"
1120 IF C=0 AND SRW<>1 THEN 1160
1130 GET C$
1140 IF C$="" THEN 1130
1150 IF C$<>CHR$(13) THEN 1130
1160 PRINT "OK"
1170 RETURN
```

Original (OCR/transcribed) input as provided:
```basic
1100  REM  DELAY
1110  PRINT"  <:D0WN> PRESS  tRVSJRETURNCROFFJ TO  CONTINUE"
1120  IFC=0ANDSRW<>1G0T01160
1130  GETC* : I FC*<> " " THEN 1 1 30
1140  GETC*: IFC*=""THEN1140
1150  IFC*<>CHR*(13)G0T01140
1160  PR I NT "OK"
1170  RETURN
```

## Key Registers
(omit — this chunk documents a BASIC subroutine, not hardware registers)

## References
- "basic_write_loop_and_completion" — used by the main program to pause between operations and wait for user to swap disks or confirm