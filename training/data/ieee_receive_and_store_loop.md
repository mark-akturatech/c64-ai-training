# KERNAL: IEEE main data receive loop and exit (addresses $F4F3-$F530)

**Summary:** Main IEEE device receive loop and exit sequence in the KERNAL ROM: checks STOP key ($FFE1), repeatedly calls ACPTR ($EE13) to fetch bytes, tests STATUS ($0090) for timeouts and EOI, optionally performs VERIFY (flag $0093), stores bytes to memory via the EAL/EAH pointer ($00AE/$00AF), increments the pointer, and closes the channel with UNTLK ($EDEF) / CLSEI ($F642). Error handling: SPERR update via UDST ($FE1C) and jump to BREAK/ERROR4 on STOP or file-not-found.

## Description
This routine implements the main loop used when loading data from an IEEE device:

- Mask off the timeout bit in STATUS: LDA #$FD / AND $90 / STA $90.
- Check the STOP key with JSR $FFE1 (STOP). If the STOP routine indicates a break, jump to BREAK (JMP $F633).
- Call ACPTR (JSR $EE13) to retrieve the next byte from the IEEE bus. The retrieved byte is preserved in X (TAX).
- Test STATUS for a timeout condition: the code shifts STATUS right twice and branches back to the top (LD40) to retry if a timeout is detected.
- Verify vs. store:
  - If the VERCK flag ($0093) is non-zero, perform a verify: set Y=#$00 and CMP (EAL),Y (compare fetched byte with memory at (EAL)). If compare fails, set A=#$10 (SPERR) and JSR UDST ($FE1C) to update status (verify error), and skip the subsequent store (assembly includes a single byte $2C to skip the next STA).
  - If verify is not requested, or the verify succeeded, STA (EAL),Y stores the fetched byte into memory pointed by EAL/EAH.
- Increment the 16-bit EAL/EAH pointer (INC $AE; if low byte wrapped to zero, INC $AF).
- BIT STATUS tests for EOI (end-of-file). If EOI is not set, loop back to LD40 to continue receiving data.
- On EOI: JSR UNTLK ($EDEF) to unlock the device, JSR CLSEI ($F642) to close the file.
- After close, branch to LD180 (via BCC $F5A9 in source — the comment says "BRANCH ALWAYS"), and if the file was not found the code jumps to ERROR4 (JMP $F704).

Notes:
- Zero page variables used: STATUS ($0090) holds timeout/EOI bits; VERCK ($0093) used as verify flag; EAL/EAH are at $00AE/$00AF and used as the destination pointer for stores.
- ROM routine calls referenced: ACPTR ($EE13), UDST ($FE1C), UNTLK ($EDEF), CLSEI ($F642), STOP ($FFE1).
- The listing contains a .BYTE $2C after the UDST call to skip the next STA — this is intentional in the original ROM listing.

## Source Code
```asm
                                ;
.,F4F3 A9 FD    LDA #$FD        LD40   LDA #$FD        ;MASK OFF TIMEOUT
.,F4F5 25 90    AND $90         AND    STATUS
.,F4F7 85 90    STA $90         STA    STATUS
                                ;
.,F4F9 20 E1 FF JSR $FFE1       JSR    STOP            ;STOP KEY?
.,F4FC D0 03    BNE $F501       BNE    LD45            ;NO...
                                ;
.,F4FE 4C 33 F6 JMP $F633       JMP    BREAK           ;STOP KEY PRESSED
                                ;
.,F501 20 13 EE JSR $EE13       LD45   JSR ACPTR       ;GET BYTE OFF IEEE
.,F504 AA       TAX             TAX
.,F505 A5 90    LDA $90         LDA    STATUS          ;WAS THERE A TIMEOUT?
.,F507 4A       LSR             LSR    A
.,F508 4A       LSR             LSR    A
.,F509 B0 E8    BCS $F4F3       BCS    LD40            ;YES...TRY AGAIN
.,F50B 8A       TXA             TXA
.,F50C A4 93    LDY $93         LDY    VERCK           ;PERFORMING VERIFY?
.,F50E F0 0C    BEQ $F51C       BEQ    LD50            ;NO...LOAD
.,F510 A0 00    LDY #$00        LDY    #0
.,F512 D1 AE    CMP ($AE),Y     CMP    (EAL)Y          ;VERIFY IT
.,F514 F0 08    BEQ $F51E       BEQ    LD60            ;O.K....
.,F516 A9 10    LDA #$10        LDA    #SPERR          ;NO GOOD...VERIFY ERROR
.,F518 20 1C FE JSR $FE1C       JSR    UDST            ;UPDATE STATUS
.:F51B 2C       .BYTE $2C       .BYT   $2C             ;SKIP NEXT STORE
                                ;
.,F51C 91 AE    STA ($AE),Y     LD50   STA (EAL)Y
.,F51E E6 AE    INC $AE         LD60   INC EAL         ;INCREMENT STORE ADDR
.,F520 D0 02    BNE $F524       BNE    LD64
.,F522 E6 AF    INC $AF         INC    EAH
.,F524 24 90    BIT $90         LD64   BIT STATUS      ;EOI?
.,F526 50 CB    BVC $F4F3       BVC    LD40            ;NO...CONTINUE LOAD
                                ;
.,F528 20 EF ED JSR $EDEF       JSR    UNTLK           ;CLOSE CHANNEL
.,F52B 20 42 F6 JSR $F642       JSR    CLSEI           ;CLOSE THE FILE
.,F52E 90 79    BCC $F5A9       BCC    LD180           ;BRANCH ALWAYS
                                ;
.,F530 4C 04 F7 JMP $F704       LD90   JMP ERROR4      ;FILE NOT FOUND
                                ;
```

## Key Registers
- $0090 - KERNAL (zero page) - STATUS (timeout and EOI/status bits tested by this loop)
- $0093 - KERNAL (zero page) - VERCK flag (non-zero => perform verify instead of store)
- $00AE-$00AF - KERNAL (zero page) - EAL/EAH (16-bit destination pointer for STA (EAL),Y and increment)

## References
- "ieee_load_open_and_address_fetch" — begins after fetch of starting address and LODING message
- "load_header_and_entry_points" — uses saved SA/MEMUSS for alternate start behavior
- "loading_verify_message" — uses the LOADING/VERIFYING message routines to inform the user

## Labels
- ACPTR
- UDST
- UNTLK
- CLSEI
- STOP
- STATUS
- VERCK
- EAL
- EAH
