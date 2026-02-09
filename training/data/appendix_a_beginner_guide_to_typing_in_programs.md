# Appendix A: Beginner's Guide to Typing In Programs

**Summary:** Notes on typing BASIC programs exactly (characters, punctuation, spacing), handling DATA statements, using braces for special characters, and the critical habit of SAVE before RUN (tape/disk). Mentions editing, backspace/back-arrow, and a pointer to Appendix B for special-character entry.

## What Is a Program?
A program is the set of instructions the computer executes; without a program the machine does nothing. The listings in this book are written in BASIC (the Commodore 64's built‑in interpreter).

## BASIC Programs
BASIC is strict and mostly unambiguous: every letter, character, and number is significant. Enter listings exactly as shown, including punctuation and spacing. Common typing mistakes to watch for:
- Letter O vs numeral 0
- Lowercase l vs numeral 1
- Uppercase B vs numeral 8

Always include required colons, commas, and other punctuation exactly as printed.

## Braces and Special Characters
Text shown in braces (for example {DOWN}) denotes special character keys or key sequences that cannot be printed normally. These must be entered using the method described in Appendix B ("How to Type In Programs").

## About DATA Statements
DATA statements supply program data (e.g., numeric tables, graphics codes, or embedded machine-language bytes). They are particularly sensitive to typing errors: a single mistyped number in a DATA line can cause the program to lock up or crash. Symptoms of a mistyped DATA entry can include an unresponsive keyboard, a blank screen, or the machine appearing to hang. If that happens, power the computer off and on to regain control — this clears memory.

Because power-cycling erases memory, always SAVE a copy of your program before you RUN it. If a program fails when RUN, the reported error may reference the line that READs the DATA, but the actual error is usually in the DATA statements themselves.

## Get to Know Your Machine
Before typing in programs:
- Learn how to SAVE and LOAD programs to/from tape or disk.
- Learn your editing keys (how to change or retype a line, backspace/back arrow).
- Know how to enter reverse video, lowercase, and control characters (see your machine's manual for specific key combinations).
These functions prevent retyping the entire program and speed debugging.

## A Quick Review
1. Type the program one line at a time, in order. Press RETURN at the end of each line. Use backspace or the back arrow to correct mistakes as you go.  
2. Check each typed line against the printed listing. If the program errors when RUN, recheck DATA statements and any recent edits.

## References
- "Appendix B" — How to Type In Programs (special characters and key-entry methods)