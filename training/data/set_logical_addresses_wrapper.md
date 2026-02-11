# SET LOGICAL, FIRST AND SECOND ADDRESSES (KERNAL wrapper at $FFBA)

**Summary:** Wrapper at $FFBA that JMPs to $FE00 to set the logical file number and device/secondary addresses (uses STA $B8, STX $BA, STY $B9). Includes device-number table and note that a secondary address of $FF means "none"; device numbers ≥ 4 refer to CBM serial-bus devices.

## Description
This ROM entry is a small JMP wrapper at $FFBA that transfers control to the implementation at $FE00. The $FE00 routine stores the logical file number, device number and secondary address into KERNAL workspace locations so subsequent KERNAL routines (OPEN, CLOSE, CHKIN/CHKOUT, etc.) use them.

The routine sets:
- Logical file number (stored with STA $B8)
- Device number (stored with STX $BA)
- Secondary address (stored with STY $B9)

Device numbers may range from 0 to 30. Device numbers 4 and above denote devices on the CBM serial bus; common device-number meanings are listed in the device table below. When no secondary address is to be sent, the Y register should be set to $FF before calling the routine.

## Source Code
```asm
.,FFBA 4C 00 FE JMP $FE00       set logical, first and second addresses
```

```text
this routine will set the logical file number, device address, and secondary
address, command number, for other KERNAL routines.
the logical file number is used by the system as a key to the file table created
by the OPEN file routine. Device addresses can range from 0 to 30. The following
codes are used by the computer to stand for the following CBM devices:
ADDRESS DEVICE
======= ======
 0      Keyboard
 1      Cassette #1
 2      RS-232C device
 3      CRT display
 4      Serial bus printer
 8      CBM Serial bus disk drive
device numbers of four or greater automatically refer to devices on the serial
bus.
a command to the device is sent as a secondary address on the serial bus after
the device number is sent during the serial attention handshaking sequence. If
no secondary address is to be sent Y should be set to $FF.
```

## Key Registers
- $00B8 - KERNAL workspace (zero page) - logical file number (key into file table)
- $00BA - KERNAL workspace (zero page) - device number (0-30; ≥4 = serial bus)
- $00B9 - KERNAL workspace (zero page) - secondary address (use $FF for none)

## References
- "set_logical_first_second_addresses" — expands on implementation at $FE00

## Labels
- SETLFS
