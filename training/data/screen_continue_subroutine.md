# Screen 'continue' prompt subroutine (BASIC lines 710–780)

**Summary:** BASIC subroutine (lines 710–780) that prints a PETSCII-formatted "continue(y/n)" prompt, reads input into z$ using GET, loops until a valid 'y' or 'n' is entered, returns to caller on 'n' (abort display) or clears the screen and prints the current "track t sector s" header on 'y'. Uses PETSCII control codes ({down}, {right*4}, {clear}, {home}).

## Description
This is a compact screen-mode "continue" prompt intended to be called when output reaches mid-page. Behavior:

- Prints the prompt positioned with PETSCII control codes: "{down}{right*4}continue(y/n)".
- Uses GET z$ to fetch a single-character response; loops until non-empty input is received and is either "y" or "n".
- If z$ = "n": the subroutine executes RETURN, causing the caller's display loop to abort.
- If z$ = "y": the subroutine clears the screen using "{clear}", prints "track" t " sector" s, issues "{home}", and RETURNs so the caller continues printing.
- The variables t and s are expected to contain the current track and sector numbers (not declared here).
- PETSCII tokens in the source (e.g. {down}, {clear}) are control-code placeholders for the C64 screen; GET reads a single character without waiting for ENTER (input is stored in z$).

Call sites / context (see References):
- Invoked at half-page during screen-mode display (see "read_and_crt_display").
- A similar check of z$ exists in printer-mode logic to allow aborting the print (see "printer_display_loop_reading_disk_buffer").

## Source Code
```basic
 710 rem******************************
 720 rem* screen continue message    *
 730 rem******************************
 740 print "{down}{right*4}continue(y/n)"
 750 get z$:if z$="" then 750
 760 if z$="n" then return
 770 if z$<>"y" then 750
 780 print "{clear}track" t " sector" s "{home}":return
```

## References
- "read_and_crt_display" — invoked at half-page during screen-mode display
- "printer_display_loop_reading_disk_buffer" — printer-mode logic that also checks z$ to abort