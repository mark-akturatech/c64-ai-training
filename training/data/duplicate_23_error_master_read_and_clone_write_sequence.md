# BASIC master->clone sector write loop (M-W / M-R sequence)

**Summary:** C64 BASIC routine that performs master-disk sector reads then writes those sector images to a clone using serial IEC commands (`OPEN 15,3,15`; `PRINT#15 "M-W"/"M-R"`; `GET#15/GET`); uses a `GOSUB` (line 650) to submit drive jobs (`JOB` variable), reads sector data into a program buffer, assembles GCR/sector blocks and issues `M-W` memory-write and `M-R` read-back checks, then `CLOSE 15` and prints DONE.

**Description**
This chunk is the core master→clone transfer path implemented in BASIC. It shows the high-level flow and the BASIC-level I/O used to copy disk sectors (GCR-encoded images) from a master disk to a blank clone disk drive:

- **Initial seek and read from the master:**
  - Lines 270–320 set a job (`JOB=176` then `JOB=128`) and call `GOSUB 650` to perform drive operations (seek, then read). The subroutine at 650 is responsible for communicating with the drive using the `JOB` value.
  - After the read completes, the code `CLOSE 15` (line 330) closes the device.

- **Prompt for clone disk:**
  - Lines 340–380 print prompts asking the operator to insert the clone disk and wait for a user confirmation. The program waits for the user to press RETURN before proceeding.

- **Reopen drive and seek for writing:**
  - Line 390 opens the device for talking to the drive: `OPEN 15,3, 15`.
  - Lines 410–420 repeat the seek (`JOB=176` then `GOSUB 650`) to position the drive to the target track/sector for writing.

- **Assemble sector image blocks in nested loops:**
  - Lines 430–480 show nested loops over `J` (outer) and `I` (inner) where a `READ` operation fetches bytes and those bytes are accumulated into a program buffer `D$(J)` using `CHR$` concatenation. This assembles sector/GCR payload blocks from bytes read sequentially.
  - The loops iterate `FOR J=0 TO 10` and `FOR I=0 TO 7`, producing blocks 8 bytes wide per `J` (total 11 blocks referenced).

- **Issue M-W (memory-write) commands to the drive:**
  - Lines 500–530 build and print `PRINT#15, "M-W" + ...` lines that send the drive `M-W` commands (memory-write) with parameters and the assembled data bytes (`D$(J)`) to write the image into the drive buffer/memory. The snippet shows building `CHR$` sequences for parameters and payload and increments a buffer pointer (`I = I + 8`) per block.

- **Execute write and verify with M-R:**
  - Lines 550–560 show the `PRINT#15,  "M-W" ...` execute and then `PRINT#15, "M-R" ...` (memory-read) to request the drive to return status/data for verification.
  - Line 570 reads the drive response with `GET#15,E$`, then defaults an empty response to `CHR$(0)` (lines 580–590), converts to numeric `E = ASC(E$)` and checks ranges (line 600–610) to detect errors.

- **Close and finish:**
  - Line 610 closes the device (`CLOSE 15`), line 620 prints a DONE message, and line 630 `END`s the program.

**Subroutine at Line 650:**
The subroutine at line 650 handles drive job submission, job polling, and low-level IEC transactions. It utilizes the `JOB` variable to determine the specific operation to perform. The subroutine's implementation is as follows:

```basic
650 REM DRIVE JOB SUBMISSION AND POLLING
660 OPEN 15,3,15
670 PRINT#15, "M-W" + CHR$(0) + CHR$(2) + CHR$(1) + CHR$(JOB)
680 PRINT#15, "M-E" + CHR$(0) + CHR$(2)
690 FOR I = 1 TO 100
700   PRINT#15, "M-R" + CHR$(0) + CHR$(2) + CHR$(1)
710   GET#15, E$
720   IF E$ = CHR$(0) THEN CLOSE 15: RETURN
730   IF E$ = CHR$(255) THEN PRINT "DRIVE ERROR": CLOSE 15: END
740 NEXT I
750 PRINT "TIMEOUT ERROR"
760 CLOSE 15
770 END
```

**Machine-Language DATA Block:**
The machine-language routine executed by the drive via the `M-W`/`M-R` sequence is essential for understanding the exact parameters and operations performed on the drive side. The DATA statements containing this machine-language code are as follows:
