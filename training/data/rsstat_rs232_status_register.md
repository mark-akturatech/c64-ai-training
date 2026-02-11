# RSSTAT ($297)

**Summary:** RSSTAT is a pseudo-6551 RS-232 status register at $297 (decimal 663) that reports RS-232 line and receiver errors (Break, DTR/CTS missing, buffer empty/overrun, framing/parity). It can be read by PEEKing $297, referenced via BASIC reserved variable ST, or obtained with the Kernal READST routine ($FE07); reading via ST or READST clears the register.

## Description
RSSTAT contains bitflags describing RS-232 conditions and receiver errors. You can inspect it by PEEK $297, by reading the BASIC variable ST, or by calling the Kernal READST vector (6502 vector at $FE07). Note: reading through ST or the Kernal READST clears $297 to 0, so if multiple bit tests are required save the original value first (PEEK into a variable) because you cannot re-read it after using ST/READST.

Recommended handling (from source):
- Bit 0 (Parity error) or Bit 1 (Framing error): typically indicates a corrupted received byte — resend the last byte if detected while sending/acknowledging.
- Bit 2 (Receiver buffer overrun): the program is not emptying the receive buffer quickly enough (GET#2 in BASIC). GET#2 must be executed more frequently or lower the baud; BASIC can usually keep up at 300 baud but may fail at higher rates.
- Bit 7 (Break detected): stop sending, perform a GET#2 to inspect what data is being sent.
- Bits 6/4 (DTR / CTS missing): hardware control signals absent — handle according to modem/protocol requirements.
- Bit 3 (Receiver buffer empty): indicates no data waiting in the receiver buffer.

Preserve the register value if you need to test multiple bits (read once into a variable).

## Source Code
```text
Address/Name:
663    $297    $RSSTAT
RS-232: Mock 6551 Status Register

Bit definitions (bit value in parentheses):
Bit 7: 1 = Break Detected (128)
Bit 6: 1 = DTR (Data Set Ready) Signal Missing (64)
Bit 5: Unused
Bit 4: 1 = CTS (Clear to Send) Signal Missing (16)
Bit 3: 1 = Receiver Buffer Empty (8)
Bit 2: 1 = Receiver Buffer Overrun (4)
Bit 1: 1 = Framing Error (2)
Bit 0: 1 = Parity Error (1)

Notes:
- The contents indicate RS-232 error/status conditions.
- Readable via PEEK $297, BASIC variable ST, or Kernal READST (65031, $FE07).
- Reading via ST or Kernal READST clears this location (it is set to 0 after being read).
- User/program must check bits and take appropriate action:
    - Bits 0/1 set: resend last byte (parity/framing error).
    - Bit 2 set: receiver buffer overrun — execute GET#2 more frequently (BASIC limit at higher baud).
    - Bit 7 set: stop sending and execute GET#2 to inspect incoming data.
```

## Key Registers
- $0297 - Pseudo-6551 - RS-232 status register (RSSTAT); read cleared by BASIC ST and Kernal READST ($FE07)

## References
- "rs232_pseudo_6551_registers_intro" — expands on the pseudo-6551 register set including RSSTAT

## Labels
- RSSTAT
- READST
- ST
