# MEMORY-WRITE command (disk controller)

**Summary:** MEMORY-WRITE (C64 disk controller) writes up to 34 bytes into the disk controller's RAM using the PRINT# file interface ("M-W"). Use MEMORY-EXECUTE ("M-E") or USER command jump table to run code written into controller memory; examples use CHR$(low) CHR$(high) CHR$(count) and byte data.

## Description
The MEMORY-WRITE command sends a block of bytes to the disk controller's memory via the Commodore serial bus. Each MEMORY-WRITE packet contains:
- a low address byte and a high address byte (address in controller memory),
- a byte count (# of characters) indicating how many data bytes follow,
- the raw data bytes (up to 34 bytes per single command).

After writing code into controller memory you can start it with the MEMORY-EXECUTE command or by invoking a USER-command jump table entry (USER command method described elsewhere). MEMORY-WRITE is useful for small routines (installing an RTS, patches, or brief loaders).

Protocol summary (fields, in order): low address byte, high address byte, count byte, then count data bytes. Maximum count = 34.

## Source Code
```text
begin 644 RDISKMEM.PRG
M`0@/"`H`GR`Q-2PX+#$U`"D(%`"%("),3T-!5$E/3B!03$5!4T4B.T$`.`@9
M`($@3+(Q(*0@-3``5`@>`$$QLK4H0:TR-38I.D$RLD&K03&L,C4V`&T(*`"8
M,34L(DTM4B(@QRA!,BG'*$$Q*0"9"#(`H2,Q-2Q!)#H@CR!'150@0TA!4E,@
M1E)/32!%4E)/4B!#2$%.3D5,`*H(/`"9(,8H022JQR@P*2D`M`A&`$&R0:HQ
M`+H(4`""`,X(6@"%(")#3TY424Y512([020`Y0AD`(L@R"A!)"PQ*;(B62(@
0IR`R-0#N"&X`B2`R,```````
`
end
```

```text
Format for MEMORY-WRITE (conceptual):
PRINT#file#, "M-W" CHR$(low address byte) CHR$(high address byte) CHR$(#-of-characters) byte1 byte2 ... byteN
(Maximum #-of-characters = 34)
```

```basic
10 OPEN 8,8,15,"I": REM INITIALIZE DISK FIRST
20 PRINT#8,"M-W" CHR$(0) CHR$(3) CHR$(1) CHR$(96)
30 PRINT#8,"M-E" CHR$(0) CHR$(3)
40 CLOSE 8
```
(The BASIC example writes a single byte $60 (RTS) to controller address $0300 and then executes it with MEMORY-EXECUTE.)

## References
- "memory_execute_and_user_command_table" — expands on MEMORY-EXECUTE example and USER command jump table to run code in controller memory
