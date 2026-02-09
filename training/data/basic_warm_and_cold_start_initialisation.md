# BASIC warm & cold start sequences and zero-page character-get stub

**Summary:** Disassembly of the C64 BASIC warm start and cold start entry points, the zero-page character-get stub install (copied to $0073), and initialization of BASIC vectors (USR(), float↔fixed) and RAM workspace pointers ($002B-$0038, $0073-$0088, $0310-$0312, etc.).

## Warm start (entry)
Warm start is entered at $E37B. Steps performed:
- JSR $FFCC — close input and output channels (OS close routine).
- Clear accumulator and store into $13 to set the current I/O channel / default flag.
- JSR $A67A — flush BASIC stack and clear the continuation pointer.
- CLI — enable interrupts.
- Set X = #$80 (negative error marker) and JMP indirect via ($0300) — error/message handler (normally routes to $E38B).
- Error handler copies error number (TXA), branches for negative errors to do the warm start path, otherwise does an error display and then warm start via jumps to $A43A / $A474.

The routine ensures I/O is closed, BASIC continuation state cleared, interrupts enabled, and error-handling routed to the warm-start flow.

## Cold start (entry) and RAM/BASIC initialization
Cold start is entered at $E394. Steps performed:
- JSR $E453 — initialize the BASIC vector table (sets vector bytes used by BASIC).
- JSR $E3BF — initialize BASIC RAM locations (set USR(), float/fixed conversion vectors, copy character-get stub into page zero, clear workspace).
- JSR $E422 — print the start-up banner and compute/initialize memory pointers (startup message and free-memory calculation).
- Set the CPU stack pointer via LDX #$FB / TXS (sets system stack to $FB).
- Branch to the warm-start sequence (eventual READY. warm start).

Key details from the RAM initialization sequence ($E3BF..$E421):
- Stores JMP opcode ($4C) into $54 (used for function vector jump table).
- Installs USR() vector bytes at $0310-$0312 — sets USR() to an illegal-quantity-error handler by default.
- Sets fixed↔float conversion vectors:
  - Fixed-to-float saved into $05/$06 (low/high).
  - Float-to-fixed saved into $03/$04 (low/high).
- Copies a 28-byte (0x1C) character-get subroutine from $E3A2.. to page-zero addresses starting at $0073.
- Sets garbage-collection step size at $53.
- Clears FAC1 overflow byte at $68.
- Clears current I/O channel/flags at $13, descriptor stack pointer and related fields ($16, $18).
- Initializes chain link pointer at $01FC-$01FD.
- Queries the KERNAL for bottom and top of BASIC memory via JSR $FF9C / $FF99, storing:
  - Start of BASIC memory low/high at $2B/$2C.
  - End of BASIC memory low/high at $37/$38.
  - Bottom of string space low/high at $33/$34.
- Clears the first byte of BASIC memory (STA ($2B),Y with Y=0) and increments the start pointer for further initialization.

## Zero-page character-get stub (copied to $0073)
- Source stub starts at $E3A2 and is 0x1C bytes long; it is copied to $0073..$0088 during cold start.
- Purpose: a minimal character-get routine in page zero. The comments indicate that the target address used for LDA $EA60 becomes the BASIC execute pointer once the block is copied; $EA60 is used as an example (contains RTS, NOP).
- Behavior of the stub (as disassembled):
  - Increment BASIC execute pointer low byte ($7A); if carry then increment high byte ($7B).
  - LDA $EA60 — loads a byte from the address pointed to by the calling code (address set by the caller).
  - Compare with ":" (0x3A); if >=, return (exit).
  - If byte is space (0x20), loop to process next byte.
  - Otherwise, perform numeric normalization: SEC / SBC #'0' / SEC / SBC #$D0 — this sequence effectively maps ASCII digits to numeric values and clears carry if the byte is between '0' and '9'.
  - RTS upon exit.

(See Source Code for full byte-for-byte listing of the stub and the copy loop.)

## Source Code
```asm
.,E37B 20 CC FF JSR $FFCC       close input and output channels
.,E37E A9 00    LDA #$00        clear A
.,E380 85 13    STA $13         set current I/O channel, flag default
.,E382 20 7A A6 JSR $A67A       flush BASIC stack and clear continue pointer
.,E385 58       CLI             enable the interrupts
.,E386 A2 80    LDX #$80        set -ve error, just do warm start
.,E388 6C 00 03 JMP ($0300)     go handle error message, normally $E38B
.,E38B 8A       TXA             copy the error number
.,E38C 30 03    BMI $E391       if -ve go do warm start
.,E38E 4C 3A A4 JMP $A43A       else do error #X then warm start
.,E391 4C 74 A4 JMP $A474       do warm start

                                *** BASIC cold start entry point
.,E394 20 53 E4 JSR $E453       initialise the BASIC vector table
.,E397 20 BF E3 JSR $E3BF       initialise the BASIC RAM locations
.,E39A 20 22 E4 JSR $E422       print the start up message and initialise the memory
                                pointers
                                not ok ??
.,E39D A2 FB    LDX #$FB        value for start stack
.,E39F 9A       TXS             set stack pointer
.,E3A0 D0 E4    BNE $E386       do "READY." warm start, branch always

                                *** character get subroutine for zero page
                                the target address for the LDA $EA60 becomes the BASIC execute pointer once the
                                block is copied to its destination, any non zero page address will do at assembly
                                time, to assemble a three byte instruction. $EA60 is RTS, NOP.
                                page 0 initialisation table from $0073
                                increment and scan memory
.,E3A2 E6 7A    INC $7A         increment BASIC execute pointer low byte
.,E3A4 D0 02    BNE $E3A8       branch if no carry
                                else
.,E3A6 E6 7B    INC $7B         increment BASIC execute pointer high byte
                                page 0 initialisation table from $0079
                                scan memory
.,E3A8 AD 60 EA LDA $EA60       get byte to scan, address set by call routine
.,E3AB C9 3A    CMP #$3A        compare with ":"
.,E3AD B0 0A    BCS $E3B9       exit if>=
                                page 0 initialisation table from $0080
                                clear Cb if numeric
.,E3AF C9 20    CMP #$20        compare with " "
.,E3B1 F0 EF    BEQ $E3A2       if " " go do next
.,E3B3 38       SEC             set carry for SBC
.,E3B4 E9 30    SBC #$30        subtract "0"
.,E3B6 38       SEC             set carry for SBC
.,E3B7 E9 D0    SBC #$D0        subtract -"0"
                                clear carry if byte = "0"-"9"
.,E3B9 60       RTS             

                                *** spare bytes, not referenced
.:E3BA 80 4F C7 52 58           0.811635157

                                *** initialise BASIC RAM locations
.,E3BF A9 4C    LDA #$4C        opcode for JMP
.,E3C1 85 54    STA $54         save for functions vector jump
.,E3C3 8D 10 03 STA $0310       save for USR() vector jump
                                set USR() vector to illegal quantity error
.,E3C6 A9 48    LDA #$48        set USR() vector low byte
.,E3C8 A0 B2    LDY #$B2        set USR() vector high byte
.,E3CA 8D 11 03 STA $0311       save USR() vector low byte
.,E3CD 8C 12 03 STY $0312       save USR() vector high byte
.,E3D0 A9 91    LDA #$91        set fixed to float vector low byte
.,E3D2 A0 B3    LDY #$B3        set fixed to float vector high byte
.,E3D4 85 05    STA $05         save fixed to float vector low byte
.,E3D6 84 06    STY $06         save fixed to float vector high byte
.,E3D8 A9 AA    LDA #$AA        set float to fixed vector low byte
.,E3DA A0 B1    LDY #$B1        set float to fixed vector high byte
.,E3DC 85 03    STA $03         save float to fixed vector low byte
.,E3DE 84 04    STY $04         save float to fixed vector high byte
                                copy the character get subroutine from $E3A2 to $0074
.,E3E0 A2 1C    LDX #$1C        set the byte count
.,E3E2 BD A2 E3 LDA $E3A2,X     get a byte from the table
.,E3E5 95 73    STA $73,X       save the byte in page zero
.,E3E7 CA       DEX             decrement the count
.,E3E8 10 F8    BPL $E3E2       loop if not all done
                                clear descriptors, strings, program area and mamory pointers
.,E3EA A9 03    LDA #$03        set the step size, collecting descriptors
.,E3EC 85 53    STA $53         save the garbage collection step size
.,E3EE A9 00    LDA #$00        clear A
.,E3F0 85 68    STA $68         clear FAC1 overflow byte
.,E3F2 85 13    STA $13         clear the current I/O channel, flag default
.,E3F4 85 18    STA $18         clear the current descriptor stack item pointer high byte
.,E3F6 A2 01    LDX #$01        set X
.,E3F8 8E FD 01 STX $01FD       set the chain link pointer low byte
.,E3FB 8E FC 01 STX $01FC       set the chain link pointer high byte
.,E3FE A2 19    LDX #$19        initial the value for descriptor stack
.,E400 86 16    STX $16         set descriptor stack pointer
.,E402 38       SEC             set Cb = 1 to read the bottom of memory
.,E403 20 9C FF JSR $FF9C       read/set the bottom of memory
.,E406 86 2B    STX $2B         save the start of memory low byte
.,E408 84 2C    STY $2C         save the start of memory high byte
.,E40A 38       SEC             set Cb = 1 to read the top of memory
.,E40B 20 99 FF JSR $FF99       read/set the top of memory
.,E40E 86 37    STX $37         save the end of memory low byte
.,E410 84 38    STY $38         save the end of memory high byte
.,E412 86 33    STX $33         set the bottom of string space low byte
.,E414 84 34    STY $34         set the bottom of string space high byte
.,E416 A0 00    LDY #$00        clear the index
.,E418 98       TYA             clear the A
.,E419 91 2B    STA ($2B),Y     clear the the first byte of memory
.,E41B E6 2B    INC $2B         increment the start of memory low byte
.,E41D D0 02    BNE $E421       if no rollover skip the high byte increment
.,E41F E6 2C    INC $2C         increment start of memory high byte
.,E421 60       RTS             
```

## Key Registers
- $0073-$0088 - BASIC (page zero) - copied-in character-get stub and initialization table (0x1C bytes copied at cold start)
- $0003-$0006 - BASIC - float↔fixed conversion vectors (float->fixed: $03-$04, fixed->float: $05-$06)
- $0013 - BASIC - current I/O channel / default flag
- $0016 - BASIC - descriptor stack pointer
- $0018 - BASIC - current descriptor stack item pointer (high byte)
- $0053 - BASIC - garbage-collection step size
- $0054 - BASIC - functions vector JMP opcode storage
- $0068 - BASIC - FAC1 overflow byte
- $01FC-$01FD - BASIC - chain link pointer (low/high)
- $002B-$0038 - BASIC - start/end of BASIC memory and bottom of string space ($2B/$2C start, $37/$38 end, $33/$34 string space)
- $0310-$0312 - BASIC - USR() vector (installed at cold start)

## References
- "startup_message_and_memory_initialization" — expands on cold start prints the startup banner and computes free memory
- "basic_vectors_and_startup_messages" — expands on vector table bytes copied into RAM during initialization