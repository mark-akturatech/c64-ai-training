# JOB QUEUE — 1541 Job Submission & Drive-Polling (BASIC)

**Summary:** BASIC routine that sends low-level job packets to the 1541 via channel 15 using PRINT#15 (M-W), polls for completion with PRINT#15 (M-R) / GET#15, converts the single-byte response with ASC, uses a TRY retry counter and limit (TRY=500), treats response 27 as a transient retry, and performs failure cleanup with CLOSE 15 and END.

**Description**
This routine builds and transmits drive "job" packets to the 1541 on the command channel (assumed OPEN 15 done elsewhere), then polls the drive for a single-byte result. Key behaviors:

- **Lines 660–670:** Construct and send two M‑W (memory-write) packets containing job parameters and the job payload. The packet bytes are sent via concatenated CHR$ values; variables T, S, and JOB supply bytes.
  - **Line 660:** Sends an M-W command to write 4 bytes to the drive's memory starting at address $0008. The bytes written are T, S, T, and S.
  - **Line 670:** Sends an M-W command to write 1 byte to the drive's memory starting at address $0001. The byte written is JOB.
- **Line 680:** Increment TRY prior to polling.
- **Line 690:** Send an M‑R (memory-read) request to read 1 byte from the drive.
- **Line 700:** Retrieve the response into E$ with GET#15.
- **Line 710:** If an empty string is returned, normalize to CHR$(0) so ASC(E$) yields 0.
- **Line 720:** Convert the single-character response to a numeric byte with E = ASC(E$).
- **Line 730:** If TRY reaches the limit (500), jump to failure handling (line 760).
- **Line 740:** If the response byte equals 27 (decimal), treat it as a transient condition and jump back to the retry loop at 680 (re-send M-R and GET#15).
- **Line 750:** On any other response value, RETURN to the caller indicating completion/success.
- **Lines 760–780:** Print a failure message, CLOSE 15, and END on fatal failure.

This routine is a low-level helper used by the duplicate/clone process to submit machine-code jobs to the drive and poll for completion/error status. It does not itself interpret success codes beyond treating 27 as retry; the caller receives control on RETURN and must examine other state if needed.

## Source Code
```basic
640 REM JOB QUEUE
650 TRY=0

660 PRINT#15,"M-W"+CHR$(8)+CHR$(0)+CHR$(4)+CHR$(T)+CHR$(S)+CHR$(T)+CHR$(S)
670 PRINT#15,"M-W"+CHR$(1)+CHR$(0)+CHR$(1)+CHR$(JOB)

680 TRY=TRY+1

690 PRINT#15,"M-R"+CHR$(1)+CHR$(0)

700 GET#15,E$
710 IF E$="" THEN E$=CHR$(0)
720 E=ASC(E$)
730 IF TRY=500 GOTO 760
740 IF E=27 GOTO 680
750 RETURN

760 PRINT "JOB FAILED"
770 CLOSE 15
780 END
```

## References
- "duplicate_23_error_master_read_and_clone_write_sequence" — expands on the main read/write sequence and how job submission/polling integrates with clone operations
- "duplicate_23_error_machine_language_data_payload" — expands on the machine-code routine and data payload targeted by the job submissions
