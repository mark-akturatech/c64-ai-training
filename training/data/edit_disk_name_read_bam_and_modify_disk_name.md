# EDIT DISK NAME — main BASIC routine

**Summary:** BASIC routine for editing a disk name stored in the BAM/ID buffer (track 18, sector 0) via the 1541 drive data channel (OPEN 2,8,2,"#"), using drive command channel (PRINT#15) with read/write commands ("U1"/"U2") and pointer ("B-P"). Reads bytes with GET#2, reconstructs old disk name, prompts/validates/pads new name to 16 chars, writes it back and issues a block-write, then checks drive status bytes.

**Description**
This chunk is the main body of a BASIC program that:
- Assumes the drive command channel (PRINT#15 / INPUT#15) is already available (opened in the init chunk).
- Opens the data channel to device 8 on channel 2 (OPEN 2,8,2,"#").
- Sends a "U1" (read) command to the drive (via PRINT#15) to fetch the BAM/ID buffer (track 18, sector 0) and reads status bytes with INPUT#15.
- Uses the "B-P" pointer command to position the data channel at the ID/BAM area and performs GET#2 to read raw bytes from the data channel.
- Converts raw bytes to printable ASCII: subtracts 128 for high-bit set; maps out-of-range values and double-quote (") to '?' (ASCII 63); assembles the old disk name string (ODN$).
- Displays the old disk name, prompts the user for a new disk name (NDN$), validates length (must be 1–16 characters), asks for confirmation, then pads/truncates to exactly 16 characters before writing.
- Repositions the pointer and issues a data-channel PRINT#2,NDN$; to overwrite the 16-byte name in the buffer, then issues a "U2" (write) command to the drive via PRINT#15 and reads the drive status (INPUT#15).
- If the drive reports success, closes the data channel, sends device cleanup commands ("10") and closes the command channel (CLOSE 15), then prints "DONE" and ENDs.
- Prints error/failure messages and jumps to a cleanup/abort label (GOTO 720) on failure; the referenced cleanup/close routine is in another chunk.

Notes about OCR / source correction:
- The original text contained OCR artifacts (e.g. '*' in place of '$', O/0 confusion, truncated lines). The listing below was cleaned to valid Commodore BASIC syntax where the intended meaning was clear.
- The original status-test line for EN (drive error code) was garbled; this listing uses IF EN=0 GOTO 640 as the success check — the original may have tested string "00" or other encoding.

## Source Code
```basic
280 OPEN 2,8,2,"#"

290 PRINT#15,"U1";2;0;18;0
300 INPUT#15,EN,EM,ET,ES

310 PRINT#15,"B-P";2;2
320 REM position data channel for reading
330 GET#2,B$
340 IF B$=" " THEN B$=CHR$(0)
350 DOS=ASC(B$)
360 IF DOS=65 THEN GOTO 390
370 PRINT "<DOWN> CBM DOS V2.6 1541,00,00"
380 PRINT "<DOWN> <RVS>FAILED<ROFF>"
390 GOTO 720

390 PRINT#15,"B-P";2;144
400 FOR I=1 TO 16
410 GET#2,B$
420 IF B$="" THEN B$=CHR$(0)
430 A=ASC(B$)
440 IF A>127 THEN A=A-128
450 IF A<32 OR A>95 THEN A=63
460 IF A=34 THEN A=63
470 ODN$=ODN$+CHR$(A)
480 NEXT I

490 PRINT "<DOWN>OLD DISK NAME: "; ODN$
500 INPUT "<DOWN>NEW DISK NAME";NDN$
510 IF LEN(NDN$)<1 OR LEN(NDN$)>16 THEN GOTO 530
520 GOTO 720

530 INPUT "<DOWN>ARE YOU SURE (Y/N)";Q$
535 Q$=LEFT$(Q$,1)
540 IF Q$<>"Y" THEN GOTO 720

550 PAD$=SPACE$(16)
550 NDN$=LEFT$(NDN$+PAD$,16)

560 PRINT#15,"B-P";2;144
570 PRINT#2,NDN$;
580 PRINT#15,"U2";2;0;18;0
590 INPUT#15,EN,EM,ET,ES

600 IF EN=0 THEN GOTO 640
610 PRINT " ",EN,EM,ET,ES
620 PRINT "<DOWN> <RVS>FAILED<ROFF>"
630 GOTO 720

640 CLOSE 2

650 INPUT#15,EN,EM,ET,ES
660 PRINT#15,"10"
670 INPUT#15,EN,EM,ET,ES
680 CLOSE 15

690 PRINT "<DOWN>DONE !"
700 END
```

## References
- "edit_disk_name_intro_and_drive_init" — program initialization and drive status/checks (opens command channel #15)
- "edit_disk_name_close_routine" — cleanup/close routine used to finalize/close channels after the write
