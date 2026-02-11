# MACHINE - PET memory map (further): $0200-$03FF — tape buffers, keyboard, monitor vector

**Summary:** PET memory map entries for $0200-$03FF covering keyboard buffers ($020F-$0218), tape control/status and tape #1/#2 input buffers ($027A-$03F9), tape-related pointers, and the monitor extension vector ($03FA-$03FB). Includes file tables and various I/O/status bytes; several addresses are marked unused in the original source.

**Description**
This chunk documents PET RAM locations $0200 through $03FF (decimal 512–1023). It lists byte-level uses for keyboard handling, tape control and buffers (two cassette channels), file/device tables used by the ROM routines, cursor/screen helper bytes, interrupt/BRK vectors, and the monitor extension vector. Items that the original text did not list are preserved as “[unused? ...]”.

Notable entries:
- Keyboard input buffer and status bytes are grouped at $0203–$0218.
- Interrupt and BRK vectors are at $0219–$021C.
- Cursor and screen helper bytes (cursor position, blink, cursor character, screen wrap table) occupy $0220–$0241.
- File-related tables (logical address, device number, secondary address) are at $0242–$025F.
- Tape control: serial/tape status, timing constants, write/read state, cycle counter, buffer pointers and buffers for tape #1 and tape #2 are defined from $0270 through $03F9.
- Monitor extension vector (for hooking the built-in monitor) is at $03FA–$03FB.
- Several single-byte flags and pointers are mixed in; the full list follows in the reference table below.

This chunk does not include higher-level memory map regions (BASIC ROM, KERNAL ROM, screen RAM absolute addresses, or PIA/VIA I/O ranges); those are covered in other chunks.

## Source Code
```text
0200-0202     512-514     Jiffy clock for TI and TI$
0203          515         Which key down:  255 = no key
0204          516         Shift key:  1 = pressed
0205-0206     517-518     Correction clock
0207-0208     519-520     Cassette statuses, #1 and #2
0209          521         Keyswitch PIA:  STOP and RVS flags
020A          522         Timing constant for tape
020B          523         0 = load; 1 = verify
020C          524         Status word ST
020D          525         Number of characters in keyboard buffer
020E          526         Screen reverse flag
020F-0218     527-536     Keyboard input buffer
0219-021A     537-538     IRQ vector
021B-021C     539-540     BRK interrupt vector
021D          541         IEEE output:  255 = character pending
021E          542         End-of-line-for-input pointer
021F          543         [unused?  not listed in original text. -wf]
0220-0221     544-545     Cursor log, row and column
0222          546         IEEE output buffer
0223          547         Key image
0224          548         0 = flash cursor
0225          549         Cursor timing countdown
0226          550         Character under cursor
0227          551         Cursor in blink phase
0228          552         EOT received from tape
0229-0241     553-577     Screen line wrap table
0242-024B     578-587     File logical address table
024C-0255     588-597     File device number table
0256-025F     598-607     File secondary address table
0260          608         Input from screen/keyboard
0261          609         X save
0262          610         How many open files
0263          611         Input device, normally 0
0264          612         Output CMD device, normally 3
0265          613         Tape character parity
0266          614         Byte-received flag
0267          615         [unused?  not listed in original text. -wf]
0268-0269     616-617     File name pointer; counter
026A-026B     618-619     [unused?  not listed in original text. -wf]
026C          620         Serial bit count
026D-026E     621-622     [unused?  not listed in original text. -wf]
026F          623         Cycle counter
0270          624         Tape writer countdown
0271-0272     625-626     Tape buffer pointers, #1 and #2
0273          627         Write leader count; read pass 1/2
0274          628         Write new byte; read error flag
0275          629         Write start bit; read bit error sequence
0276-0277     630-631     Error log pointers, pass 1/2
0278          632         0 = scan; 1-15 = count; $40 = load; $80 = end
0279          633         Write leader length; read checksum
027A-0339     634-825     Tape #1 input buffer
033A-03F9     826-1017    Tape #2 input buffer
03FA-03FB    1018-1019    Monitor extension vector
03FC-03FF    1020-1023    [unused?  not listed in original text. -wf]
```

## Key Registers
- $0200-$0202 - RAM - Jiffy clock for TI/TI$
- $0203 - RAM - Which key down (255 = no key)
- $0204 - RAM - Shift key flag (1 = pressed)
- $0205-$0206 - RAM - Correction clock
- $0207-$0208 - RAM - Cassette statuses (#1 and #2)
- $0209 - RAM - Keyswitch PIA (STOP and RVS flags)
- $020A - RAM - Tape timing constant
- $020B - RAM - Load/Verify flag (0 = load; 1 = verify)
- $020C - RAM - Status word ST
- $020D - RAM - Number of characters in keyboard buffer
- $020E - RAM - Screen reverse flag
- $020F-$0218 - RAM - Keyboard input buffer
- $0219-$021A - RAM - IRQ vector
- $021B-$021C - RAM - BRK interrupt vector
- $021D - RAM - IEEE output (255 = character pending)
- $021E - RAM - End-of-line-for-input pointer
- $021F - RAM - [unused?]
- $0220-$0221 - RAM - Cursor log (row, column)
- $0222 - RAM - IEEE output buffer
- $0223 - RAM - Key image
- $0224 - RAM - Cursor flash flag (0 = flash)
- $0225 - RAM - Cursor timing countdown
- $0226 - RAM - Character under cursor
- $0227 - RAM - Cursor blink phase flag
- $0228 - RAM - EOT received from tape
- $0229-$0241 - RAM - Screen line wrap table
- $0242-$024B - RAM - File logical address table
- $024C-$0255 - RAM - File device number table
- $0256-$025F - RAM - File secondary address table
- $0260 - RAM - Input from screen/keyboard
- $0261 - RAM - X save
- $0262 - RAM - How many open files
- $0263 - RAM - Input device (normally 0)
- $0264 - RAM - Output CMD device (normally 3)
- $0265 - RAM - Tape character parity
- $0266 - RAM - Byte-received flag
- $0267 - RAM - [unused?]
- $0268-$0269 - RAM - File name pointer; counter
- $026A-$026B - RAM - [unused?]
- $026C - RAM - Serial bit count
- $026D-$026E - RAM - [unused?]
- $026F - RAM - Cycle counter
- $0270 - RAM - Tape writer countdown
- $0271-$0272 - RAM - Tape buffer pointers #1 and #2
- $0273 - RAM - Write leader count; read pass 1/2
- $0274 - RAM - Write new byte; read error flag
- $0275 - RAM - Write start bit; read bit error sequence
- $0276-$0277 - RAM - Error log pointers pass 1/2
- $0278 - RAM - Tape scan/load/end flag (0=scanning; 1-15=count; $40=load; $80=end)
- $0279 - RAM - Write leader length; read checksum
- $027A-$0339 - RAM - Tape #1 input buffer
- $033A-$03F9 - RAM - Tape #2 input buffer
- $03FA-$03FB - RAM - Monitor extension vector
- $03FC-$03FF - RAM - [unused?]

## References
- "pia_via_charts" — Detailed PIA/VIA register descriptions follow (search pointer from source)