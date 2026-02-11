# KERNAL: Graphics/Text and <Shift‑CBM> control ($D018, $0291)

**Summary:** Routine from the Commodore 64 KERNAL that, when called with A = CBM ASCII code, toggles VIC-II memory control ($D018) bit to select text/graphics (upper/lower case character set) and sets/clears the MODE flag at $0291 to enable/disable the <Shift‑CBM> keys.

## Description
This KERNAL routine is invoked by the main output-to-screen path with the accumulator (A) containing a CBM ASCII code. It performs two independent controls based on the value in A:

- Switch character set (upper/lower case)
  - If A == $0E: load $D018 (VIC-II memory control), ORA #$02 (set bit 1), then store back to $D018. This selects the alternate/lower-case character set.
  - If A == $8E: load $D018, AND #$FD (clear bit 1), then store back to $D018. This selects the normal/upper-case character set.

- Enable/disable MODE (<Shift‑CBM>) keys via $0291
  - If A == $08: disable MODE. The routine loads A with #$80, ORs with $0291 and then stores the result back into $0291 (sets bit 7).
  - If A == $09: enable MODE. The routine loads A with #$7F, ANDs with $0291 and then stores the result back into $0291 (clears bit 7).

After either class of handling the code jumps to $E6A8 to finish the screen print. The routine branches explicitly for matched character codes and otherwise returns quickly to the normal printing flow.

## Source Code
```asm
                                *** GRAPHICS / TEXT CONTROL
                                This routine is used to toggle between text and graphics
                                character set, and to enable/disable the <shift-CBM> keys.
                                The routine is called by the main 'output to screen'
                                routine, and (A) holds a CBM ASCII code on entry.
.,EC44 C9 0E    CMP #$0E        <switch to lower case>
.,EC46 D0 07    BNE $EC4F       nope
.,EC48 AD 18 D0 LDA $D018       VIC memory control register
.,EC4B 09 02    ORA #$02        set bit1
.,EC4D D0 09    BNE $EC58       always branch
.,EC4F C9 8E    CMP #$8E        <switch to upper case>
.,EC51 D0 0B    BNE $EC5E       nope
.,EC53 AD 18 D0 LDA $D018       VIC memory control register
.,EC56 29 FD    AND #$FD        clear bit1
.,EC58 8D 18 D0 STA $D018       and store
.,EC5B 4C A8 E6 JMP $E6A8       finish screen print
.,EC5E C9 08    CMP #$08        <disable <shift-CBM>>
.,EC60 D0 07    BNE $EC69       nope
.,EC62 A9 80    LDA #$80
.,EC64 0D 91 02 ORA $0291       disable MODE
.,EC67 30 09    BMI $EC72       always jump
.,EC69 C9 09    CMP #$09        <enable <shift-CBM>>
.,EC6B D0 EE    BNE $EC5B       nope, exit
.,EC6D A9 7F    LDA #$7F
.,EC6F 2D 91 02 AND $0291       enable MODE
.,EC72 8D 91 02 STA $0291       store MODE, enable/disable shift keys
.,EC75 4C A8 E6 JMP $E6A8       finish screen print
```

## Key Registers
- $D018 - VIC-II - Memory control register (bit 1 is toggled by this routine to switch character ROM/bank for upper/lower case)
- $0291 - KERNAL RAM flag - MODE (<Shift‑CBM>) enable/disable (routine sets bit 7 to disable, clears bit 7 to enable)

## References
- "keyboard_table_commodore" — expands on Commodore character set affected by this routine
- "keyboard_table_control" — expands on control keys that can enable/disable upper/lower switching
- "video_chip_setup_table" — expands on VIC register $D018 as part of initial VIC setup