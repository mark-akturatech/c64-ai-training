# BLOCK-ALLOCATE (BASIC example — block-allocation via command channel)

**Summary:** BASIC program that opens the command channel (OPEN 15) to device 8 and a direct-access channel (OPEN 2,8,2,"#"), issues B-A (block-allocate) commands, reads the drive's 4-field responses (EN$, EM$, ET$, ES$), and iterates through returned track/sector pairs until allocation completes; skips the directory track (track 18).

**Description**
This program demonstrates using the drive command channel to perform repeated B-A (block-allocate) operations and to parse the drive's responses to find the next available track/sector returned by the drive. It opens the command channel (channel 15) to device 8, issues an initial control string ("10") to initialize the drive, waits for a "00" OK response, then opens a data channel (channel 2) for block allocation. The main loop issues "B-A" with a target track T and sector S, reads EN$, EM$, ET$, ES$ (drive response fields — error number, error message, error track, error sector), and:

- If EN$ indicates an allocation continuation (the listing treats code "65" as the "no block" response, meaning the drive has no more blocks to allocate), it increments a BA counter and uses ET$/ES$ as the next T/S pair.
- If the drive returns track 18 (the directory track), the code skips it by setting T=19 and S=0.
- If ET$ evaluates to 0, the program closes the data channel and finishes.

(EN$/EM$/ET$/ES$ are the four text fields returned by the drive on the command channel; ET$/ES$ contain ASCII digits for returned track/sector.)

## Source Code
```basic
100 REM BLOCK-ALLOCATE
110 OPEN 15,8,15
120 PRINT#15,"10"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 310
150 OPEN 2,8,2,"#"
160 T=1
170 S=0
180 PRINT#15,"B-A";0;T;S
190 INPUT#15,EN$,EM$,ET$,ES$
200 IF EN$="00" GOTO 180
210 IF EN$<>"65" GOTO 330
220 BA=BA+1
230 PRINT T,S,BA
240 T=VAL(ET$)
250 IF T=0 GOTO 290
260 IF T=18 THEN T=19: S=0: GOTO 180
270 S=VAL(ES$)
280 GOTO 180
290 CLOSE 2
300 INPUT#15,EN$,EM$,ET$,ES$
310 CLOSE 15
320 END
330 PRINT "CDOWN>";EN$,",",EM$,",",ET$,",",ES$
340 CLOSE 2
350 INPUT#15,EN$,EM$,ET$,ES$
360 CLOSE 15
370 END
```

## References
- "block_allocate_command" — expands on B-A syntax and drive error handling
- Commodore 1541 User's Guide, Appendix B: Summary of CBM Floppy Error Messages
- Commodore 1541 User's Guide, Chapter 2: BASIC 2.0 Commands