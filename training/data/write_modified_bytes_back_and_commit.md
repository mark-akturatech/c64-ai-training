# Write LOW/HIGH into drive buffer with DOS M-W and issue U2 (BASIC)

**Summary:** BASIC fragment that writes modified LOW and HIGH bytes into the 1541 drive buffer using a DOS memory-write ("M-W" with CHR$ wrappers), sends the DOS "U2" command to write the buffer back to disk, reads the drive status with INPUT#15 into EN$,EM$,ET$,ES$, and branches on success or failure.

## Description
This code sequence:

- Stores or updates the HIGH byte (assignment shown as HIGH = D).
- Sends a DOS "M-W" (memory-write) command to the drive on the command channel (device #15) using CHR$ wrappers to transmit raw bytes (BASIC's CHR$ sends one raw byte).
- The M-W line includes a sequence of CHR$ bytes: control/parameter bytes followed by the LOW and HIGH bytes that were prepared earlier (these are written into the drive's sector buffer at the appropriate offsets).
- After the buffer is modified, a DOS "U2" command is sent to the drive to write the current buffer back to disk (the U2 parameters are printed after the "U2" token).
- The program reads the drive's status response from channel 15 using INPUT#15 into four status variables (EN$, EM$, ET$, ES$).
- If the drive error number EN$ equals "00" the code jumps to the success/close routine; otherwise it jumps to an error handler.

This fragment assumes earlier code calculated/converted the target address and placed the two low/high bytes into LOW and HIGH (see referenced chunk "confirm_and_convert_new_address").

## Source Code
```basic
780 HIGH = D

790 PRINT#15, "M-W";CHR$(2);CHR$(5);CHR$(2);CHR$(LOW);CHR$(HIGH)

800 PRINT#15, "U2";2;O;T;S

810 INPUT#15,EN$,EM$,ET$,ES$

820 IF EN$ = "00" GOTO 840

830 GOTO 940

840 CLOSE 2
```

Notes about the listing:
- CHR$ is used to transmit single raw bytes to the drive (e.g., CHR$(LOW), CHR$(HIGH)).
- The PRINT#15 lines send commands to the drive's command channel (device 15).
- INPUT#15 expects a four-field status response (drive returned status bytes read into EN$, EM$, ET$, ES$).
- The CLOSE 2 implies channel 2 was used elsewhere for a request channel; channel usage/context is external to this snippet.

## References
- "confirm_and_convert_new_address" — expands on how the LOW and HIGH numeric bytes are obtained from address conversion
- "finalize_success" — expands on successful write handling: closing channels and reporting DONE
- "error_and_close_handlers" — expands on error handling and close routines used on failure
