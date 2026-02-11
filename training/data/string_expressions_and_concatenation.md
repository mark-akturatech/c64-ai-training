# CBM BASIC — String expressions and concatenation

**Summary:** CBM BASIC supports string expressions with the single concatenation operator `+` (plus). Concatenation appends the right string to the left; results may be printed, compared, or assigned. Mixing string and numeric types in comparisons or assignments raises the error "?TYPE MISMATCH". See CHR$ to insert control characters into strings.

**String Expressions**

Expressions in CBM BASIC are treated as if an implied "<>0" follows them; if the expression is true, the remainder of the statements on the same program line are executed; otherwise, the rest of the line is ignored, and execution continues at the next program line.

String arithmetic is limited to concatenation using the plus sign (`+`). When two string operands are concatenated, the string on the right is appended to the string on the left, producing a third string. The concatenated result may be:
- printed immediately,
- used in comparisons,
- or assigned to a string variable.

Type mixing is not permitted between strings and numbers: comparing or assigning between a string and a numeric value (in either direction) produces the BASIC error message:
?TYPE MISMATCH

To insert control characters (for example, carriage return, tab, or color-control codes) inside string literals, use the CHR$ function (see "chr$_function" for details).

Some examples of string expressions and concatenation are:


In line 30, note the space after "NEW " to ensure proper spacing in the concatenated result.

## Source Code

```basic
10 A$="FILE": B$="NAME"
20 NAM$=A$+B$                      :REM gives the string: FILENAME
30 RES$="NEW "+A$+B$               :REM gives the string: NEW FILENAME
```


## References

- Commodore 64 Programmer's Reference Guide: [BASIC Programming Rules - Expressions and Operations](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_017.html)