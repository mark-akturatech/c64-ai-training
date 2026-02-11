# STR$() entry and descriptor handling ($B465-$B4F3)

**Summary:** ROM disassembly of the STR$() entry and descriptor handling routine ($B465-$B4F3). Covers FAC1->string conversion (JSR $BDDF), creation/allocation of string space (JSR $B4F4), copying strings from input/utility area to string memory, and pushing the resulting pointer/length descriptor onto the descriptor stack. Zero-page registers used: $00-$02, $07-$08, $16-$17, $61-$65, $6F-$72, $50-$51, $62-$63, $0D.

## Operation
This chunk documents the entry point that implements STR$() and the "string vector" path which yields a string descriptor on the descriptor stack.

Main steps (flow follows code addresses):

1. Entry and numeric check
   - $B465 JSR $AD8D — perform a type check (fail if source is not numeric).
   - If the source is numeric, FAC1 is converted to a string:
     - $B46A JSR $BDDF — convert FAC1 to an ASCII string.
     - Two PLAs ($B46D-$B46E) drop return addresses used to skip the type-check path.

2. Initialize result pointers
   - $B46F–$B473 set a default result pointer (A = $FF, Y = $00) and branch to print a null-terminated string into the utility pointer if no string was produced.

3. String-vector / descriptor handling
   - Copy the current descriptor pointer (zero page $64/$65) into $50/$51 for use by the string allocator (saving the descriptor pointer).
   - $B47D JSR $B4F4 — call the string-space allocator to make string-space A bytes long (see referenced allocator chunk for GC behavior).
   - Save the allocated string pointer/length into zero page $62/$63 (pointer low/high) and $61 (length).

4. String scanning and length computation (terminated strings)
   - $B487 sets the terminator character to double-quote ($22) and stores it in zero page $07/$08 for the string scanner.
   - The source string pointer is in zero page $6F/$70 (low/high); $62/$63 are primed with that pointer too.
   - $B495–$B4A6 loop counts bytes until a terminator or NUL is found; length is stored in $61 (and also copied into FAC1 exponent as noted).
   - If the string ended with NUL, carry is cleared (CLC at $B4A8) to indicate EOL termination.

5. Compute end address and detect input/utility area
   - End address low byte saved to $71; end high byte saved to $72.
   - If the source resides in the input buffer or utility area (high byte $00 or $02), the code branches to move the string into string memory:
     - Branch to $B4BF then JSR $B475 (copy descriptor pointer & make string space A bytes long) and JSR $B688 (store A bytes from XY into utility pointer).

6. Push descriptor onto descriptor stack
   - $B4CA-$B4CE check descriptor stack pointer ($16) against the maximum (#$22) to ensure space; if full, error $19 (string too complex) is raised.
   - If there is room: store length and pointer (STA $00,X ; STA $01,X ; STA $02,X) — descriptor stack entry = length, pointer low, pointer high.
   - Clear the global descriptor pointer ($64/$65 := $00/$00); set FAC1 rounding byte cleared ($70 := $00); set data type flag $0D := $FF to mark a string.
   - Save and advance descriptor stack pointer ($16/$17 updated), then RTS.

Notes:
- Allocation and garbage-collection behavior is performed by the string allocator at $B4F4 and related routines (see referenced chunk).
- The routine uses a temporary saved-descriptor mechanism: $50/$51 hold the previous descriptor pointer while the allocator runs.
- Descriptor stack entries are stored using zero-page indirect addressing (STA $00,X etc.) with X initially from $16.

## Source Code
```asm
                                *** perform STR$()
.,B465 20 8D AD JSR $AD8D       check if source is numeric, else do type mismatch
.,B468 A0 00    LDY #$00        set string index
.,B46A 20 DF BD JSR $BDDF       convert FAC1 to string
.,B46D 68       PLA             dump return address (skip type check)
.,B46E 68       PLA             dump return address (skip type check)
.,B46F A9 FF    LDA #$FF        set result string low pointer
.,B471 A0 00    LDY #$00        set result string high pointer
.,B473 F0 12    BEQ $B487       print null terminated string to utility pointer

                                *** do string vector
                                copy descriptor pointer and make string space A bytes long
.,B475 A6 64    LDX $64         get descriptor pointer low byte
.,B477 A4 65    LDY $65         get descriptor pointer high byte
.,B479 86 50    STX $50         save descriptor pointer low byte
.,B47B 84 51    STY $51         save descriptor pointer high byte

                                *** make string space A bytes long
.,B47D 20 F4 B4 JSR $B4F4       make space in string memory for string A long
.,B480 86 62    STX $62         save string pointer low byte
.,B482 84 63    STY $63         save string pointer high byte
.,B484 85 61    STA $61         save length
.,B486 60       RTS

                                *** scan, set up string
                                print " terminated string to utility pointer
.,B487 A2 22    LDX #$22        set terminator to "
.,B489 86 07    STX $07         set search character, terminator 1
.,B48B 86 08    STX $08         set terminator 2
                                print search or alternate terminated string to utility pointer
                                source is AY
.,B48D 85 6F    STA $6F         store string start low byte
.,B48F 84 70    STY $70         store string start high byte
.,B491 85 62    STA $62         save string pointer low byte
.,B493 84 63    STY $63         save string pointer high byte
.,B495 A0 FF    LDY #$FF        set length to -1
.,B497 C8       INY             increment length
.,B498 B1 6F    LDA ($6F),Y     get byte from string
.,B49A F0 0C    BEQ $B4A8       exit loop if null byte [EOS]
.,B49C C5 07    CMP $07         compare with search character, terminator 1
.,B49E F0 04    BEQ $B4A4       branch if terminator
.,B4A0 C5 08    CMP $08         compare with terminator 2
.,B4A2 D0 F3    BNE $B497       loop if not terminator 2
.,B4A4 C9 22    CMP #$22        compare with "
.,B4A6 F0 01    BEQ $B4A9       branch if " (carry set if = !)
.,B4A8 18       CLC             clear carry for add (only if [EOL] terminated string)
.,B4A9 84 61    STY $61         save length in FAC1 exponent
.,B4AB 98       TYA             copy length to A
.,B4AC 65 6F    ADC $6F         add string start low byte
.,B4AE 85 71    STA $71         save string end low byte
.,B4B0 A6 70    LDX $70         get string start high byte
.,B4B2 90 01    BCC $B4B5       branch if no low byte overflow
.,B4B4 E8       INX             else increment high byte
.,B4B5 86 72    STX $72         save string end high byte
.,B4B7 A5 70    LDA $70         get string start high byte
.,B4B9 F0 04    BEQ $B4BF       branch if in utility area
.,B4BB C9 02    CMP #$02        compare with input buffer memory high byte
.,B4BD D0 0B    BNE $B4CA       branch if not in input buffer memory
                                string in input buffer or utility area, move to string
                                memory
.,B4BF 98       TYA             copy length to A
.,B4C0 20 75 B4 JSR $B475       copy descriptor pointer and make string space A bytes long
.,B4C3 A6 6F    LDX $6F         get string start low byte
.,B4C5 A4 70    LDY $70         get string start high byte
.,B4C7 20 88 B6 JSR $B688       store string A bytes long from XY to utility pointer
                                check for space on descriptor stack then ...
                                put string address and length on descriptor stack and update stack pointers
.,B4CA A6 16    LDX $16         get the descriptor stack pointer
.,B4CC E0 22    CPX #$22        compare it with the maximum + 1
.,B4CE D0 05    BNE $B4D5       if there is space on the string stack continue
                                else do string too complex error
.,B4D0 A2 19    LDX #$19        error $19, string too complex error
.,B4D2 4C 37 A4 JMP $A437       do error #X then warm start
                                put string address and length on descriptor stack and update stack pointers
.,B4D5 A5 61    LDA $61         get the string length
.,B4D7 95 00    STA $00,X       put it on the string stack
.,B4D9 A5 62    LDA $62         get the string pointer low byte
.,B4DB 95 01    STA $01,X       put it on the string stack
.,B4DD A5 63    LDA $63         get the string pointer high byte
.,B4DF 95 02    STA $02,X       put it on the string stack
.,B4E1 A0 00    LDY #$00        clear Y
.,B4E3 86 64    STX $64         save the string descriptor pointer low byte
.,B4E5 84 65    STY $65         save the string descriptor pointer high byte, always $00
.,B4E7 84 70    STY $70         clear FAC1 rounding byte
.,B4E9 88       DEY             Y = $FF
.,B4EA 84 0D    STY $0D         save the data type flag, $FF = string
.,B4EC 86 17    STX $17         save the current descriptor stack item pointer low byte
.,B4EE E8       INX             update the stack pointer
.,B4EF E8       INX             update the stack pointer
.,B4F0 E8       INX             update the stack pointer
.,B4F1 86 16    STX $16         save the new descriptor stack pointer
.,B4F3 60       RTS
```

## Key Registers
- $00-$02 - Zero Page - descriptor stack entry layout (length, pointer low, pointer high) (stored via STA $00,X etc.)
- $07-$08 - Zero Page - search/terminator character(s) for string scanner
- $0D - Zero Page - data type flag ($FF = string)
- $16-$17 - Zero Page - descriptor stack pointer (low/high)
- $50-$51 - Zero Page - saved descriptor pointer (low/high) (temporary while allocating)
- $61 - Zero Page - string length / FAC1 exponent storage
- $62-$63 - Zero Page - string pointer (low/high) for allocated string / utility pointer
- $64-$65 - Zero Page - current descriptor pointer (low/high)
- $6F-$72 - Zero Page - source string start and end temporary pointers (6F/70 start low/high, 71/72 end low/high)

## References
- "string_space_allocate_and_gc_trigger" — makes space in string memory and triggers garbage collection if necessary
- "string_concatenation_and_descriptor_ops" — uses descriptor pointers to copy and place strings on descriptor stack