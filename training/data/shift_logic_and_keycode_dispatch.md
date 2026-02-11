# KERNAL: Shift handling, repeat/queue insert, and KEYCOD dispatch (addresses $EB03-$EB6C)

**Summary:** Implements key repeat/timing, inserts raw key bytes into the KERNAL queue, reads SHFLAG ($028D) to detect Commodore-shift combos, prevents double-shift handling via LSTSHF ($028E), toggles VIC case bit by EOR #$02 to $D018, selects control/shift translation table indices and loads a KEYCOD pointer from $EB79. The KEYCOD table at $EB79 contains pointers to the KEYTAB translation tables, which map keyboard matrix values to PETSCII codes based on the current modifier keys (Shift, Commodore, Control). Search terms: $D018, $DC00, SHFLAG, LSTSHF, KEYCOD, KEYTAB, REKEY, key queue ($0277), MODE ($0291).

**Behavior and structure**

- **Repeat / queue insertion (entry at $EB03):**
  - Checks for special cursor-key repeat conditions (compares against #$1D and #$11).
  - Uses DELAY ($028C) and KOUNT ($028B) to time repeats:
    - If DELAY reaches zero, it is decremented and KOUNT is tested; KOUNT is decremented and, when it reaches zero, it is reloaded to #$04 (reset), stored back to KOUNT, and repeat handling proceeds.
  - Prevents inserting into the key queue if the queue is full:
    - NDX (at $C6) is used as the current count/index of keys in the queue.
    - Compared to XMAX ($0289); if greater-or-equal, abort inserting.
  - When inserting:
    - SFDX ($CB) provides the index of the raw key found; stored into LSTX ($C5).
    - SHFLAG ($028D) is loaded and stored into LSTSHF ($028E) to remember shift status at time of key press.
    - If key is not null (#$FF) and the queue is not full, raw key byte is stored into KEYD ($0277) at offset X (STA $0277,X), NDX incremented and stored back to $C6.
  - Before returning, sets column lines for stop-key sense (LDA #$7F; STA $DC00).

- **Shift logic (label SHFLOG at $EB48):**
  - Reads SHFLAG ($028D). If SHFLAG == #$03 this is the special "Commodore shift combination" case:
    - It tests LSTSHF ($028E) to avoid handling the same Commodore shift twice (prevents double-shift handling).
    - Reads MODE ($0291); if negative (BMI), it skips the toggle (it "doesn't shift if it's minus").
    - Otherwise reads $D018, EOR #$02, and stores back to $D018 — toggling the VIC case bit to switch upper/lower case rendering.
    - Jumps to SHFOUT ($EB76) after toggling.
  - If not the Commodore-shift combo, falls through to KEYLG2:
    - ASL A then CMP #$08 tests whether the control key path should be used (the code shifts the accumulator and compares; branch if carry indicates control set).
    - If control pattern detected, LDA #$06 is loaded (table index selection).
  - Loads table index into X (TAX) and loads a byte from the KEYCOD table with LDA $EB79,X. This byte is a pointer/index used to pick the proper KEYTAB translation pointers.

- **KEYCOD table at $EB79:**
  - Contains pointers to the KEYTAB translation tables:
    - $EB79: Pointer to standard (unshifted) KEYTAB at $EB81.
    - $EB7B: Pointer to Shifted KEYTAB at $EBC2.
    - $EB7D: Pointer to Commodore-keyed KEYTAB at $EC03.
    - $EB7F: Pointer to Control-keyed KEYTAB at $EC78.

- **KEYTAB translation tables:**
  - **Standard KEYTAB at $EB81:**
    - Maps keyboard matrix values to PETSCII codes for unmodified key presses.
  - **Shifted KEYTAB at $EBC2:**
    - Maps keyboard matrix values to PETSCII codes when the Shift key is held.
  - **Commodore-keyed KEYTAB at $EC03:**
    - Maps keyboard matrix values to PETSCII codes when the Commodore key is held.
  - **Control-keyed KEYTAB at $EC78:**
    - Maps keyboard matrix values to PETSCII codes when the Control key is held.

## Source Code

## Labels
- SHFLAG
- LSTSHF
- KEYCOD
- KEYTAB
- KEYD
- NDX
