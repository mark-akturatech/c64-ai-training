# Open RS232 device (C64 ROM)

**Summary:** Opens and initializes an RS232 device: calls RS232 output initializer ($F483), copies up to 4 filename bytes into the pseudo-6551 register area ($0293..), computes bit count and selects NTSC/PAL baud-timing table entries, saves nonstandard bit timing ($0295/$0296), checks DSR on CIA‑2 port B ($DD01) and may set a "no DSR" error, initializes Rx/Tx circular-buffer indices ($029B/$029E / $029C/$029D), and allocates 256‑byte I/O buffers saving pointers in $F8/$F7 and $FA/$F9.

## Operation / Notes
- Entry calls JSR $F483 to perform RS232 output initialization (sets VIA/CIA/line control: DTR/RTS/Tx lines).
- Copies up to 4 filename bytes from the file descriptor (indirect ($BB),Y) into the pseudo‑6551 register area starting at $0293; loop limited by file name length at $B7 and by 4 bytes.
- Calls JSR $EF4A to compute the "bit count" (returned in X) and saves it to $0298.
- Uses the low nibble of pseudo‑6551 control at $0293 (AND #$0F) as a baud index. If nonzero:
  - Index is doubled (ASL) to form a word index for table lookup.
  - If the PAL/NTSC flag at $02A6 = 0 (NTSC), reads word from ROM table at $FEC0/$FEC1 indexed by X; otherwise reads from PAL table at $E4EA/$E4EB.
  - Stores the word (low/high) into $0295/$0296 as nonstandard bit timing.
- Calls JSR $FF2E after shifting low byte ($0295) left (ASL *2) — this routine is used with the timing word (details in separate chunk).
- Reads pseudo‑6551 command register at $0294 and shifts right (LSR) to test the X/3‑line bit (shifted into carry). If the 3‑line bit is clear, it skips DSR test.
- If 3‑line mode is in use, it reads CIA‑2 port B ($DD01) and shifts it left (ASL) to bring DSR into carry; if DSR is not present it calls the "set no DSR" error handler at $F00D.
  - **[Note: Source text labels $DD01 as "VIA 2 DRB" — the address $DD01 is CIA‑2 port B on the C64. Source may contain an error in chip naming.]**
- Initializes circular buffers by copying Rx "end" index ($029B) to Rx "start" ($029C) and Tx "end" ($029E) to Tx "start" ($029D) thereby clearing buffers.
- Calls $FE27 to read the system top‑of‑memory (returns X/Y pointers). If the RS232 input buffer pointer high byte ($F8) is zero, decrements returned top‑of‑memory high byte (DEY) to allocate a 256‑byte block and saves high/low to $F8/$F7. Similarly for the RS232 output buffer pointer high byte ($FA) and $FA/$F9.
  - Short parenthetical: (read-top-of-memory returns Y=high, X=low for the pointer.)
- May call a helper that sets the system top‑of‑memory to $F000 under some conditions (see referenced chunk "set_top_of_memory_to_f0xx").

## Source Code
```asm
.,F409 20 83 F4 JSR $F483       initialise RS232 output
.,F40C 8C 97 02 STY $0297       save the RS232 status register
.,F40F C4 B7    CPY $B7         compare with file name length
.,F411 F0 0A    BEQ $F41D       exit loop if done
.,F413 B1 BB    LDA ($BB),Y     get file name byte
.,F415 99 93 02 STA $0293,Y     copy to 6551 register set
.,F418 C8       INY             increment index
.,F419 C0 04    CPY #$04        compare with $04
.,F41B D0 F2    BNE $F40F       loop if not to 4 yet
.,F41D 20 4A EF JSR $EF4A       compute bit count
.,F420 8E 98 02 STX $0298       save bit count
.,F423 AD 93 02 LDA $0293       get pseudo 6551 control register
.,F426 29 0F    AND #$0F        mask 0000 xxxx, baud rate
.,F428 F0 1C    BEQ $F446       if zero skip the baud rate setup
.,F42A 0A       ASL             * 2 bytes per entry
.,F42B AA       TAX             copy to the index
.,F42C AD A6 02 LDA $02A6       get the PAL/NTSC flag
.,F42F D0 09    BNE $F43A       if PAL go set PAL timing
.,F431 BC C1 FE LDY $FEC1,X     get the NTSC baud rate value high byte
.,F434 BD C0 FE LDA $FEC0,X     get the NTSC baud rate value low byte
.,F437 4C 40 F4 JMP $F440       go save the baud rate values
.,F43A BC EB E4 LDY $E4EB,X     get the PAL baud rate value high byte
.,F43D BD EA E4 LDA $E4EA,X     get the PAL baud rate value low byte
.,F440 8C 96 02 STY $0296       save the nonstandard bit timing high byte
.,F443 8D 95 02 STA $0295       save the nonstandard bit timing low byte
.,F446 AD 95 02 LDA $0295       get the nonstandard bit timing low byte
.,F449 0A       ASL             * 2
.,F44A 20 2E FF JSR $FF2E       
.,F44D AD 94 02 LDA $0294       read the pseudo 6551 command register
.,F450 4A       LSR             shift the X line/3 line bit into Cb
.,F451 90 09    BCC $F45C       if 3 line skip the DRS test
.,F453 AD 01 DD LDA $DD01       read VIA 2 DRB, RS232 port
.,F456 0A       ASL             shift DSR in into Cb
.,F457 B0 03    BCS $F45C       if DSR present skip the error set
.,F459 20 0D F0 JSR $F00D       set no DSR
.,F45C AD 9B 02 LDA $029B       get index to Rx buffer end
.,F45F 8D 9C 02 STA $029C       set index to Rx buffer start, clear Rx buffer
.,F462 AD 9E 02 LDA $029E       get index to Tx buffer end
.,F465 8D 9D 02 STA $029D       set index to Tx buffer start, clear Tx buffer
.,F468 20 27 FE JSR $FE27       read the top of memory
.,F46B A5 F8    LDA $F8         get the RS232 input buffer pointer high byte
.,F46D D0 05    BNE $F474       if buffer already set skip the save
.,F46F 88       DEY             decrement top of memory high byte, 256 byte buffer
.,F470 84 F8    STY $F8         save the RS232 input buffer pointer high byte
.,F472 86 F7    STX $F7         save the RS232 input buffer pointer low byte
.,F474 A5 FA    LDA $FA         get the RS232 output buffer pointer high byte
.,F476 D0 05    BNE $F47D       if ?? go set the top of memory to F0xx
.,F478 88       DEY             
.,F479 84 FA    STY $FA         save the RS232 output buffer pointer high byte
.,F47B 86 F9    STX $F9         save the RS232 output buffer pointer low byte
```

## Key Registers
- $0293-$0298 - Pseudo 6551 (ACIA) register area used by DOS RS232 device (control/command/bit-timing storage)
- $0294 - Pseudo 6551 command register (bit tested for 3‑line/X‑line)
- $0295-$0296 - Saved nonstandard bit timing (low/high)
- $0298 - Saved bit count (from compute routine)
- $029B-$029E - Rx/Tx circular buffer indices (Rx end/start $029B/$029C, Tx end/start $029E/$029D)
- $F7/$F8 - RS232 input buffer pointer (low/high)
- $F9/$FA - RS232 output buffer pointer (low/high)
- $DD00-$DD0F - CIA‑2 registers (Port B at $DD01 used to read DSR)

## References
- "initialise_rs232_output" — expands on calls to set VIA/CIA and RS232 output lines (DTR/RTS/Tx)
- "set_top_of_memory_to_f0xx" — helper that sets the system top‑of‑memory to $F000 when called by RS232 open logic