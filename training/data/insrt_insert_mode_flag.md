# INSRT ($D8) — Insert Mode Flag

**Summary:** $00D8 is the editor Insert Mode flag (zero page). Any nonzero value is interpreted as the count of open insert spaces; pressing INST shifts the line right, may allocate a new physical line, updates line length at $00D5 and the screen line link table at $00D9, and causes the editor to behave like quote mode (see $00D4) until inserts are filled.

## Description
- Address: $00D8 (decimal 216). Flag: Insert Mode — any number > 0 = number of insert spaces currently open.
- When the INST key is pressed:
  - The editor shifts the current logical line to the right.
  - If necessary and possible, it allocates an additional physical line to hold the logical line.
  - The screen line length value at $00D5 is updated to reflect the new length.
  - The screen line link table (maintained starting at or adjusted via $00D9) is updated to reflect any physical/logical line changes.
  - $00D8 is used to record how many spaces were opened by the insertion operation (the insert count).
- While $00D8 contains a nonzero value (inserts are open), the editor treats input as if in quote mode (see $00D4). That is, normally nonprinting cursor-control characters will instead leave their printed equivalents on screen when typed.
- The difference between insert mode and quote mode:
  - In insert mode, the DELETE key will leave a printed equivalent (like in quote mode).
  - In insert mode, pressing INST inserts spaces as normal (whereas quote mode does not perform insertion behavior).

## Key Registers
- $00D8 - Zero Page - INSRT: Insert mode flag / number of open insert spaces (any nonzero = count of inserts)
- $00D5 - Zero Page - LNMX: Screen line length / updated when inserts allocate space
- $00D9 - Zero Page - Screen line link table adjustments (link table entry used/adjusted when physical/logical lines change)
- $00D4 - Zero Page - QUOTE: Quote mode flag (editor behavior while inserts are open mirrors quote mode)

## References
- "qtsw_quote_mode_and_hook_example" — expands on similarities and differences between quote and insert modes  
- "ldtb1_screen_line_link_table" — details adjustments to the screen line link table when inserts cause physical/logical line changes

## Labels
- INSRT
- LNMX
- QUOTE
