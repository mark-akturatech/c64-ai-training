# VIC-20 Start-Of-Variables (SOV) Pointer — Change via Monitor

**Summary:** Demonstrates how to view and modify the VIC-20 BASIC Start-Of-Variables (SOV) pointer located at addresses $002D (low byte) and $002E (high byte) using the VICMON machine language monitor. The example sets the pointer to $10C8 (low byte = $C8 at $002D, high byte = $10 at $002E) to position the SOV above a machine-language program.

**Procedure**

To adjust the SOV pointer so that BASIC variables begin above a machine-language program located below $10C8, follow these steps using the VICMON monitor:

1. **Enter the Monitor:**
   - If using the VICMON cartridge, enter the monitor from BASIC by executing:
     This brings up the monitor prompt (`.`). ([techtinkering.com](https://techtinkering.com/2013/04/16/beginning-assembly-programming-on-the-commodore-vic-20/?utm_source=openai))

2. **Display the SOV Pointer:**
   - At the monitor prompt, display the current values of the SOV pointer:
     This command shows the contents of memory addresses $002D and $002E.

3. **Modify the SOV Pointer:**
   - To change the pointer bytes so that $002D = $C8 (low byte) and $002E = $10 (high byte), use the following command:
     This displays the current value at $002D.
   - Use the cursor keys to navigate to the byte you wish to change, type the new value (`C8`), and press <Return>.
   - Repeat the process for address $002E, setting it to `10`.

By setting the SOV pointer to $10C8, BASIC variables will start at address $10C8, effectively placing them above your machine-language program.

## Source Code

     ```
     SYS 24576
     ```

     ```
     .M 002D 002E
     ```

     ```
     .M 002D
     ```


```text
; Enter the VICMON monitor
SYS 24576

; Display the SOV pointer
.M 002D 002E

; Modify the SOV pointer
.M 002D
; Use cursor keys to navigate to the byte, type 'C8', and press <Return>
.M 002E
; Use cursor keys to navigate to the byte, type '10', and press <Return>
```

## Key Registers

- **$002D-$002E**: VIC-20/BASIC Start-Of-Variables (SOV) pointer; low byte at $002D, high byte at $002E (little-endian).

## References

- ([techtinkering.com](https://techtinkering.com/2013/04/16/beginning-assembly-programming-on-the-commodore-vic-20/?utm_source=openai))

## Labels
- SOV
