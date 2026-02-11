# READIT — subroutine header and initial setup

**Summary:** The `READIT` subroutine is designed to read in half a page of data. It initializes the X register with a specific immediate value and calls the `CHKOUT` subroutine to prepare the device/channel for output. The exact immediate value for the `LDX` instruction and the body of the `READIT` subroutine after the `CHKOUT` call are missing. Additionally, the definition of the `CHKOUT` subroutine and clarification on whether `READIT` is a read routine or an output-setup routine are required.

**Description**

This chunk contains the comment header and the initial instructions of the `READIT` subroutine. The comment suggests that the subroutine's purpose is to "READ IN HALF PAGE," but the code initializes the X register and calls `CHKOUT`, which prepares the channel for output. This presents a contradiction between the comment and the code.

What is present:
- Comment header: "SUBROUTINE TO READ IN HALF PAGE".
- Label: `READIT`.
- `LDX` instruction with an immediate operand shown as the literal token "#*of" in the source (operand value missing/unclear).
- `JSR CHKOUT` call to prepare the device/channel for output.

Notes:
- The `LDX` operand is ambiguous in the source ("#*of") and likely represents a placeholder or OCR corruption; the actual numeric immediate value is missing.
- The subroutine's name and comment suggest reading data, but the explicit `JSR CHKOUT` prepares the channel for output, indicating a possible contradiction.
- The rest of the `READIT` implementation (transfer loop, return, error handling) is not present in this chunk.

## Source Code

```asm
;    SUBROUTINE  TO  READ   IN  HALF  PAGE 

600 

610 

READIT  LDX 

#*of  ; prepare  channel 

FOR 

OUTPUT 

620 

JSR 

CHKOUT 

630 
```

## References

- "send_m-r_command_loop" — expands on follow-up code that sends the M-R command bytes prepared by this setup.