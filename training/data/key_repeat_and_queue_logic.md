# KERNAL: Keyboard Scan, Repeat & Queue Handling (RPT10..RPT40 Flow)

**Summary:** This disassembly of the Commodore 64 KERNAL focuses on the keyboard scan and key-repeat logic between addresses $EA8E and $EB01. It details the keyboard matrix I/O via $DC00/$DC01 (CIA1), debounce and column scanning, special-key detection (Shift, Stop, Inst/Del, Space), repeat-flag checks (RPTFLG at $028A), repeat delay (DELAY at $028C), last-key index (LSTX at $C5), and the indirect jump into key logging and queue handling (JMP ($028F)). The process includes how raw key indices and characters are utilized for repeat detection and queue insertion (PUTQUE path).

**Keyboard Scan and Debounce**

The KERNAL scans the 8-column keyboard matrix by driving column outputs and reading rows through CIA1 ports at $DC00 and $DC01. The sequence is as follows:

- `STY $CB` stores a "null key" marker/index.
- `STA $DC00` (COLM) raises all column lines; `LDX $DC01` (ROWS) reads row input and checks for $FF (no keys pressed).
- If keys are detected, the KEYTAB pointer is loaded into $F5/$F6, and columns are scanned starting with the column output value #$FE.
- For each column:
  - The column output is saved (`PHA`), and the current rows ($DC01) are polled in a debounce loop until the value stabilizes.
  - The row byte is shifted right (`LSR`) to find the first set bit (indicating a key press).
  - Upon detecting a key press, the code fetches the character/key-code from the KEYTAB table indexed by the key index (constructed from column and row).
  - Special keys (codes ≤ $05) are handled separately; for instance, the Stop key (code $03) bypasses shift handling.
  - For shift handling, SHFLAG ($028D) is updated with the shift bit from the key code.
  - The key index is stored into $CB (SFDX) for later processing.

- After scanning all columns, the code jumps via the KEYLOG pointer (`JMP ($028F)`) to evaluate shift functions and continue processing.

**Notes:**

- Debounce is implemented by re-reading $DC01 and looping until the value stabilizes.
- The KEYTAB table is accessed indirectly through the two-byte pointer at $F5/$F6.
- The code preserves and restores the column output value using `PHA`/`PLA` and `ROL`/`STA` to iterate to the next column.

**Repeat Detection and Queueing Entry (REKEY..RPT10)**

After scanning, the REKEY path loads the saved key index (SFDX in $CB) and looks up the character code again (`LDA (KEYTAB),Y`), copying it to X (`TAX`) for further checks.

- It compares the current key index (in Y) with LSTX ($C5) to detect repetition:
  - If LSTX equals the current index, execution branches to RPT10 (repeat handling).
  - If different, DELAY ($028C) is reset to #$10 to establish the initial delay before repeats.

**RPT10..RPT40 (fragment shown):**

- At RPT10, the code masks the high bit (`AND #$7F`) to "unshift" the character.
- It tests RPTFLG ($028A) with `BIT`; if the repeat flag indicates repeat is disabled, it branches out.
- Further branches include checks for the no-key sentinel #$7F and special key codes (Inst/Del #$14, Space #$20) which alter repeat behavior (some keys repeat immediately or differently).
- The fragment ends in the middle of these checks.

**Behavioral Summary:**

- Repeat enable/disable is read from RPTFLG ($028A).
- DELAY ($028C) is used as the countdown before allowing repeats; it gets reset on a new key.
- LSTX ($C5) holds the last-key index to detect holding the same key.
- Control then flows to queue-insert logic (PUTQUE) and additional handling (stop-key sense via COLM) via later code not included in this fragment.

## Labels
- RPTFLG
- DELAY
- SHFLAG
- LSTX
- SFDX
- KEYTAB
- KEYLOG
- COLM
