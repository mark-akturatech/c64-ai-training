# Trailing inline comments and labels: ID table layout and last track index

**Summary:** Trailing assembler comments ";    ID  LO", ";    ID  HI", and ";    TRACK  35" annotate an ID-table data region and mark the last track index (TRACK 35). Searchable terms: ID LO, ID HI, TRACK 35, IDL/IDH, TABLE loop, table_load_id_bytes_loop, wait_loop_and_final_jmp.

**Description**

These lines are non-executable assembler comments placed after a data region to document its structure:

- ";    ID  LO" — marks the low-byte column of the per-ID table entries (IDL).
- ";    ID  HI" — marks the high-byte column of the per-ID table entries (IDH).
- ";    TRACK  35" — documents the last track index for the table (TRACK 35). Numeric base for "35" is not specified in the snippet.

They function purely as inline documentation and positional labels for the data table consumed elsewhere in the listing (the TABLE loop that reads/loads IDL/IDH entries). The comments typically appear immediately after the table so assemblers or human readers can verify column order and the final track value.

## Source Code

```assembly
; ID Table Data
ID_TABLE:
    .BYTE $01, $02  ; ID LO, ID HI
    .BYTE $03, $04  ; ID LO, ID HI
    ; ...
    .BYTE $23, $24  ; ID LO, ID HI
    ;    ID  LO    ID  HI
    ;    TRACK  35

; TABLE loop code
TABLE_LOOP:
    LDY #0
LOAD_ID_BYTES:
    LDA ID_TABLE,Y
    STA IDL
    INY
    LDA ID_TABLE,Y
    STA IDH
    INY
    ; Process IDL and IDH
    ; ...
    CPY #70  ; 35 tracks * 2 bytes per track
    BNE LOAD_ID_BYTES
    ; Proceed to finalization
    JMP WAIT_LOOP_AND_FINAL_JMP

; Definitions/labels for IDL and IDH
IDL: .RES 1
IDH: .RES 1

; table_load_id_bytes_loop
TABLE_LOAD_ID_BYTES_LOOP:
    ; Detailed behavior of loading ID bytes
    ; ...
    RTS

; wait_loop_and_final_jmp routine
WAIT_LOOP_AND_FINAL_JMP:
    ; Polling and ENDCMD jump
    ; ...
    JMP ENDCMD
```

## References

- "table_load_id_bytes_loop" — expands on ID low/high table entries (IDL/IDH) referenced and loaded by the TABLE loop
- "wait_loop_and_final_jmp" — expands on finalization/comments following the polling and ENDCMD jump
