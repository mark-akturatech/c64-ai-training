# initialise_vic_chip (ROM disassembly)

**Summary:** Stores device numbers in zero page ($009A = screen/output #$03, $0099 = keyboard/input #$00) and copies a 47-byte VIC-II initialisation table from ROM ($ECB8-$ECE7) into the VIC-II register block $D000-$D02E using an indexed STA $CFFF,X write loop. Searchable terms: $0099, $009A, $CFFF, $D000-$D02E, VIC-II, LDX, LDA, STA, $ECB8.

## Description
This routine initialises the VIC-II by:
- Saving the chosen output device number (screen) into zero page $009A.
- Saving the chosen input device number (keyboard) into zero page $0099.
- Loading X with #$2F and looping to copy 47 initialization bytes from a ROM table at $ECB8+X into the VIC-II register range $D000-$D02E via indexed stores to $CFFF,X.

Important details and behavior:
- The STA $CFFF,X addressing is used so that, for X values 1..$2F, $CFFF+X maps to $D000..$D02E (VIC-II register block). The code intentionally never writes CFFF itself (X never equals 0 during the store).
- The loop executes for X = $2F down to $01 inclusive (47 iterations). The loop pattern is: LDX #$2F ; LDA $ECB8,X ; STA $CFFF,X ; DEX ; BNE loop.
- The source table for initialization bytes is referenced as $ECB8,X (ROM). The first store occurs with X = $2F, writing to $D02E; the final store is with X = $01, writing to $D000.
- Routine returns with RTS after finishing the block copy.
- Zero page locations used for device numbers are $0099 (input) and $009A (output).

## Source Code
```asm
.,E5A0 A9 03    LDA #$03        set the screen as the output device
.,E5A2 85 9A    STA $9A         save the output device number
.,E5A4 A9 00    LDA #$00        set the keyboard as the input device
.,E5A6 85 99    STA $99         save the input device number
.,E5A8 A2 2F    LDX #$2F        set the count/index
.,E5AA BD B8 EC LDA $ECB8,X     get a vic ii chip initialisation value
.,E5AD 9D FF CF STA $CFFF,X     save it to the vic ii chip
.,E5B0 CA       DEX             decrement the count/index
.,E5B1 D0 F7    BNE $E5AA       loop if more to do
.,E5B3 60       RTS             
```

## Key Registers
- $D000-$D02E - VIC-II - initialization registers (47 bytes written by the ROM table)
- $0099 - Zero Page - saved input device number (keyboard = #$00)
- $009A - Zero Page - saved output device number (screen = #$03)
- $ECB8-$ECE7 - ROM - VIC-II initialisation table (source bytes copied into VIC-II)

## References
- "initialise_screen_and_keyboard_defaults" — expands on called-from initialization
- "orphan_bytes_and_reinitialise_sequence" — expands on entry path that calls this routine