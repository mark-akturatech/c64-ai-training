# TAPEH — Write Tape Header (KERNAL)

**Summary:** Writes a cassette header block into the cassette buffer and requests writing it to tape (JSR TWRT2). Uses KERNAL zero-page variables and temporary pointers ($B2-$B3 TAPE1 pointer, $9E/$9F temporaries, STAL/STAH $C1/$C2, EAL/EAH $AE/$AF, FNADR $BB, FNLEN $B7). Calls ZZZ ($F7D0) to get the tape buffer pointer and LDAD1 ($F7D7) to set header start/end pointers.

## Description
TAPEH (entry at $F76A) constructs a standard tape header in the cassette buffer and initiates writing it to tape. High-level flow:

- Store incoming block type (A) into zero-page T1 ($9E).
- JSR $F7D0 (ZZZ): obtains the cassette buffer pointer (stored indirectly at $B2/$B3) and sets the carry to indicate success/failure. If the buffer is not allocated the routine branches to TH40 and returns without doing anything.
- Preserve current load/start and end addresses by pushing STAH ($C2), STAL ($C1), EAH ($AF) and EAL ($AE) onto the stack so they can be restored after forming the header.
- Fill the entire cassette buffer with blanks (ASCII $20). BUFSZ-1 is held at $BF; loop writes 0x20 into the buffer via STA ($B2),Y with Y descending from $BF to 0.
- Place the block type (T1 / $9E) into the header at the appropriate header offset in the buffer.
- Write the start load address (STAL/STAH $C1/$C2) into the header by incrementing Y and storing the two bytes via STA ($B2),Y.
- Write the end load address (EAL/EAH $AE/$AF) into the header similarly.
- Copy the file name into the header:
  - Uses FNADR pointer at $BB and file-name length byte at $B7 (FNLEN).
  - Temporaries T1 ($9E) and T2 ($9F) are used to index and save header positions while copying via LDA ($BB),Y and STA ($B2),Y in a loop up to FNLEN bytes.
- JSR $F7D7 (LDAD1) to set header start/end pointers (header's own start/end addresses used by the tape writer).
- Set leader timing by storing $69 into SHCNH ($AB).
- JSR $F86B (TWRT2) to write the header block to tape.
- Restore the previously saved start/end addresses from the stack into EAL/EAH and STAL/STAH.
- Preserve the A error code returned from TWRT2 by transferring it into Y (TAY) before the stack pops and restore it to A at the end (TYA) so the routine returns with the TWRT2 result in A. Finally RTS.

**[Note: Source may contain an error — the top comment "CARRY CLEAR IF O.K." contradicts the code which branches on BCC to indicate the buffer was de-allocated. The code behavior (BCC -> branch to return) indicates carry set means OK, carry clear means buffer de-allocated.]**

## Source Code
```asm
                                ;TAPEH--WRITE TAPE HEADER
                                ;ERROR IF TAPE BUFFER DE-ALLOCATED
                                ;CARRY CLEAR IF O.K.
                                ;
.,F76A 85 9E    STA $9E         TAPEH  STA T1
                                ;
                                ;DETERMINE ADDRESS OF BUFFER
                                ;
.,F76C 20 D0 F7 JSR $F7D0       JSR    ZZZ
.,F76F 90 5E    BCC $F7CF       BCC    TH40            ;BUFFER WAS DE-ALLOCATED
                                ;
                                ;PRESERVE START AND END ADDRESSES
                                ;FOR CASE OF HEADER FOR LOAD FILE
                                ;
.,F771 A5 C2    LDA $C2         LDA    STAH
.,F773 48       PHA             PHA
.,F774 A5 C1    LDA $C1         LDA    STAL
.,F776 48       PHA             PHA
.,F777 A5 AF    LDA $AF         LDA    EAH
.,F779 48       PHA             PHA
.,F77A A5 AE    LDA $AE         LDA    EAL
.,F77C 48       PHA             PHA
                                ;
                                ;PUT BLANKS IN TAPE BUFFER
                                ;
.,F77D A0 BF    LDY #$BF        LDY    #BUFSZ-1
.,F77F A9 20    LDA #$20        LDA    #'
.,F781 91 B2    STA ($B2),Y     BLNK2  STA (TAPE1)Y
.,F783 88       DEY             DEY
.,F784 D0 FB    BNE $F781       BNE    BLNK2
                                ;
                                ;PUT BLOCK TYPE IN HEADER
                                ;
.,F786 A5 9E    LDA $9E         LDA    T1
.,F788 91 B2    STA ($B2),Y     STA    (TAPE1)Y
                                ;
                                ;PUT START LOAD ADDRESS IN HEADER
                                ;
.,F78A C8       INY             INY
.,F78B A5 C1    LDA $C1         LDA    STAL
.,F78D 91 B2    STA ($B2),Y     STA    (TAPE1)Y
.,F78F C8       INY             INY
.,F790 A5 C2    LDA $C2         LDA    STAH
.,F792 91 B2    STA ($B2),Y     STA    (TAPE1)Y
                                ;
                                ;PUT END LOAD ADDRESS IN HEADER
                                ;
.,F794 C8       INY             INY
.,F795 A5 AE    LDA $AE         LDA    EAL
.,F797 91 B2    STA ($B2),Y     STA    (TAPE1)Y
.,F799 C8       INY             INY
.,F79A A5 AF    LDA $AF         LDA    EAH
.,F79C 91 B2    STA ($B2),Y     STA    (TAPE1)Y
                                ;
                                ;PUT FILE NAME IN HEADER
                                ;
.,F79E C8       INY             INY
.,F79F 84 9F    STY $9F         STY    T2
.,F7A1 A0 00    LDY #$00        LDY    #0
.,F7A3 84 9E    STY $9E         STY    T1
.,F7A5 A4 9E    LDY $9E         TH20   LDY T1
.,F7A7 C4 B7    CPY $B7         CPY    FNLEN
.,F7A9 F0 0C    BEQ $F7B7       BEQ    TH30
.,F7AB B1 BB    LDA ($BB),Y     LDA    (FNADR)Y
.,F7AD A4 9F    LDY $9F         LDY    T2
.,F7AF 91 B2    STA ($B2),Y     STA    (TAPE1)Y
.,F7B1 E6 9E    INC $9E         INC    T1
.,F7B3 E6 9F    INC $9F         INC    T2
.,F7B5 D0 EE    BNE $F7A5       BNE    TH20
                                ;
                                ;SET UP START AND END ADDRESS OF HEADER
                                ;
.,F7B7 20 D7 F7 JSR $F7D7       TH30   JSR LDAD1
                                ;
                                ;SET UP TIME FOR LEADER
                                ;
.,F7BA A9 69    LDA #$69        LDA    #$69
.,F7BC 85 AB    STA $AB         STA    SHCNH
                                ;
.,F7BE 20 6B F8 JSR $F86B       JSR    TWRT2           ;WRITE HEADER ON TAPE
                                ;
                                ;RESTORE START AND END ADDRESS OF
                                ;LOAD FILE.
                                ;
.,F7C1 A8       TAY             TAY                    ;SAVE ERROR CODE IN .Y
.,F7C2 68       PLA             PLA
.,F7C3 85 AE    STA $AE         STA    EAL
.,F7C5 68       PLA             PLA
.,F7C6 85 AF    STA $AF         STA    EAH
.,F7C8 68       PLA             PLA
.,F7C9 85 C1    STA $C1         STA    STAL
.,F7CB 68       PLA             PLA
.,F7CC 85 C2    STA $C2         STA    STAH
.,F7CE 98       TYA             TYA                    ;RESTORE ERROR CODE FOR RETURN
                                ;
.,F7CF 60       RTS             TH40   RTS
```

## Key Registers
- $9E - KERNAL zero-page - T1 (block type / temporary)
- $9F - KERNAL zero-page - T2 (temporary Y save / header pointer)
- $B2-$B3 - KERNAL zero-page pointer - TAPE1 (pointer to cassette buffer)
- $B7 - KERNAL zero-page - FNLEN (file name length)
- $BB-$BC - KERNAL zero-page pointer - FNADR (pointer to filename in memory)
- $AE - KERNAL zero-page - EAL (end address low)
- $AF - KERNAL zero-page - EAH (end address high)
- $C1 - KERNAL zero-page - STAL (start address low)
- $C2 - KERNAL zero-page - STAH (start address high)
- $AB - KERNAL zero-page - SHCNH (leader timing high)
- $BF - KERNAL zero-page - BUFSZ-1 (buffer size - 1 used as LDY initial)

## References
- "zzz_get_tape_buffer_pointer" — verifies and returns the cassette buffer pointer used by TAPEH (ZZZ $F7D0)
- "ldad1_compute_start_end_addresses" — computes and stores start/end header addresses (LDAD1 $F7D7)
- "find_any_header_fah" — searches tape for headers; TAPEH produces headers that FAH can find

## Labels
- TAPEH
