# FLAG ERRORS (KERNAL routine)

**Summary:** KERNAL routine at $EDAD-$EDB7 that loads A with an error flag (#$80 = device not present, #$03 = write timeout), calls the KERNAL status setter JSR $FE1C to store the value into the I/O status word ST, clears interrupts and carry (CLI, CLC), and unconditionally branches (BCC) to the final handshake at $EE03.

**FLAG ERRORS**
This routine sets the I/O status word (ST) with one of two error flags depending on entry: #$80 (device not present) or #$03 (write timeout). It then calls the KERNAL helper at $FE1C to write the status word, clears the interrupt disable and carry flags (CLI, CLC), and performs a BCC to $EE03. Because CLC clears the carry, the BCC is always taken and transfers control to the final serial-bus handshake code that clears ATN and completes the transfer.

Behavioral notes preserved from the source:
- #$80 = device not present
- #$03 = write timeout
- JSR $FE1C = set I/O status word (ST)
- CLI followed by CLC ensures BCC will always branch to $EE03 (final handshake)

## Source Code
```asm
; FLAG ERRORS
; (A) is loaded with one of two error flags, then stored into ST via JSR $FE1C,
; CLI/CLC, and BCC to final handshake at $EE03.

$EDAD  A9 80       LDA #$80        ; flag ?DEVICE NOT PRESENT
$EDAF  85 90       STA $90         ; store in ST
$EDB1  A9 03       LDA #$03        ; flag write timeout
$EDB3  20 1C FE    JSR $FE1C       ; set I/O status word (ST)
$EDB6  58          CLI
$EDB7  18          CLC
$EDB8  90 49       BCC $EE03       ; always jump (carry clear), final handshake
```

## Key Registers
- **ST ($90):** I/O status word

## References
- "second_listen_sa" — expands on KERNAL routines invoked after the final handshake
- "acptr_receive_from_serial_bus" — expands on related I/O status setting for read timeouts and EOI