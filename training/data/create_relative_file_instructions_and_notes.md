# Relative-file creation: POSITION and CHR$ usage (lines 6–65)

**Summary:** This document provides a sample program demonstrating the creation and manipulation of a Commodore 64 relative file with two fixed fields. It utilizes the `POSITION` command (`P`) and `CHR$` functions to set file pointer positions within records. The `POSITION` command does not read or write data; it solely sets the pointer for subsequent `PRINT#` or `INPUT#` operations.

**Step-by-step notes**

- **File Structure:** The relative file consists of records with two fields:
  - First field starts at character position 1.
  - Second field starts at character position 25.
  - Each record is 50 characters long (`CHR$(50)`).

- **Line 6:** Defines `Z$` as the file name variable. The `F1` function key is programmed to trigger file creation.

- **Line 8:** Creates the relative file and reserves space for records of 50 characters using `CHR$(50)`.

- **Line 30:** Uses the `POSITION` command (`P`) with `CHR$(1)` to set the file pointer to the first character position of the current record. If `CHR$` is omitted, `POSITION` defaults to character position 1.

- **Line 65:** Employs `POSITION` (`P`) with `CHR$(25)` to move the file pointer to the 25th character position of the record, marking the start of the second field.

- **Behavioral Note:** The `POSITION` command does not perform read or write operations. It only moves the file pointer; subsequent `PRINT#` or `INPUT#` operations will read from or write to the file starting at the specified position.

## Source Code

Below is the complete sample program illustrating the creation and manipulation of a relative file with two fields:

```basic
5 REM RELATIVE FILE CREATION EXAMPLE
6 Z$ = "RELFILE" : REM DEFINE FILE NAME
7 OPEN 15,8,15 : REM OPEN COMMAND CHANNEL
8 OPEN 2,8,2,Z$+",L,"+CHR$(50) : REM CREATE RELATIVE FILE WITH 50-CHARACTER RECORDS
9 IF DS$<>"" THEN PRINT DS$ : CLOSE 2 : CLOSE 15 : END : REM CHECK FOR DISK ERRORS
10 PRINT "RELATIVE FILE ";Z$;" CREATED"
20 REM WRITE SAMPLE DATA TO RELATIVE FILE
30 PRINT#15,"P"CHR$(2+96)CHR$(1)CHR$(0)CHR$(1) : REM POSITION TO RECORD 1, FIELD 1
40 PRINT#2,"FIRST FIELD DATA" : REM WRITE DATA TO FIRST FIELD
50 PRINT#15,"P"CHR$(2+96)CHR$(1)CHR$(0)CHR$(25) : REM POSITION TO RECORD 1, FIELD 2
60 PRINT#2,"SECOND FIELD DATA" : REM WRITE DATA TO SECOND FIELD
70 REM READ DATA BACK FROM RELATIVE FILE
80 PRINT#15,"P"CHR$(2+96)CHR$(1)CHR$(0)CHR$(1) : REM POSITION TO RECORD 1, FIELD 1
90 INPUT#2,A$ : PRINT "FIELD 1: ";A$ : REM READ AND DISPLAY FIRST FIELD
100 PRINT#15,"P"CHR$(2+96)CHR$(1)CHR$(0)CHR$(25) : REM POSITION TO RECORD 1, FIELD 2
110 INPUT#2,B$ : PRINT "FIELD 2: ";B$ : REM READ AND DISPLAY SECOND FIELD
120 CLOSE 2 : CLOSE 15 : REM CLOSE FILE AND COMMAND CHANNEL
```

**Explanation:**

- **Lines 5–6:** Set up the file name variable `Z$`.

- **Line 7:** Opens the command channel on logical file number 15.

- **Line 8:** Creates a relative file named `RELFILE` with records of 50 characters.

- **Line 9:** Checks for disk errors using the disk status string `DS$`.

- **Line 10:** Confirms the creation of the relative file.

- **Lines 20–60:** Write sample data to the first and second fields of record 1:
  - **Line 30:** Positions the file pointer to the first character of record 1.
  - **Line 40:** Writes "FIRST FIELD DATA" to the first field.
  - **Line 50:** Positions the file pointer to the 25th character of record 1.
  - **Line 60:** Writes "SECOND FIELD DATA" to the second field.

- **Lines 70–110:** Read and display the data from the first and second fields of record 1:
  - **Line 80:** Positions the file pointer to the first character of record 1.
  - **Line 90:** Reads and prints the first field data.
  - **Line 100:** Positions the file pointer to the 25th character of record 1.
  - **Line 110:** Reads and prints the second field data.

- **Line 120:** Closes the relative file and the command channel.

## References

- "relative_files_introduction_and_structure_overview" — background on relative-file structure and side sectors
