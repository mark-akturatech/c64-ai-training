# COMMODORE 64 BASIC Keywords: ABS, AND, ASC, ATN, CHR$, CLOSE, CLR, CMD, CONT, COS, DATA, DEF, DIM

**Summary:** Table mapping Commodore 64 BASIC keywords to keyboard abbreviations (SHIFT key sequences), on-screen token labels, and function type (NUMERIC, STRING, SPECIAL). Includes entries for ABS, AND, ASC, ATN, CHR$, CLOSE, CLR, CMD, CONT, COS, DATA, DEF, DIM.

## Description
This chunk is a concise reference for how the listed Commodore 64 BASIC keywords are entered from the keyboard (the two-key abbreviation sequences that use the SHIFT key), what token or label appears on the screen where applicable, and whether the keyword is treated as numeric, string, special, or blank in the BASIC interpreter's token table. Abbreviations are shown as presented in the source (e.g., "A <SHIFT+B>" means press the A key then SHIFT+B to produce the keyword token). The table below is preserved verbatim in the Source Code section for exact lookup.

**[Note: Source may contain a duplicated/ambiguous abbreviation — CLOSE and CONT share "CL <SHIFT+O>" in the table.]**

## Source Code
```text
		    Table 2-1. COMMODORE 64 BASIC KEYWORDS
  +-----------+----------------------+----------------+-------------------+
  |  COMMAND  |     ABBREVIATION     |     SCREEN     |   FUNCTION TYPE   |
  +-----------+----------------------+----------------+-------------------+
  |           |                      |                |                   |
  |    ABS    |     A <SHIFT+B>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    AND    |     A <SHIFT+N>      |                |                   |
  |           |                      |                |                   |
  |    ASC    |     A <SHIFT+S>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    ATN    |     A <SHIFT+T>      |                |     NUMERIC       |
  |           |                      |                |                   |
  |    CHR$   |     C <SHIFT+H>      |                |     STRING        |
  |           |                      |                |                   |
  |    CLOSE  |     CL <SHIFT+O>     |                |                   |
  |           |                      |                |                   |
  |    CLR    |     C <SHIFT+L>      |                |                   |
  |           |                      |                |                   |
  |    CMD    |     C <SHIFT+M>      |                |                   |
  |           |                      |                |                   |
  |    CONT   |     C <SHIFT+O>      |                |                   |
  |           |                      |                |                   |
  |    COS    |        none          |      COS       |     NUMERIC       |
  |           |                      |                |                   |
  |    DATA   |     D <SHIFT+A>      |                |                   |
  |           |                      |                |                   |
  |    DEF    |     D <SHIFT+E>      |                |                   |
  |           |                      |                |                   |
  |    DIM    |     D <SHIFT+I>      |                |     NUMERIC       |
  +-----------+----------------------+----------------+-------------------+
```

## Key Registers
(omitted — this chunk documents BASIC keywords, not hardware registers)

## References
- "ignored_page_header_vocabulary_31" — expands on page header / non-technical separator following this table segment
- "basic_keywords_end_to_log" — expands on the next block of BASIC keywords (END through LOG)