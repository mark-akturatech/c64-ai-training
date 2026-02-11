# MACHINE Appendix E: Adding a Command — PET/CBM Notes

**Summary:** To add a BASIC command on PET/CBM systems, one must modify the CHRGET routine located at $0070–$0087. This involves overwriting part of CHRGET, supplying replacement code to restore its original functionality, and inserting the new command handler.

**PET/CBM Version**

Unlike the Commodore 64, PET/CBM computers lack a convenient hook at $0308/$0309 for inserting new command handling. Therefore, to implement an additional BASIC command, the CHRGET routine at $0070–$0087 must be modified. This routine is responsible for fetching the next character from the BASIC program during interpretation.

The CHRGET routine operates as follows:

- It increments the text pointer to fetch the next character.
- It loads the character into the accumulator.
- It sets processor flags based on the character's type (e.g., numeric, end-of-command).

To add a new command:

1. **Overwrite Part of CHRGET:** Insert a jump to a custom routine at the beginning of CHRGET.
2. **Supply Replacement CHRGET Code:** In the custom routine, replicate the original CHRGET functionality that was overwritten.
3. **Install the New Command Handler:** After restoring CHRGET's functionality, add code to detect and handle the new command.

This approach ensures that the BASIC interpreter continues to function correctly while accommodating the new command.

## Source Code

Below is an assembly listing that demonstrates how to modify the CHRGET routine to add a new command. This example assumes the new command is identified by a unique keyword and is handled by a routine named `NEWCMD_HANDLER`.

```assembly
; Original CHRGET routine at $0070–$0087
; We will overwrite the beginning to insert our custom code

        .org $0070

        ; Jump to custom routine
        JMP CUSTOM_CHRGET

        ; Rest of the original CHRGET code...
        ; (This part remains unchanged)

CUSTOM_CHRGET:
        ; Preserve registers
        PHA
        TXA
        PHA
        TYA
        PHA

        ; Call original CHRGET functionality
        JSR ORIGINAL_CHRGET

        ; Check for new command keyword
        ; (Assume the keyword is a single character 'X' for simplicity)
        CMP #'X'
        BNE NOT_NEW_CMD

        ; Handle new command
        JSR NEWCMD_HANDLER

        ; Restore registers and return
        PLA
        TAY
        PLA
        TAX
        PLA
        RTS

NOT_NEW_CMD:
        ; Restore registers and return
        PLA
        TAY
        PLA
        TAX
        PLA
        RTS

ORIGINAL_CHRGET:
        ; Increment text pointer
        INC $0077
        BNE CHRGOT
        INC $0078
CHRGOT:
        ; Load character
        LDA ($0077),Y
        ; Set flags
        CMP #$3A
        BCS EXIT
        CMP #$20
        BEQ CHRGET
EXIT:
        RTS

NEWCMD_HANDLER:
        ; Code to handle the new command goes here
        RTS
```

In this example:

- The beginning of the CHRGET routine is overwritten with a jump to `CUSTOM_CHRGET`.
- `CUSTOM_CHRGET` preserves the processor state, calls the original CHRGET functionality, checks for the new command keyword, and, if found, calls `NEWCMD_HANDLER`.
- `ORIGINAL_CHRGET` contains the original CHRGET code that was overwritten.
- `NEWCMD_HANDLER` is where the new command's functionality is implemented.

This method allows the addition of new commands to the PET/CBM BASIC interpreter by modifying the CHRGET routine.

## References

- "MACHINE - Appendix E Project: Adding a Command" — C64 version discussion (original project context)
- Jim Butterfield, "Machine Language for the Commodore 64 and Other Commodore Computers," Prentice Hall, 1984.
- "Machine Language: The Wonderful Wedge," COMPUTE! Magazine, Issue 11, April 1981.

## Labels
- CHRGET
