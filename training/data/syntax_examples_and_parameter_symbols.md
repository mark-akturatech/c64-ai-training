# BASIC Syntax Symbols: <file-num>, <device>, <file-name> (OPEN examples)

**Summary:** Table of BASIC parameter symbols and example values used for I/O/OPEN statements on the Commodore 64: <file-num>, <device>, <address>, <drive>, <file-name>, <constant>, <variable>, <string>, <number>, <line-number>, <numeric>.

## Symbols and usage
The listing below defines the parameter-name tokens used in the book's BASIC syntax examples (commonly used with OPEN/CLOSE and other I/O statements). The introductory note clarifies that example listings show blanks between words/operators for readability only; BASIC does not require blanks except where omission would create ambiguous syntax.

## Source Code
```text
    Programming examples in this book are shown with blanks separating
  words and operators for the sake of readability. Normally though, BASIC
  doesn't require blanks between words unless leaving them out would give
  you an ambiguous or incorrect syntax.
    Shown below are some examples and descriptions of the symbols used for
  various statement parameters in the following chapters. The list is not
  meant to show every possibility, but to give you a better understanding
  as to how syntax examples are presented.

    SYMBOL        EXAMPLE                 DESCRIPTION
  <file-num>        50              A logical file number
  <device>          4               A hardware device number
  <address>         15              A serial bus secondary
                                    device address number
  <drive>           0               A physical disk drive number
  <file-name>       "TEST.DATA"     The name of a data or program file
  <constant>        "ABCDEFG"       Literal data supplied by
                                    the programmer
  <variable>        X145            Any BASIC data variable name or
                                    constant
  <string>          AB$             Use of a string type variable required
  <number>          12345           Use of a numeric type variable
                                    required
  <line-number>     1000            An actual program line number
  <numeric>         1.5E4           An integer or floating-point variable
```

## References
- "io_overview" — expands on I/O device numbering and OPEN/CLOSE usage