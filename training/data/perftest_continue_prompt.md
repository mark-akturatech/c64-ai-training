# Continue (y/n)? prompt routine (BASIC)

**Summary:** C64/BASIC prompt routine that prints "continue (y/n)?", flushes the keyboard input buffer with repeated GET A$, waits for a non-empty keypress, echoes the key, and branches: 'n' executes END (terminate program), 'y' executes RETURN (return to caller), any other key repeats the prompt.

**Description**
This is a compact BASIC subroutine intended to be called (via GOSUB) when the program needs an operator decision to continue. Behavior and implementation details:
- Line 1750 prints the prompt: "   {down}continue (y/n)?". (The "{down}" token in the source represents the PETSCII control code for moving the cursor down one line.)
- Lines 1760–1760 use a FOR loop with GET A$ to quickly consume any buffered keypresses (flush the keyboard buffer). (On C64 BASIC, GET returns immediately with an empty string if no key is available.)
- Lines 1770–1780 repeatedly call GET A$ until a non-empty string is returned, then echo the character with PRINT a$ "{down}".
- Lines 1790–1800 branch on the returned character:
  - if a$ = "n" then END — terminates the entire program.
  - if a$ = "y" then RETURN — returns control to the caller (GOSUB context).
  - otherwise the routine loops back to the flushing step (GOTO 1760) and re-prompts.
- The routine only accepts lowercase "y" and "n" explicitly; other input repeats the prompt.

This routine is referenced by the failure handler (perftest_io_response_handler) to query the operator whether to continue.

## Source Code
```basic
1730 :
1740 :
1750 print "   {down}continue (y/n)?";
1760 for i=0 to 50:get a$:next
1770 get a$:if a$="" then 1770
1780 print a$ "{down}"
1790 if a$="n" then end
1800 if a$="y" then return
1810 goto 1760
```

## References
- "perftest_io_response_handler" — expands on usage by the failure handler to ask whether to continue