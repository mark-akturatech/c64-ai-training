# Fetch screen line address (routine at $E9F0)

**Summary:** 6502 routine that computes a screen line start address using tables at $ECF0 (ROM) and $00D9 (RAM); writes low byte to $00D1, computes high-byte as (table_high & #$03) OR $0288 and stores it to $00D2. Uses LDA/STA/BIT/AND/ORA/RTS.

## Description
This routine expects X to index the desired screen line. It builds a 16-bit address (start-of-line pointer) in two zero-page bytes:

- Low byte: loaded from the ROM table at $ECF0 + X and stored to $00D1.
- High byte: loaded from the RAM table at $00D9 + X, masked with AND #$03 to keep only bits 0–1 (permitted screen memory pages 0–3), ORed with the byte at $0288 (which holds the current screen memory page bits), and stored to $00D2.

Result: $00D1/$00D2 contain the start address of the requested screen line. The routine ends with RTS.

Notes:
- X is the line index input.
- Masking with #$03 forces the table high-byte contribution into the low two bits of the high byte (page selection 0–3) before ORing with $0288.
- $ECF0 is referenced as a ROM-based low-byte table; $00D9 is a RAM-based high-byte table.
- This is used by higher-level routines that resolve or modify specific screen lines (see references).

## Source Code
```asm
                                *** fetch a screen address
.,E9F0 BD F0 EC LDA $ECF0,X     get the start of line low byte from the ROM table
.,E9F3 85 D1    STA $D1         set the current screen line pointer low byte
.,E9F5 B5 D9    LDA $D9,X       get the start of line high byte from the RAM table
.,E9F7 29 03    AND #$03        mask 0000 00xx, line memory page
.,E9F9 0D 88 02 ORA $0288       OR with the screen memory page
.,E9FC 85 D2    STA $D2         save the current screen line pointer high byte
.,E9FE 60       RTS             
```

## Key Registers
- $ECF0 - ROM - table of line start low bytes (indexed by X)
- $00D1 - RAM (zero page) - current screen line pointer low byte
- $00D2 - RAM (zero page) - current screen line pointer high byte
- $00D9 - RAM (zero page) - table of line start high bytes (indexed by X)
- $0288 - RAM - byte containing screen memory page bits (ORed into high byte)

## References
- "open_up_space_on_screen" — expands on used-to-resolve screen line addresses while opening a space
- "clear_screen_line_x" — expands on called-before-clearing-line initialization of the line pointer