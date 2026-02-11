# Quote Mode (Commodore 64)

**Summary:** On the C64, typing the quote mark (SHIFT+2) enters "quote mode" where cursor-control keys stop moving the cursor and instead insert reversed-character representations of those controls into the string; when that string is PRINTed, the embedded cursor controls execute. INST/DEL is not affected.

**Quote Mode**
Once a quote (SHIFT+2) is typed, cursor-control keys cease their normal editing behavior and instead display as reversed-character tokens inside the quoted string. This allows programming of cursor movements and shifts by embedding those tokens in strings; when the string is later PRINTed, the tokens act as the actual cursor-control actions (moving the cursor, etc.). The INST/DEL key remains functional as normal and is not converted to a token in quote mode.

Affected cursor-control categories (all can be encoded inside strings in quote mode):
- CLR/HOME and SHIFT+CLR/HOME
- Cursor UP and DOWN, and their SHIFT variants
- Cursor LEFT and RIGHT, and their SHIFT variants

Example of use:
- To PRINT the word HELLO diagonally from the upper-left corner, you can type the string:
  PRINT"<HOME>H<DOWN>E<DOWN>L<DOWN>L<DOWN>O"
Inside the quotes, the angle-bracket names represent the reversed-character tokens produced by pressing the corresponding cursor keys; when PRINTed, those tokens move the cursor as if the keys had been pressed at runtime.

## Source Code
```text
KEY                             APPEARS AS
<CLR/HOME>                      
<SHIFT+CLR/HOME>                
<CRSR UP>                       
<CRSR DOWN>                     
<CRSR LEFT>                     
<CRSR RIGHT>                    
<SHIFT+CRSR UP>                 
<SHIFT+CRSR DOWN>               
<SHIFT+CRSR LEFT>               
<SHIFT+CRSR RIGHT>              
```

```basic
10 PRINT"<HOME>H<DOWN>E<DOWN>L<DOWN>L<DOWN>O"
```

## References
- "print_statement_examples" — expands on PRINT examples using strings
- "quote_mode_reverse_characters" — expands on how to enable reverse video via control characters
- "quote_mode_insert_mode_part1" — expands on insert mode differences within quote mode