# KERNAL: OP155 cassette-open decision (read vs write, named/any file search)

**Summary:** KERNAL cassette open entry that inspects SA ($00B9) to select tape-write (mask #$0F non-zero) or tape-read path; for read it calls CSTE1 (prompt PLAY), monitors STOP (BCS), shows LUKING (searching), checks FNLEN ($00B7) to choose “any file” (OP170) or named-file search via FAF (branches to OP171/OP180/ERROR4). Searchable terms: $00B9, $00B7, CSTE1, LUKING, FAF, OP155, OP171, OP180, OP160.

## Decision flow (concise)
- Entry point tests allocation: BCS to OP155 if allocated, JMP ERROR9 if deallocated.
- OP155 (at $F393): load SA ($00B9) and AND #$0F to mask the low nibble (command).
  - If result <> 0 (BNE OP200) — treated as tape WRITE open (tape-write path not shown here; see tape_open_write_prompt_and_header).
  - If result == 0 — proceed with tape READ open.
- Tape READ open:
  - JSR CSTE1 ($F817) — prompt user to "PRESS PLAY".
    - If STOP pressed during prompt (BCS) branch to OP180 (abort / STOP handling).
  - JSR LUKING ($F5AF) — display "SEARCHING".
  - LDA FNLEN ($00B7); if FNLEN == 0 (BEQ OP170) then open to read "any file".
    - Otherwise JSR FAF (named-file find routine).
      - If FAF returns carry clear (BCC) — file found → OP171.
      - If FAF returns zero flag set (BEQ) — STOP pressed during search → OP180.
      - Otherwise — file not found → JMP ERROR4 (OP160).
- Labels referenced: OP155 (this entry), OP160 (ERROR4), OP170 (any-file open), OP171 (file-found open), OP180 (STOP/abort), OP200 (tape-write path).

## Source Code
```asm
.,F38E B0 03    BCS $F393       BCS    OP155           ;YES
                                ;
.,F390 4C 13 F7 JMP $F713       JMP    ERROR9          ;NO...DEALLOCATED
                                ;
.,F393 A5 B9    LDA $B9         OP155  LDA SA
.,F395 29 0F    AND #$0F        AND    #$F             ;MASK OFF COMMAND
.,F397 D0 1F    BNE $F3B8       BNE    OP200           ;NON ZERO IS TAPE WRITE
                                ;
                                ;OPEN CASSETE TAPE FILE TO READ
                                ;
.,F399 20 17 F8 JSR $F817       JSR    CSTE1           ;TELL "PRESS PLAY"
.,F39C B0 36    BCS $F3D4       BCS    OP180           ;STOP KEY PRESSED
                                ;
.,F39E 20 AF F5 JSR $F5AF       JSR    LUKING          ;TELL USER "SEARCHING"
                                ;
.,F3A1 A5 B7    LDA $B7         LDA    FNLEN
.,F3A3 F0 0A    BEQ $F3AF       BEQ    OP170           ;LOOKING FOR ANY FILE
                                ;
.,F3A5 20 EA F7 JSR $F7EA       JSR    FAF             ;LOOKING FOR NAMED FILE
.,F3A8 90 18    BCC $F3C2       BCC    OP171           ;FOUND IT!!!
.,F3AA F0 28    BEQ $F3D4       BEQ    OP180           ;STOP KEY PRESSED
                                ;
.,F3AC 4C 04 F7 JMP $F704       OP160  JMP ERROR4      ;FILE NOT FOUND
                                ;
```

## Key Registers
- $00B9 - Zero page (KERNAL) - SA (status/command byte; low nibble contains tape command, masked with #$0F)
- $00B7 - Zero page (KERNAL) - FNLEN (filename length; zero selects "any file" search)

## References
- "tape_open_write_prompt_and_header" — expands on tape-write path and header write flow
- "tape_open_finish_and_buffer_init" — expands on finalize open and initialize tape buffer pointers

## Labels
- SA
- FNLEN
- OP155
- OP160
