# Modify first music example to hear different SID waveforms

**Summary:** This guide demonstrates how to modify the first music BASIC program on the Commodore 64 to hear different 6581 SID waveforms. By changing specific values in lines 70 and 90 of the original program, you can alter the note range and waveform characteristics. Searchable terms: 6581 SID, sawtooth waveform, BASIC line 70, BASIC line 90, Example Program 3.

**Re-running and modifying the first music example**

To explore different SID waveforms, you'll modify the original music program by adjusting the note range and waveform settings.

**Steps:**

1. **Load the Original Program:**
   - Retrieve the original music program from your datasette or disk.
   - Use the `LOAD` command to load the program into memory.

2. **Run the Original Program:**
   - Execute the program using the `RUN` command to hear the default sawtooth waveform.

3. **Modify the Program:**
   - Edit the following lines in the BASIC program:
     - **Line 70:** Change the note start number from `33` to `17`.
     - **Line 90:** Change the note stop number from `32` to `16`.

These changes adjust the note range, effectively modifying the waveform characteristics.

4. **Save the Modified Program:**
   - After making the changes, save the modified program to preserve your edits.

5. **Run the Modified Program:**
   - Execute the modified program using the `RUN` command to hear the changes.

## Source Code

Below is the original BASIC program listing (Example Program 1) with the specified modifications to create Example Program 3.

```basic
5 S=54272
10 FOR L=S TO S+24: POKE L,0: NEXT
20 POKE S+5,9: POKE S+6,0
30 POKE S+24,15
40 READ HF,LF,DR
50 IF HF<0 THEN END
60 POKE S+1,HF: POKE S,LF
70 POKE S+4,33
80 FOR T=1 TO DR: NEXT
90 POKE S+4,32: FOR T=1 TO 50: NEXT
100 GOTO 40
110 DATA 25,177,250,28,214,250
120 DATA 25,177,250,25,177,250
130 DATA 25,177,125,28,214,125
140 DATA 32,94,750,25,177,250
150 DATA 28,214,250,19,63,250
160 DATA 19,63,250,19,63,250
170 DATA 21,154,63,24,63,63
180 DATA 25,177,250,24,63,125
190 DATA 19,63,250,-1,-1,-1
```

**Modifications for Example Program 3:**

- **Line 70:** Change `POKE S+4,33` to `POKE S+4,17`
- **Line 90:** Change `POKE S+4,32` to `POKE S+4,16`

These changes adjust the note range, allowing you to hear different SID waveforms.

## References

- "Commodore 64 Programmer's Reference Guide" – Provides detailed information on programming the SID chip and modifying waveforms.
- "Commodore 64 User's Guide" – Offers foundational knowledge on BASIC programming and sound generation on the C64.