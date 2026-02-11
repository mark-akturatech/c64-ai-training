# DATA statement (BASIC)

**Summary:** DATA <list of constants> stores literal constants in a BASIC program for retrieval by READ; DATA lines are not executed and are treated as a continuous left-to-right list from lowest to highest line number. Strings that contain commas, colons, blanks, or other special characters must be quoted; READ type-mismatch causes an error.

## Description
- TYPE: Statement  
- FORMAT: DATA <list of constants>

Action and behaviour:
- DATA statements place literal constants into a program for later consumption by READ statements. DATA lines themselves are not executed; they only need to exist in the program listing.
- All DATA statements in a program form a single continuous list of constants. READ pulls items left-to-right within a DATA line, and then proceeds to the next DATA line by increasing line number (lowest to highest).
- If READ requests a numeric value but encounters a string (or otherwise finds data that does not match the requested type), the interpreter raises an error.
- Any characters may be included as DATA items. However, if an item contains punctuation that would normally delimit tokens (comma , or colon :), blanks, shifted/graphic characters, or cursor-control characters, the item must be enclosed in double quotes (").
- DATA lines are commonly placed at the end of a program but can be located anywhere in the listing.

Examples illustrate usage forms: numeric lists, bare word tokens, quoted strings containing commas, and numeric constants using scientific notation.

## Source Code
```basic
10 DATA 1,10,5,8
20 DATA JOHN,PAUL,GEORGE,RINGO
30 DATA "DEAR MARY, HOW ARE YOU, LOVE, BILL"
40 DATA -1.7E-9, 3.33
```

## References
- "using_arrays_and_data_statements" — expands on using READ to pull DATA into arrays or variables