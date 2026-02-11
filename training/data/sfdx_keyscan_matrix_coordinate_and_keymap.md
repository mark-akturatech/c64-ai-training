# SFDX ($CB) — Matrix coordinate of current key pressed

**Summary:** SFDX at $00CB is the zero-page byte holding the key-scanner matrix index written by the keyboard-scan interrupt; values 0–63 map to physical keys and symbols, and 64 means "no key pressed". The RESTORE key is not in the matrix and instead triggers NMI.

**Description**

SFDX ($00CB) is the single-byte location used by the keyboard scan (keyscan) interrupt routine to record which key is currently pressed. The interrupt writes a matrix-coordinate index here; that value is then used as an index into the keyboard decode tables (KEYTAB) to select the character produced for the current shift/CTRL/Commodore-key state.

Valid contents:
- 0–63: index of a physical key or special function key in the C64 keyboard matrix.
- 64: NO KEY PRESSED (indicates no key detected).

The RESTORE key is not part of the normal keyboard matrix and does not produce a value in SFDX; it is wired to the CPU NMI line and causes an NMI when pressed.

Note: LSTX (a different zero-page location) holds the last key matrix coordinate used for debouncing; see referenced chunks for debounce behavior and the KEYTAB decode tables.

Mapping of matrix index → physical key / symbol:
0 = INST/DEL
1 = RETURN
2 = CRSR RIGHT
3 = F7
4 = F1
5 = F3
6 = F5
7 = CRSR DOWN
8 = 3
9 = W
10 = A
11 = 4
12 = Z
13 = S
14 = E
15 = NOT USED (would be LEFT SHIFT)
16 = 5
17 = R
18 = D
19 = 6
20 = C
21 = F
22 = T
23 = X
24 = 7
25 = Y
26 = G
27 = 8
28 = B
29 = H
30 = U
31 = V
32 = 9
33 = I
34 = J
35 = 0
36 = M
37 = K
38 = O
39 = N
40 = +
41 = P
42 = L
43 = -
44 = .
45 = :
46 = @
47 = ,
48 = LIRA (BRITISH POUND SIGN)
49 = *
50 = ;
51 = CLR/HOME
52 = NOT USED (would be RIGHT SHIFT)
53 = =
54 = UP ARROW
55 = /
56 = 1
57 = LEFT ARROW
58 = NOT USED (would be CTRL)
59 = 2
60 = SPACE BAR
61 = NOT USED (would be COMMODORE LOGO)
62 = Q
63 = RUN/STOP
64 = NO KEY PRESSED

## Source Code

The following assembly code represents the keyscan interrupt routine that updates the SFDX ($00CB) location with the matrix coordinate of the currently pressed key:

```assembly
; Keyscan Interrupt Routine
; Scans the keyboard matrix and updates SFDX with the key index

        LDA #$FE            ; Initialize CIA1 Port A for keyboard scanning
        STA $DC00           ; Write to CIA1 Port A

        LDX #$08            ; Set row counter to 8
ScanRow:
        PHA                 ; Save A register
        LDA $DC01           ; Read CIA1 Port B (keyboard column data)
        CMP $DC01           ; Read again for stability
        BNE ScanRow         ; If different, re-read

        LSR A               ; Shift right to check each column bit
        BCS NoKey           ; If bit is set, no key in this column
        PHA                 ; Save A register
        LDA (KEYTAB),Y      ; Load character from KEYTAB using Y as index
        CMP #$05            ; Compare with control character threshold
        BCS NoKey           ; If above, ignore
        CMP #$03            ; Compare with another control character
        BEQ NoKey           ; If equal, ignore
        ORA $028D           ; Combine with shift/CTRL/C= key state
        STA $028D           ; Store updated shift state
        BPL StoreKey        ; If positive, store key index
NoKey:
        PLA                 ; Restore A register
StoreKey:
        INY                 ; Increment Y index
        CPY #$41            ; Compare Y with 65 (end of KEYTAB)
        BCS Done            ; If Y >= 65, scanning is done
        DEX                 ; Decrement row counter
        BNE ScanRow         ; If not zero, scan next row
        SEC                 ; Set carry flag
        PLA                 ; Restore A register
        ROL A               ; Rotate left through carry
        STA $DC00           ; Write back to CIA1 Port A
        BNE ScanRow         ; If not zero, continue scanning
Done:
        JMP $EB76           ; Jump to next routine
```

This routine scans each row and column of the keyboard matrix, checking for key presses. When a key press is detected, it updates the SFDX location with the corresponding matrix index.

## Key Registers

- $00CB - CPU (Zero Page) - SFDX: matrix coordinate (key index) of the current key pressed (0–63 = keys, 64 = no key pressed)

## References

- "lstx_last_key_matrix_coordinate" — expands on LSTX holding the last key matrix coordinate used for debouncing
- "keytab_keyboard_decode_tables" — expands on KEYTAB mapping matrix indexes to characters depending on shift/CTRL/Commodore-key state

## Labels
- SFDX
