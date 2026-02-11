# Kernel: display control I/O message routine ($F12B–$F13D)

**Summary:** Checks the kernel message-mode flag at $009D and, if enabled, reads a kernel I/O message table starting at $F0BD and outputs characters through the kernel CHROUT vector ($FFD2). Masks the high bit of each message byte before output and preserves processor status across CHROUT calls; loops until the message terminator (high-bit set) is reached.

**Routine description**
This kernal routine prints a control I/O message when the message-mode flag is enabled:

- BIT $009D tests the message-mode flag (zero-page $9D). If the flag indicates control messages are disabled, the routine returns immediately.
- The message bytes are read from the kernel message table beginning at $F0BD, indexed by Y (LDA $F0BD,Y).
- Each byte is masked with AND #$7F to clear bit 7 (the high bit). The high bit in the original byte is used as the end-of-message marker: when the high bit is set on a message byte, that byte is the final character.
- The (masked) character is output using the kernel CHROUT vector at $FFD2 (JSR $FFD2).
- The code preserves the processor status across the character output so that CHROUT (or other operations) does not disturb the loop decision logic.
- The routine increments Y for each character and repeats until the end-of-message is detected, then clears the carry and returns (RTS).

**Note:** The original ROM listing confirms the instruction order as PHP followed by AND #$7F. This sequence ensures that the processor status is preserved before modifying the accumulator, allowing the loop control to function correctly. ([cbmitapages.it](https://www.cbmitapages.it/c64/c64rom.htm?utm_source=openai))

## Source Code
```asm
; display control I/O message if in direct mode
.,F12B 24 9D    BIT $9D         ; test message mode flag
.,F12D 10 0D    BPL $F13C       ; exit if control messages off

; display kernel I/O message
.,F12F B9 BD F0 LDA $F0BD,Y     ; get byte from message table
.,F132 08       PHP             ; save status
.,F133 29 7F    AND #$7F        ; clear b7
.,F135 20 D2 FF JSR $FFD2       ; output character to channel
.,F138 C8       INY             ; increment index
.,F139 28       PLP             ; restore status
.,F13A 10 F3    BPL $F12F       ; loop if not end of message
.,F13C 18       CLC
.,F13D 60       RTS
```

## Key Registers
- $009D - Kernel (zero page) - message-mode flag (control messages on/off)
- $F0BD - Kernel ROM - start/address of kernel I/O message table (indexed by Y)
- $FFD2 - Kernel ROM vector CHROUT - JSR target to output a character

## References
- "kernel_io_message_table" — expands on message text the routine reads and outputs
- "get_character_from_input_device" — message display is part of higher-level I/O operations

## Labels
- CHROUT
