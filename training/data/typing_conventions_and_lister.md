# Program listings: lister conversion and control-character notation

**Summary:** Describes the use of a special "lister" to convert working BASIC programs into WordPro files and the convention of spelling out Commodore control characters in curly braces (e.g., {CLR}), for C64/VIC-20 listings to reduce typographical errors and improve readability.

**How to Type in the Programs**

Program listings in this source were produced by a lister program that took working BASIC programs and converted them into WordPro™ files. To avoid unreadable Commodore control characters (for example, the reverse-field heart used for Clear Screen) the lister spelled out control characters as words and surrounded them with curly brackets. For example, the reverse-field heart becomes {CLR}.

The conversion was intended to (1) reduce typographical errors that occur when listings are retyped, and (2) make control characters readable and typeable by specifying the corresponding key(s) to press on a Commodore 64 or VIC-20. The table below summarizes the listing conventions, the corresponding control characters, and the proper key/keys to press on a C64 or VIC-20.

| Control Character | Listing Notation | Key Combination on C64/VIC-20 |
|-------------------|------------------|-------------------------------|
| Clear Screen      | {CLR}            | SHIFT + CLR/HOME              |
| Home              | {HOME}           | CLR/HOME                      |
| Cursor Down       | {DOWN}           | Cursor Down                   |
| Cursor Up         | {UP}             | SHIFT + Cursor Down           |
| Cursor Left       | {LEFT}           | SHIFT + Cursor Right          |
| Cursor Right      | {RIGHT}          | Cursor Right                  |
| Reverse On        | {RVS ON}         | CTRL + 9                      |
| Reverse Off       | {RVS OFF}        | CTRL + 0                      |
| Black             | {BLK}            | CTRL + 1                      |
| White             | {WHT}            | CTRL + 2                      |
| Red               | {RED}            | CTRL + 3                      |
| Cyan              | {CYN}            | CTRL + 4                      |
| Purple            | {PUR}            | CTRL + 5                      |
| Green             | {GRN}            | CTRL + 6                      |
| Blue              | {BLU}            | CTRL + 7                      |
| Yellow            | {YEL}            | CTRL + 8                      |
| Orange            | {ORANGE}         | C= + 1                        |
| Brown             | {BROWN}          | C= + 2                        |
| Light Red         | {LT RED}         | C= + 3                        |
| Dark Gray         | {DARK GRAY}      | C= + 4                        |
| Medium Gray       | {MED GRAY}       | C= + 5                        |
| Light Green       | {LT GREEN}       | C= + 6                        |
| Light Blue        | {LT BLUE}        | C= + 7                        |
| Light Gray        | {LT GRAY}        | C= + 8                        |

*Note: "C=" refers to the Commodore key.*

For example, to clear the screen, you would type `{CLR}`, which corresponds to pressing the SHIFT key and the CLR/HOME key simultaneously on the C64 or VIC-20.

**Sample Converted Listing**

Below is a sample BASIC program listing demonstrating the curly-brace convention in context:


In this listing:

- `{CLR}` clears the screen at the beginning and end of the program.
- `{DOWN}` moves the cursor down two lines before printing the message.
- `{RVS ON}` and `{RVS OFF}` toggle reverse video mode for the enclosed text.
- `{HOME}` moves the cursor to the top-left corner before displaying the prompt.

When typing in the program, replace each curly-brace notation with the corresponding key combination as specified in the table above.

## Source Code

```
10 PRINT "{CLR}"
20 PRINT "HELLO, WORLD!"
30 PRINT "{DOWN}{DOWN}THIS IS A SAMPLE PROGRAM."
40 PRINT "{RVS ON}REVERSE TEXT{RVS OFF}"
50 PRINT "{HOME}"
60 PRINT "PRESS ANY KEY TO CONTINUE..."
70 GET A$: IF A$="" THEN 70
80 PRINT "{CLR}"
90 END
```


## References

- "control_character_table_and_notes" — expands on control-character mapping table and typing instructions