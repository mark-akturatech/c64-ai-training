# KERNAL $FFE1 — Scan the STOP key

**Summary:** KERNAL call $FFE1 scans the keyboard for the STOP key (call with JSR $FFE1); if STOP is pressed, the Z (zero) flag is set and all other processor status flags are left unchanged; otherwise, A contains a byte representing the last keyboard-scan row (see $FF9F for row/bit mapping).

**Description**

JSR $FFE1 invokes the KERNAL routine that tests whether the STOP key is pressed at the moment of the call. Behavior on return:

- If the STOP key is pressed: the Z (zero) flag is set.
- If the STOP key is not pressed: the accumulator (A) is loaded with a byte representing the last row of the keyboard scan.
- All other processor status flags remain unchanged (i.e., aside from Z, flags such as C, N, V, and the interrupt/decimal bits are preserved).

The same mechanism can be used to check other special keys by interpreting the keyboard-scan byte. The keyboard matrix is organized into 8 rows and 8 columns, with each key corresponding to a specific bit in this matrix. For example, the STOP key is located in row 7, bit 7. To check if a specific key is pressed, you can examine the corresponding bit in the accumulator after the call. ([c64os.com](https://www.c64os.com/post/howthekeyboardworks?utm_source=openai))

**Example Usage**

To check if the STOP key is pressed and branch accordingly:


In this example, after calling the STOP routine, the program checks the Z flag. If the STOP key is pressed, the Z flag is set, and the program branches to the `StopPressed` label to handle the event.

## Source Code

```assembly
    JSR $FFE1        ; Call the STOP key scan routine
    BEQ StopPressed  ; Branch if Z flag is set (STOP key pressed)
    ; Continue with other code if STOP is not pressed
StopPressed:
    ; Handle STOP key press
```


## References

- "ff9f_scan_the_keyboard" — expands on keyboard scanning routine and provides row/bit layout for interpreting the accumulator byte
- Commodore 64 Programmer's Reference Guide, p. 268: "The KERNAL"