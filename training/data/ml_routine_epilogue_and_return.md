# Final fragment of backup machine-language routine (tail)

**Summary:** Final segment of a 6502 machine-language routine used in Commodore 1541 disk drive operations, featuring instructions such as JSR, CPY, BNE, LDA, BEQ, and concluding with an RTS at the DONE label to return control to BASIC. The fragment is incomplete and lacks operand addresses and labels.

**Description**

This fragment represents the concluding part of a low-level routine for the 6502 processor, likely associated with the Commodore 1541 disk drive. The visible instructions suggest a control-flow pattern involving:

- A comparison using CPY followed by a conditional branch (BNE).
- JSR calls to subroutines, potentially for I/O or buffer management.
- An LDA/BEQ sequence to test a status or result before branching to the DONE label.
- The DONE label concluding with an RTS to return control to BASIC.

Due to the fragmentary nature of the listing, specific details such as subroutine entry points, absolute addresses, and branch targets are missing. No explicit references to Commodore 64 hardware registers ($Dxxx, $DCxx, $DDxx, $D4xx) are present in this segment.

**[Note: The source may contain OCR errors, resulting in missing or corrupted operands and labels.]**

## Source Code

```asm
; Original fragment (OCR-corrupted). Line numbers from source retained where present.
; Many operands, labels, and addresses are missing or garbled — placeholders shown as <...>.

        ; TERS  (unknown header / corruption)
1       170

1180    JSR   (         ; JSR with missing operand/address

1190    I     NY         ; garbled: likely "INY" or "IY" (OCR error)

1200    CPY   ■■        ; CPY with missing immediate/operand

1210    BNE   1         ; Branch if not equal — target unclear (likely label/offset)

1220    ?               ; unknown / unreadable line

1230    LDA   <...>     ; LDA with missing operand

1240    JSR   1         ; JSR to subroutine (operand/address missing)

1250    JSR   1         ; another JSR (operand/address missing)

1260    5               ; stray digit / corrupted line

1270    LDA   <...>     ; LDA with missing operand

1280    BEQ   I         ; BEQ with unclear target (I = garbled)

1290
DONE
DONE    RTS            ; BACK TO BASIC
```

Notes in-source:
- Numeric markers (1180, 1190, etc.) appear to be line numbers from the original listing and are preserved above.
- The fragment concludes with the DONE label followed by RTS, indicating a return to BASIC.

## References

- "1541_backup_source_annotation" — expands on the high-level backup flow that uses the machine routines described here.
