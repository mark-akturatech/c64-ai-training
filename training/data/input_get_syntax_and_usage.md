# INPUT# and GET# — reading DOS responses from the command channel

**Summary:** INPUT# and GET# are Commodore BASIC file-I/O statements for reading data from the DOS command channel (logical file/channel numbers such as 15). INPUT# reads through the next carriage return (used for drive error/status messages); GET# reads a single byte (used in direct-access or low-level drive comms). Keywords: INPUT#, GET#, command channel, DOS, BASIC.

## Usage and behavior
- Syntax (BASIC): INPUT# file#, varlist and GET# file#, varlist. Use the file number you opened for the command channel (commonly 15).
- file# = logical file number for the already-opened command channel.
- variable list = one or more variable names separated by commas (string variables use the $ suffix).
- Both statements must appear inside a BASIC program (cannot be executed in immediate mode).
- Do not put a space before the '#' in the keyword (correct: INPUT#, not "INPUT #"). Spaces after the '#' are optional.
- Behavior:
  - INPUT# reads from the file until the next carriage-return (CR) character; useful for reading DOS error/status messages and drive report lines.
  - GET# reads a single byte from the file; commonly used for direct-access or byte-at-a-time communication with a drive or device.

**[Note: Source may contain OCR errors — original text used '*' characters in place of '#' and the string-variable '$' suffix; this node corrects those to INPUT#/GET# and $ for string variables.]**

## Source Code
```basic
SYNTAX:      INPUT# file#, varlist
             GET#  file#, varlist

EXAMPLE:     INPUT# 15, EN, EM$, ET, ES$
             GET#   15, A$
```

(These examples show reading from the command channel opened as file 15; variable names are placeholders — numeric variables have no suffix, string variables end with $.)

## References
- "checking_error_status_subroutine" — expands on an example that reads error status using INPUT#
