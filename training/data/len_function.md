# LEN

**Summary:** LEN is a Commodore 64 BASIC (BASIC 2.0) string function that returns the number of characters in a string expression, counting blanks and non-printed characters. Format: LEN(<string>) — returns an integer.

## Description
TYPE: Integer Function  
Format: LEN(<string>)

Action: Returns the number of characters in the string expression. Non-printed characters and blanks are counted.

## Source Code
```basic
CC$ = "COMMODORE COMPUTER": PRINT LEN(CC$)
```
Output:
```text
18
```