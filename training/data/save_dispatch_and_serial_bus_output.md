# SAVE dispatch and serial-bus SAVE ($F5ED..$F624)

**Summary:** C64 ROM SAVE entry ($F5ED..$F624) validates device numbers (rejects keyboard and screen), requires a filename ($B7), prepares a serial-bus secondary address (stores ORed value in $B9), sends secondary+filename, issues LISTEN on the IEC bus, sends the post-LISTEN secondary address, copies I/O start address into the transfer buffer, outputs the buffer address low/high ($AC/$AD) to the serial bus, and calls a read/write-pointer check that sets Carry if pointer >= end. Searchable terms: $F5ED, $F624, IEC serial bus, LISTEN, secondary address, $B9, $B7, $AC, $AD.

## Operation / Implementation Details
- Entry: $F5ED — LDA $BA: load device number (caller places desired device in zero-page $BA).
- Device-number validation:
  - If $BA == $00 the routine jumps to the illegal-device handler (JMP $F713).
  - If $BA == $03 (screen) it also jumps to illegal-device handler.
  - If $BA < $03 (i.e., 1 or 2) execution branches to $F659 (other device types; not covered in this chunk).
  - If $BA > $03 execution continues assuming a serial-bus device (IEC/serial).
- Secondary address setup:
  - Loads #$61 into accumulator (value is $60 OR $01; serial secondary addresses must be ORed with $60 before sending).
  - Stores the result into $B9 (zero-page): the secondary address byte to send.
- Filename check and transmission:
  - Loads $B7 (filename length). If zero, jump to missing-filename error (JMP $F710).
  - JSR $F3D5 — sends secondary address + filename on the bus (caller-supplied filename pointed to by ROM conventions).
  - JSR $F68F — print "saving <filename>" message.
- Serial-bus LISTEN/secondary sequence:
  - LDA $BA; JSR $ED0C — command devices on the bus to LISTEN (using device number).
  - LDA $B9; JSR $EDB9 — send secondary address byte after LISTEN (post-LISTEN secondary).
- Prepare and send I/O start address:
  - LDY #$00; JSR $FB8E — copy the I/O start address (start of the block transfer region) into the buffer address (zero-page buffer pointers).
  - LDA $AC; JSR $EDDD — output the low byte of buffer address to the serial bus.
  - LDA $AD; JSR $EDDD — output the high byte of buffer address to the serial bus.
- Final pointer check and return:
  - JSR $FCD1 — checks read/write pointer vs end pointer; sets Carry if pointer >= end (Carry=1 when pointer >= end), then returns to caller.

## Source Code
```asm
.; Save dispatch and serial-bus SAVE implementation
.; $F5ED..$F624

.,F5ED A5 BA    LDA $BA         ; get the device number
.,F5EF D0 03    BNE $F5F4       ; if not keyboard go ??
.,F5F1 4C 13 F7 JMP $F713       ; else do 'illegal device number' and return
.,F5F4 C9 03    CMP #$03        ; compare device number with screen
.,F5F6 F0 F9    BEQ $F5F1       ; if screen do illegal device number and return
.,F5F8 90 5F    BCC $F659       ; branch if < screen (other handlers)
                                ; is greater than screen so is serial bus
.,F5FA A9 61    LDA #$61        ; set secondary address to $01 (ORed with $60)
                                ; when a secondary address is to be sent to a device on
                                ; the serial bus the address must first be ORed with $60
.,F5FC 85 B9    STA $B9         ; save the secondary address
.,F5FE A4 B7    LDY $B7         ; get the file name length
.,F600 D0 03    BNE $F605       ; if filename not null continue
.,F602 4C 10 F7 JMP $F710       ; else do 'missing file name' error and return
.,F605 20 D5 F3 JSR $F3D5       ; send secondary address and filename
.,F608 20 8F F6 JSR $F68F       ; print saving <file name>
.,F60B A5 BA    LDA $BA         ; get the device number
.,F60D 20 0C ED JSR $ED0C       ; command devices on the serial bus to LISTEN
.,F610 A5 B9    LDA $B9         ; get the secondary address
.,F612 20 B9 ED JSR $EDB9       ; send secondary address after LISTEN
.,F615 A0 00    LDY #$00        ; clear index
.,F617 20 8E FB JSR $FB8E       ; copy I/O start address to buffer address
.,F61A A5 AC    LDA $AC         ; get buffer address low byte
.,F61C 20 DD ED JSR $EDDD       ; output byte to serial bus
.,F61F A5 AD    LDA $AD         ; get buffer address high byte
.,F621 20 DD ED JSR $EDDD       ; output byte to serial bus
.,F624 20 D1 FC JSR $FCD1       ; check read/write pointer, return Cb = 1 if pointer >= end
```

## References
- "setup_save_ram_to_device" — expands on caller that sets up start/end addresses before invoking this SAVE dispatch
- "print_searching_and_file_name" — expands on uses filename handling/printing for SAVE user messages

## Labels
- SAVE
