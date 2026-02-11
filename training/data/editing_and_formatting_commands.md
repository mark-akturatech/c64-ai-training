# Editing and Formatting Commands (LIST, PRINT formatting, cursor & special-key behavior)

**Summary:** Commodore 64 BASIC editing and formatting commands: LIST / LIST A-B, REM comments, PRINT helpers TAB(X), SPC(X), POS(X), screen/cursor controls (CLR/HOME, SHIFT+CLR/HOME, INST/DEL, SHIFT+INST/DEL), cursor keys, CTRL and Commodore key color/character-mode selection.

## Commands and effects
- LIST  
  Lists entire program.

- LIST A-B  
  Lists program lines from line A to line B.

- REM Message  
  Comment; appears when listing but is ignored during program execution.

- TAB(X)  
  Used in PRINT to move the output cursor to column X (spaces or tab-stop positioning).

- SPC(X)  
  PRINTs X blank characters on the current output line.

- POS(X)  
  Returns the current cursor/print position (column). (Function used from BASIC.)

## Screen and cursor control
- CLR / HOME  
  Positions the cursor at the left corner of the screen (home column).

- SHIFT + CLR / SHIFT + HOME  
  Clears the screen and places the cursor at the home position.

- INST / DEL  
  Deletes the character at the current cursor position.

- SHIFT + INST / SHIFT + DEL  
  Inserts a space at the current cursor position (shifts text right).

- CRSR keys (cursor keys)  
  Move the cursor up, down, left, and right on the screen.

## Special-key behavior
- CTRL + numeric color key  
  Selects a text color; can be used in PRINT statements (control-code color selection).

- Commodore key + SHIFT  
  Toggles between upper/lower case and graphic character display modes.

- Commodore key + numeric color key  
  Selects optional/alternate text colors (platform key modifier for color selection).

## References
- "system_commands" — expands on system-level execution and file commands  
- "arrays_and_string_functions" — expands on string and array manipulation functions used in programs