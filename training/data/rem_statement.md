# REM statement (Commodore 64 BASIC)

**Summary:** REM — BASIC remark/comment statement; syntax: REM [<remark>]. Used in Commodore 64 BASIC programs and appears when LISTed. REM lines are ignored during execution but can be targets for GOTO/GOSUB; the remark may contain any characters including colons and BASIC keywords.

**Description**
Type: Statement

Format: REM [<remark>]

Action: The REM statement stores a remark (comment) with a program line. When the program is LISTed, the REMark is printed exactly as entered. During execution, BASIC ignores the REM statement and anything following it on the same program line; no code on that line after REM is executed.

Behavior details:
- A REM line may be empty (e.g., just "REM").
- The remark may include any characters, including the colon (:) or BASIC keywords — they are not parsed as code when following REM.
- REM lines can be the target of GOTO or GOSUB; if execution jumps to a REM line, the interpreter will skip the REM and continue execution at the next higher program line that contains executable statements.
- REM is useful for documenting program intent and variable use and has no runtime effect other than occupying a line number.

**Examples**


In this example:
- Line 10 is a simple REM statement.
- Line 20 demonstrates that colons and keywords can be included in the remark.
- Lines 30 and 40 show REM statements following GOTO and GOSUB commands.
- Line 50 is an empty REM statement.
- Line 100 is a REM statement serving as a target for GOSUB.

## Source Code

```basic
10 REM This is a comment line
20 REM This line contains a colon: and a keyword PRINT
30 GOTO 10 : REM This is a comment after a GOTO statement
40 GOSUB 100 : REM This is a comment after a GOSUB statement
50 REM
60 PRINT "This line is executed after jumping to a REM line"
70 END
100 REM Subroutine starts here
110 PRINT "In subroutine"
120 RETURN
```


## References
- "BASIC LANGUAGE VOCABULARY" — BASIC statement reference (original source)