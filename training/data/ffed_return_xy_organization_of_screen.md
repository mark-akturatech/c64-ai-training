# KERNAL $FFED — Return screen X,Y organization

**Summary:** KERNAL ROM routine at $FFED returns the screen organization (number of columns and rows) in the CPU X and Y registers. Use by calling JSR $FFED; results are returned in X and Y.

**Description**
JSR $FFED is a KERNAL entry that reports the current logical screen dimensions. There are no input parameters; after the call, the X and Y registers contain the screen organization values (X = columns, Y = rows). Typical C64 default values are 40 columns by 25 rows (X = $28, Y = $19), but the routine returns whatever dimensions the system/VIC/screen editor currently uses.

Behavior and usage notes:
- Call with JSR $FFED from code; the routine places the number of columns in X and the number of rows in Y.
- No documented input parameters or required setup.
- The source does not state which other registers or flags are affected; assume only X and Y are guaranteed to contain the values on return.
- Use these returned values for cursor coordinate calculations, screen indexing, or for code that needs to adapt to different screen organizations.

## Source Code
```asm
; Example: query screen organisation and store results
    JSR $FFED        ; KERNAL: return screen organisation in X,Y
    STX screen_cols  ; store columns (X)
    STY screen_rows  ; store rows    (Y)

; Typical returned values on a standard C64:
;   X = $28   ; 40 columns
;   Y = $19   ; 25 rows
```

## Key Registers
- $FFED - KERNAL (ROM) - Return screen organization: X = columns, Y = rows

## References
- "ff81_initialise_vic_and_screen_editor" — initializes VIC and screen editor
- "fff0_read_set_xy_cursor_position" — cursor coordinates within screen organization