# Relative-file program behavior and modification notes (function keys, POSITION/PRINT#/INPUT#, CHR$ record sizing)

**Summary:** Describes a sample Commodore 64 relative-file program using POSITION, PRINT#, and INPUT# for record access, CHR$() for record length and indexing, error-channel handling via the disk drive error channel, and runtime function-key controls (F1/F3/F5/F7). Includes rules for adding fields (extra POSITION commands) and record-count limits (up to 720 records; special third-CHR$() values for >256 and >512 records).

**Program behavior (runtime controls and I/O sequencing)**

- **Creating a relative file:** Press F1 to open/create the relative file on disk.
- **Reading a relative file:** Run the program, then press F3 to read the previously created relative file.
- **Error-channel handling:** If the disk drive shows an error (flashing red light), press RUN/STOP, type RUN, then press F5. The program reads the drive error channel and displays:
  - Error number and message
  - Track and sector of the error
  - Then resets the drive for further use
- **Printing option:** When prompted later in the program, press F7 to print the file or press C to continue without printing.

I/O sequencing notes (line references from the sample program):

- **Line 60:** After a POSITION command, use PRINT# to place data under the command channel and move to the specified character position (example: move to character position 1 as set by line 30 using CHR$(1)).
- **Lines 130–160:** To read, use POSITION to specify the character position (line 130) followed by INPUT# (line 160) to read the data at that position.

Essential rules to follow when using relative files:

1. A POSITION command must be executed before any write (PRINT#) or read (INPUT#) operation.
2. Always use PRINT#<channel> immediately after POSITION when writing; this places the data under the drive’s command channel control.
3. The first character-string argument in the POSITION command (a CHR$ value) must match the third numeric argument (channel number) in the corresponding OPEN statement (exceptions noted in the sample: OPEN 1,8,15).
4. For record indexing, it’s convenient to use the FOR...NEXT loop variable as the second character-string in POSITION (e.g., CHR$(I) where I is the record number).

**Modifying the sample program (fields, record length, record count)**

- **Adding fields within a record:**
  - Insert additional POSITION commands for each field you want inside the record.
  - When adding a POSITION for a field, append the character position number as the last CHR$() argument (this sets the byte offset within the record).
- **Changing record length:**
  - Modify the CHR$(n) value that sets record length (the sample uses CHR$(50) on line 8 — change that value to alter record length).
- **Record-count limits and indexing:**
  - The number of accessible records is determined by how POSITION is invoked (the record index supplied via CHR$ in POSITION).
  - The sample demonstrates 5 records (FOR I = 1 TO 5).
  - The program can address up to 720 records in total.
  - For addressing more than 256 records, set the third CHR$() argument in POSITION to value 1.
  - For addressing more than 512 records, set the third CHR$() argument in POSITION to value 2.
  - For up to 256 records, you may simply loop with FOR I = 1 TO 256 using the standard CHR$(I) indexing.

## Source Code

```basic
10 OPEN 15,8,15
20 OPEN 8,8,8,"O:TEST,L," + CHR$(50)
30 PRINT#15,"P" + CHR$(8) + CHR$(0) + CHR$(4) + CHR$(1)
40 PRINT#8,CHR$(255)
50 CLOSE 8:CLOSE 15
```

This program creates a relative file called TEST with records that are 50 bytes long. Line 30 moves the pointer to the first position in record #1024 (rec# = 256 * 4 + 0 = 1024). Since the record didn't already exist, an error message will be generated, warning you not to use GET# or INPUT#.

Once a relative file exists, you can open it and expand it or access it for data transfer. The file can be expanded, but the record length cannot be changed. To expand a file, specify a larger number of records, as in line 30 in the previous example program.

To write data to an existing relative file, use the following:

```basic
10 OPEN 15,8,15
20 OPEN 2,8,6,"0:TEST"
30 GOSUB 1000
40 IF A=100 THEN STOP
50 PRINT#15,"P" + CHR$(6) + CHR$(100) + CHR$(0) + CHR$(1)
60 GOSUB 1000
70 IF A=50 THEN PRINT#2,1:GOTO 50
80 IF A=100 THEN STOP
90 PRINT#2,"123456789"
100 PRINT#15,"P" + CHR$(6) + CHR$(100) + CHR$(0) + CHR$(20)
110 PRINT#2,"JOHN QWERTY"
120 CLOSE 2:CLOSE 15
130 END
1000 INPUT#15,A,A$,B$,C$
1010 IF (A=50) OR (A<20) THEN RETURN
1020 PRINT "FATAL ERROR:"; A, A$, B$, C$
1030 A=100: RETURN
```

Lines 10 and 20 open the command and a data channel. Lines 30 and 40 check for errors. Line 50 moves the file pointer to the 100th record position. Since no records exist yet, an error signal is generated. Lines 60, 70, and 80 check for the error and create 100 records. Line 90 writes 9 bytes of data to the first 9 locations in record 100. Line 110 then prints a name from that position. It is important that data is written into the record sequentially so data already in the record is not destroyed.

The following program reads back the data put in the file by the previous program:

```basic
10 OPEN 15,8,15
20 OPEN 2,8,6,"0:TEST"
30 GOSUB 1000
40 IF A=100 THEN STOP
50 PRINT#15,"P" + CHR$(6) + CHR$(100) + CHR$(0) + CHR$(1)
60 GOSUB 1000
70 IF A=50 THEN PRINT A$
80 IF A=100 THEN STOP
90 INPUT#2,D$: PRINT D$
100 PRINT#15,"P" + CHR$(6) + CHR$(100) + CHR$(0) + CHR$(20)
110 INPUT#2,E$: PRINT E$
120 CLOSE 2:CLOSE 15
130 END
1000 INPUT#15,A,A$,B$,C$
1010 IF (A=50) OR (A<20) THEN RETURN
1020 PRINT "FATAL ERROR:"; A, A$, B$, C$
1030 A=100: RETURN
```

## References

- "mailing_list_sample_program_and_usage" — expands on practical modification examples (changing CHR$ length and adding fields)
- Commodore 64 User's Guide, 2nd Edition
- Commodore 1541 User's Guide
- Compute! Magazine, Issue 40, "Relative Files for VIC-20 and Commodore 64"