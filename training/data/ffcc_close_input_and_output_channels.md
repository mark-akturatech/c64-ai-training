# C64 KERNAL $FFCC — Close input and output channels

**Summary:** KERNAL entry $FFCC clears all open I/O channels and restores defaults (input=$00 keyboard, output=$03 screen). When closing serial channels it sends an UNTALK for input channels or an UNLISTEN for output channels; leaving listeners open permits broadcasting (e.g., printer TALK + disk LISTEN).

## Description
This KERNAL routine closes all currently open input and output channels and restores the I/O defaults: input device 0 (keyboard) and output device 3 (screen). It is typically invoked after using non-default channels for input/output.

For serial (IEC) channels:
- If the channel being closed is an input (talking) channel, an UNTALK command is sent first to clear the input channel.
- If the channel being closed is an output (listening) channel, an UNLISTEN command is sent first to clear the output channel.

Leaving listener(s) active on the serial bus is intentional behavior that allows multiple devices to receive the same data from the VIC-II/CPU simultaneously. A common use is to command the printer to TALK and the disk drive to LISTEN for direct printing of a disk file without intermediate buffering.

## References
- "ffae_command_unlisten" — expands on UNLISTEN sent to clear output channels  
- "ffab_command_untalk" — expands on UNTALK sent to clear input channels

## Labels
- CLOSE
