# Sample BASIC: Silent 700 terminal (tok64 page356.prg)

**Summary:** C64 BASIC program demonstrating OPEN/GET#/PRINT# usage with device channel 2 (3-line RS-232), SR=ST status polling for parity/frame/overrun/break, and waiting for transmit completion via PEEK(673) (decimal). Uses PET ASCII, mark parity, 300 baud, full duplex.

## Program Description
This BASIC listing opens device channel 2 for a modified Silent 700 terminal (PET ASCII), enables the receiver, and enters a main loop that:
- reads the computer keyboard with GET (local input),
- sends typed characters to the terminal via PRINT#2,
- reads incoming characters from the terminal with GET#2,
- echoes both keyboard and terminal input to the computer screen,
- reads the RS-232 status into SR via SR=ST and tests error bits (parity, framing, receiver buffer full/overrun, break),
- waits for all characters to be transmitted by polling PEEK(673) before closing.

Status bit tests in the program (using SR):
- bit 0 (value 1): parity error
- bit 1 (value 2): framing error
- bit 2 (value 4): receiver buffer full (overrun)
- bit 7 (value 128): break detected

PEEK(673) is used to wait for the transmitter-empty/finished condition (program polls until (PEEK(673) AND 1) = 0). The program expects a 3-line RS-232 interface on the user port and the terminal set for 300 baud, 7-bit ASCII, mark parity, full duplex.

## Source Code
```basic
10 rem this program sends and receives data to/from a silent 700
11 rem terminal modified for pet ascii
20 rem ti silent 700 set-up: 300 baud, 7-bit ascii, mark parity,
21 rem full duplex
30 rem same set-up at computer using 3-line interface
100 open2,2,3,chr$(6+32)+chr$(32+128):rem open the channel
110 get#2,a$:rem turn on the receiver channel (toss a null)
200 rem main loop
210 get b$:rem get from computer keyboard
220 if b$<>""then print#2,b$;:rem if a key pressed, send to terminal
230 get#2,c$:rem get a key from the terminal
240 print b$;c$;:rem print all inputs to computer screen
250 sr=st:ifsr=0orsr=8then200:rem check status, if good then continue
300 rem error reporting
310 print "error: ";
320 if sr and 1 then print"parity"
330 if sr and 2 then print"frame"
340 if sr and 4 then print"receiver buffer full"
350 if sr and 128 then print"break"
360 if (peek(673)and1)then360:rem wait until all chars transmitted
370 close 2:end
```

## References
- "rs232_status_register_bits_and_usage" — expanded description of SR=ST status bits and their meanings
- "user_port_rs232_pin_assignments" — hardware modes and pin assignments for 3-line RS-232 on the user port
- "rs232_buffer_base_pointers" — OPEN/CLOSE interactions with serial buffer pointers and device channel behavior

## Labels
- ST
