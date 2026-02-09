# BASIC Keywords Table (Continuation: SAVE–WAIT)

**Summary:** Continuation of the Commodore 64 BASIC keyword/token table listing SAVE, SGN, SIN, SPC(, SQR, STATUS, STEP, STOP, STR$, SYS, TAB(, TAN, THEN, TIME/TI/TI$, TO, USR, VAL, VERIFY, WAIT. Contains keyboard abbreviations, displayed-screen tokens (short forms), and function type classification (NUMERIC, STRING, SPECIAL).

## Table description
This chunk is the continuation of a BASIC keyword/token reference table. Columns are, left-to-right:
- Keyword — the BASIC keyword/token name
- Keyboard abbreviation — key or key-combination printed in the source as the shortcut/keyboard entry
- Displayed token — short on-screen token (if present)
- Function type — classification from the source (NUMERIC, STRING, SPECIAL, or blank if not specified)

Entries with blank fields are preserved exactly as in the source. No additional interpretation or expansion of the table has been added.

## Source Code
```text
  |           |                      |                |                   |
  |    SAVE   |     S <SHIFT+A>      |                |                   |
  |           |                      |                |                   |
  |    SGN    |     S <SHIFT+G>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    SIN    |     S <SHIFT+I>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    SPC(   |     S <SHIFT+P>      |                |     SPECIAL       |
  |           |                      |                |                   |
  |    SQR    |     S <SHIFT+Q>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    STATUS |          ST          |       ST       |     NUMERIC       |
  |           |                      |                |                   |
  |    STEP   |     ST <SHIFT+E>     |                |                   |
  |           |                      |                |                   |
  |    STOP   |     S <SHIFT+T>      |                |                   |
  |           |                      |                |                   |
  |    STR$   |     ST <SHIFT+R>     |                |     STRING        |
  |           |                      |                |                   |
  |    SYS    |     S <SHIFT+Y>      |                |                   |
  |           |                      |                |                   |
  |    TAB(   |     T <SHIFT+A>      |                |     SPECIAL       |
  |           |                      |                |                   |
  |    TAN    |        none          |      TAN       |     NUMERIC       |
  |           |                      |                |                   |
  |    THEN   |     T <SHIFT+H>      |                |                   |
  |           |                      |                |                   |
  |    TIME   |         TI           |       TI       |     NUMERIC       |
  |           |                      |                |                   |
  |    TIME$  |         TI$          |      TI$       |     STRING        |
  |           |                      |                |                   |
  |    TO     |        none          |       TO       |                   |
  |           |                      |                |                   |
  |    USR    |     U <SHIFT+S>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    VAL    |     V <SHIFT+A>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    VERIFY |     V <SHIFT+E>      |                |                   |
  |           |                      |                |                   |
  |    WAIT   |     W <SHIFT+A>      |                |                   |
  +-----------+----------------------+----------------+-------------------+
```

## References
- "basic_keywords_mid_to_run" — expands on previous block of BASIC keywords (MID$–RUN)
- "ignored_page_header_vocabulary_33" — page header / non-technical separator preceding this block