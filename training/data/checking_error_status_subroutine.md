# Example: BASIC subroutine — check 1541 drive error status via command channel

**Summary:** Uses OPEN 15,8,15 and INPUT#15 to read the 1541 DOS status report (EN, EM$, ET, ES). Shows a short BASIC subroutine to detect drive errors and print the error code, message, track and sector.

## Description
The DOS prepares a status report for every disk operation and places it on the drive's command channel. Open the command channel (logical file number 15) to device 8 and use INPUT#15 to read the report fields:

- EN — numeric error code (error codes < 20 indicate no error)
- EM$ — English-language error message string
- ET — track number where the error occurred
- ES — sector number where the error occurred

Common usage: open the command channel early in your program and keep it open until the program ends (avoids repeated OPEN/CLOSE overhead). Use INPUT#15,EN,EM$,ET,ES after an operation to retrieve the drive's most recent status report. For the complete list of error codes and messages consult the 1541 User's Manual; Chapter 7 provides detailed explanations of causes and disk protection issues.

## Source Code
```basic
100 OPEN 15,8,15 : REM OPEN COMMAND CHANNEL

500 INPUT#15,EN,EM$,ET,ES : REM INPUT THE ERROR STATUS
510 IF EN < 20 THEN RETURN : REM NO ERROR ENCOUNTERED
520 PRINT EN; EM$; ET; ES : REM PRINT THE ERROR STATUS ON SCREEN
530 CLOSE 15 : END : REM ABORT ON BAD STATUS
```

## Key Registers
- (none)

## References
- "input_get_syntax_and_usage" — expands on uses of INPUT# to read the error message
- "validate_operation_and_risks_unclosed_files" — expands on error handling and consequences of leaving files/command channels open