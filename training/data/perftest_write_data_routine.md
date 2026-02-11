# Write-data subroutine (line 1930)

**Summary:** BASIC subroutine that writes sequential numeric records 1000–2000 to an open file channel variable (ch). The subroutine prints "writing data" to the screen, writes each numeric value to the file using `PRINT# ch,i`, calls an I/O status-display routine (`GOSUB 1850`), and closes the channel (`CLOSE ch`). It is used to populate a test file with sequential numeric records for later verification; typically invoked with `ch=2` (file channel).

**Description**
This is a compact BASIC write routine beginning at line 1930. Behavior:
- Prints the status message "writing data" to the screen.
- Loops `i` from 1000 to 2000 and writes each numeric value to the file associated with variable `ch` using `PRINT# ch,i` (writes one record per loop iteration).
- Calls `GOSUB 1850` to display the drive/I/O status after the writes (see `perftest_io_response_handler`).
- Closes the file channel with `CLOSE ch` and returns to the caller.

Notes:
- The routine assumes `ch` is a previously `OPEN`ed file channel (i.e., `OPEN` executed by the caller).
- Typical invocation: caller sets `ch=2` then `GOSUB 1930` to perform the write pass (see `perftest_mechanical_file_test`).

## Source Code
```basic
1920 :
1930 print "writing data"
1940 for i=1000 to 2000:print# ch,i:next
1950 gosub 1850
1960 close ch:return
1970 :
```

## References
- "perftest_io_response_handler" — expands on the I/O status-display routine called by `GOSUB 1850`
- "perftest_mechanical_file_test" — expands on the test harness that invokes this routine (sets `ch=2`; `GOSUB 1930`)