# BASIC Statement Syntax Notation (Commodore 64 Manual)

**Summary:** Rules for interpreting BASIC statement syntax on the C64: uppercase BASIC keywords, quoted items ("..."), optional parameters in [ ], underlined items inside [ ] must be used as shown, angle-bracket variables (<...>), slash (/) for exclusive choices, ellipses (...) for repetition; includes OPEN syntax and concrete OPEN examples.

## Syntax Rules
1. BASIC keywords are shown in capital letters and must be entered exactly as shown.
2. Items in quotation marks (" ") indicate literal text you must supply; both the quotation marks and the data inside must appear.
3. Items inside square brackets [ ] are optional parameters. If you use an optional parameter you must supply its required data. Ellipses (...) indicate that an optional item may be repeated as many times as the line allows.
4. If an item inside square brackets [ ] is underlined in the manual, those characters are required and must be spelled exactly as shown.
5. Items inside angle brackets < > indicate variable data you supply (e.g., <file-num>).
6. A slash (/) between items indicates you must choose one of the mutually exclusive options.

When applying these conventions practically, parameter sequence in real statements may vary; examples are intended to show required and optional parameters, not every possible order.

## Source Code
```basic
OPEN <file-num>,<device>[,<address>],["<drive>:<filename>][,<mode>]"
10 OPEN 2,8,6,"0:STOCK FOLIO,S,W"
20 OPEN 1,1,2,"CHECKBOOK"
30 OPEN 3,4
```

## References
- "basic_keywords_table" — expands on BASIC keywords and abbreviations
