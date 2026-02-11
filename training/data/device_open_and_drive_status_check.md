# Drive I/O: OPEN 15,8,15 and 1541 status command (10)

**Summary:** C64 BASIC sequence to open the command channel to the 1541 (OPEN 15,8,15), send the status command "10" via PRINT#15, read the drive response with INPUT#15 into EN$, EM$, ET$, ES$, test for EN$ = "00" (OK), report errors, CLOSE 15, and END on fatal error.

**Description**

This BASIC snippet ensures the 1541 drive is ready before any destructive operations. Steps:

- `OPEN 15,8,15` opens the command (device) channel number 15 to device 8 (the 1541) with secondary 15 (command channel).
- `PRINT#15,"10"` sends the drive status/command "10" (as in the source).
- `INPUT#15,EN$,EM$,ET$,ES$` reads the drive's response into four string variables:
  - **EN$**: Error Number
  - **EM$**: Error Message
  - **ET$**: Error Track
  - **ES$**: Error Sector
- `IF EN$="00" GOTO 280` branches to the next step (not included here) when the drive reports "00" (OK).
- If EN$ is not "00", the program prints the returned fields, CLOSEs the command channel, and ENDs (treating the condition as fatal).

**Note:** The original print prompt text was unclear in the source and has been normalized to "DRIVE>".

## Source Code

```basic
200 OPEN 15,8,15
210 PRINT#15,"10"
220 INPUT#15,EN$,EM$,ET$,ES$
230 IF EN$="00" GOTO 280
240 PRINT "DRIVE>",EN$,EM$,ET$,ES$
250 CLOSE 15
260 END
```

## References

- "program_header_and_input_validation" — expands on uses of the track/sector selected by the user
- "seek_operation_job_submission" — expands on next program steps after successful device status check