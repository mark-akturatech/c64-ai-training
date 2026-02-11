# Disk error routine (BASIC GOSUB 650, INPUT#15)

**Summary:** BASIC disk error handler invoked via GOSUB 650; uses INPUT#15 to read drive error fields (en, em$, et, es) and prints a formatted "disk error" message when en<>0. Commonly called after OPEN and drive commands.

## Disk error handler
This subroutine block begins at line 650 and is intended to be called (GOSUB 650) after disk/drive operations (e.g., OPEN, read/write commands). It performs an INPUT#15 to retrieve the drive's error information into the variables en, em$, et, es. If en equals 0 the subroutine returns immediately (no error). If en is nonzero it prints a formatted error banner ("{reverse on}disk error{reverse off}") followed by the four returned fields and then executes END to stop the BASIC program.

- en — numeric error code returned by the drive (0 = no error)
- em$ — error message string (drive-supplied)
- et, es — additional error fields (often track/sector or error type details)
- The print uses PETSCII reverse-on/reverse-off control codes (reverse video) around the "disk error" banner.

## Source Code
```basic
630 rem******************************
640 rem* subroutines                *
650 rem******************************
660 rem* error routine              *
670 rem******************************
680 input#15,en,em$,et,es:if en=0 then return
690 print "{reverse on}disk error{reverse off}" en,em$,et,es
700 end
```

## References
- "device_selection_and_file_opening" — expands on GOSUB 650 used after OPEN calls
- "read_byte0_and_m_r_commands" — expands on GOSUB 650 used after drive commands
- "screen_continue_subroutine" — expands on other subroutines that follow in this section