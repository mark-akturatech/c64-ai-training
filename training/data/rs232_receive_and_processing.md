# KERNAL RS232 Receive Path (Magnus Nyman)

**Summary:** Describes the C64 KERNAL RS232 receive path: building RIDATA under NMI from INBIT, parity handling via RIPRTY, buffer storage into RIBUF using RIDBS/RIDBE ($029C/$029B), and CIA#2 I.C.R. setup ($DD0D). Covers routines: RS232 RECEIVE, SET UP TO RECEIVE, and PROCESS RS232 BYTE (parity/framing/overflow error reporting to RSSTAT $0297).

## RS232 RECEIVE
This routine is invoked under NMI timing to assemble an incoming RS232 byte. Each sampled bit is placed in INBIT (zero page), then:
- INBIT is shifted into the CPU carry (LSR $A7), and RIDATA is rotated right through carry (ROR $AA), building the received byte LSB-first in RIDATA.
- BITC1 ($A8) is decremented for each bit; when it reaches zero the code branches to PROCESS RS232 BYTE to finish processing.
- Parity is updated per-bit by EORing INBIT into RIPRTY ($AB) before storing it back (toggle parity accumulator).
- Code paths handle signed-branch checks (BMI/BNE) while counting bits and managing the single-bit receive flow.
- A KERNAL patch (jump at $EF94) initialises RIPRTY on detection of a start bit (see PROCESS section).

Behavioral summary (implementation flow):
- Wait for start bit detection (RINONE $A9 used as start-bit flag).
- On each NMI sample: collect bit, update parity accumulator, decrement counter.
- When the full bit count is received (BITC1 == 0), transfer to PROCESS RS232 BYTE.

## SET UP TO RECEIVE
This routine arms the CIA#2 interrupt control register to detect the receiver edge and sets KERNAL enable flags:
- Writes #$90 to CIA#2 I.C.R. ($DD0D) to select the desired edge interrupt for RS232 receive.
- Sets the ENABL flag in KERNAL workspace ($02A1) via ORA/STA to mark RS232 receive enabled.
- Stores RINONE ($A9) to mark "check for start bit" state.
- Exits via a jump that disables the timer and returns to the main timing loop.

Effect: CIA#2 will generate the edge interrupt; the KERNAL flag ENABL ($02A1) enables the receive-state logic so incoming edges start the sampling/NMI receive routine.

## PROCESS RS232 BYTE
When a full set of bits has been sampled into RIDATA ($AA), this routine validates and stores the byte, or sets RSSTAT error bits.

Main steps:
- If INBIT indicates another start (LDA $A7; BNE $EF7E), re-arm receive setup.
- Patch jump at $EF94 (to $E4D3) is used to initialise parity (RIPRTY) on start bit reception (ensures correct parity calculation for the following bits).
- Check for input buffer overflow: increment RIDBE ($029B), compare to RIDBS ($029C); if equal, branch to receive-overflow error handling.
- Store received byte:
  - Adjust for full-word mode: BITNUM ($0298) compared to #$09; for 9-bit words a shift/LSR loop is used.
  - Store with STA ($F7),Y — using zero-page pointer at $F7 which points to RIBUF (indirect,Y).
  - Mark stored byte with a space character ($20) as part of buffer housekeeping (LDA #$20; then BIT $0294 used to test parity enabling).
- Parity and framing/error checking:
  - Test the 6551 command-register image M51CDR ($0294) to see if parity is enabled. If parity is disabled, flow exits to re-arm receive.
  - When enabled, parity is validated by comparing the computed parity accumulator (RIPRTY $AB) and INBIT $A7 with the expected parity; parity-fail branches set receive parity error.
  - Framing error (framing bit missing) and break detection are tested via RIDATA contents and control flow; on errors, RSSTAT ($0297) is OR'ed with the appropriate error mask and stored.
- Error encoding:
  - Receive parity error loads #$01 into the error accumulator.
  - Receive overflow loads #$04.
  - Framing break loads #$80.
  - Framing error loads #$02.
  - RSSTAT ($0297) receives ORed error flags and is written back.

After processing (store or error), the routine re-arms the receiver (set up to receive) and returns to normal timing.

## Source Code
```asm
.,EF59 A6 A9    LDX $A9         RINONE, check for start bit?
.,EF5B D0 33    BNE $EF90
.,EF5D C6 A8    DEC $A8         BITC1, RS232 in bit count
.,EF5F F0 36    BEQ $EF97       process received byte
.,EF61 30 0D    BMI $EF70
.,EF63 A5 A7    LDA $A7         INBIT, RS232 in bits
.,EF65 45 AB    EOR $AB         RIPRTY, RS232 in parity
.,EF67 85 AB    STA $AB
.,EF69 46 A7    LSR $A7         INBIT, put input bit into carry
.,EF6B 66 AA    ROR $AA         RIDATA,
.,EF6D 60       RTS
.,EF6E C6 A8    DEC $A8         BITC1
.,EF70 A5 A7    LDA $A7         INBIT
.,EF72 F0 67    BEQ $EFDB
.,EF74 AD 93 02 LDA $0293       M51CTR, 6551 control register image
.,EF77 0A       ASL
.,EF78 A9 01    LDA #$01
.,EF7A 65 A8    ADC $A8         BITC1
.,EF7C D0 EF    BNE $EF6D       end

                                *** SET UP TO RECEIVE
.,EF7E A9 90    LDA #$90
.,EF80 8D 0D DD STA $DD0D       CIA#2 I.C.R.
.,EF83 0D A1 02 ORA $02A1       ENABL, RS232 enables
.,EF86 8D A1 02 STA $02A1
.,EF89 85 A9    STA $A9         RINONE, check for start bit
.,EF8B A9 02    LDA #$02
.,EF8D 4C 3B EF JMP $EF3B       disable timer and exit

                                *** PROCESS RS232 BYTE
.,EF90 A5 A7    LDA $A7         INBIT, RS232 in bits
.,EF92 D0 EA    BNE $EF7E       set up to receive
.,EF94 4C D3 E4 JMP $E4D3       patch, init parity byte
.,EF97 AC 9B 02 LDY $029B       RIDBE, index to the end of in buffer
.,EF9A C8       INY
.,EF9B CC 9C 02 CPY $029C       RIDBS, start page of in buffer
.,EF9E F0 2A    BEQ $EFCA       receive overflow error
.,EFA0 8C 9B 02 STY $029B       RIDBE
.,EFA3 88       DEY
.,EFA4 A5 AA    LDA $AA         RIDATA, RS232 in byte buffer
.,EFA6 AE 98 02 LDX $0298       BITNUM, number of bits left to send
.,EFA9 E0 09    CPX #$09        full word to come?
.,EFAB F0 04    BEQ $EFB1       yes
.,EFAD 4A       LSR
.,EFAE E8       INX
.,EFAF D0 F8    BNE $EFA9
.,EFB1 91 F7    STA ($F7),Y     RIBUF, RS232 in buffer
.,EFB3 A9 20    LDA #$20
.,EFB5 2C 94 02 BIT $0294       M51CDR, 6551 command register image
.,EFB8 F0 B4    BEQ $EF6E       parity disabled
.,EFBA 30 B1    BMI $EF6D       parity check disabled, TRS
.,EFBC A5 A7    LDA $A7         INBIT, parity check
.,EFBE 45 AB    EOR $AB         RIPRTY, RS232 in parity
.,EFC0 F0 03    BEQ $EFC5       receive parity error
.,EFC2 70 A9    BVS $EF6D
.:EFC4 2C       .BYTE $2C       mask
.,EFC5 50 A6    BVC $EF6D
.,EFC7 A9 01    LDA #$01        receive parity error
.:EFC9 2C       .BYTE $2C       mask
.,EFCA A9 04    LDA #$04        receive overflow
.:EFCC 2C       .BYTE $2C       mask
.,EFCD A9 80    LDA #$80        framing break
.:EFCF 2C       .BYTE $2C       mask
.,EFD0 A9 02    LDA #$02        framing error
.,EFD2 0D 97 02 ORA $0297       RSSTAT, 6551 status register image
.,EFD5 8D 97 02 STA $0297
.,EFD8 4C 7E EF JMP $EF7E       set up to receive
.,EFDB A5 AA    LDA $AA         RIDATA
.,EFDD D0 F1    BNE $EFD0       framing error
.,EFDF F0 EC    BEQ $EFCD       receive break
```

## Key Registers
- $DD0D - CIA#2 - Interrupt Control Register (I.C.R.) used to arm receiver-edge interrupt
- $02A1 - KERNAL workspace - ENABL (RS232 enables flag)
- $0293 - KERNAL workspace - M51CTR (6551 control register image)
- $0294 - KERNAL workspace - M51CDR (6551 command register image; used to test parity enable)
- $0297 - KERNAL workspace - RSSTAT (6551 status register image; error flags stored here)
- $0298 - KERNAL workspace - BITNUM (number of bits/word size handling)
- $029B - $029C - KERNAL buffer pointers - RIDBE (end index) / RIDBS (start page) for input buffer
- $00F7 - Zero page pointer - indirect Y pointer to RIBUF (STA ($F7),Y stores received byte)
- $00A7 - Zero page - INBIT (current sampled input bit)
- $00A8 - Zero page - BITC1 (per-bit counter)
- $00A9 - Zero page - RINONE (start-bit check flag)
- $00AA - Zero page - RIDATA (assembled received byte)
- $00AB - Zero page - RIPRTY (running parity accumulator)

## References
- "rs232_control_and_delay" — expands on uses DELAY and GET SERIAL DATA helpers
- "rs232_send_receive_helpers" — expands on transmit-side helpers (RODATA, RIBUF)

## Labels
- INBIT
- BITC1
- RINONE
- RIDATA
- RIPRTY
- RIDBE
- RIDBS
- RSSTAT
