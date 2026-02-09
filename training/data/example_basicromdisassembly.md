CBM BASIC Interpreter — tokeniser, parser and runtime (C64 BASIC ROM)

## Summary
This is the Commodore BASIC interpreter core: it tokenises input lines, inserts/removes program lines in memory, parses and evaluates expressions with a stack-driven precedence parser, and implements runtime features (FOR/NEXT, GOSUB/RETURN, arrays, strings, I/O). Execution flow is driven by a pair of RAM pointers (BASIC execute pointer $7A/$7B) and a small set of zero-page "registers" that hold current line, continue/break pointers and variable/array table anchors. Expression evaluation uses two software floating accumulators (FAC1/FAC2) saved in zero page; operators and functions are dispatched via table lookups and stacked precedence bytes. The ROM avoids direct hardware register access and instead calls KERNAL vectors for I/O, timing and device operations; it uses the CPU stack heavily as a data area for FOR/GOSUB frames, function call frames and temporary storage.

## Key Registers
- $0073 - ROM/KERNAL vector - called to "increment and scan memory" (token/char advance)
- $0022/$0023 - RAM (vector) - used as temporary return-address storage / indirect JMP target when pushing rounded FAC1 onto stack
- $0300-$030A - ROM vector table area - interpreter uses indirect JMP/JSR via these vectors to dispatch token handlers and arithmetic element fetch
- $0100-$01FF - CPU stack page - scanned and manipulated (TSX / LDA $0101,X) to find FOR/GOSUB frames and to push/pop packed frames (return addresses, FOR control data)
- $0200-$0259 - RAM input buffer - BASIC input line storage and crunch/uncrunch routines read/write here
- $2B/$2C - RAM pointers (word) - start of BASIC program memory area (program load start)
- $2D/$2E - RAM pointers (word) - start of variables area (variable & array pool)
- $2F/$30 - RAM pointers (word) - end of variables area (used to clear/scan variables)
- $31/$32 - RAM pointers (word) - end of arrays area
- $33/$34 - RAM pointers (word) - bottom of string space (string pool pointer)
- $39/$3A - RAM (word) - current line number (low/high), updated as execution advances or on breaks
- $3B/$3C - RAM (word) - saved break line number (for STOP/CTRL-C)
- $3D/$3E - RAM (word) - continue pointer (saved BASIC execution address for CONT)
- $41/$42 - RAM (word) - DATA pointer (low/high) for READ
- $43/$44 - RAM (word) - READ pointer saved/restored during GET/READ
- $45/$46 - RAM (bytes) - working storage for current variable name (first and second character)
- $47/$48 - RAM (word) - current variable pointer (low/high) used by LET/GET/ARRAY element access
- $49/$4A - RAM (word) - temporary variable pointer (used by LET/NEXT and other ops)
- $4B/$4C - RAM (word) - saved BASIC execute pointer used when performing GET/READ
- $50/$51 - RAM (word) - temporary descriptor pointer (string copy operations)
- $5A/$5B - RAM (word) - source end pointer (used in memory moves)
- $58/$59 - RAM (word) - destination end pointer (used in memory moves)
- $5F/$60 - RAM (word) - general-purpose pointer often used as "current line pointer" during scanning/chaining
- $61 - FAC1 exponent - software floating accumulator exponent for FAC1
- $62-$65 - FAC1 mantissa bytes - FAC1 mantissa (4 bytes)
- $66 - FAC1 sign (b7) - sign flag for FAC1
- $69 - FAC2 exponent - software floating accumulator exponent for FAC2
- $6A-$6D - FAC2 mantissa bytes - FAC2 mantissa (4 bytes)
- $6E - FAC2 sign (b7) - sign flag for FAC2
- $6F/$70 - utility old descriptor pointer - saved during string moves
- $71 - index/loop/temp byte used widely in string and array handling
- $72 - temporary / array-size high byte
- $07/$08 - temporary search/scan characters used by scan routines (terminator and quote handling)
- $0B/$0C/$0D/$0E/$0F - small flag bytes: word-index, DIM flag, data-type flags (string/integer/float), open-quote/DATA flag, etc.
- $10/$11/$13 - flags and I/O channel: $10 subscript/FNX flag, $11 input mode flag (INPUT/GET/READ), $13 current I/O channel (default vs file channel)
- $14/$15 - temporary integer (line number) low/high used for parsing numeric line targets and LIST ranges
- $16 - descriptor stack pointer (start) - used to manage string descriptor stack
- $22/$23 (also used as temp) - often used to save return vector bytes and as temp pointer in expression evaluation

## Techniques
- Keyword tokenisation ("crunching") and uncrunching using keyword tables with b7 end-markers; token table comparisons use table-driven matching and subtraction (SBC) to speed matching.
- Table-driven dispatch: operator precedence table and function/action pointer tables; interpreter uses table indices to push vectors onto stack and indirect JMPs (via $0300+ vectors) for command execution.
- Stack-as-data: heavy use of the CPU stack and direct stack scanning (TSX, LDA $0101,X) to find and manage FOR/GOSUB frames; FOR frames are stored on the stack and inspected/removed by adjusting the stack pointer (TXS/TAS).
- Expression evaluation using a two-accumulator floating-point model (FAC1/FAC2) in zero page; operators and functions manipulate FAC1/FAC2 and conversion routines convert between fixed and floating formats.
- Precedence parsing implemented by pushing precedence bytes on the stack and looping until the required precedence is reached; functions are called via stacked return-address trick (round FAC1, push sign and mantissa bytes, then JMP via an indirect vector).
- String handling via descriptors stored in a string pool; a descriptor stack is used to pass and manipulate strings without copying until necessary; garbage-collection routines invoked before memory exhaustion.
- Memory management for program, variable and array areas: dynamic insertion/deletion of program lines by memmove-like routines using zero-page pointers; arrays are allocated in the variable/array pool with explicit size computation and bounds checking.
- Use of small, re-used zero-page temporaries and flags (data type flags, DIM flag, open-quote flag) to keep interpreter state compact and fast.
- Error handling via an error vector mechanism: error number used as index into an error message pointer table; error routines close channels, print messages and warm-start by jumping through a vector.

## Hardware
- No direct $D000-$D7FF (VIC/SID) or $DC00/$DD00 (CIA) register accesses in this ROM; all hardware I/O, timing and device interactions are performed indirectly through KERNAL vectors (JSR $FFxx/$E1xx etc).

## Source Code
```asm
*** start of the BASIC ROM
.:A000 94 E3                    BASIC cold start entry point
.:A002 7B E3                    BASIC warm start entry point

.:A004 43 42 4D 42 41 53 49 43  'cbmbasic', ROM name, unreferenced

                                *** action addresses for primary commands
                                these are called by pushing the address onto the stack and doing an RTS so the
                                actual address -1 needs to be pushed
.:A00C 30 A8                    perform END     $80
.:A00E 41 A7                    perform FOR     $81
.:A010 1D AD                    perform NEXT    $82
.:A012 F7 A8                    perform DATA    $83
.:A014 A4 AB                    perform INPUT#  $84
.:A016 BE AB                    perform INPUT   $85
.:A018 80 B0                    perform DIM     $86
.:A01A 05 AC                    perform READ    $87
.:A01C A4 A9                    perform LET     $88
.:A01E 9F A8                    perform GOTO    $89
.:A020 70 A8                    perform RUN     $8A
.:A022 27 A9                    perform IF      $8B
.:A024 1C A8                    perform RESTORE $8C
.:A026 82 A8                    perform GOSUB   $8D
.:A028 D1 A8                    perform RETURN  $8E
.:A02A 3A A9                    perform REM     $8F
.:A02C 2E A8                    perform STOP    $90
.:A02E 4A A9                    perform ON      $91
.:A030 2C B8                    perform WAIT    $92
.:A032 67 E1                    perform LOAD    $93
.:A034 55 E1                    perform SAVE    $94
.:A036 64 E1                    perform VERIFY  $95
.:A038 B2 B3                    perform DEF     $96
.:A03A 23 B8                    perform POKE    $97
.:A03C 7F AA                    perform PRINT#  $98
.:A03E 9F AA                    perform PRINT   $99
.:A040 56 A8                    perform CONT    $9A
.:A042 9B A6                    perform LIST    $9B
.:A044 5D A6                    perform CLR     $9C
.:A046 85 AA                    perform CMD     $9D
.:A048 29 E1                    perform SYS     $9E
.:A04A BD E1                    perform OPEN    $9F
.:A04C C6 E1                    perform CLOSE   $A0
.:A04E 7A AB                    perform GET     $A1
.:A050 41 A6                    perform NEW     $A2

                                *** action addresses for functions
.:A052 39 BC                    perform SGN     $B4
.:A054 CC BC                    perform INT     $B5
.:A056 58 BC                    perform ABS     $B6
.:A058 10 03                    perform USR     $B7
.:A05A 7D B3                    perform FRE     $B8
.:A05C 9E B3                    perform POS     $B9
.:A05E 71 BF                    perform SQR     $BA
.:A060 97 E0                    perform RND     $BB
.:A062 EA B9                    perform LOG     $BC
.:A064 ED BF                    perform EXP     $BD
.:A066 64 E2                    perform COS     $BE
.:A068 6B E2                    perform SIN     $BF
.:A06A B4 E2                    perform TAN     $C0
.:A06C 0E E3                    perform ATN     $C1
.:A06E 0D B8                    perform PEEK    $C2
.:A070 7C B7                    perform LEN     $C3
.:A072 65 B4                    perform STR$    $C4
.:A074 AD B7                    perform VAL     $C5
.:A076 8B B7                    perform ASC     $C6
.:A078 EC B6                    perform CHR$    $C7
.:A07A 00 B7                    perform LEFT$   $C8
.:A07C 2C B7                    perform RIGHT$  $C9
.:A07E 37 B7                    perform MID$    $CA

                                *** precedence byte and action addresses for operators
                                like the primary commands these are called by pushing the address onto the stack
                                and doing an RTS, so again the actual address -1 needs to be pushed
.:A080 79 69 B8                 +
.:A083 79 52 B8                 -
.:A086 7B 2A BA                 *
.:A089 7B 11 BB                 /
.:A08C 7F 7A BF                 ^
.:A08F 50 E8 AF                 AND
.:A092 46 E5 AF                 OR
.:A095 7D B3 BF                 >
.:A098 5A D3 AE                 =
.:A09B 64 15 B0                 <

                                *** BASIC keywords
                                each word has b7 set in it's last character as an end marker, even
                                the one character keywords such as "<" or "="
                                first are the primary command keywords, only these can start a statement
.:A09E 45 4E                    end
.:A0A0 C4 46 4F D2 4E 45 58 D4  for next
.:A0A8 44 41 54 C1 49 4E 50 55  data input#
.:A0B0 54 A3 49 4E 50 55 D4 44  input dim
.:A0B8 49 CD 52 45 41 C4 4C 45  read let
.:A0C0 D4 47 4F 54 CF 52 55 CE  goto run
.:A0C8 49 C6 52 45 53 54 4F 52  if restore
.:A0D0 C5 47 4F 53 55 C2 52 45  gosub return
.:A0D8 54 55 52 CE 52 45 CD 53  rem stop
.:A0E0 54 4F D0 4F CE 57 41 49  on wait
.:A0E8 D4 4C 4F 41 C4 53 41 56  load save
.:A0F0 C5 56 45 52 49 46 D9 44  verify def
.:A0F8 45 C6 50 4F 4B C5 50 52  poke print#
.:A100 49 4E 54 A3 50 52 49 4E  print
.:A108 D4 43 4F 4E D4 4C 49 53  cont list
.:A110 D4 43 4C D2 43 4D C4 53  clr cmd sys
.:A118 59 D3 4F 50 45 CE 43 4C  open close
.:A120 4F 53 C5 47 45 D4 4E 45  get new

                                next are the secondary command keywords, these can not start a statement
.:A128 D7 54 41 42 A8 54 CF 46  tab( to
.:A130 CE 53 50 43 A8 54 48 45  spc( then
.:A138 CE 4E 4F D4 53 54 45 D0  not stop
                                next are the operators
.:A140 AB AD AA AF DE 41 4E C4  + - * / ' and
.:A148 4F D2 BE BD BC           or <=>
.:A14D                53 47 CE  sgn

                                and finally the functions
.:A150 49 4E D4 41 42 D3 55 53  int abs usr
.:A158 D2 46 52 C5 50 4F D3 53  fre pos sqr
.:A160 51 D2 52 4E C4 4C 4F C7  rnd log
.:A168 45 58 D0 43 4F D3 53 49  exp cos sin
.:A170 CE 54 41 CE 41 54 CE 50  tan atn peek
.:A178 45 45 CB 4C 45 CE 53 54  len str$
.:A180 52 A4 56 41 CC 41 53 C3  val asc
.:A188 43 48 52 A4 4C 45 46 54  chr$ left$
.:A190 A4 52 49 47 48 54 A4 4D  right$ mid$

                                lastly is GO, this is an add on so that GO TO, as well as GOTO, will work
.:A198 49 44 A4 47 CF           go
.:A19F 00                       end marker

                                *** BASIC error messages
.:A1A0 54 4F                    1 too many files
.:A1A0 4F 20 4D 41 4E 59 20 46
.:A1A8 49 4C 45 D3 46 49 4C 45  2 file open
.:A1B0 20 4F 50 45 CE 46 49 4C  3 file not open
.:A1B8 45 20 4E 4F 54 20 4F 50
.:A1C0 45 CE 46 49 4C 45 20 4E  4 file not found
.:A1C8 4F 54 20 46 4F 55 4E C4  5 device not present
.:A1D0 44 45 56 49 43 45 20 4E
.:A1D8 4F 54 20 50 52 45 53 45
.:A1E0 4E D4 4E 4F 54 20 49 4E  6 not input file
.:A1E8 50 55 54 20 46 49 4C C5
.:A1F0 4E 4F 54 20 4F 55 54 50  7 not output file
.:A1F8 55 54 20 46 49 4C C5 4D
.:A200 49 53 53 49 4E 47 20 46  8 missing filename
.:A208 49 4C 45 20 4E 41 4D C5
.:A210 49 4C 4C 45 47 41 4C 20  9 illegal device number
.:A218 44 45 56 49 43 45 20 4E
.:A220 55 4D 42 45 D2 4E 45 58  10 next without for
.:A228 54 20 57 49 54 48 4F 55
.:A230 54 20 46 4F D2 53 59 4E  11 syntax
.:A238 54 41 D8 52 45 54 55 52  12 return without gosub
.:A240 4E 20 57 49 54 48 4F 55
.:A248 54 20 47 4F 53 55 C2 4F  13 out of data
.:A250 55 54 20 4F 46 20 44 41
.:A258 54 C1 49 4C 4C 45 47 41  14 illegal quantity
.:A260 4C 20 51 55 41 4E 54 49
.:A268 54 D9 4F 56 45 52 46 4C  15 overflow
.:A270 4F D7 4F 55 54 20 4F 46  16 out of memory
.:A278 20 4D 45 4D 4F 52 D9 55  17 undef'd statement
.:A280 4E 44 45 46 27 44 20 53
.:A288 54 41 54 45 4D 45 4E D4
.:A290 42 41 44 20 53 55 42 53  18 bad subscript
.:A298 43 52 49 50 D4 52 45 44  19 redim'd array
.:A2A0 49 4D 27 44 20 41 52 52
.:A2A8 41 D9 44 49 56 49 53 49  20 division by zero
.:A2B0 4F 4E 20 42 59 20 5A 45
.:A2B8 52 CF 49 4C 4C 45 47 41  21 illegal direct
.:A2C0 4C 20 44 49 52 45 43 D4
.:A2C8 54 59 50 45 20 4D 49 53  22 type mismatch
.:A2D0 4D 41 54 43 C8 53 54 52  23 string too long
.:A2D8 49 4E 47 20 54 4F 4F 20
.:A2E0 4C 4F 4E C7 46 49 4C 45  24 file data
.:A2E8 20 44 41 54 C1 46 4F 52  25 formula too complex
.:A2F0 4D 55 4C 41 20 54 4F 4F
.:A2F8 20 43 4F 4D 50 4C 45 D8
.:A300 43 41 4E 27 54 20 43 4F  26 can't continue
.:A308 4E 54 49 4E 55 C5 55 4E  27 undef'd function
.:A310 44 45 46 27 44 20 46 55
.:A318 4E 43 54 49 4F CE 56 45  28 verify
.:A320 52 49 46 D9 4C 4F 41 C4  29 load

                                *** error message pointer table
.:A328 9E A1 AC A1 B5 A1 C2 A1
.:A330 D0 A1 E2 A1 F0 A1 FF A1
.:A338 10 A2 25 A2 35 A2 3B A2
.:A340 4F A2 5A A2 6A A2 72 A2
.:A348 7F A2 90 A2 9D A2 AA A2
.:A350 BA A2 C8 A2 D5 A2 E4 A2
.:A358 ED A2 00 A3 0E A3 1E A3
.:A360 24 A3 83 A3

                                *** BASIC messages
.:A364 0D 4F 4B 0D              OK
.:A368 00 20 20 45 52 52 4F 52  ERROR
.:A370 00 20 49 4E 20 00 0D 0A  IN
.:A378 52 45 41 44 59 2E 0D 0A  READY.
.:A380 00 0D 0A 42 52 45 41 4B  BREAK
.:A388 00

                                *** spare byte, not referenced
.:A389 A0                       unused

                                *** search the stack for FOR or GOSUB activity
                                return Zb=1 if FOR variable found
.,A38A BA       TSX             copy stack pointer
.,A38B E8       INX             +1 pass return address
.,A38C E8       INX             +2 pass return address
.,A38D E8       INX             +3 pass calling routine return address
.,A38E E8       INX             +4 pass calling routine return address
.,A38F BD 01 01 LDA $0101,X     get the token byte from the stack
.,A392 C9 81    CMP #$81        is it the FOR token
.,A394 D0 21    BNE $A3B7       if not FOR token just exit
                                it was the FOR token
.,A396 A5 4A    LDA $4A         get FOR/NEXT variable pointer high byte
.,A398 D0 0A    BNE $A3A4       branch if not null
.,A39A BD 02 01 LDA $0102,X     get FOR variable pointer low byte
.,A39D 85 49    STA $49         save FOR/NEXT variable pointer low byte
.,A39F BD 03 01 LDA $0103,X     get FOR variable pointer high byte
.,A3A2 85 4A    STA $4A         save FOR/NEXT variable pointer high byte
.,A3A4 DD 03 01 CMP $0103,X     compare variable pointer with stacked variable pointer
                                high byte
.,A3A7 D0 07    BNE $A3B0       branch if no match
.,A3A9 A5 49    LDA $49         get FOR/NEXT variable pointer low byte
.,A3AB DD 02 01 CMP $0102,X     compare variable pointer with stacked variable pointer
                                low byte
.,A3AE F0 07    BEQ $A3B7       exit if match found
.,A3B0 8A       TXA             copy index
.,A3B1 18       CLC             clear carry for add
.,A3B2 69 12    ADC #$12        add FOR stack use size
.,A3B4 AA       TAX             copy back to index
.,A3B5 D0 D8    BNE $A38F       loop if not at start of stack
.,A3B7 60       RTS             

                                *** open up a space in the memory, set the end of arrays
.,A3B8 20 08 A4 JSR $A408       check available memory, do out of memory error if no room
.,A3BB 85 31    STA $31         set end of arrays low byte
.,A3BD 84 32    STY $32         set end of arrays high byte
                                open up a space in the memory, don't set the array end
.,A3BF 38       SEC             set carry for subtract
.,A3C0 A5 5A    LDA $5A         get block end low byte
.,A3C2 E5 5F    SBC $5F         subtract block start low byte
.,A3C4 85 22    STA $22         save MOD(block length/$100) byte
.,A3C6 A8       TAY             copy MOD(block length/$100) byte to Y
.,A3C7 A5 5B    LDA $5B         get block end high byte
.,A3C9 E5 60    SBC $60         subtract block start high byte
.,A3CB AA       TAX             copy block length high byte to X
.,A3CC E8       INX             +1 to allow for count=0 exit
.,A3CD 98       TYA             copy block length low byte to A
.,A3CE F0 23    BEQ $A3F3       branch if length low byte=0
                                block is (X-1)*256+Y bytes, do the Y bytes first
.,A3D0 A5 5A    LDA $5A         get block end low byte
.,A3D2 38       SEC             set carry for subtract
.,A3D3 E5 22    SBC $22         subtract MOD(block length/$100) byte
.,A3D5 85 5A    STA $5A         save corrected old block end low byte
.,A3D7 B0 03    BCS $A3DC       branch if no underflow
.,A3D9 C6 5B    DEC $5B         else decrement block end high byte
.,A3DB 38       SEC             set carry for subtract
.,A3DC A5 58    LDA $58         get destination end low byte
.,A3DE E5 22    SBC $22         subtract MOD(block length/$100) byte
.,A3E0 85 58    STA $58         save modified new block end low byte
.,A3E2 B0 08    BCS $A3EC       branch if no underflow
.,A3E4 C6 59    DEC $59         else decrement block end high byte
.,A3E6 90 04    BCC $A3EC       branch always
.,A3E8 B1 5A    LDA ($5A),Y     get byte from source
.,A3EA 91 58    STA ($58),Y     copy byte to destination
.,A3EC 88       DEY             decrement index
.,A3ED D0 F9    BNE $A3E8       loop until Y=0
                                now do Y=0 indexed byte
.,A3EF B1 5A    LDA ($5A),Y     get byte from source
.,A3F1 91 58    STA ($58),Y     save byte to destination
.,A3F3 C6 5B    DEC $5B         decrement source pointer high byte
.,A3F5 C6 59    DEC $59         decrement destination pointer high byte
.,A3F7 CA       DEX             decrement block count
.,A3F8 D0 F2    BNE $A3EC       loop until count = $0
.,A3FA 60       RTS             

                                *** check room on stack for A bytes
                                if stack too deep do out of memory error
.,A3FB 0A       ASL             *2
.,A3FC 69 3E    ADC #$3E        need at least $3E bytes free
.,A3FE B0 35    BCS $A435       if overflow go do out of memory error then warm start
.,A400 85 22    STA $22         save result in temp byte
.,A402 BA       TSX             copy stack
.,A403 E4 22    CPX $22         compare new limit with stack
.,A405 90 2E    BCC $A435       if stack < limit do out of memory error then warm start
.,A407 60       RTS             

                                *** check available memory, do out of memory error if no room
.,A408 C4 34    CPY $34         compare with bottom of string space high byte
.,A40A 90 28    BCC $A434       if less then exit (is ok)
.,A40C D0 04    BNE $A412       skip next test if greater (tested <)
                                high byte was =, now do low byte
.,A40E C5 33    CMP $33         compare with bottom of string space low byte
.,A410 90 22    BCC $A434       if less then exit (is ok)
                                address is > string storage ptr (oops!)
.,A412 48       PHA             push address low byte
.,A413 A2 09    LDX #$09        set index to save $57 to $60 inclusive
.,A415 98       TYA             copy address high byte (to push on stack)
                                save misc numeric work area
.,A416 48       PHA             push byte
.,A417 B5 57    LDA $57,X       get byte from $57 to $60
.,A419 CA       DEX             decrement index
.,A41A 10 FA    BPL $A416       loop until all done
.,A41C 20 26 B5 JSR $B526       do garbage collection routine
                                restore misc numeric work area
.,A41F A2 F7    LDX #$F7        set index to restore bytes
.,A421 68       PLA             pop byte
.,A422 95 61    STA $61,X       save byte to $57 to $60
.,A424 E8       INX             increment index
.,A425 30 FA    BMI $A421       loop while -ve
.,A427 68       PLA             pop address high byte
.,A428 A8       TAY             copy back to Y
.,A429 68       PLA             pop address low byte
.,A42A C4 34    CPY $34         compare with bottom of string space high byte
.,A42C 90 06    BCC $A434       if less then exit (is ok)
.,A42E D0 05    BNE $A435       if greater do out of memory error then warm start
                                high byte was =, now do low byte
.,A430 C5 33    CMP $33         compare with bottom of string space low byte
.,A432 B0 01    BCS $A435       if >= do out of memory error then warm start
                                ok exit, carry clear
.,A434 60       RTS             

                                *** do out of memory error then warm start
.,A435 A2 10    LDX #$10        error code $10, out of memory error
                                do error #X then warm start
.,A437 6C 00 03 JMP ($0300)     do error message

                                *** do error #X then warm start, the error message vector is initialised to point here
.,A43A 8A       TXA             copy error number
.,A43B 0A       ASL             *2
.,A43C AA       TAX             copy to index
.,A43D BD 26 A3 LDA $A326,X     get error message pointer low byte
.,A440 85 22    STA $22         save it
.,A442 BD 27 A3 LDA $A327,X     get error message pointer high byte
.,A445 85 23    STA $23         save it
.,A447 20 CC FF JSR $FFCC       close input and output channels
.,A44A A9 00    LDA #$00        clear A
.,A44C 85 13    STA $13         clear current I/O channel, flag default
.,A44E 20 D7 AA JSR $AAD7       print CR/LF
.,A451 20 45 AB JSR $AB45       print "?"
.,A454 A0 00    LDY #$00        clear index
.,A456 B1 22    LDA ($22),Y     get byte from message
.,A458 48       PHA             save status
.,A459 29 7F    AND #$7F        mask 0xxx xxxx, clear b7
.,A45B 20 47 AB JSR $AB47       output character
.,A45E C8       INY             increment index
.,A45F 68       PLA             restore status
.,A460 10 F4    BPL $A456       loop if character was not end marker
.,A462 20 7A A6 JSR $A67A       flush BASIC stack and clear continue pointer
.,A465 A9 69    LDA #$69        set " ERROR" pointer low byte
.,A467 A0 A3    LDY #$A3        set " ERROR" pointer high byte

                                *** print string and do warm start, break entry
.,A469 20 1E AB JSR $AB1E       print null terminated string
.,A46C A4 3A    LDY $3A         get current line number high byte
.,A46E C8       INY             increment it
.,A46F F0 03    BEQ $A474       branch if was in immediate mode
.,A471 20 C2 BD JSR $BDC2       do " IN " line number message

                                *** do warm start
.,A474 A9 76    LDA #$76        set "READY." pointer low byte
.,A476 A0 A3    LDY #$A3        set "READY." pointer high byte
.,A478 20 1E AB JSR $AB1E       print null terminated string
.,A47B A9 80    LDA #$80        set for control messages only
.,A47D 20 90 FF JSR $FF90       control kernal messages
.,A480 6C 02 03 JMP ($0302)     do BASIC warm start

                                *** BASIC warm start, the warm start vector is initialised to point here
.,A483 20 60 A5 JSR $A560       call for BASIC input
.,A486 86 7A    STX $7A         save BASIC execute pointer low byte
.,A488 84 7B    STY $7B         save BASIC execute pointer high byte
.,A48A 20 73 00 JSR $0073       increment and scan memory
.,A48D AA       TAX             copy byte to set flags
.,A48E F0 F0    BEQ $A480       loop if no input
                                got to interpret the input line now ....
.,A490 A2 FF    LDX #$FF        current line high byte to -1, indicates immediate mode
.,A492 86 3A    STX $3A         set current line number high byte
.,A494 90 06    BCC $A49C       if numeric character go handle new BASIC line
                                no line number .. immediate mode
.,A496 20 79 A5 JSR $A579       crunch keywords into BASIC tokens
.,A499 4C E1 A7 JMP $A7E1       go scan and interpret code

                                *** handle new BASIC line
.,A49C 20 6B A9 JSR $A96B       get fixed-point number into temporary integer
.,A49F 20 79 A5 JSR $A579       crunch keywords into BASIC tokens
.,A4A2 84 0B    STY $0B         save index pointer to end of crunched line
.,A4A4 20 13 A6 JSR $A613       search BASIC for temporary integer line number
.,A4A7 90 44    BCC $A4ED       if not found skip the line delete
                                line # already exists so delete it
.,A4A9 A0 01    LDY #$01        set index to next line pointer high byte
.,A4AB B1 5F    LDA ($5F),Y     get next line pointer high byte
.,A4AD 85 23    STA $23         save it
.,A4AF A5 2D    LDA $2D         get start of variables low byte
.,A4B1 85 22    STA $22         save it
.,A4B3 A5 60    LDA $60         get found line pointer high byte
.,A4B5 85 25    STA $25         save it
.,A4B7 A5 5F    LDA $5F         get found line pointer low byte
.,A4B9 88       DEY             decrement index
.,A4BA F1 5F    SBC ($5F),Y     subtract next line pointer low byte
.,A4BC 18       CLC             clear carry for add
.,A4BD 65 2D    ADC $2D         add start of variables low byte
.,A4BF 85 2D    STA $2D         set start of variables low byte
.,A4C1 85 24    STA $24         save destination pointer low byte
.,A4C3 A5 2E    LDA $2E         get start of variables high byte
.,A4C5 69 FF    ADC #$FF        -1 + carry
.,A4C7 85 2E    STA $2E         set start of variables high byte
.,A4C9 E5 60    SBC $60         subtract found line pointer high byte
.,A4CB AA       TAX             copy to block count
.,A4CC 38       SEC             set carry for subtract
.,A4CD A5 5F    LDA $5F         get found line pointer low byte
.,A4CF E5 2D    SBC $2D         subtract start of variables low byte
.,A4D1 A8       TAY             copy to bytes in first block count
.,A4D2 B0 03    BCS $A4D7       branch if no underflow
.,A4D4 E8       INX             increment block count, correct for = 0 loop exit
.,A4D5 C6 25    DEC $25         decrement destination high byte
.,A4D7 18       CLC             clear carry for add
.,A4D8 65 22    ADC $22         add source pointer low byte
.,A4DA 90 03    BCC $A4DF       branch if no overflow
.,A4DC C6 23    DEC $23         else decrement source pointer high byte
.,A4DE 18       CLC             clear carry
                                close up memory to delete old line
.,A4DF B1 22    LDA ($22),Y     get byte from source
.,A4E1 91 24    STA ($24),Y     copy to destination
.,A4E3 C8       INY             increment index
.,A4E4 D0 F9    BNE $A4DF       while <> 0 do this block
.,A4E6 E6 23    INC $23         increment source pointer high byte
.,A4E8 E6 25    INC $25         increment destination pointer high byte
.,A4EA CA       DEX             decrement block count
.,A4EB D0 F2    BNE $A4DF       loop until all done
                                got new line in buffer and no existing same #
.,A4ED 20 59 A6 JSR $A659       reset execution to start, clear variables, flush stack
                                and return
.,A4F0 20 33 A5 JSR $A533       rebuild BASIC line chaining
.,A4F3 AD 00 02 LDA $0200       get first byte from buffer
.,A4F6 F0 88    BEQ $A480       if no line go do BASIC warm start
                                else insert line into memory
.,A4F8 18       CLC             clear carry for add
.,A4F9 A5 2D    LDA $2D         get start of variables low byte
.,A4FB 85 5A    STA $5A         save as source end pointer low byte
.,A4FD 65 0B    ADC $0B         add index pointer to end of crunched line
.,A4FF 85 58    STA $58         save as destination end pointer low byte
.,A501 A4 2E    LDY $2E         get start of variables high byte
.,A503 84 5B    STY $5B         save as source end pointer high byte
.,A505 90 01    BCC $A508       branch if no carry to high byte
.,A507 C8       INY             else increment high byte
.,A508 84 59    STY $59         save as destination end pointer high byte
.,A50A 20 B8 A3 JSR $A3B8       open up space in memory
                                most of what remains to do is copy the crunched line into the space opened up in memory,
                                however, before the crunched line comes the next line pointer and the line number. the
                                line number is retrieved from the temporary integer and stored in memory, this
                                overwrites the bottom two bytes on the stack. next the line is copied and the next line
                                pointer is filled with whatever was in two bytes above the line number in the stack.
                                this is ok because the line pointer gets fixed in the line chain re-build.
.,A50D A5 14    LDA $14         get line number low byte
.,A50F A4 15    LDY $15         get line number high byte
.,A511 8D FE 01 STA $01FE       save line number low byte before crunched line
.,A514 8C FF 01 STY $01FF       save line number high byte before crunched line
.,A517 A5 31    LDA $31         get end of arrays low byte
.,A519 A4 32    LDY $32         get end of arrays high byte
.,A51B 85 2D    STA $2D         set start of variables low byte
.,A51D 84 2E    STY $2E         set start of variables high byte
.,A51F A4 0B    LDY $0B         get index to end of crunched line
.,A521 88       DEY             -1
.,A522 B9 FC 01 LDA $01FC,Y     get byte from crunched line
.,A525 91 5F    STA ($5F),Y     save byte to memory
.,A527 88       DEY             decrement index
.,A528 10 F8    BPL $A522       loop while more to do
                                reset execution, clear variables, flush stack, rebuild BASIC chain and do warm start
.,A52A 20 59 A6 JSR $A659       reset execution to start, clear variables and flush stack
.,A52D 20 33 A5 JSR $A533       rebuild BASIC line chaining
.,A530 4C 80 A4 JMP $A480       go do BASIC warm start

                                *** rebuild BASIC line chaining
.,A533 A5 2B    LDA $2B         get start of memory low byte
.,A535 A4 2C    LDY $2C         get start of memory high byte
.,A537 85 22    STA $22         set line start pointer low byte
.,A539 84 23    STY $23         set line start pointer high byte
.,A53B 18       CLC             clear carry for add
.,A53C A0 01    LDY #$01        set index to pointer to next line high byte
.,A53E B1 22    LDA ($22),Y     get pointer to next line high byte
.,A540 F0 1D    BEQ $A55F       exit if null, [EOT]
.,A542 A0 04    LDY #$04        point to first code byte of line
                                there is always 1 byte + [EOL] as null entries are deleted
.,A544 C8       INY             next code byte
.,A545 B1 22    LDA ($22),Y     get byte
.,A547 D0 FB    BNE $A544       loop if not [EOL]
.,A549 C8       INY             point to byte past [EOL], start of next line
.,A54A 98       TYA             copy it
.,A54B 65 22    ADC $22         add line start pointer low byte
.,A54D AA       TAX             copy to X
.,A54E A0 00    LDY #$00        clear index, point to this line's next line pointer
.,A550 91 22    STA ($22),Y     set next line pointer low byte
.,A552 A5 23    LDA $23         get line start pointer high byte
.,A554 69 00    ADC #$00        add any overflow
.,A556 C8       INY             increment index to high byte
.,A557 91 22    STA ($22),Y     set next line pointer high byte
.,A559 86 22    STX $22         set line start pointer low byte
.,A55B 85 23    STA $23         set line start pointer high byte
.,A55D 90 DD    BCC $A53C       go do next line, branch always
.,A55F 60       RTS             
                                call for BASIC input
.,A560 A2 00    LDX #$00        set channel $00, keyboard
.,A562 20 12 E1 JSR $E112       input character from channel with error check
.,A565 C9 0D    CMP #$0D        compare with [CR]
.,A567 F0 0D    BEQ $A576       if [CR] set XY to $200 - 1, print [CR] and exit
                                character was not [CR]
.,A569 9D 00 02 STA $0200,X     save character to buffer
.,A56C E8       INX             increment buffer index
.,A56D E0 59    CPX #$59        compare with max+1
.,A56F 90 F1    BCC $A562       branch if < max+1
.,A571 A2 17    LDX #$17        error $17, string too long error
.,A573 4C 37 A4 JMP $A437       do error #X then warm start
.,A576 4C CA AA JMP $AACA       set XY to $200 - 1 and print [CR]

                                *** crunch BASIC tokens vector
.,A579 6C 04 03 JMP ($0304)     do crunch BASIC tokens

                                *** crunch BASIC tokens, the crunch BASIC tokens vector is initialised to point here
.,A57C A6 7A    LDX $7A         get BASIC execute pointer low byte
.,A57E A0 04    LDY #$04        set save index
.,A580 84 0F    STY $0F         clear open quote/DATA flag
.,A582 BD 00 02 LDA $0200,X     get a byte from the input buffer
.,A585 10 07    BPL $A58E       if b7 clear go do crunching
.,A587 C9 FF    CMP #$FF        compare with the token for PI, this toke is input
                                directly from the keyboard as the PI character
.,A589 F0 3E    BEQ $A5C9       if PI save byte then continue crunching
                                this is the bit of code that stops you being able to enter
                                some keywords as just single shifted characters. If this
                                dropped through you would be able to enter GOTO as just
                                [SHIFT]G
.,A58B E8       INX             increment read index
.,A58C D0 F4    BNE $A582       loop if more to do, branch always
.,A58E C9 20    CMP #$20        compare with [SPACE]
.,A590 F0 37    BEQ $A5C9       if [SPACE] save byte then continue crunching
.,A592 85 08    STA $08         save buffer byte as search character
.,A594 C9 22    CMP #$22        compare with quote character
.,A596 F0 56    BEQ $A5EE       if quote go copy quoted string
.,A598 24 0F    BIT $0F         get open quote/DATA token flag
.,A59A 70 2D    BVS $A5C9       branch if b6 of Oquote set, was DATA
                                go save byte then continue crunching
.,A59C C9 3F    CMP #$3F        compare with "?" character
.,A59E D0 04    BNE $A5A4       if not "?" continue crunching
.,A5A0 A9 99    LDA #$99        else the keyword token is $99, PRINT
.,A5A2 D0 25    BNE $A5C9       go save byte then continue crunching, branch always
.,A5A4 C9 30    CMP #$30        compare with "0"
.,A5A6 90 04    BCC $A5AC       branch if <, continue crunching
.,A5A8 C9 3C    CMP #$3C        compare with "<"
.,A5AA 90 1D    BCC $A5C9       if <, 0123456789:; go save byte then continue crunching
                                gets here with next character not numeric, ";" or ":"
.,A5AC 84 71    STY $71         copy save index
.,A5AE A0 00    LDY #$00        clear table pointer
.,A5B0 84 0B    STY $0B         clear word index
.,A5B2 88       DEYadjust for pre increment loop
.,A5B3 86 7A    STX $7A         save BASIC execute pointer low byte, buffer index
.,A5B5 CA       DEX             adjust for pre increment loop
.,A5B6 C8       INY             next table byte
.,A5B7 E8       INX             next buffer byte
.,A5B8 BD 00 02 LDA $0200,X     get byte from input buffer
.,A5BB 38       SEC             set carry for subtract
.,A5BC F9 9E A0 SBC $A09E,Y     subtract table byte
.,A5BF F0 F5    BEQ $A5B6       go compare next if match
.,A5C1 C9 80    CMP #$80        was it end marker match ?
.,A5C3 D0 30    BNE $A5F5       branch if not, not found keyword
                                actually this works even if the input buffer byte is the
                                end marker, i.e. a shifted character. As you can't enter
                                any keywords as a single shifted character, see above,
                                you can enter keywords in shorthand by shifting any
                                character after the first. so RETURN can be entered as
                                R[SHIFT]E, RE[SHIFT]T, RET[SHIFT]U or RETU[SHIFT]R.
                                RETUR[SHIFT]N however will not work because the [SHIFT]N
                                will match the RETURN end marker so the routine will try
                                to match the next character.
                                else found keyword
.,A5C5 05 0B    ORA $0B         OR with word index, +$80 in A makes token
.,A5C7 A4 71    LDY $71         restore save index
                                save byte then continue crunching
.,A5C9 E8       INXincrement buffer read index
.,A5CA C8       INY             increment save index
.,A5CB 99 FB 01 STA $01FB,Y     save byte to output
.,A5CE B9 FB 01 LDA $01FB,Y     get byte from output, set flags
.,A5D1 F0 36    BEQ $A609       branch if was null [EOL]
                                A holds the token here
.,A5D3 38       SEC             set carry for subtract
.,A5D4 E9 3A    SBC #$3A        subtract ":"
.,A5D6 F0 04    BEQ $A5DC       branch if it was (is now $00)
                                A now holds token-':'
.,A5D8 C9 49    CMP #$49        compare with the token for DATA-':'
.,A5DA D0 02    BNE $A5DE       if not DATA go try REM
                                token was : or DATA
.,A5DC 85 0F    STA $0F         save the token-$3A
.,A5DE 38       SEC             set carry for subtract
.,A5DF E9 55    SBC #$55        subtract the token for REM-':'
.,A5E1 D0 9F    BNE $A582       if wasn't REM crunch next bit of line
.,A5E3 85 08    STA $08         else was REM so set search for [EOL]
                                loop for "..." etc.
.,A5E5 BD 00 02 LDA $0200,X     get byte from input buffer
.,A5E8 F0 DF    BEQ $A5C9       if null [EOL] save byte then continue crunching
.,A5EA C5 08    CMP $08         compare with stored character
.,A5EC F0 DB    BEQ $A5C9       if match save byte then continue crunching
.,A5EE C8       INY             increment save index
.,A5EF 99 FB 01 STA $01FB,Y     save byte to output
.,A5F2 E8       INX             increment buffer index
.,A5F3 D0 F0    BNE $A5E5       loop while <> 0, should never reach 0
                                not found keyword this go
.,A5F5 A6 7A    LDX $7A         restore BASIC execute pointer low byte
.,A5F7 E6 0B    INC $0B         increment word index (next word)
                                now find end of this word in the table
.,A5F9 C8       INY             increment table index
.,A5FA B9 9D A0 LDA $A09D,Y     get table byte
.,A5FD 10 FA    BPL $A5F9       loop if not end of word yet
.,A5FF B9 9E A0 LDA $A09E,Y     get byte from keyword table
.,A602 D0 B4    BNE $A5B8       go test next word if not zero byte, end of table
                                reached end of table with no match
.,A604 BD 00 02 LDA $0200,X     restore byte from input buffer
.,A607 10 BE    BPL $A5C7       branch always, all unmatched bytes in the buffer are
                                $00 to $7F, go save byte in output and continue crunching
                                reached [EOL]
.,A609 99 FD 01 STA $01FD,Y     save [EOL]
.,A60C C6 7B    DEC $7B         decrement BASIC execute pointer high byte
.,A60E A9 FF    LDA #$FF        point to start of buffer-1
.,A610 85 7A    STA $7A         set BASIC execute pointer low byte
.,A612 60       RTS             

                                *** search BASIC for temporary integer line number
.,A613 A5 2B    LDA $2B         get start of memory low byte
.,A615 A6 2C    LDX $2C         get start of memory high byte

                                *** search Basic for temp integer line number from AX
                                returns carry set if found
.,A617 A0 01    LDY #$01        set index to next line pointer high byte
.,A619 85 5F    STA $5F         save low byte as current
.,A61B 86 60    STX $60         save high byte as current
.,A61D B1 5F    LDA ($5F),Y     get next line pointer high byte from address
.,A61F F0 1F    BEQ $A640       pointer was zero so done, exit
.,A621 C8       INY             increment index ...
.,A622 C8       INY             ... to line # high byte
.,A623 A5 15    LDA $15         get temporary integer high byte
.,A625 D1 5F    CMP ($5F),Y     compare with line # high byte
.,A627 90 18    BCC $A641       exit if temp < this line, target line passed
.,A629 F0 03    BEQ $A62E       go check low byte if =
.,A62B 88       DEY             else decrement index
.,A62C D0 09    BNE $A637       branch always
.,A62E A5 14    LDA $14         get temporary integer low byte
.,A630 88       DEY             decrement index to line # low byte
.,A631 D1 5F    CMP ($5F),Y     compare with line # low byte
.,A633 90 0C    BCC $A641       exit if temp < this line, target line passed
.,A635 F0 0A    BEQ $A641       exit if temp = (found line#)
                                not quite there yet
.,A637 88       DEY             decrement index to next line pointer high byte
.,A638 B1 5F    LDA ($5F),Y     get next line pointer high byte
.,A63A AA       TAX             copy to X
.,A63B 88       DEY             decrement index to next line pointer low byte
.,A63C B1 5F    LDA ($5F),Y     get next line pointer low byte
.,A63E B0 D7    BCS $A617       go search for line # in temporary integer
                                from AX, carry always set
.,A640 18       CLC             clear found flag
.,A641 60       RTS             

                                *** perform NEW
.,A642 D0 FD    BNE $A641       exit if following byte to allow syntax error
.,A644 A9 00    LDA #$00        clear A
.,A646 A8       TAY             clear index
.,A647 91 2B    STA ($2B),Y     clear pointer to next line low byte
.,A649 C8       INY             increment index
.,A64A 91 2B    STA ($2B),Y     clear pointer to next line high byte, erase program
.,A64C A5 2B    LDA $2B         get start of memory low byte
.,A64E 18       CLC             clear carry for add
.,A64F 69 02    ADC #$02        add null program length
.,A651 85 2D    STA $2D         set start of variables low byte
.,A653 A5 2C    LDA $2C         get start of memory high byte
.,A655 69 00    ADC #$00        add carry
.,A657 85 2E    STA $2E         set start of variables high byte

                                *** reset execute pointer and do CLR
.,A659 20 8E A6 JSR $A68E       set BASIC execute pointer to start of memory - 1
.,A65C A9 00    LDA #$00        set Zb for CLR entry

                                *** perform CLR
.,A65E D0 2D    BNE $A68D       exit if following byte to allow syntax error
.,A660 20 E7 FF JSR $FFE7       close all channels and files
.,A663 A5 37    LDA $37         get end of memory low byte
.,A665 A4 38    LDY $38         get end of memory high byte
.,A667 85 33    STA $33         set bottom of string space low byte, clear strings
.,A669 84 34    STY $34         set bottom of string space high byte
.,A66B A5 2D    LDA $2D         get start of variables low byte
.,A66D A4 2E    LDY $2E         get start of variables high byte
.,A66F 85 2F    STA $2F         set end of variables low byte, clear variables
.,A671 84 30    STY $30         set end of variables high byte
.,A673 85 31    STA $31         set end of arrays low byte, clear arrays
.,A675 84 32    STY $32         set end of arrays high byte

                                *** do RESTORE and clear stack
.,A677 20 1D A8 JSR $A81D       perform RESTORE

                                *** flush BASIC stack and clear the continue pointer
.,A67A A2 19    LDX #$19        get the descriptor stack start
.,A67C 86 16    STX $16         set the descriptor stack pointer
.,A67E 68       PLA             pull the return address low byte
.,A67F A8       TAY             copy it
.,A680 68       PLA             pull the return address high byte
.,A681 A2 FA    LDX #$FA        set the cleared stack pointer
.,A683 9A       TXS             set the stack
.,A684 48       PHA             push the return address high byte
.,A685 98       TYA             restore the return address low byte
.,A686 48       PHA             push the return address low byte
.,A687 A9 00    LDA #$00        clear A
.,A689 85 3E    STA $3E         clear the continue pointer high byte
.,A68B 85 10    STA $10         clear the subscript/FNX flag
.,A68D 60       RTS             

                                *** set BASIC execute pointer to start of memory - 1
.,A68E 18       CLC             clear carry for add
.,A68F A5 2B    LDA $2B         get start of memory low byte
.,A691 69 FF    ADC #$FF        add -1 low byte
.,A693 85 7A    STA $7A         set BASIC execute pointer low byte
.,A695 A5 2C    LDA $2C         get start of memory high byte
.,A697 69 FF    ADC #$FF        add -1 high byte
.,A699 85 7B    STA $7B         save BASIC execute pointer high byte
.,A69B 60       RTS             

                                *** perform LIST
.,A69C 90 06    BCC $A6A4       branch if next character not token (LIST n...)
.,A69E F0 04    BEQ $A6A4       branch if next character [NULL] (LIST)
.,A6A0 C9 AB    CMP #$AB        compare with token for -
.,A6A2 D0 E9    BNE $A68D       exit if not - (LIST -m)
                                LIST [[n][-m]]
                                this bit sets the n , if present, as the start and end
.,A6A4 20 6B A9 JSR $A96B       get fixed-point number into temporary integer
.,A6A7 20 13 A6 JSR $A613       search BASIC for temporary integer line number
.,A6AA 20 79 00 JSR $0079       scan memory
.,A6AD F0 0C    BEQ $A6BB       branch if no more chrs
                                this bit checks the - is present
.,A6AF C9 AB    CMP #$AB        compare with token for -
.,A6B1 D0 8E    BNE $A641       return if not "-" (will be SN error)
                                LIST [n]-m
                                the - was there so set m as the end value
.,A6B3 20 73 00 JSR $0073       increment and scan memory
.,A6B6 20 6B A9 JSR $A96B       get fixed-point number into temporary integer
.,A6B9 D0 86    BNE $A641       exit if not ok
.,A6BB 68       PLA             dump return address low byte, exit via warm start
.,A6BC 68       PLA             dump return address high byte
.,A6BD A5 14    LDA $14         get temporary integer low byte
.,A6BF 05 15    ORA $15         OR temporary integer high byte
.,A6C1 D0 06    BNE $A6C9       branch if start set
.,A6C3 A9 FF    LDA #$FF        set for -1
.,A6C5 85 14    STA $14         set temporary integer low byte
.,A6C7 85 15    STA $15         set temporary integer high byte
.,A6C9 A0 01    LDY #$01        set index for line
.,A6CB 84 0F    STY $0F         clear open quote flag
.,A6CD B1 5F    LDA ($5F),Y     get next line pointer high byte
.,A6CF F0 43    BEQ $A714       if null all done so exit
.,A6D1 20 2C A8 JSR $A82C       do CRTL-C check vector
.,A6D4 20 D7 AA JSR $AAD7       print CR/LF
.,A6D7 C8       INY             increment index for line
.,A6D8 B1 5F    LDA ($5F),Y     get line number low byte
.,A6DA AA       TAX             copy to X
.,A6DB C8       INY             increment index
.,A6DC B1 5F    LDA ($5F),Y     get line number high byte
.,A6DE C5 15    CMP $15         compare with temporary integer high byte
.,A6E0 D0 04    BNE $A6E6       branch if no high byte match
.,A6E2 E4 14    CPX $14         compare with temporary integer low byte
.,A6E4 F0 02    BEQ $A6E8       branch if = last line to do, < will pass next branch
                                else
.,A6E6 B0 2C    BCS $A714       if greater all done so exit
.,A6E8 84 49    STY $49         save index for line
.,A6EA 20 CD BD JSR $BDCD       print XA as unsigned integer
.,A6ED A9 20    LDA #$20        space is the next character
.,A6EF A4 49    LDY $49         get index for line
.,A6F1 29 7F    AND #$7F        mask top out bit of character
.,A6F3 20 47 AB JSR $AB47       go print the character
.,A6F6 C9 22    CMP #$22        was it " character
.,A6F8 D0 06    BNE $A700       if not skip the quote handle
                                we are either entering or leaving a pair of quotes
.,A6FA A5 0F    LDA $0F         get open quote flag
.,A6FC 49 FF    EOR #$FF        toggle it
.,A6FE 85 0F    STA $0F         save it back
.,A700 C8       INY             increment index
.,A701 F0 11    BEQ $A714       line too long so just bail out and do a warm start
.,A703 B1 5F    LDA ($5F),Y     get next byte
.,A705 D0 10    BNE $A717       if not [EOL] (go print character)
                                was [EOL]
.,A707 A8       TAY             else clear index
.,A708 B1 5F    LDA ($5F),Y     get next line pointer low byte
.,A70A AA       TAX             copy to X
.,A70B C8       INY             increment index
.,A70C B1 5F    LDA ($5F),Y     get next line pointer high byte
.,A70E 86 5F    STX $5F         set pointer to line low byte
.,A710 85 60    STA $60         set pointer to line high byte
.,A712 D0 B5    BNE $A6C9       go do next line if not [EOT]
                                else ...
.,A714 4C 86 E3 JMP $E386       do warm start
.,A717 6C 06 03 JMP ($0306)     do uncrunch BASIC tokens

                                *** uncrunch BASIC tokens, the uncrunch BASIC tokens vector is initialised to point here
.,A71A 10 D7    BPL $A6F3       just go print it if not token byte
                                else was token byte so uncrunch it
.,A71C C9 FF    CMP #$FF        compare with the token for PI. in this case the token
                                is the same as the PI character so it just needs printing
.,A71E F0 D3    BEQ $A6F3       just print it if so
.,A720 24 0F    BIT $0F         test the open quote flag
.,A722 30 CF    BMI $A6F3       just go print character if open quote set
.,A724 38       SEC             else set carry for subtract
.,A725 E9 7F    SBC #$7F        reduce token range to 1 to whatever
.,A727 AA       TAX             copy token # to X
.,A728 84 49    STY $49         save index for line
.,A72A A0 FF    LDY #$FF        start from -1, adjust for pre increment
.,A72C CA       DEX             decrement token #
.,A72D F0 08    BEQ $A737       if now found go do printing
.,A72F C8       INY             else increment index
.,A730 B9 9E A0 LDA $A09E,Y     get byte from keyword table
.,A733 10 FA    BPL $A72F       loop until keyword end marker
.,A735 30 F5    BMI $A72C       go test if this is required keyword, branch always
                                found keyword, it's the next one
.,A737 C8       INY             increment keyword table index
.,A738 B9 9E A0 LDA $A09E,Y     get byte from table
.,A73B 30 B2    BMI $A6EF       go restore index, mask byte and print if
                                byte was end marker
.,A73D 20 47 AB JSR $AB47       else go print the character
.,A740 D0 F5    BNE $A737       go get next character, branch always

                                *** perform FOR
.,A742 A9 80    LDA #$80        set FNX
.,A744 85 10    STA $10         set subscript/FNX flag
.,A746 20 A5 A9 JSR $A9A5       perform LET
.,A749 20 8A A3 JSR $A38A       search the stack for FOR or GOSUB activity
.,A74C D0 05    BNE $A753       branch if FOR, this variable, not found
                                FOR, this variable, was found so first we dump the old one
.,A74E 8A       TXA             copy index
.,A74F 69 0F    ADC #$0F        add FOR structure size-2
.,A751 AA       TAX             copy to index
.,A752 9A       TXS             set stack (dump FOR structure (-2 bytes))
.,A753 68       PLA             pull return address
.,A754 68       PLA             pull return address
.,A755 A9 09    LDA #$09        we need 18d bytes !
.,A757 20 FB A3 JSR $A3FB       check room on stack for 2*A bytes
.,A75A 20 06 A9 JSR $A906       scan for next BASIC statement ([:] or [EOL])
.,A75D 18       CLC             clear carry for add
.,A75E 98       TYA             copy index to A
.,A75F 65 7A    ADC $7A         add BASIC execute pointer low byte
.,A761 48       PHA             push onto stack
.,A762 A5 7B    LDA $7B         get BASIC execute pointer high byte
.,A764 69 00    ADC #$00        add carry
.,A766 48       PHA             push onto stack
.,A767 A5 3A    LDA $3A         get current line number high byte
.,A769 48       PHA             push onto stack
.,A76A A5 39    LDA $39         get current line number low byte
.,A76C 48       PHA             push onto stack
.,A76D A9 A4    LDA #$A4        set "TO" token
.,A76F 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,A772 20 8D AD JSR $AD8D       check if source is numeric, else do type mismatch
.,A775 20 8A AD JSR $AD8A       evaluate expression and check is numeric, else do
                                type mismatch
.,A778 A5 66    LDA $66         get FAC1 sign (b7)
.,A77A 09 7F    ORA #$7F        set all non sign bits
.,A77C 25 62    AND $62         and FAC1 mantissa 1
.,A77E 85 62    STA $62         save FAC1 mantissa 1
.,A780 A9 8B    LDA #$8B        set return address low byte
.,A782 A0 A7    LDY #$A7        set return address high byte
.,A784 85 22    STA $22         save return address low byte
.,A786 84 23    STY $23         save return address high byte
.,A788 4C 43 AE JMP $AE43       round FAC1 and put on stack, returns to next instruction
.,A78B A9 BC    LDA #$BC        set 1 pointer low address, default step size
.,A78D A0 B9    LDY #$B9        set 1 pointer high address
.,A78F 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,A792 20 79 00 JSR $0079       scan memory
.,A795 C9 A9    CMP #$A9        compare with STEP token
.,A797 D0 06    BNE $A79F       if not "STEP" continue
                                was step so ....
.,A799 20 73 00 JSR $0073       increment and scan memory
.,A79C 20 8A AD JSR $AD8A       evaluate expression and check is numeric, else do
                                type mismatch
.,A79F 20 2B BC JSR $BC2B       get FAC1 sign, return A = $FF -ve, A = $01 +ve
.,A7A2 20 38 AE JSR $AE38       push sign, round FAC1 and put on stack
.,A7A5 A5 4A    LDA $4A         get FOR/NEXT variable pointer high byte
.,A7A7 48       PHA             push on stack
.,A7A8 A5 49    LDA $49         get FOR/NEXT variable pointer low byte
.,A7AA 48       PHA             push on stack
.,A7AB A9 81    LDA #$81        get FOR token
.,A7AD 48       PHA             push on stack

                                *** interpreter inner loop
.,A7AE 20 2C A8 JSR $A82C       do CRTL-C check vector
.,A7B1 A5 7A    LDA $7A         get the BASIC execute pointer low byte
.,A7B3 A4 7B    LDY $7B         get the BASIC execute pointer high byte
.,A7B5 C0 02    CPY #$02        compare the high byte with $02xx
.,A7B7 EA       NOP             unused byte
.,A7B8 F0 04    BEQ $A7BE       if immediate mode skip the continue pointer save
.,A7BA 85 3D    STA $3D         save the continue pointer low byte
.,A7BC 84 3E    STY $3E         save the continue pointer high byte
.,A7BE A0 00    LDY #$00        clear the index
.,A7C0 B1 7A    LDA ($7A),Y     get a BASIC byte
.,A7C2 D0 43    BNE $A807       if not [EOL] go test for ":"
.,A7C4 A0 02    LDY #$02        else set the index
.,A7C6 B1 7A    LDA ($7A),Y     get next line pointer high byte
.,A7C8 18       CLC             clear carry for no "BREAK" message
.,A7C9 D0 03    BNE $A7CE       branch if not end of program
.,A7CB 4C 4B A8 JMP $A84B       else go to immediate mode,was immediate or [EOT] marker
.,A7CE C8       INY             increment index
.,A7CF B1 7A    LDA ($7A),Y     get line number low byte
.,A7D1 85 39    STA $39         save current line number low byte
.,A7D3 C8       INY             increment index
.,A7D4 B1 7A    LDA ($7A),Y     get line # high byte
.,A7D6 85 3A    STA $3A         save current line number high byte
.,A7D8 98       TYA             A now = 4
.,A7D9 65 7A    ADC $7A         add BASIC execute pointer low byte, now points to code
.,A7DB 85 7A    STA $7A         save BASIC execute pointer low byte
.,A7DD 90 02    BCC $A7E1       branch if no overflow
.,A7DF E6 7B    INC $7B         else increment BASIC execute pointer high byte
.,A7E1 6C 08 03 JMP ($0308)     do start new BASIC code

                                *** start new BASIC code, the start new BASIC code vector is initialised to point here
.,A7E4 20 73 00 JSR $0073       increment and scan memory
.,A7E7 20 ED A7 JSR $A7ED       go interpret BASIC code from BASIC execute pointer
.,A7EA 4C AE A7 JMP $A7AE       loop

                                *** go interpret BASIC code from BASIC execute pointer
.,A7ED F0 3C    BEQ $A82B       if the first byte is null just exit
.,A7EF E9 80    SBC #$80        normalise the token
.,A7F1 90 11    BCC $A804       if wasn't token go do LET
.,A7F3 C9 23    CMP #$23        compare with token for TAB(-$80
.,A7F5 B0 17    BCS $A80E       branch if >= TAB(
.,A7F7 0A       ASL             *2 bytes per vector
.,A7F8 A8       TAY             copy to index
.,A7F9 B9 0D A0 LDA $A00D,Y     get vector high byte
.,A7FC 48       PHA             push on stack
.,A7FD B9 0C A0 LDA $A00C,Y     get vector low byte
.,A800 48       PHA             push on stack
.,A801 4C 73 00 JMP $0073       increment and scan memory and return. the return in
                                this case calls the command code, the return from
                                that will eventually return to the interpreter inner
                                loop above
.,A804 4C A5 A9 JMP $A9A5       perform LET
                                was not [EOL]
.,A807 C9 3A    CMP #$3A        comapre with ":"
.,A809 F0 D6    BEQ $A7E1       if ":" go execute new code
                                else ...
.,A80B 4C 08 AF JMP $AF08       do syntax error then warm start
                                token was >= TAB(
.,A80E C9 4B    CMP #$4B        compare with the token for GO
.,A810 D0 F9    BNE $A80B       if not "GO" do syntax error then warm start
                                else was "GO"
.,A812 20 73 00 JSR $0073       increment and scan memory
.,A815 A9 A4    LDA #$A4        set "TO" token
.,A817 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,A81A 4C A0 A8 JMP $A8A0       perform GOTO

                                *** perform RESTORE
.,A81D 38       SEC             set carry for subtract
.,A81E A5 2B    LDA $2B         get start of memory low byte
.,A820 E9 01    SBC #$01        -1
.,A822 A4 2C    LDY $2C         get start of memory high byte
.,A824 B0 01    BCS $A827branch if no rollunder
.,A826 88       DEY             else decrement high byte
.,A827 85 41    STA $41         set DATA pointer low byte
.,A829 84 42    STY $42         set DATA pointer high byte
.,A82B 60       RTS             

                                *** do CRTL-C check vector
.,A82C 20 E1 FF JSR $FFE1       scan stop key

                                *** perform STOP
.,A82F B0 01    BCS $A832       if carry set do BREAK instead of just END

                                *** perform END
.,A831 18       CLC             clear carry
.,A832 D0 3C    BNE $A870       return if wasn't CTRL-C
.,A834 A5 7A    LDA $7A         get BASIC execute pointer low byte
.,A836 A4 7B    LDY $7B         get BASIC execute pointer high byte
.,A838 A6 3A    LDX $3A         get current line number high byte
.,A83A E8       INX             increment it
.,A83B F0 0C    BEQ $A849       branch if was immediate mode
.,A83D 85 3D    STA $3D         save continue pointer low byte
.,A83F 84 3E    STY $3E         save continue pointer high byte
.,A841 A5 39    LDA $39         get current line number low byte
.,A843 A4 3A    LDY $3A         get current line number high byte
.,A845 85 3B    STA $3B         save break line number low byte
.,A847 84 3C    STY $3C         save break line number high byte
.,A849 68       PLA             dump return address low byte
.,A84A 68       PLA             dump return address high byte
.,A84B A9 81    LDA #$81        set [CR][LF]"BREAK" pointer low byte
.,A84D A0 A3    LDY #$A3        set [CR][LF]"BREAK" pointer high byte
.,A84F 90 03    BCC $A854       if was program end skip the print string
.,A851 4C 69 A4 JMP $A469       print string and do warm start
.,A854 4C 86 E3 JMP $E386       do warm start

                                *** perform CONT
.,A857 D0 17    BNE $A870       exit if following byte to allow syntax error
.,A859 A2 1A    LDX #$1A        error code $1A, can't continue error
.,A85B A4 3E    LDY $3E         get continue pointer high byte
.,A85D D0 03    BNE $A862       go do continue if we can
.,A85F 4C 37 A4 JMP $A437       else do error #X then warm start
                                we can continue so ...
.,A862 A5 3D    LDA $3D         get continue pointer low byte
.,A864 85 7A    STA $7A         save BASIC execute pointer low byte
.,A866 84 7B    STY $7B         save BASIC execute pointer high byte
.,A868 A5 3B    LDA $3B         get break line low byte
.,A86A A4 3C    LDY $3C         get break line high byte
.,A86C 85 39    STA $39         set current line number low byte
.,A86E 84 3A    STY $3A         set current line number high byte
.,A870 60       RTS             

                                *** perform RUN
.,A871 08       PHP             save status
.,A872 A9 00    LDA #$00        no control or kernal messages
.,A874 20 90 FF JSR $FF90       control kernal messages
.,A877 28       PLP             restore status
.,A878 D0 03    BNE $A87D       branch if RUN n
.,A87A 4C 59 A6 JMP $A659       reset execution to start, clear variables, flush stack
                                and return
.,A87D 20 60 A6 JSR $A660       go do "CLEAR"
.,A880 4C 97 A8 JMP $A897       get n and do GOTO n

                                *** perform GOSUB
.,A883 A9 03    LDA #$03        need 6 bytes for GOSUB
.,A885 20 FB A3 JSR $A3FB       check room on stack for 2*A bytes
.,A888 A5 7B    LDA $7B         get BASIC execute pointer high byte
.,A88A 48       PHA             save it
.,A88B A5 7A    LDA $7A         get BASIC execute pointer low byte
.,A88D 48       PHA             save it
.,A88E A5 3A    LDA $3A         get current line number high byte
.,A890 48       PHA             save it
.,A891 A5 39    LDA $39         get current line number low byte
.,A893 48       PHA             save it
.,A894 A9 8D    LDA #$8D        token for GOSUB
.,A896 48       PHA             save it
.,A897 20 79 00 JSR $0079       scan memory
.,A89A 20 A0 A8 JSR $A8A0       perform GOTO
.,A89D 4C AE A7 JMP $A7AE       go do interpreter inner loop

                                *** perform GOTO
.,A8A0 20 6B A9 JSR $A96B       get fixed-point number into temporary integer
.,A8A3 20 09 A9 JSR $A909       scan for next BASIC line
.,A8A6 38       SEC             set carry for subtract
.,A8A7 A5 39    LDA $39         get current line number low byte
.,A8A9 E5 14    SBC $14         subtract temporary integer low byte
.,A8AB A5 3A    LDA $3A         get current line number high byte
.,A8AD E5 15    SBC $15         subtract temporary integer high byte
.,A8AF B0 0B    BCS $A8BC       if current line number >= temporary integer, go search
                                from the start of memory
.,A8B1 98       TYA             else copy line index to A
.,A8B2 38       SEC             set carry (+1)
.,A8B3 65 7A    ADC $7A         add BASIC execute pointer low byte
.,A8B5 A6 7B    LDX $7B         get BASIC execute pointer high byte
.,A8B7 90 07    BCC $A8C0       branch if no overflow to high byte
.,A8B9 E8       INX             increment high byte
.,A8BA B0 04    BCS $A8C0       branch always (can never be carry)

                                *** search for line number in temporary integer from start of memory pointer
.,A8BC A5 2B    LDA $2B         get start of memory low byte
.,A8BE A6 2C    LDX $2Cget start of memory high byte

                                *** search for line # in temporary integer from (AX)
.,A8C0 20 17 A6 JSR $A617       search Basic for temp integer line number from AX
.,A8C3 90 1E    BCC $A8E3       if carry clear go do unsdefined statement error
                                carry all ready set for subtract
.,A8C5 A5 5F    LDA $5F         get pointer low byte
.,A8C7 E9 01    SBC #$01        -1
.,A8C9 85 7A    STA $7A         save BASIC execute pointer low byte
.,A8CB A5 60    LDA $60         get pointer high byte
.,A8CD E9 00    SBC #$00        subtract carry
.,A8CF 85 7B    STA $7B         save BASIC execute pointer high byte
.,A8D1 60       RTS             

                                *** perform RETURN
.,A8D2 D0 FD    BNE $A8D1       exit if following token to allow syntax error
.,A8D4 A9 FF    LDA #$FF        set byte so no match possible
.,A8D6 85 4A    STA $4A         save FOR/NEXT variable pointer high byte
.,A8D8 20 8A A3 JSR $A38A       search the stack for FOR or GOSUB activity,
                                get token off stack
.,A8DB 9A       TXScorrect the stack
.,A8DC C9 8D    CMP #$8D        compare with GOSUB token
.,A8DE F0 0B    BEQ $A8EB       if matching GOSUB go continue RETURN
.,A8E0 A2 0C    LDX #$0C        else error code $04, return without gosub error
.:A8E2 2C       .BYTE $2C       makes next line BIT $11A2
.,A8E3 A2 11    LDX #$02        error code $11, undefined statement error
.,A8E5 4C 37 A4 JMP $A437       do error #X then warm start
.,A8E8 4C 08 AF JMP $AF08       do syntax error then warm start
                                was matching GOSUB token
.,A8EB 68       PLA             dump token byte
.,A8EC 68       PLA             pull return line low byte
.,A8ED 85 39    STA $39         save current line number low byte
.,A8EF 68       PLA             pull return line high byte
.,A8F0 85 3A    STA $3A         save current line number high byte
.,A8F2 68       PLA             pull return address low byte
.,A8F3 85 7A    STA $7A         save BASIC execute pointer low byte
.,A8F5 68       PLA             pull return address high byte
.,A8F6 85 7B    STA $7B         save BASIC execute pointer high byte

                                *** perform DATA
.,A8F8 20 06 A9 JSR $A906       scan for next BASIC statement ([:] or [EOL])

                                *** add Y to the BASIC execute pointer
.,A8FB 98       TYA             copy index to A
.,A8FC 18       CLC             clear carry for add
.,A8FD 65 7A    ADC $7A         add BASIC execute pointer low byte
.,A8FF 85 7A    STA $7A         save BASIC execute pointer low byte
.,A901 90 02    BCC $A905       skip increment if no carry
.,A903 E6 7B    INC $7B         else increment BASIC execute pointer high byte
.,A905 60       RTS             

                                *** scan for next BASIC statement ([:] or [EOL])
                                returns Y as index to [:] or [EOL]
.,A906 A2 3A    LDX #$3A        set look for character = ":"
.:A908 2C       .BYTE $2C       makes next line BIT $00A2

                                *** scan for next BASIC line
                                returns Y as index to [EOL]
.,A909 A2 00    LDX #$00        set alternate search character = [EOL]
.,A90B 86 07    STX $07         store alternate search character
.,A90D A0 00    LDY #$00        set search character = [EOL]
.,A90F 84 08    STY $08         save the search character
.,A911 A5 08    LDA $08         get search character
.,A913 A6 07    LDX $07         get alternate search character
.,A915 85 07    STA $07         make search character = alternate search character
.,A917 86 08    STX $08         make alternate search character = search character
.,A919 B1 7A    LDA ($7A),Y     get BASIC byte
.,A91B F0 E8    BEQ $A905       exit if null [EOL]
.,A91D C5 08    CMP $08         compare with search character
.,A91F F0 E4    BEQ $A905       exit if found
.,A921 C8       INY             else increment index
.,A922 C9 22    CMP #$22        compare current character with open quote
.,A924 D0 F3    BNE $A919       if found go swap search character for alternate search
                                character
.,A926 F0 E9    BEQ $A911       loop for next character, branch always

                                *** perform IF
.,A928 20 9E AD JSR $AD9E       evaluate expression
.,A92B 20 79 00 JSR $0079       scan memory
.,A92E C9 89    CMP #$89        compare with "GOTO" token
.,A930 F0 05    BEQ $A937       if it was  the token for GOTO go do IF ... GOTO
                                wasn't IF ... GOTO so must be IF ... THEN
.,A932 A9 A7    LDA #$A7        set "THEN" token
.,A934 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,A937 A5 61    LDA $61         get FAC1 exponent
.,A939 D0 05    BNE $A940       if result was non zero continue execution
                                else REM rest of line

                                *** perform REM
.,A93B 20 09 A9 JSR $A909       scan for next BASIC line
.,A93E F0 BB    BEQ $A8FB       add Y to the BASIC execute pointer and return, branch
                                always
                                result was non zero so do rest of line
.,A940 20 79 00 JSR $0079       scan memory
.,A943 B0 03    BCS $A948       branch if not numeric character, is variable or keyword
.,A945 4C A0 A8 JMP $A8A0       else perform GOTO n
                                is variable or keyword
.,A948 4C ED A7 JMP $A7ED       interpret BASIC code from BASIC execute pointer

                                *** perform ON
.,A94B 20 9E B7 JSR $B79E       get byte parameter
.,A94E 48       PHA             push next character
.,A94F C9 8D    CMP #$8D        compare with GOSUB token
.,A951 F0 04    BEQ $A957       if GOSUB go see if it should be executed
.,A953 C9 89    CMP #$89        compare with GOTO token
.,A955 D0 91    BNE $A8E8       if not GOTO do syntax error then warm start
                                next character was GOTO or GOSUB, see if it should be executed
.,A957 C6 65    DEC $65         decrement the byte value
.,A959 D0 04    BNE $A95F       if not zero go see if another line number exists
.,A95B 68       PLA             pull keyword token
.,A95C 4C EF A7 JMP $A7EF       go execute it
.,A95F 20 73 00 JSR $0073       increment and scan memory
.,A962 20 6B A9 JSR $A96B       get fixed-point number into temporary integer
                                skip this n
.,A965 C9 2C    CMP #$2C        compare next character with ","
.,A967 F0 EE    BEQ $A957       loop if ","
.,A969 68       PLA             else pull keyword token, ran out of options
.,A96A 60       RTS             

                                *** get fixed-point number into temporary integer
.,A96B A2 00    LDX #$00        clear X
.,A96D 86 14    STX $14         clear temporary integer low byte
.,A96F 86 15    STX $15         clear temporary integer high byte
.,A971 B0 F7    BCS $A96A       return if carry set, end of scan, character was not 0-9
.,A973 E9 2F    SBC #$2F        subtract $30, $2F+carry, from byte
.,A975 85 07    STA $07         store #
.,A977 A5 15    LDA $15         get temporary integer high byte
.,A979 85 22    STA $22         save it for now
.,A97B C9 19    CMP #$19        compare with $19
.,A97D B0 D4    BCS $A953       branch if >= this makes the maximum line number 63999
                                because the next bit does $1900 * $0A = $FA00 = 64000
                                decimal. the branch target is really the SYNTAX error
                                at $A8E8 but that is too far so an intermediate
                                compare and branch to that location is used. the problem
                                with this is that line number that gives a partial result
                                from $8900 to $89FF, 35072x to 35327x, will pass the new
                                target compare and will try to execute the remainder of
                                the ON n GOTO/GOSUB. a solution to this is to copy the
                                byte in A before the branch to X and then branch to
                                $A955 skipping the second compare
.,A97F A5 14    LDA $14         get temporary integer low byte
.,A981 0A       ASL             *2 low byte
.,A982 26 22    ROL $22         *2 high byte
.,A984 0A       ASL             *2 low byte
.,A985 26 22    ROL $22         *2 high byte (*4)
.,A987 65 14    ADC $14         + low byte (*5)
.,A989 85 14    STA $14         save it
.,A98B A5 22    LDA $22         get high byte temp
.,A98D 65 15    ADC $15         + high byte (*5)
.,A98F 85 15    STA $15         save it
.,A991 06 14    ASL $14         *2 low byte (*10d)
.,A993 26 15    ROL $15         *2 high byte (*10d)
.,A995 A5 14    LDA $14         get low byte
.,A997 65 07    ADC $07         add #
.,A999 85 14    STA $14         save low byte
.,A99B 90 02    BCC $A99F       branch if no overflow to high byte
.,A99D E6 15    INC $15         else increment high byte
.,A99F 20 73 00 JSR $0073       increment and scan memory
.,A9A2 4C 71 A9 JMP $A971       loop for next character

                                *** perform LET
.,A9A5 20 8B B0 JSR $B08B       get variable address
.,A9A8 85 49    STA $49         save variable address low byte
.,A9AA 84 4A    STY $4A         save variable address high byte
.,A9AC A9 B2    LDA #$B2        $B2 is "=" token
.,A9AE 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,A9B1 A5 0E    LDA $0E         get data type flag, $80 = integer, $00 = float
.,A9B3 48       PHA             push data type flag
.,A9B4 A5 0D    LDA $0D         get data type flag, $FF = string, $00 = numeric
.,A9B6 48       PHA             push data type flag
.,A9B7 20 9E AD JSR $AD9E       evaluate expression
.,A9BA 68       PLA             pop data type flag
.,A9BB 2A       ROL             string bit into carry
.,A9BC 20 90 AD JSR $AD90       do type match check
.,A9BF D0 18    BNE $A9D9       branch if string
.,A9C1 68       PLA             pop integer/float data type flag
                                assign value to numeric variable
.,A9C2 10 12    BPL $A9D6       branch if float
                                expression is numeric integer
.,A9C4 20 1B BC JSR $BC1B       round FAC1
.,A9C7 20 BF B1 JSR $B1BF       evaluate integer expression, no sign check
.,A9CA A0 00    LDY #$00        clear index
.,A9CC A5 64    LDA $64         get FAC1 mantissa 3
.,A9CE 91 49    STA ($49),Y     save as integer variable low byte
.,A9D0 C8       INY             increment index
.,A9D1 A5 65    LDA $65         get FAC1 mantissa 4
.,A9D3 91 49    STA ($49),Y     save as integer variable high byte
.,A9D5 60       RTS             
.,A9D6 4C D0 BB JMP $BBD0       pack FAC1 into variable pointer and return
                                assign value to numeric variable
.,A9D9 68       PLA             dump integer/float data type flag
.,A9DA A4 4A    LDY $4A         get variable pointer high byte
.,A9DC C0 BF    CPY #$BF        was it TI$ pointer
.,A9DE D0 4C    BNE $AA2C       branch if not
                                else it's TI$ = <expr$>
.,A9E0 20 A6 B6 JSR $B6A6       pop string off descriptor stack, or from top of string
                                space returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,A9E3 C9 06    CMP #$06        compare length with 6
.,A9E5 D0 3D    BNE $AA24       if length not 6 do illegal quantity error then warm start
.,A9E7 A0 00    LDY #$00        clear index
.,A9E9 84 61    STY $61         clear FAC1 exponent
.,A9EB 84 66    STY $66         clear FAC1 sign (b7)
.,A9ED 84 71    STY $71         save index
.,A9EF 20 1D AA JSR $AA1D       check and evaluate numeric digit
.,A9F2 20 E2 BA JSR $BAE2       multiply FAC1 by 10
.,A9F5 E6 71    INC $71         increment index
.,A9F7 A4 71    LDY $71         restore index
.,A9F9 20 1D AA JSR $AA1D       check and evaluate numeric digit
.,A9FC 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,A9FF AA       TAX             copy FAC1 exponent
.,AA00 F0 05    BEQ $AA07       branch if FAC1 zero
.,AA02 E8       INX             increment index, * 2
.,AA03 8A       TXA             copy back to A
.,AA04 20 ED BA JSR $BAED       FAC1 = (FAC1 + (FAC2 * 2)) * 2 = FAC1 * 6
.,AA07 A4 71    LDY $71         get index
.,AA09 C8       INY             increment index
.,AA0A C0 06    CPY #$06        compare index with 6
.,AA0C D0 DF    BNE $A9ED       loop if not 6
.,AA0E 20 E2 BA JSR $BAE2       multiply FAC1 by 10
.,AA11 20 9B BC JSR $BC9B       convert FAC1 floating to fixed
.,AA14 A6 64    LDX $64         get FAC1 mantissa 3
.,AA16 A4 63    LDY $63         get FAC1 mantissa 2
.,AA18 A5 65    LDA $65         get FAC1 mantissa 4
.,AA1A 4C DB FF JMP $FFDB       set real time clock and return

                                *** check and evaluate numeric digit
.,AA1D B1 22    LDA ($22),Y     get byte from string
.,AA1F 20 80 00 JSR $0080       clear Cb if numeric. this call should be to $84
                                as the code from $80 first comapres the byte with
                                [SPACE] and does a BASIC increment and get if it is
.,AA22 90 03    BCC $AA27       branch if numeric
.,AA24 4C 48 B2 JMP $B248       do illegal quantity error then warm start
.,AA27 E9 2F    SBC #$2F        subtract $2F + carry to convert ASCII to binary
.,AA29 4C 7E BD JMP $BD7E       evaluate new ASCII digit and return

                                *** assign value to numeric variable, but not TI$
.,AA2C A0 02    LDY #$02        index to string pointer high byte
.,AA2E B1 64    LDA ($64),Y     get string pointer high byte
.,AA30 C5 34    CMP $34         compare with bottom of string space high byte
.,AA32 90 17    BCC $AA4B       branch if string pointer high byte is less than bottom
                                of string space high byte
.,AA34 D0 07    BNE $AA3D       branch if string pointer high byte is greater than
                                bottom of string space high byte
                                else high bytes were equal
.,AA36 88       DEY             decrement index to string pointer low byte
.,AA37 B1 64    LDA ($64),Y     get string pointer low byte
.,AA39 C5 33    CMP $33         compare with bottom of string space low byte
.,AA3B 90 0E    BCC $AA4B       branch if string pointer low byte is less than bottom
                                of string space low byte
.,AA3D A4 65    LDY $65         get descriptor pointer high byte
.,AA3F C4 2E    CPY $2E         compare with start of variables high byte
.,AA41 90 08    BCC $AA4B       branch if less, is on string stack
.,AA43 D0 0D    BNE $AA52       if greater make space and copy string
                                else high bytes were equal
.,AA45 A5 64    LDA $64         get descriptor pointer low byte
.,AA47 C5 2D    CMP $2D         compare with start of variables low byte
.,AA49 B0 07    BCS $AA52       if greater or equal make space and copy string
.,AA4B A5 64    LDA $64         get descriptor pointer low byte
.,AA4D A4 65    LDY $65         get descriptor pointer high byte
.,AA4F 4C 68 AA JMP $AA68       go copy descriptor to variable
.,AA52 A0 00    LDY #$00        clear index
.,AA54 B1 64    LDA ($64),Y     get string length
.,AA56 20 75 B4 JSR $B475       copy descriptor pointer and make string space A bytes long
.,AA59 A5 50    LDA $50         copy old descriptor pointer low byte
.,AA5B A4 51    LDY $51         copy old descriptor pointer high byte
.,AA5D 85 6F    STA $6F         save old descriptor pointer low byte
.,AA5F 84 70    STY $70         save old descriptor pointer high byte
.,AA61 20 7A B6 JSR $B67A       copy string from descriptor to utility pointer
.,AA64 A9 61    LDA #$61        get descriptor pointer low byte
.,AA66 A0 00    LDY #$00        get descriptor pointer high byte
.,AA68 85 50    STA $50         save descriptor pointer low byte
.,AA6A 84 51    STY $51         save descriptor pointer high byte
.,AA6C 20 DB B6 JSR $B6DB       clean descriptor stack, YA = pointer
.,AA6F A0 00    LDY #$00        clear index
.,AA71 B1 50    LDA ($50),Y     get string length from new descriptor
.,AA73 91 49    STA ($49),Y     copy string length to variable
.,AA75 C8       INY             increment index
.,AA76 B1 50    LDA ($50),Y     get string pointer low byte from new descriptor
.,AA78 91 49    STA ($49),Y     copy string pointer low byte to variable
.,AA7A C8       INY             increment index
.,AA7B B1 50    LDA ($50),Y     get string pointer high byte from new descriptor
.,AA7D 91 49    STA ($49),Y     copy string pointer high byte to variable
.,AA7F 60       RTS             

                                *** perform PRINT#
.,AA80 20 86 AA JSR $AA86       perform CMD
.,AA83 4C B5 AB JMP $ABB5       close input and output channels and return

                                *** perform CMD
.,AA86 20 9E B7 JSR $B79E       get byte parameter
.,AA89 F0 05    BEQ $AA90       branch if following byte is ":" or [EOT]
.,AA8B A9 2C    LDA #$2C        set ","
.,AA8D 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,AA90 08       PHP             save status
.,AA91 86 13    STX $13         set current I/O channel
.,AA93 20 18 E1 JSR $E118       open channel for output with error check
.,AA96 28       PLP             restore status
.,AA97 4C A0 AA JMP $AAA0       perform PRINT
.,AA9A 20 21 AB JSR $AB21       print string from utility pointer
.,AA9D 20 79 00 JSR $0079       scan memory

                                *** perform PRINT
.,AAA0 F0 35    BEQ $AAD7       if nothing following just print CR/LF
.,AAA2 F0 43    BEQ $AAE7       exit if nothing following, end of PRINT branch
.,AAA4 C9 A3    CMP #$A3        compare with token for TAB(
.,AAA6 F0 50    BEQ $AAF8       if TAB( go handle it
.,AAA8 C9 A6    CMP #$A6        compare with token for SPC(
.,AAAA 18       CLC             flag SPC(
.,AAAB F0 4B    BEQ $AAF8       if SPC( go handle it
.,AAAD C9 2C    CMP #$2C        compare with ","
.,AAAF F0 37    BEQ $AAE8       if "," go skip to the next TAB position
.,AAB1 C9 3B    CMP #$3B        compare with ";"
.,AAB3 F0 5E    BEQ $AB13       if ";" go continue the print loop
.,AAB5 20 9E AD JSR $AD9E       evaluate expression
.,AAB8 24 0D    BIT $0D         test data type flag, $FF = string, $00 = numeric
.,AABA 30 DE    BMI $AA9A       if string go print string, scan memory and continue PRINT
.,AABC 20 DD BD JSR $BDDD       convert FAC1 to ASCII string result in (AY)
.,AABF 20 87 B4 JSR $B487       print " terminated string to utility pointer
.,AAC2 20 21 AB JSR $AB21       print string from utility pointer
.,AAC5 20 3B AB JSR $AB3B       print [SPACE] or [CURSOR RIGHT]
.,AAC8 D0 D3    BNE $AA9D       go scan memory and continue PRINT, branch always

                                *** set XY to $0200 - 1 and print [CR]
.,AACA A9 00    LDA #$00        clear A
.,AACC 9D 00 02 STA $0200,X     clear first byte of input buffer
.,AACF A2 FF    LDX #$FF        $0200 - 1 low byte
.,AAD1 A0 01    LDY #$01        $0200 - 1 high byte
.,AAD3 A5 13    LDA $13         get current I/O channel
.,AAD5 D0 10    BNE $AAE7       exit if not default channel

                                *** print CR/LF
.,AAD7 A9 0D    LDA #$0D        set [CR]
.,AAD9 20 47 AB JSR $AB47       print the character
.,AADC 24 13    BIT $13         test current I/O channel
.,AADE 10 05    BPL $AAE5       if ?? toggle A, EOR #$FF and return
.,AAE0 A9 0A    LDA #$0A        set [LF]
.,AAE2 20 47 AB JSR $AB47       print the character
                                toggle A
.,AAE5 49 FF    EOR #$FF        invert A
.,AAE7 60       RTS             
                                was ","
.,AAE8 38       SEC             set Cb for read cursor position
.,AAE9 20 F0 FF JSR $FFF0       read/set X,Y cursor position
.,AAEC 98       TYA             copy cursor Y
.,AAED 38       SEC             set carry for subtract
.,AAEE E9 0A    SBC #$0A        subtract one TAB length
.,AAF0 B0 FC    BCS $AAEE       loop if result was +ve
.,AAF2 49 FF    EOR #$FF        complement it
.,AAF4 69 01    ADC #$01        +1, twos complement
.,AAF6 D0 16    BNE $AB0E       always print A spaces, result is never $00
.,AAF8 08       PHP             save TAB( or SPC( status
.,AAF9 38       SEC             set Cb for read cursor position
.,AAFA 20 F0 FF JSR $FFF0       read/set X,Y cursor position
.,AAFD 84 09    STY $09         save current cursor position
.,AAFF 20 9B B7 JSR $B79B       scan and get byte parameter
.,AB02 C9 29    CMP #$29        compare with ")"
.,AB04 D0 59    BNE $AB5F       if not ")" do syntax error
.,AB06 28       PLP             restore TAB( or SPC( status
.,AB07 90 06    BCC $AB0F       branch if was SPC(
                                else was TAB(
.,AB09 8A       TXA             copy TAB() byte to A
.,AB0A E5 09    SBC $09         subtract current cursor position
.,AB0C 90 05    BCC $AB13       go loop for next if already past requited position
.,AB0E AA       TAX             copy [SPACE] count to X
.,AB0F E8       INX             increment count
.,AB10 CA       DEX             decrement count
.,AB11 D0 06    BNE $AB19       branch if count was not zero
                                was ";" or [SPACES] printed
.,AB13 20 73 00 JSR $0073       increment and scan memory
.,AB16 4C A2 AA JMP $AAA2       continue print loop
.,AB19 20 3B AB JSR $AB3B       print [SPACE] or [CURSOR RIGHT]
.,AB1C D0 F2    BNE $AB10       loop, branch always

                                *** print null terminated string
.,AB1E 20 87 B4 JSR $B487       print " terminated string to utility pointer

                                *** print string from utility pointer
.,AB21 20 A6 B6 JSR $B6A6       pop string off descriptor stack, or from top of string
                                space returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,AB24 AA       TAX             copy length
.,AB25 A0 00    LDY #$00        clear index
.,AB27 E8       INX             increment length, for pre decrement loop
.,AB28 CA       DEX             decrement length
.,AB29 F0 BC    BEQ $AAE7       exit if done
.,AB2B B1 22    LDA ($22),Y     get byte from string
.,AB2D 20 47 AB JSR $AB47       print the character
.,AB30 C8       INY             increment index
.,AB31 C9 0D    CMP #$0D        compare byte with [CR]
.,AB33 D0 F3    BNE $AB28       loop if not [CR]
.,AB35 20 E5 AA JSR $AAE5       toggle A, EOR #$FF. what is the point of this ??
.,AB38 4C 28 AB JMP $AB28       loop

                                *** print [SPACE] or [CURSOR RIGHT]
.,AB3B A5 13    LDA $13         get current I/O channel
.,AB3D F0 03    BEQ $AB42       if default channel go output [CURSOR RIGHT]
.,AB3F A9 20    LDA #$20        else output [SPACE]
.:AB41 2C       .BYTE $2C       makes next line BIT $1DA9
.,AB42 A9 1D    LDA #$1D        set [CURSOR RIGHT]
.:AB44 2C       .BYTE $2C       makes next line BIT $3FA9

                                *** print "?"
.,AB45 A9 3F    LDA #$3F        set "?"

                                *** print character
.,AB47 20 0C E1 JSR $E10C       output character to channel with error check
.,AB4A 29 FF    AND #$FF        set the flags on A
.,AB4C 60       RTS             

                                *** bad input routine
.,AB4D A5 11    LDA $11         get INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
.,AB4F F0 11    BEQ $AB62       branch if INPUT
.,AB51 30 04    BMI $AB57       branch if READ
                                else was GET
.,AB53 A0 FF    LDY #$FF        set current line high byte to -1, indicate immediate mode
.,AB55 D0 04    BNE $AB5B       branch always
.,AB57 A5 3F    LDA $3F         get current DATA line number low byte
.,AB59 A4 40    LDY $40         get current DATA line number high byte
.,AB5B 85 39    STA $39         set current line number low byte
.,AB5D 84 3A    STY $3A         set current line number high byte
.,AB5F 4C 08 AF JMP $AF08       do syntax error then warm start
                                was INPUT
.,AB62 A5 13    LDA $13         get current I/O channel
.,AB64 F0 05    BEQ $AB6B       branch if default channel
.,AB66 A2 18    LDX #$18        else error $18, file data error
.,AB68 4C 37 A4 JMP $A437       do error #X then warm start
.,AB6B A9 0C    LDA #$0C        set "?REDO FROM START" pointer low byte
.,AB6D A0 AD    LDY #$AD        set "?REDO FROM START" pointer high byte
.,AB6F 20 1E AB JSR $AB1E       print null terminated string
.,AB72 A5 3D    LDA $3D         get continue pointer low byte
.,AB74 A4 3E    LDY $3E         get continue pointer high byte
.,AB76 85 7A    STA $7A         save BASIC execute pointer low byte
.,AB78 84 7B    STY $7B         save BASIC execute pointer high byte
.,AB7A 60       RTS             

                                *** perform GET
.,AB7B 20 A6 B3 JSR $B3A6       check not Direct, back here if ok
.,AB7E C9 23    CMP #$23        compare with "#"
.,AB80 D0 10    BNE $AB92       branch if not GET#
.,AB82 20 73 00 JSR $0073       increment and scan memory
.,AB85 20 9E B7 JSR $B79E       get byte parameter
.,AB88 A9 2C    LDA #$2C        set ","
.,AB8A 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,AB8D 86 13    STX $13         set current I/O channel
.,AB8F 20 1E E1 JSR $E11E       open channel for input with error check
.,AB92 A2 01    LDX #$01        set pointer low byte
.,AB94 A0 02    LDY #$02        set pointer high byte
.,AB96 A9 00    LDA #$00        clear A
.,AB98 8D 01 02 STA $0201       ensure null terminator
.,AB9B A9 40    LDA #$40        input mode = GET
.,AB9D 20 0F AC JSR $AC0F       perform the GET part of READ
.,ABA0 A6 13    LDX $13         get current I/O channel
.,ABA2 D0 13    BNE $ABB7       if not default channel go do channel close and return
.,ABA4 60       RTS             

                                *** perform INPUT#
.,ABA5 20 9E B7 JSR $B79E       get byte parameter
.,ABA8 A9 2C    LDA #$2C        set ","
.,ABAA 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,ABAD 86 13    STX $13         set current I/O channel
.,ABAF 20 1E E1 JSR $E11E       open channel for input with error check
.,ABB2 20 CE AB JSR $ABCE       perform INPUT with no prompt string

                                *** close input and output channels
.,ABB5 A5 13    LDA $13         get current I/O channel
.,ABB7 20 CC FF JSR $FFCC       close input and output channels
.,ABBA A2 00    LDX #$00        clear X
.,ABBC 86 13    STX $13         clear current I/O channel, flag default
.,ABBE 60       RTS             

                                *** perform INPUT
.,ABBF C9 22    CMP #$22        compare next byte with open quote
.,ABC1 D0 0B    BNE $ABCE       if no prompt string just do INPUT
.,ABC3 20 BD AE JSR $AEBD       print "..." string
.,ABC6 A9 3B    LDA #$3B        load A with ";"
.,ABC8 20 FF AE JSR $AEFF       scan for CHR$(A), else do syntax error then warm start
.,ABCB 20 21 AB JSR $AB21       print string from utility pointer
                                done with prompt, now get data
.,ABCE 20 A6 B3 JSR $B3A6       check not Direct, back here if ok
.,ABD1 A9 2C    LDA #$2C        set ","
.,ABD3 8D FF 01 STA $01FF       save to start of buffer - 1
.,ABD6 20 F9 AB JSR $ABF9       print "? " and get BASIC input
.,ABD9 A5 13    LDA $13         get current I/O channel
.,ABDB F0 0D    BEQ $ABEA       branch if default I/O channel
.,ABDD 20 B7 FF JSR $FFB7       read I/O status word
.,ABE0 29 02    AND #$02        mask no DSR/timeout
.,ABE2 F0 06    BEQ $ABEA       branch if not error
.,ABE4 20 B5 AB JSR $ABB5       close input and output channels
.,ABE7 4C F8 A8 JMP $A8F8       perform DATA
.,ABEA AD 00 02 LDA $0200       get first byte in input buffer
.,ABED D0 1E    BNE $AC0D       branch if not null
                                else ..
.,ABEF A5 13    LDA $13         get current I/O channel
.,ABF1 D0 E3    BNE $ABD6       if not default channel go get BASIC input
.,ABF3 20 06 A9 JSR $A906       scan for next BASIC statement ([:] or [EOL])
.,ABF6 4C FB A8 JMP $A8FB       add Y to the BASIC execute pointer and return

                                *** print "? " and get BASIC input
.,ABF9 A5 13    LDA $13         get current I/O channel
.,ABFB D0 06    BNE $AC03       skip "?" prompt if not default channel
.,ABFD 20 45 AB JSR $AB45       print "?"
.,AC00 20 3B AB JSR $AB3B       print [SPACE] or [CURSOR RIGHT]
.,AC03 4C 60 A5 JMP $A560       call for BASIC input and return

                                *** perform READ
.,AC06 A6 41    LDX $41         get DATA pointer low byte
.,AC08 A4 42    LDY $42         get DATA pointer high byte
.,AC0A A9 98    LDA #$98        set input mode = READ
.:AC0C 2C       .BYTE $2C       makes next line BIT $00A9
.,AC0D A9 00    LDA #$00        set input mode = INPUT

                                *** perform GET
.,AC0F 85 11    STA $11         set input mode flag, $00 = INPUT, $40 = GET, $98 = READ
.,AC11 86 43    STX $43         save READ pointer low byte
.,AC13 84 44    STY $44         save READ pointer high byte
                                READ, GET or INPUT next variable from list
.,AC15 20 8B B0 JSR $B08B       get variable address
.,AC18 85 49    STA $49         save address low byte
.,AC1A 84 4A    STY $4A         save address high byte
.,AC1C A5 7A    LDA $7A         get BASIC execute pointer low byte
.,AC1E A4 7B    LDY $7B         get BASIC execute pointer high byte
.,AC20 85 4B    STA $4B         save BASIC execute pointer low byte
.,AC22 84 4C    STY $4C         save BASIC execute pointer high byte
.,AC24 A6 43    LDX $43         get READ pointer low byte
.,AC26 A4 44    LDY $44         get READ pointer high byte
.,AC28 86 7A    STX $7A         save as BASIC execute pointer low byte
.,AC2A 84 7B    STY $7B         save as BASIC execute pointer high byte
.,AC2C 20 79 00 JSR $0079       scan memory
.,AC2F D0 20    BNE $AC51       branch if not null
                                pointer was to null entry
.,AC31 24 11    BIT $11         test input mode flag, $00 = INPUT, $40 = GET, $98 = READ
.,AC33 50 0C    BVC $AC41       branch if not GET
                                else was GET
.,AC35 20 24 E1 JSR $E124       get character from input device with error check
.,AC38 8D 00 02 STA $0200       save to buffer
.,AC3B A2 FF    LDX #$FF        set pointer low byte
.,AC3D A0 01    LDY #$01        set pointer high byte
.,AC3F D0 0C    BNE $AC4D       go interpret single character
.,AC41 30 75    BMI $ACB8       branch if READ
                                else was INPUT
.,AC43 A5 13    LDA $13         get current I/O channel
.,AC45 D0 03    BNE $AC4A       skip "?" prompt if not default channel
.,AC47 20 45 AB JSR $AB45       print "?"
.,AC4A 20 F9 AB JSR $ABF9       print "? " and get BASIC input
.,AC4D 86 7A    STX $7A         save BASIC execute pointer low byte
.,AC4F 84 7B    STY $7B         save BASIC execute pointer high byte
.,AC51 20 73 00 JSR $0073       increment and scan memory, execute pointer now points to
                                start of next data or null terminator
.,AC54 24 0D    BIT $0D         test data type flag, $FF = string, $00 = numeric
.,AC56 10 31    BPL $AC89       branch if numeric
                                type is string
.,AC58 24 11    BIT $11         test INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
.,AC5A 50 09    BVC $AC65       branch if not GET
                                else do string GET
.,AC5C E8       INX             clear X ??
.,AC5D 86 7A    STX $7A         save BASIC execute pointer low byte
.,AC5F A9 00    LDA #$00        clear A
.,AC61 85 07    STA $07         clear search character
.,AC63 F0 0C    BEQ $AC71       branch always
                                is string INPUT or string READ
.,AC65 85 07    STA $07         save search character
.,AC67 C9 22    CMP #$22        compare with "
.,AC69 F0 07    BEQ $AC72       branch if quote
                                string is not in quotes so ":", "," or $00 are the
                                termination characters
.,AC6B A9 3A    LDA #$3A        set ":"
.,AC6D 85 07    STA $07         set search character
.,AC6F A9 2C    LDA #$2C        set ","
.,AC71 18       CLC             clear carry for add
.,AC72 85 08    STA $08         set scan quotes flag
.,AC74 A5 7A    LDA $7A         get BASIC execute pointer low byte
.,AC76 A4 7B    LDY $7B         get BASIC execute pointer high byte
.,AC78 69 00    ADC #$00        add to pointer low byte. this add increments the pointer
                                if the mode is INPUT or READ and the data is a "..."
                                string
.,AC7A 90 01    BCC $AC7D       branch if no rollover
.,AC7C C8       INY             else increment pointer high byte
.,AC7D 20 8D B4 JSR $B48D       print string to utility pointer
.,AC80 20 E2 B7 JSR $B7E2       restore BASIC execute pointer from temp
.,AC83 20 DA A9 JSR $A9DA       perform string LET
.,AC86 4C 91 AC JMP $AC91       continue processing command
                                GET, INPUT or READ is numeric
.,AC89 20 F3 BC JSR $BCF3       get FAC1 from string
.,AC8C A5 0E    LDA $0E         get data type flag, $80 = integer, $00 = float
.,AC8E 20 C2 A9 JSR $A9C2       assign value to numeric variable
.,AC91 20 79 00 JSR $0079       scan memory
.,AC94 F0 07    BEQ $AC9D       branch if ":" or [EOL]
.,AC96 C9 2C    CMP #$2C        comparte with ","
.,AC98 F0 03    BEQ $AC9D       branch if ","
.,AC9A 4C 4D AB JMP $AB4D       else go do bad input routine
                                string terminated with ":", "," or $00
.,AC9D A5 7A    LDA $7A         get BASIC execute pointer low byte
.,AC9F A4 7B    LDY $7B         get BASIC execute pointer high byte
.,ACA1 85 43    STA $43         save READ pointer low byte
.,ACA3 84 44    STY $44         save READ pointer high byte
.,ACA5 A5 4B    LDA $4B         get saved BASIC execute pointer low byte
.,ACA7 A4 4C    LDY $4C         get saved BASIC execute pointer high byte
.,ACA9 85 7A    STA $7A         restore BASIC execute pointer low byte
.,ACAB 84 7B    STY $7B         restore BASIC execute pointer high byte
.,ACAD 20 79 00 JSR $0079       scan memory
.,ACB0 F0 2D    BEQ $ACDF       branch if ":" or [EOL]
.,ACB2 20 FD AE JSR $AEFD       scan for ",", else do syntax error then warm start
.,ACB5 4C 15 AC JMP $AC15       go READ or INPUT next variable from list
                                was READ
.,ACB8 20 06 A9 JSR $A906       scan for next BASIC statement ([:] or [EOL])
.,ACBB C8       INY             increment index to next byte
.,ACBC AA       TAX             copy byte to X
.,ACBD D0 12    BNE $ACD1       branch if ":"
.,ACBF A2 0D    LDX #$0D        else set error $0D, out of data error
.,ACC1 C8       INY             increment index to next line pointer high byte
.,ACC2 B1 7A    LDA ($7A),Y     get next line pointer high byte
.,ACC4 F0 6C    BEQ $AD32       branch if program end, eventually does error X
.,ACC6 C8       INY             increment index
.,ACC7 B1 7A    LDA ($7A),Y     get next line # low byte
.,ACC9 85 3F    STA $3F         save current DATA line low byte
.,ACCB C8       INY             increment index
.,ACCC B1 7A    LDA ($7A),Y     get next line # high byte
.,ACCE C8       INY             increment index
.,ACCF 85 40    STA $40         save current DATA line high byte
.,ACD1 20 FB A8 JSR $A8FB       add Y to the BASIC execute pointer
.,ACD4 20 79 00 JSR $0079       scan memory
.,ACD7 AA       TAX             copy the byte
.,ACD8 E0 83    CPX #$83        compare it with token for DATA
.,ACDA D0 DC    BNE $ACB8       loop if not DATA
.,ACDC 4C 51 AC JMP $AC51       continue evaluating READ
.,ACDF A5 43    LDA $43         get READ pointer low byte
.,ACE1 A4 44    LDY $44         get READ pointer high byte
.,ACE3 A6 11    LDX $11         get INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
.,ACE5 10 03    BPL $ACEA       branch if INPUT or GET
.,ACE7 4C 27 A8 JMP $A827       else set data pointer and exit
.,ACEA A0 00    LDY #$00        clear index
.,ACEC B1 43    LDA ($43),Y     get READ byte
.,ACEE F0 0B    BEQ $ACFB       exit if [EOL]
.,ACF0 A5 13    LDA $13         get current I/O channel
.,ACF2 D0 07    BNE $ACFB       exit if not default channel
.,ACF4 A9 FC    LDA #$FC        set "?EXTRA IGNORED" pointer low byte
.,ACF6 A0 AC    LDY #$AC        set "?EXTRA IGNORED" pointer high byte
.,ACF8 4C 1E AB JMP $AB1E       print null terminated string
.,ACFB 60       RTS             

                                *** input error messages
.:ACFC 3F 45 58 54 52 41 20 49  '?extra ignored'
.:AD04 47 4E 4F 52 45 44 0D 00
.:AD0C 3F 52 45 44 4F 20 46 52  '?redo from start'
.:AD14 4F 4D 20 53 54 41 52 54
.:AD1C 0D 00

                                *** perform NEXT
.,AD1E D0 04    BNE $AD24       branch if NEXT variable
.,AD20 A0 00    LDY #$00        else clear Y
.,AD22 F0 03    BEQ $AD27       branch always
                                NEXT variable
.,AD24 20 8B B0 JSR $B08B       get variable address
.,AD27 85 49    STA $49         save FOR/NEXT variable pointer low byte
.,AD29 84 4A    STY $4A         save FOR/NEXT variable pointer high byte
                                (high byte cleared if no variable defined)
.,AD2B 20 8A A3 JSR $A38A       search the stack for FOR or GOSUB activity
.,AD2E F0 05    BEQ $AD35       branch if FOR, this variable, found
.,AD30 A2 0A    LDX #$0A        else set error $0A, next without for error
.,AD32 4C 37 A4 JMP $A437       do error #X then warm start
                                found this FOR variable
.,AD35 9A       TXS             update stack pointer
.,AD36 8A       TXA             copy stack pointer
.,AD37 18       CLC             clear carry for add
.,AD38 69 04    ADC #$04        point to STEP value
.,AD3A 48       PHA             save it
.,AD3B 69 06    ADC #$06        point to TO value
.,AD3D 85 24    STA $24         save pointer to TO variable for compare
.,AD3F 68       PLA             restore pointer to STEP value
.,AD40 A0 01    LDY #$01        point to stack page
.,AD42 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,AD45 BA       TSX             get stack pointer back
.,AD46 BD 09 01 LDA $0109,X     get step sign
.,AD49 85 66    STA $66         save FAC1 sign (b7)
.,AD4B A5 49    LDA $49         get FOR/NEXT variable pointer low byte
.,AD4D A4 4A    LDY $4A         get FOR/NEXT variable pointer high byte
.,AD4F 20 67 B8 JSR $B867       add FOR variable to FAC1
.,AD52 20 D0 BB JSR $BBD0       pack FAC1 into FOR variable
.,AD55 A0 01    LDY #$01        point to stack page
.,AD57 20 5D BC JSR $BC5D       compare FAC1 with TO value
.,AD5A BA       TSX             get stack pointer back
.,AD5B 38       SEC             set carry for subtract
.,AD5C FD 09 01 SBC $0109,X     subtract step sign
.,AD5F F0 17    BEQ $AD78       branch if =, loop complete
                                loop back and do it all again
.,AD61 BD 0F 01 LDA $010F,X     get FOR line low byte
.,AD64 85 39    STA $39         save current line number low byte
.,AD66 BD 10 01 LDA $0110,X     get FOR line high byte
.,AD69 85 3A    STA $3A         save current line number high byte
.,AD6B BD 12 01 LDA $0112,X     get BASIC execute pointer low byte
.,AD6E 85 7A    STA $7A         save BASIC execute pointer low byte
.,AD70 BD 11 01 LDA $0111,X     get BASIC execute pointer high byte
.,AD73 85 7B    STA $7B         save BASIC execute pointer high byte
.,AD75 4C AE A7 JMP $A7AE       go do interpreter inner loop
                                NEXT loop comlete
.,AD78 8A       TXA             stack copy to A
.,AD79 69 11    ADC #$11        add $12, $11 + carry, to dump FOR structure
.,AD7B AA       TAX             copy back to index
.,AD7C 9A       TXS             copy to stack pointer
.,AD7D 20 79 00 JSR $0079       scan memory
.,AD80 C9 2C    CMP #$2C        compare with ","
.,AD82 D0 F1    BNE $AD75       if not "," go do interpreter inner loop
                                was "," so another NEXT variable to do
.,AD84 20 73 00 JSR $0073       increment and scan memory
.,AD87 20 24 AD JSR $AD24       do NEXT variable

                                *** evaluate expression and check type mismatch
.,AD8A 20 9E AD JSR $AD9E       evaluate expression
                                check if source and destination are numeric
.,AD8D 18       CLC             
.:AD8E 24       .BYTE $24       makes next line BIT $38
                                check if source and destination are string
.,AD8F 38       SEC             destination is string
                                type match check, set C for string, clear C for numeric
.,AD90 24 0D    BIT $0D         test data type flag, $FF = string, $00 = numeric
.,AD92 30 03    BMI $AD97       branch if string
.,AD94 B0 03    BCS $AD99       if destiantion is numeric do type missmatch error
.,AD96 60       RTS             
.,AD97 B0 FD    BCS $AD96       exit if destination is string
                                do type missmatch error
.,AD99 A2 16    LDX #$16        error code $16, type missmatch error
.,AD9B 4C 37 A4 JMP $A437       do error #X then warm start

                                *** evaluate expression
.,AD9E A6 7A    LDX $7A         get BASIC execute pointer low byte
.,ADA0 D0 02    BNE $ADA4       skip next if not zero
.,ADA2 C6 7B    DEC $7B         else decrement BASIC execute pointer high byte
.,ADA4 C6 7A    DEC $7A         decrement BASIC execute pointer low byte
.,ADA6 A2 00    LDX #$00        set null precedence, flag done
.:ADA8 24       .BYTE $24       makes next line BIT $48
.,ADA9 48       PHA             push compare evaluation byte if branch to here
.,ADAA 8A       TXA             copy precedence byte
.,ADAB 48       PHA             push precedence byte
.,ADAC A9 01    LDA #$01        2 bytes
.,ADAE 20 FB A3 JSR $A3FB       check room on stack for A*2 bytes
.,ADB1 20 83 AE JSR $AE83       get value from line
.,ADB4 A9 00    LDA #$00        clear A
.,ADB6 85 4D    STA $4D         clear comparrison evaluation flag
.,ADB8 20 79 00 JSR $0079       scan memory
.,ADBB 38       SEC             set carry for subtract
.,ADBC E9 B1    SBC #$B1        subtract the token for ">"
.,ADBE 90 17    BCC $ADD7       branch if < ">"
.,ADC0 C9 03    CMP #$03        compare with ">" to +3
.,ADC2 B0 13    BCS $ADD7       branch if >= 3
                                was token for ">" "=" or "<"
.,ADC4 C9 01    CMP #$01compare with token for =
.,ADC6 2A       ROL             *2, b0 = carry (=1 if token was = or <)
.,ADC7 49 01    EOR #$01        toggle b0
.,ADC9 45 4D    EOR $4D         EOR with comparrison evaluation flag
.,ADCB C5 4D    CMP $4D         compare with comparrison evaluation flag
.,ADCD 90 61    BCC $AE30       if < saved flag do syntax error then warm start
.,ADCF 85 4D    STA $4D         save new comparrison evaluation flag
.,ADD1 20 73 00 JSR $0073       increment and scan memory
.,ADD4 4C BB AD JMP $ADBB       go do next character
.,ADD7 A6 4D    LDX $4D         get comparrison evaluation flag
.,ADD9 D0 2C    BNE $AE07       branch if compare function
.,ADDB B0 7B    BCS $AE58       go do functions
                                else was < TK_GT so is operator or lower
.,ADDD 69 07    ADC #$07        add # of operators (+, -, *, /, ^, AND or OR)
.,ADDF 90 77    BCC $AE58       branch if < + operator
                                carry was set so token was +, -, *, /, ^, AND or OR
.,ADE1 65 0D    ADC $0D         add data type flag, $FF = string, $00 = numeric
.,ADE3 D0 03    BNE $ADE8       branch if not string or not + token
                                will only be $00 if type is string and token was +
.,ADE5 4C 3D B6 JMP $B63D       add strings, string 1 is in the descriptor, string 2
                                is in line, and return
.,ADE8 69 FF    ADC #$FF        -1 (corrects for carry add)
.,ADEA 85 22    STA $22         save it
.,ADEC 0A       ASL             *2
.,ADED 65 22    ADC $22         *3
.,ADEF A8       TAY             copy to index
.,ADF0 68       PLA             pull previous precedence
.,ADF1 D9 80 A0 CMP $A080,Y     compare with precedence byte
.,ADF4 B0 67    BCS $AE5D       branch if A >=
.,ADF6 20 8D AD JSR $AD8D       check if source is numeric, else do type mismatch
.,ADF9 48       PHA             save precedence
.,ADFA 20 20 AE JSR $AE20       get vector, execute function then continue evaluation
.,ADFD 68       PLArestore precedence
.,ADFE A4 4B    LDY $4B         get precedence stacked flag
.,AE00 10 17    BPL $AE19       branch if stacked values
.,AE02 AA       TAX             copy precedence, set flags
.,AE03 F0 56    BEQ $AE5B       exit if done
.,AE05 D0 5F    BNE $AE66       else pop FAC2 and return, branch always
.,AE07 46 0D    LSR $0D         clear data type flag, $FF = string, $00 = numeric
.,AE09 8A       TXA             copy compare function flag
.,AE0A 2A       ROL             <<1, shift data type flag into b0, 1 = string, 0 = num
.,AE0B A6 7A    LDX $7A         get BASIC execute pointer low byte
.,AE0D D0 02    BNE $AE11       branch if no underflow
.,AE0F C6 7B    DEC $7B         else decrement BASIC execute pointer high byte
.,AE11 C6 7A    DEC $7A         decrement BASIC execute pointer low byte
.,AE13 A0 1B    LDY #$1B        
                                set offset to = operator precedence entry
.,AE15 85 4D    STA $4D         save new comparrison evaluation flag
.,AE17 D0 D7    BNE $ADF0       branch always
.,AE19 D9 80 A0 CMP $A080,Y     compare with stacked function precedence
.,AE1C B0 48    BCS $AE66       if A >=, pop FAC2 and return
.,AE1E 90 D9    BCC $ADF9       else go stack this one and continue, branch always

                                *** get vector, execute function then continue evaluation
.,AE20 B9 82 A0 LDA $A082,Y     get function vector high byte
.,AE23 48       PHA             onto stack
.,AE24 B9 81 A0 LDA $A081,Y     get function vector low byte
.,AE27 48       PHA             onto stack
                                now push sign, round FAC1 and put on stack
.,AE28 20 33 AE JSR $AE33       function will return here, then the next RTS will call
                                the function
.,AE2B A5 4D    LDA $4D         get comparrison evaluation flag
.,AE2D 4C A9 AD JMP $ADA9       continue evaluating expression
.,AE30 4C 08 AF JMP $AF08       do syntax error then warm start
.,AE33 A5 66    LDA $66         get FAC1 sign (b7)
.,AE35 BE 80 A0 LDX $A080,Y     get precedence byte

                                *** push sign, round FAC1 and put on stack
.,AE38 A8       TAY             copy sign
.,AE39 68       PLA             get return address low byte
.,AE3A 85 22    STA $22         save it
.,AE3C E6 22    INC $22         increment it as return-1 is pushed
                                note, no check is made on the high byte so if the calling
                                routine ever assembles to a page edge then this all goes
                                horribly wrong!
.,AE3E 68       PLA             get return address high byte
.,AE3F 85 23    STA $23         save it
.,AE41 98       TYA             restore sign
.,AE42 48       PHA             push sign

                                *** round FAC1 and put on stack
.,AE43 20 1B BC JSR $BC1B       round FAC1
.,AE46 A5 65    LDA $65         get FAC1 mantissa 4
.,AE48 48       PHA             save it
.,AE49 A5 64    LDA $64         get FAC1 mantissa 3
.,AE4B 48       PHA             save it
.,AE4C A5 63    LDA $63         get FAC1 mantissa 2
.,AE4E 48       PHA             save it
.,AE4F A5 62    LDA $62         get FAC1 mantissa 1
.,AE51 48       PHA             save it
.,AE52 A5 61    LDA $61         get FAC1 exponent
.,AE54 48       PHA             save it
.,AE55 6C 22 00 JMP ($0022)     return, sort of

                                *** do functions
.,AE58 A0 FF    LDY #$FF        flag function
.,AE5A 68       PLA             pull precedence byte
.,AE5B F0 23    BEQ $AE80       exit if done
.,AE5D C9 64    CMP #$64        compare previous precedence with $64
.,AE5F F0 03    BEQ $AE64       branch if was $64 (< function)
.,AE61 20 8D AD JSR $AD8D       check if source is numeric, else do type mismatch
.,AE64 84 4B    STY $4B         save precedence stacked flag
                                pop FAC2 and return
.,AE66 68       PLA             pop byte
.,AE67 4A       LSR             shift out comparison evaluation lowest bit
.,AE68 85 12    STA $12         save the comparison evaluation flag
.,AE6A 68       PLA             pop exponent
.,AE6B 85 69    STA $69         save FAC2 exponent
.,AE6D 68       PLA             pop mantissa 1
.,AE6E 85 6A    STA $6A         save FAC2 mantissa 1
.,AE70 68       PLA             pop mantissa 2
.,AE71 85 6B    STA $6B         save FAC2 mantissa 2
.,AE73 68       PLA             pop mantissa 3
.,AE74 85 6C    STA $6C         save FAC2 mantissa 3
.,AE76 68       PLA             pop mantissa 4
.,AE77 85 6D    STA $6D         save FAC2 mantissa 4
.,AE79 68       PLA             pop sign
.,AE7A 85 6E    STA $6E         save FAC2 sign (b7)
.,AE7C 45 66    EOR $66         EOR FAC1 sign (b7)
.,AE7E 85 6F    STA $6F         save sign compare (FAC1 EOR FAC2)
.,AE80 A5 61    LDA $61         get FAC1 exponent
.,AE82 60       RTS             

                                *** get value from line
.,AE83 6C 0A 03 JMP ($030A)     get arithmetic element

                                *** get arithmetic element, the get arithmetic element vector is initialised to point here
.,AE86 A9 00    LDA #$00        clear byte
.,AE88 85 0D    STA $0D         clear data type flag, $FF = string, $00 = numeric
.,AE8A 20 73 00 JSR $0073       increment and scan memory
.,AE8D B0 03    BCS $AE92       branch if not numeric character
                                else numeric string found (e.g. 123)
.,AE8F 4C F3 BC JMP $BCF3       get FAC1 from string and return
                                get value from line .. continued
                                wasn't a number so ...
.,AE92 20 13 B1 JSR $B113       check byte, return Cb = 0 if<"A" or >"Z"
.,AE95 90 03    BCC $AE9A       branch if not variable name
.,AE97 4C 28 AF JMP $AF28       variable name set-up and return
.,AE9A C9 FF    CMP #$FF        compare with token for PI
.,AE9C D0 0F    BNE $AEAD       branch if not PI
.,AE9E A9 A8    LDA #$A8        get PI pointer low byte
.,AEA0 A0 AE    LDY #$AE        get PI pointer high byte
.,AEA2 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,AEA5 4C 73 00 JMP $0073       increment and scan memory and return

                                *** PI as floating number
.:AEA8 82 49 0F DA A1           3.141592653

                                *** get value from line .. continued
                                wasn't variable name so ...
.,AEAD C9 2E    CMP #$2E        compare with "."
.,AEAF F0 DE    BEQ $AE8F       if so get FAC1 from string and return, e.g. was .123
                                wasn't .123 so ...
.,AEB1 C9 AB    CMP #$AB        compare with token for -
.,AEB3 F0 58    BEQ $AF0D       branch if - token, do set-up for functions
                                wasn't -123 so ...
.,AEB5 C9 AA    CMP #$AA        compare with token for +
.,AEB7 F0 D1    BEQ $AE8A       branch if + token, +1 = 1 so ignore leading +
                                it wasn't any sort of number so ...
.,AEB9 C9 22    CMP #$22        compare with "
.,AEBB D0 0F    BNE $AECC       branch if not open quote
                                was open quote so get the enclosed string

                                *** print "..." string to string utility area
.,AEBD A5 7A    LDA $7A         get BASIC execute pointer low byte
.,AEBF A4 7B    LDY $7B         get BASIC execute pointer high byte
.,AEC1 69 00    ADC #$00        add carry to low byte
.,AEC3 90 01    BCC $AEC6       branch if no overflow
.,AEC5 C8       INY             increment high byte
.,AEC6 20 87 B4 JSR $B487       print " terminated string to utility pointer
.,AEC9 4C E2 B7 JMP $B7E2       restore BASIC execute pointer from temp and return
                                get value from line .. continued
                                wasn't a string so ...
.,AECC C9 A8    CMP #$A8        compare with token for NOT
.,AECE D0 13    BNE $AEE3       branch if not token for NOT
                                was NOT token
.,AED0 A0 18    LDY #$18        offset to NOT function
.,AED2 D0 3B    BNE $AF0F       do set-up for function then execute, branch always
                                do = compare
.,AED4 20 BF B1 JSR $B1BF       evaluate integer expression, no sign check
.,AED7 A5 65    LDA $65         get FAC1 mantissa 4
.,AED9 49 FF    EOR #$FF        invert it
.,AEDB A8       TAY             copy it
.,AEDC A5 64    LDA $64         get FAC1 mantissa 3
.,AEDE 49 FF    EOR #$FF        invert it
.,AEE0 4C 91 B3 JMP $B391       convert fixed integer AY to float FAC1 and return
                                get value from line .. continued
                                wasn't a string or NOT so ...
.,AEE3 C9 A5    CMP #$A5        compare with token for FN
.,AEE5 D0 03    BNE $AEEA       branch if not token for FN
.,AEE7 4C F4 B3 JMP $B3F4       else go evaluate FNx
                                get value from line .. continued
                                wasn't a string, NOT or FN so ...
.,AEEA C9 B4    CMP #$B4        compare with token for SGN
.,AEEC 90 03    BCC $AEF1       if less than SGN token evaluate expression in parentheses
                                else was a function token
.,AEEE 4C A7 AF JMP $AFA7       go set up function references, branch always
                                get value from line .. continued
                                if here it can only be something in brackets so ....
                                evaluate expression within parentheses
.,AEF1 20 FA AE JSR $AEFA       scan for "(", else do syntax error then warm start
.,AEF4 20 9E AD JSR $AD9E       evaluate expression
                                all the 'scan for' routines return the character after the sought character
                                scan for ")", else do syntax error then warm start
.,AEF7 A9 29    LDA #$29        load A with ")"
.:AEF9 2C       .BYTE $2C       makes next line BIT $28A9
                                scan for "(", else do syntax error then warm start
.,AEFA A9 28    LDA #$28        load A with "("
.:AEFC 2C       .BYTE $2C       makes next line BIT $2CA9
                                scan for ",", else do syntax error then warm start
.,AEFD A9 2C    LDA #$2C        load A with ","
                                scan for CHR$(A), else do syntax error then warm start
.,AEFF A0 00    LDY #$00        clear index
.,AF01 D1 7A    CMP ($7A),Y     compare with BASIC byte
.,AF03 D0 03    BNE $AF08       if not expected byte do syntax error then warm start
.,AF05 4C 73 00 JMP $0073       else increment and scan memory and return
                                syntax error then warm start
.,AF08 A2 0B    LDX #$0B        error code $0B, syntax error
.,AF0A 4C 37 A4 JMP $A437       do error #X then warm start
.,AF0D A0 15    LDY #$15        set offset from base to > operator
.,AF0F 68       PLA             dump return address low byte
.,AF10 68       PLA             dump return address high byte
.,AF11 4C FA AD JMP $ADFA       execute function then continue evaluation

                                *** check address range, return Cb = 1 if address in BASIC ROM
.,AF14 38       SEC             set carry for subtract
.,AF15 A5 64    LDA $64         get variable address low byte
.,AF17 E9 00    SBC #$00        subtract $A000 low byte
.,AF19 A5 65    LDA $65         get variable address high byte
.,AF1B E9 A0    SBC #$A0        subtract $A000 high byte
.,AF1D 90 08    BCC $AF27       exit if address < $A000
.,AF1F A9 A2    LDA #$A2        get end of BASIC marker low byte
.,AF21 E5 64    SBC $64         subtract variable address low byte
.,AF23 A9 E3    LDA #$E3        get end of BASIC marker high byte
.,AF25 E5 65    SBC $65         subtract variable address high byte
.,AF27 60       RTS             

                                *** variable name set-up
.,AF28 20 8B B0 JSR $B08B       get variable address
.,AF2B 85 64    STA $64         save variable pointer low byte
.,AF2D 84 65    STY $65         save variable pointer high byte
.,AF2F A6 45    LDX $45         get current variable name first character
.,AF31 A4 46    LDY $46         get current variable name second character
.,AF33 A5 0D    LDA $0D         get data type flag, $FF = string, $00 = numeric
.,AF35 F0 26    BEQ $AF5D       branch if numeric
                                variable is string
.,AF37 A9 00    LDA #$00        else clear A
.,AF39 85 70    STA $70         clear FAC1 rounding byte
.,AF3B 20 14 AF JSR $AF14       check address range
.,AF3E 90 1C    BCC $AF5C       exit if not in BASIC ROM
.,AF40 E0 54    CPX #$54        compare variable name first character with "T"
.,AF42 D0 18    BNE $AF5C       exit if not "T"
.,AF44 C0 C9    CPY #$C9        compare variable name second character with "I$"
.,AF46 D0 14    BNE $AF5C       exit if not "I$"
                                variable name was "TI$"
.,AF48 20 84 AF JSR $AF84       read real time clock into FAC1 mantissa, 0HML
.,AF4B 84 5E    STY $5E         clear exponent count adjust
.,AF4D 88       DEY             Y = $FF
.,AF4E 84 71    STY $71         set output string index, -1 to allow for pre increment
.,AF50 A0 06    LDY #$06        HH:MM:SS is six digits
.,AF52 84 5D    STY $5D         set number of characters before the decimal point
.,AF54 A0 24    LDY #$24        
                                index to jiffy conversion table
.,AF56 20 68 BE JSR $BE68       convert jiffy count to string
.,AF59 4C 6F B4 JMP $B46F       exit via STR$() code tail
.,AF5C 60       RTS             
                                variable name set-up, variable is numeric
.,AF5D 24 0E    BIT $0E         test data type flag, $80 = integer, $00 = float
.,AF5F 10 0D    BPL $AF6E       branch if float
.,AF61 A0 00    LDY #$00        clear index
.,AF63 B1 64    LDA ($64),Y     get integer variable low byte
.,AF65 AA       TAX             copy to X
.,AF66 C8       INY             increment index
.,AF67 B1 64    LDA ($64),Y     get integer variable high byte
.,AF69 A8       TAY             copy to Y
.,AF6A 8A       TXA             copy loa byte to A
.,AF6B 4C 91 B3 JMP $B391       convert fixed integer AY to float FAC1 and return
                                variable name set-up, variable is float
.,AF6E 20 14 AF JSR $AF14       check address range
.,AF71 90 2D    BCC $AFA0       if not in BASIC ROM get pointer and unpack into FAC1
.,AF73 E0 54    CPX #$54        compare variable name first character with "T"
.,AF75 D0 1B    BNE $AF92       branch if not "T"
.,AF77 C0 49    CPY #$49        compare variable name second character with "I"
.,AF79 D0 25    BNE $AFA0       branch if not "I"
                                variable name was "TI"
.,AF7B 20 84 AF JSR $AF84       read real time clock into FAC1 mantissa, 0HML
.,AF7E 98       TYA             clear A
.,AF7F A2 A0    LDX #$A0        set exponent to 32 bit value
.,AF81 4C 4F BC JMP $BC4F       set exponent = X and normalise FAC1

                                *** read real time clock into FAC1 mantissa, 0HML
.,AF84 20 DE FF JSR $FFDE       read real time clock
.,AF87 86 64    STX $64         save jiffy clock mid byte as  FAC1 mantissa 3
.,AF89 84 63    STY $63         save jiffy clock high byte as  FAC1 mantissa 2
.,AF8B 85 65    STA $65         save jiffy clock low byte as  FAC1 mantissa 4
.,AF8D A0 00    LDY #$00        clear Y
.,AF8F 84 62    STY $62         clear FAC1 mantissa 1
.,AF91 60       RTS             
                                variable name set-up, variable is float and not "Tx"
.,AF92 E0 53    CPX #$53        compare variable name first character with "S"
.,AF94 D0 0A    BNE $AFA0       if not "S" go do normal floating variable
.,AF96 C0 54    CPY #$54        compare variable name second character with "
.,AF98 D0 06    BNE $AFA0       if not "T" go do normal floating variable
                                variable name was "ST"
.,AF9A 20 B7 FF JSR $FFB7       read I/O status word
.,AF9D 4C 3C BC JMP $BC3C       save A as integer byte and return
                                variable is float
.,AFA0 A5 64    LDA $64         get variable pointer low byte
.,AFA2 A4 65    LDY $65         get variable pointer high byte
.,AFA4 4C A2 BB JMP $BBA2       unpack memory (AY) into FAC1

                                *** get value from line continued
                                only functions left so ..
                                set up function references
.,AFA7 0A       ASL             *2 (2 bytes per function address)
.,AFA8 48       PHA             save function offset
.,AFA9 AA       TAX             copy function offset
.,AFAA 20 73 00 JSR $0073       increment and scan memory
.,AFAD E0 8F    CPX #$8F        compare function offset to CHR$ token offset+1
.,AFAF 90 20    BCC $AFD1       branch if < LEFT$ (can not be =)
                                get value from line .. continued
                                was LEFT$, RIGHT$ or MID$ so..
.,AFB1 20 FA AE JSR $AEFA       scan for "(", else do syntax error then warm start
.,AFB4 20 9E AD JSR $AD9E       evaluate, should be string, expression
.,AFB7 20 FD AE JSR $AEFD       scan for ",", else do syntax error then warm start
.,AFBA 20 8F AD JSR $AD8F       check if source is string, else do type mismatch
.,AFBD 68       PLA             restore function offset
.,AFBE AA       TAX             copy it
.,AFBF A5 65    LDA $65         get descriptor pointer high byte
.,AFC1 48       PHA             push string pointer high byte
.,AFC2 A5 64    LDA $64         get descriptor pointer low byte
.,AFC4 48       PHA             push string pointer low byte
.,AFC5 8A       TXA             restore function offset
.,AFC6 48       PHA             save function offset
.,AFC7 20 9E B7 JSR $B79E       get byte parameter
.,AFCA 68       PLA             restore function offset
.,AFCB A8       TAY             copy function offset
.,AFCC 8A       TXA             copy byte parameter to A
.,AFCD 48       PHA             push byte parameter
.,AFCE 4C D6 AF JMP $AFD6       go call function
                                get value from line .. continued
                                was SGN() to CHR$() so..
.,AFD1 20 F1 AE JSR $AEF1       evaluate expression within parentheses
.,AFD4 68       PLA             restore function offset
.,AFD5 A8       TAY             copy to index
.,AFD6 B9 EA 9F LDA $9FEA,Y     get function jump vector low byte
.,AFD9 85 55    STA $55         save functions jump vector low byte
.,AFDB B9 EB 9F LDA $9FEB,Y     get function jump vector high byte
.,AFDE 85 56    STA $56         save functions jump vector high byte
.,AFE0 20 54 00 JSR $0054       do function call
.,AFE3 4C 8D AD JMP $AD8D       check if source is numeric and RTS, else do type mismatch
                                string functions avoid this by dumping the return address

                                *** perform OR
                                this works because NOT(NOT(x) AND NOT(y)) = x OR y
.,AFE6 A0 FF    LDY #$FF        set Y for OR
.:AFE8 2C       .BYTE $2C       makes next line BIT $00A0

                                *** perform AND
.,AFE9 A0 00    LDY #$00        clear Y for AND
.,AFEB 84 0B    STY $0B         set AND/OR invert value
.,AFED 20 BF B1 JSR $B1BF       evaluate integer expression, no sign check
.,AFF0 A5 64    LDA $64         get FAC1 mantissa 3
.,AFF2 45 0B    EOR $0B         EOR low byte
.,AFF4 85 07    STA $07         save it
.,AFF6 A5 65    LDA $65         get FAC1 mantissa 4
.,AFF8 45 0B    EOR $0B         EOR high byte
.,AFFA 85 08    STA $08         save it
.,AFFC 20 FC BB JSR $BBFC       copy FAC2 to FAC1, get 2nd value in expression
.,AFFF 20 BF B1 JSR $B1BF       evaluate integer expression, no sign check
.,B002 A5 65    LDA $65         get FAC1 mantissa 4
.,B004 45 0B    EOR $0B         EOR high byte
.,B006 25 08    AND $08         AND with expression 1 high byte
.,B008 45 0B    EOR $0B         EOR result high byte
.,B00A A8       TAY             save in Y
.,B00B A5 64    LDA $64         get FAC1 mantissa 3
.,B00D 45 0B    EOR $0B         EOR low byte
.,B00F 25 07    AND $07         AND with expression 1 low byte
.,B011 45 0B    EOR $0B         EOR result low byte
.,B013 4C 91 B3 JMP $B391       convert fixed integer AY to float FAC1 and return

                                *** perform comparisons
                                do < compare
.,B016 20 90 AD JSR $AD90       type match check, set C for string
.,B019 B0 13    BCS $B02E       branch if string
                                do numeric < compare
.,B01B A5 6E    LDA $6E         get FAC2 sign (b7)
.,B01D 09 7F    ORA #$7F        set all non sign bits
.,B01F 25 6A    AND $6A         and FAC2 mantissa 1 (AND in sign bit)
.,B021 85 6A    STA $6A         save FAC2 mantissa 1
.,B023 A9 69    LDA #$69        set pointer low byte to FAC2
.,B025 A0 00    LDY #$00        set pointer high byte to FAC2
.,B027 20 5B BC JSR $BC5B       compare FAC1 with (AY)
.,B02A AA       TAXcopy the result
.,B02B 4C 61 B0 JMP $B061       go evaluate result
                                do string < compare
.,B02E A9 00    LDA #$00        clear byte
.,B030 85 0D    STA $0D         clear data type flag, $FF = string, $00 = numeric
.,B032 C6 4D    DEC $4D         clear < bit in comparrison evaluation flag
.,B034 20 A6 B6 JSR $B6A6       pop string off descriptor stack, or from top of string
                                space returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,B037 85 61    STA $61         save length
.,B039 86 62    STX $62         save string pointer low byte
.,B03B 84 63    STY $63         save string pointer high byte
.,B03D A5 6C    LDA $6C         get descriptor pointer low byte
.,B03F A4 6D    LDY $6D         get descriptor pointer high byte
.,B041 20 AA B6 JSR $B6AA       pop (YA) descriptor off stack or from top of string space
                                returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,B044 86 6C    STX $6C         save string pointer low byte
.,B046 84 6D    STY $6D         save string pointer high byte
.,B048 AA       TAX             copy length
.,B049 38       SEC             set carry for subtract
.,B04A E5 61    SBC $61         subtract string 1 length
.,B04C F0 08    BEQ $B056       branch if str 1 length = string 2 length
.,B04E A9 01    LDA #$01        set str 1 length > string 2 length
.,B050 90 04    BCC $B056       branch if so
.,B052 A6 61    LDX $61         get string 1 length
.,B054 A9 FF    LDA #$FF        set str 1 length < string 2 length
.,B056 85 66    STA $66         save length compare
.,B058 A0 FF    LDY #$FF        set index
.,B05A E8       INX             adjust for loop
.,B05B C8       INY             increment index
.,B05C CA       DEX             decrement count
.,B05D D0 07    BNE $B066       branch if still bytes to do
.,B05F A6 66    LDX $66         get length compare back
.,B061 30 0F    BMI $B072       branch if str 1 < str 2
.,B063 18       CLC             flag str 1 <= str 2
.,B064 90 0C    BCC $B072       go evaluate result
.,B066 B1 6C    LDA ($6C),Y     get string 2 byte
.,B068 D1 62    CMP ($62),Y     compare with string 1 byte
.,B06A F0 EF    BEQ $B05B       loop if bytes =
.,B06C A2 FF    LDX #$FF        set str 1 < string 2
.,B06E B0 02    BCS $B072       branch if so
.,B070 A2 01    LDX #$01        set str 1 > string 2
.,B072 E8       INX             x = 0, 1 or 2
.,B073 8A       TXA             copy to A
.,B074 2A       ROL             * 2 (1, 2 or 4)
.,B075 25 12    AND $12         AND with the comparison evaluation flag
.,B077 F0 02    BEQ $B07B       branch if 0 (compare is false)
.,B079 A9 FF    LDA #$FFelse set result true
.,B07B 4C 3C BC JMP $BC3C       save A as integer byte and return
.,B07E 20 FD AE JSR $AEFD       scan for ",", else do syntax error then warm start

                                *** perform DIM
.,B081 AA       TAX             copy "DIM" flag to X
.,B082 20 90 B0 JSR $B090       search for variable
.,B085 20 79 00 JSR $0079       scan memory
.,B088 D0 F4    BNE $B07E       scan for "," and loop if not null
.,B08A 60       RTS             

                                *** search for variable
.,B08B A2 00    LDX #$00        set DIM flag = $00
.,B08D 20 79 00 JSR $0079       scan memory, 1st character
.,B090 86 0C    STX $0C         save DIM flag
.,B092 85 45    STA $45         save 1st character
.,B094 20 79 00 JSR $0079       scan memory
.,B097 20 13 B1 JSR $B113       check byte, return Cb = 0 if<"A" or >"Z"
.,B09A B0 03    BCS $B09F       branch if ok
.,B09C 4C 08 AF JMP $AF08       else syntax error then warm start
                                was variable name so ...
.,B09F A2 00    LDX #$00        clear 2nd character temp
.,B0A1 86 0D    STX $0D         clear data type flag, $FF = string, $00 = numeric
.,B0A3 86 0E    STX $0E         clear data type flag, $80 = integer, $00 = float
.,B0A5 20 73 00 JSR $0073       increment and scan memory, 2nd character
.,B0A8 90 05    BCC $B0AF       if character = "0"-"9" (ok) go save 2nd character
                                2nd character wasn't "0" to "9" so ...
.,B0AA 20 13 B1 JSR $B113       check byte, return Cb = 0 if<"A" or >"Z"
.,B0AD 90 0B    BCC $B0BA       branch if <"A" or >"Z" (go check if string)
.,B0AF AA       TAX             copy 2nd character
                                ignore further (valid) characters in the variable name
.,B0B0 20 73 00 JSR $0073       increment and scan memory, 3rd character
.,B0B3 90 FB    BCC $B0B0       loop if character = "0"-"9" (ignore)
.,B0B5 20 13 B1 JSR $B113       check byte, return Cb = 0 if<"A" or >"Z"
.,B0B8 B0 F6    BCS $B0B0       loop if character = "A"-"Z" (ignore)
                                check if string variable
.,B0BA C9 24    CMP #$24        compare with "$"
.,B0BC D0 06    BNE $B0C4       branch if not string
                                type is string
.,B0BE A9 FF    LDA #$FF        set data type = string
.,B0C0 85 0D    STA $0D         set data type flag, $FF = string, $00 = numeric
.,B0C2 D0 10    BNE $B0D4       branch always
.,B0C4 C9 25    CMP #$25        compare with "%"
.,B0C6 D0 13    BNE $B0DB       branch if not integer
.,B0C8 A5 10    LDA $10         get subscript/FNX flag
.,B0CA D0 D0    BNE $B09C       if ?? do syntax error then warm start
.,B0CC A9 80    LDA #$80        set integer type
.,B0CE 85 0E    STA $0E         set data type = integer
.,B0D0 05 45    ORA $45         OR current variable name first byte
.,B0D2 85 45    STA $45         save current variable name first byte
.,B0D4 8A       TXA             get 2nd character back
.,B0D5 09 80    ORA #$80        set top bit, indicate string or integer variable
.,B0D7 AA       TAX             copy back to 2nd character temp
.,B0D8 20 73 00 JSR $0073       increment and scan memory
.,B0DB 86 46    STX $46         save 2nd character
.,B0DD 38       SEC             set carry for subtract
.,B0DE 05 10    ORA $10         or with subscript/FNX flag - or FN name
.,B0E0 E9 28    SBC #$28        subtract "("
.,B0E2 D0 03    BNE $B0E7       branch if not "("
.,B0E4 4C D1 B1 JMP $B1D1       go find, or make, array
                                either find or create variable
                                variable name wasn't xx(.... so look for plain variable
.,B0E7 A0 00    LDY #$00        clear A
.,B0E9 84 10    STY $10         clear subscript/FNX flag
.,B0EB A5 2D    LDA $2D         get start of variables low byte
.,B0ED A6 2E    LDX $2E         get start of variables high byte
.,B0EF 86 60    STX $60         save search address high byte
.,B0F1 85 5F    STA $5F         save search address low byte
.,B0F3 E4 30    CPX $30         compare with end of variables high byte
.,B0F5 D0 04    BNE $B0FB       skip next compare if <>
                                high addresses were = so compare low addresses
.,B0F7 C5 2F    CMP $2F         compare low address with end of variables low byte
.,B0F9 F0 22    BEQ $B11D       if not found go make new variable
.,B0FB A5 45    LDA $45         get 1st character of variable to find
.,B0FD D1 5F    CMP ($5F),Y     compare with variable name 1st character
.,B0FF D0 08    BNE $B109       branch if no match
                                1st characters match so compare 2nd character
.,B101 A5 46    LDA $46         get 2nd character of variable to find
.,B103 C8       INY             index to point to variable name 2nd character
.,B104 D1 5F    CMP ($5F),Y     compare with variable name 2nd character
.,B106 F0 7D    BEQ $B185       branch if match (found variable)
.,B108 88       DEY             else decrement index (now = $00)
.,B109 18       CLC             clear carry for add
.,B10A A5 5F    LDA $5F         get search address low byte
.,B10C 69 07    ADC #$07        +7, offset to next variable name
.,B10E 90 E1    BCC $B0F1       loop if no overflow to high byte
.,B110 E8       INX             else increment high byte
.,B111 D0 DC    BNE $B0EF       loop always, RAM doesn't extend to $FFFF
                                check byte, return Cb = 0 if<"A" or >"Z"
.,B113 C9 41    CMP #$41        compare with "A"
.,B115 90 05    BCC $B11C       exit if less
                                carry is set
.,B117 E9 5B    SBC #$5B        subtract "Z"+1
.,B119 38       SEC             set carry
.,B11A E9 A5    SBC #$A5        subtract $A5 (restore byte)
                                carry clear if byte > $5A
.,B11C 60       RTS             
                                reached end of variable memory without match
                                ... so create new variable
.,B11D 68       PLApop return address low byte
.,B11E 48       PHA             push return address low byte
.,B11F C9 2A    CMP #$2A        compare with expected calling routine return low byte
.,B121 D0 05    BNE $B128       if not get variable go create new variable
                                this will only drop through if the call was from $AF28 and is only called
                                from there if it is searching for a variable from the right hand side of a LET a=b
                                statement, it prevents the creation of variables not assigned a value.
                                value returned by this is either numeric zero, exponent byte is $00, or null string,
                                descriptor length byte is $00. in fact a pointer to any $00 byte would have done.
                                else return dummy null value
.,B123 A9 13    LDA #$13        set result pointer low byte
.,B125 A0 BF    LDY #$BF        set result pointer high byte
.,B127 60       RTS             
                                create new numeric variable
.,B128 A5 45    LDA $45         get variable name first character
.,B12A A4 46    LDY $46         get variable name second character
.,B12C C9 54    CMP #$54        compare first character with "T"
.,B12E D0 0B    BNE $B13B       branch if not "T"
.,B130 C0 C9    CPY #$C9        compare second character with "I$"
.,B132 F0 EF    BEQ $B123       if "I$" return null value
.,B134 C0 49    CPY #$49        compare second character with "I"
.,B136 D0 03    BNE $B13B       branch if not "I"
                                if name is "TI" do syntax error
.,B138 4C 08 AF JMP $AF08       do syntax error then warm start
.,B13B C9 53    CMP #$53        compare first character with "S"
.,B13D D0 04    BNE $B143       branch if not "S"
.,B13F C0 54    CPY #$54        compare second character with "T"
.,B141 F0 F5    BEQ $B138       if name is "ST" do syntax error
.,B143 A5 2F    LDA $2F         get end of variables low byte
.,B145 A4 30    LDY $30         get end of variables high byte
.,B147 85 5F    STA $5F         save old block start low byte
.,B149 84 60    STY $60         save old block start high byte
.,B14B A5 31    LDA $31         get end of arrays low byte
.,B14D A4 32    LDY $32         get end of arrays high byte
.,B14F 85 5A    STA $5A         save old block end low byte
.,B151 84 5B    STY $5B         save old block end high byte
.,B153 18       CLC             clear carry for add
.,B154 69 07    ADC #$07        +7, space for one variable
.,B156 90 01    BCC $B159       branch if no overflow to high byte
.,B158 C8       INY             else increment high byte
.,B159 85 58    STA $58         set new block end low byte
.,B15B 84 59    STY $59         set new block end high byte
.,B15D 20 B8 A3 JSR $A3B8       open up space in memory
.,B160 A5 58    LDA $58         get new start low byte
.,B162 A4 59    LDY $59         get new start high byte (-$100)
.,B164 C8       INY             correct high byte
.,B165 85 2F    STA $2F         set end of variables low byte
.,B167 84 30    STY $30         set end of variables high byte
.,B169 A0 00    LDY #$00        clear index
.,B16B A5 45    LDA $45         get variable name 1st character
.,B16D 91 5F    STA ($5F),Y     save variable name 1st character
.,B16F C8       INY             increment index
.,B170 A5 46    LDA $46         get variable name 2nd character
.,B172 91 5F    STA ($5F),Y     save variable name 2nd character
.,B174 A9 00    LDA #$00        clear A
.,B176 C8       INY             increment index
.,B177 91 5F    STA ($5F),Y     initialise variable byte
.,B179 C8       INY             increment index
.,B17A 91 5F    STA ($5F),Y     initialise variable byte
.,B17C C8       INY             increment index
.,B17D 91 5F    STA ($5F),Y     initialise variable byte
.,B17F C8       INY             increment index
.,B180 91 5F    STA ($5F),Y     initialise variable byte
.,B182 C8       INY             increment index
.,B183 91 5F    STA ($5F),Y     initialise variable byte
                                found a match for variable
.,B185 A5 5F    LDA $5F         get variable address low byte
.,B187 18       CLC             clear carry for add
.,B188 69 02    ADC #$02        +2, offset past variable name bytes
.,B18A A4 60    LDY $60         get variable address high byte
.,B18C 90 01    BCC $B18F       branch if no overflow from add
.,B18E C8       INYelse increment high byte
.,B18F 85 47    STA $47         save current variable pointer low byte
.,B191 84 48    STY $48         save current variable pointer high byte
.,B193 60       RTS             
                                set-up array pointer to first element in array
.,B194 A5 0B    LDA $0B         get # of dimensions (1, 2 or 3)
.,B196 0A       ASL             *2 (also clears the carry !)
.,B197 69 05    ADC #$05        +5 (result is 7, 9 or 11 here)
.,B199 65 5F    ADC $5F         add array start pointer low byte
.,B19B A4 60    LDY $60         get array pointer high byte
.,B19D 90 01    BCC $B1A0       branch if no overflow
.,B19F C8       INY             else increment high byte
.,B1A0 85 58    STA $58         save array data pointer low byte
.,B1A2 84 59    STY $59         save array data pointer high byte
.,B1A4 60       RTS             

                                *** -32768 as floating value
.:B1A5 90 80 00 00 00           -32768

                                *** convert float to fixed
.,B1AA 20 BF B1 JSR $B1BF       evaluate integer expression, no sign check
.,B1AD A5 64    LDA $64         get result low byte
.,B1AF A4 65    LDY $65         get result high byte
.,B1B1 60       RTS             

                                *** evaluate integer expression
.,B1B2 20 73 00 JSR $0073       increment and scan memory
.,B1B5 20 9E AD JSR $AD9E       evaluate expression
                                evaluate integer expression, sign check
.,B1B8 20 8D AD JSR $AD8D       check if source is numeric, else do type mismatch
.,B1BB A5 66    LDA $66         get FAC1 sign (b7)
.,B1BD 30 0D    BMI $B1CC       do illegal quantity error if -ve
                                evaluate integer expression, no sign check
.,B1BF A5 61    LDA $61         get FAC1 exponent
.,B1C1 C9 90    CMP #$90        compare with exponent = 2^16 (n>2^15)
.,B1C3 90 09    BCC $B1CE       if n<2^16 go convert FAC1 floating to fixed and return
.,B1C5 A9 A5    LDA #$A5        set pointer low byte to -32768
.,B1C7 A0 B1    LDY #$B1        set pointer high byte to -32768
.,B1C9 20 5B BC JSR $BC5B       compare FAC1 with (AY)
.,B1CC D0 7A    BNE $B248       if <> do illegal quantity error then warm start
.,B1CE 4C 9B BC JMP $BC9B       convert FAC1 floating to fixed and return

                                *** find or make array
                                an array is stored as follows
                                
                                array name             two bytes with the following patterns for different types
                                                       1st char    2nd char
                                                          b7          b7       type             element size
                                                       --------    --------    -----            ------------
                                                          0           0        floating point   5
                                                          0           1        string           3
                                                          1           1        integer          2
                                offset to next array   word
                                dimension count        byte
                                1st dimension size     word, this is the number of elements including 0
                                2nd dimension size     word, only here if the array has a second dimension
                                2nd dimension size     word, only here if the array has a third dimension
                                                       note: the dimension size word is in high byte low byte
                                                       format, not like most 6502 words
                                then for each element the required number of bytes given as the element size above
.,B1D1 A5 0C    LDA $0C         get DIM flag
.,B1D3 05 0E    ORA $0E         OR with data type flag
.,B1D5 48       PHA             push it
.,B1D6 A5 0D    LDA $0D         get data type flag, $FF = string, $00 = numeric
.,B1D8 48       PHA             push it
.,B1D9 A0 00    LDY #$00        clear dimensions count
                                now get the array dimension(s) and stack it (them) before the data type and DIM flag
.,B1DB 98       TYA             copy dimensions count
.,B1DC 48       PHA             save it
.,B1DD A5 46    LDA $46         get array name 2nd byte
.,B1DF 48       PHA             save it
.,B1E0 A5 45    LDA $45         get array name 1st byte
.,B1E2 48       PHA             save it
.,B1E3 20 B2 B1 JSR $B1B2       evaluate integer expression
.,B1E6 68       PLA             pull array name 1st byte
.,B1E7 85 45    STA $45         restore array name 1st byte
.,B1E9 68       PLA             pull array name 2nd byte
.,B1EA 85 46    STA $46         restore array name 2nd byte
.,B1EC 68       PLA             pull dimensions count
.,B1ED A8       TAY             restore it
.,B1EE BA       TSX             copy stack pointer
.,B1EF BD 02 01 LDA $0102,X     get DIM flag
.,B1F2 48       PHA             push it
.,B1F3 BD 01 01 LDA $0101,X     get data type flag
.,B1F6 48       PHA             push it
.,B1F7 A5 64    LDA $64         get this dimension size high byte
.,B1F9 9D 02 01 STA $0102,X     stack before flag bytes
.,B1FC A5 65    LDA $65         get this dimension size low byte
.,B1FE 9D 01 01 STA $0101,X     stack before flag bytes
.,B201 C8       INY             increment dimensions count
.,B202 20 79 00 JSR $0079       scan memory
.,B205 C9 2C    CMP #$2C        compare with ","
.,B207 F0 D2    BEQ $B1DB       if found go do next dimension
.,B209 84 0B    STY $0B         store dimensions count
.,B20B 20 F7 AE JSR $AEF7       scan for ")", else do syntax error then warm start
.,B20E 68       PLA             pull data type flag
.,B20F 85 0D    STA $0D         restore data type flag, $FF = string, $00 = numeric
.,B211 68       PLA             pull data type flag
.,B212 85 0E    STA $0E         restore data type flag, $80 = integer, $00 = float
.,B214 29 7F    AND #$7F        mask dim flag
.,B216 85 0C    STA $0C         restore DIM flag
.,B218 A6 2F    LDX $2F         set end of variables low byte
                                (array memory start low byte)
.,B21A A5 30    LDA $30         set end of variables high byte
                                (array memory start high byte)
                                now check to see if we are at the end of array memory, we would be if there were
                                no arrays.
.,B21C 86 5F    STX $5F         save as array start pointer low byte
.,B21E 85 60    STA $60         save as array start pointer high byte
.,B220 C5 32    CMP $32         compare with end of arrays high byte
.,B222 D0 04    BNE $B228       branch if not reached array memory end
.,B224 E4 31    CPX $31         else compare with end of arrays low byte
.,B226 F0 39    BEQ $B261       go build array if not found
                                search for array
.,B228 A0 00    LDY #$00        clear index
.,B22A B1 5F    LDA ($5F),Y     get array name first byte
.,B22C C8       INY             increment index to second name byte
.,B22D C5 45    CMP $45         compare with this array name first byte
.,B22F D0 06    BNE $B237       branch if no match
.,B231 A5 46    LDA $46         else get this array name second byte
.,B233 D1 5F    CMP ($5F),Y     compare with array name second byte
.,B235 F0 16    BEQ $B24D       array found so branch
                                no match
.,B237 C8       INY             increment index
.,B238 B1 5F    LDA ($5F),Y     get array size low byte
.,B23A 18       CLC             clear carry for add
.,B23B 65 5F    ADC $5F         add array start pointer low byte
.,B23D AA       TAX             copy low byte to X
.,B23E C8       INY             increment index
.,B23F B1 5F    LDA ($5F),Y     get array size high byte
.,B241 65 60    ADC $60         add array memory pointer high byte
.,B243 90 D7    BCC $B21C       if no overflow go check next array

                                *** do bad subscript error
.,B245 A2 12    LDX #$12        error $12, bad subscript error
.:B247 2C       .BYTE $2C       makes next line BIT $0EA2

                                *** do illegal quantity error
.,B248 A2 0E    LDX #$0E        error $0E, illegal quantity error
.,B24A 4C 37 A4 JMP $A437       do error #X then warm start

                                *** found the array
.,B24D A2 13    LDX #$13        set error $13, double dimension error
.,B24F A5 0C    LDA $0C         get DIM flag
.,B251 D0 F7    BNE $B24A       if we are trying to dimension it do error #X then warm
                                start
                                found the array and we're not dimensioning it so we must find an element in it
.,B253 20 94 B1 JSR $B194       set-up array pointer to first element in array
.,B256 A5 0B    LDA $0B         get dimensions count
.,B258 A0 04    LDY #$04        set index to array's # of dimensions
.,B25A D1 5F    CMP ($5F),Y     compare with no of dimensions
.,B25C D0 E7    BNE $B245       if wrong do bad subscript error
.,B25E 4C EA B2 JMP $B2EA       found array so go get element
                                array not found, so build it
.,B261 20 94 B1 JSR $B194       set-up array pointer to first element in array
.,B264 20 08 A4 JSR $A408       check available memory, do out of memory error if no room
.,B267 A0 00    LDY #$00        clear Y
.,B269 84 72    STY $72         clear array data size high byte
.,B26B A2 05    LDX #$05        set default element size
.,B26D A5 45    LDA $45         get variable name 1st byte
.,B26F 91 5F    STA ($5F),Y     save array name 1st byte
.,B271 10 01    BPL $B274       branch if not string or floating point array
.,B273 CA       DEX             decrement element size, $04
.,B274 C8       INY             increment index
.,B275 A5 46    LDA $46         get variable name 2nd byte
.,B277 91 5F    STA ($5F),Y     save array name 2nd byte
.,B279 10 02    BPL $B27D       branch if not integer or string
.,B27B CA       DEX             decrement element size, $03
.,B27C CA       DEX             decrement element size, $02
.,B27D 86 71    STX $71         save element size
.,B27F A5 0B    LDA $0B         get dimensions count
.,B281 C8       INY             increment index ..
.,B282 C8       INY             .. to array  ..
.,B283 C8       INY             .. dimension count
.,B284 91 5F    STA ($5F),Y     save array dimension count
.,B286 A2 0B    LDX #$0B        set default dimension size low byte
.,B288 A9 00    LDA #$00        set default dimension size high byte
.,B28A 24 0C    BIT $0C         test DIM flag
.,B28C 50 08    BVC $B296       branch if default to be used
.,B28E 68       PLA             pull dimension size low byte
.,B28F 18       CLC             clear carry for add
.,B290 69 01    ADC #$01        add 1, allow for zeroeth element
.,B292 AA       TAX             copy low byte to X
.,B293 68       PLA             pull dimension size high byte
.,B294 69 00    ADC #$00        add carry to high byte
.,B296 C8       INY             incement index to dimension size high byte
.,B297 91 5F    STA ($5F),Y     save dimension size high byte
.,B299 C8       INY             incement index to dimension size low byte
.,B29A 8A       TXA             copy dimension size low byte
.,B29B 91 5F    STA ($5F),Y     save dimension size low byte
.,B29D 20 4C B3 JSR $B34C       compute array size
.,B2A0 86 71    STX $71         save result low byte
.,B2A2 85 72    STA $72         save result high byte
.,B2A4 A4 22    LDY $22         restore index
.,B2A6 C6 0B    DEC $0B         decrement dimensions count
.,B2A8 D0 DC    BNE $B286       loop if not all done
.,B2AA 65 59    ADC $59         add array data pointer high byte
.,B2AC B0 5D    BCS $B30B       if overflow do out of memory error then warm start
.,B2AE 85 59    STA $59         save array data pointer high byte
.,B2B0 A8       TAY             copy array data pointer high byte
.,B2B1 8A       TXA             copy array size low byte
.,B2B2 65 58    ADC $58         add array data pointer low byte
.,B2B4 90 03    BCC $B2B9       branch if no rollover
.,B2B6 C8       INY             else increment next array pointer high byte
.,B2B7 F0 52    BEQ $B30B       if rolled over do out of memory error then warm start
.,B2B9 20 08 A4 JSR $A408       check available memory, do out of memory error if no room
.,B2BC 85 31    STA $31         set end of arrays low byte
.,B2BE 84 32    STY $32         set end of arrays high byte
                                now the aray is created we need to zero all the elements in it
.,B2C0 A9 00    LDA #$00        clear A for array clear
.,B2C2 E6 72    INC $72increment array size high byte, now block count
.,B2C4 A4 71    LDY $71         get array size low byte, now index to block
.,B2C6 F0 05    BEQ $B2CD       branch if $00
.,B2C8 88       DEY             decrement index, do 0 to n-1
.,B2C9 91 58    STA ($58),Y     clear array element byte
.,B2CB D0 FB    BNE $B2C8       loop until this block done
.,B2CD C6 59    DEC $59decrement array pointer high byte
.,B2CF C6 72    DEC $72decrement block count high byte
.,B2D1 D0 F5    BNE $B2C8loop until all blocks done
.,B2D3 E6 59    INC $59correct for last loop
.,B2D5 38       SEC             set carry for subtract
.,B2D6 A5 31    LDA $31         get end of arrays low byte
.,B2D8 E5 5F    SBC $5F         subtract array start low byte
.,B2DA A0 02    LDY #$02        index to array size low byte
.,B2DC 91 5F    STA ($5F),Y     save array size low byte
.,B2DE A5 32    LDA $32         get end of arrays high byte
.,B2E0 C8       INY             index to array size high byte
.,B2E1 E5 60    SBC $60         subtract array start high byte
.,B2E3 91 5F    STA ($5F),Y     save array size high byte
.,B2E5 A5 0C    LDA $0C         get default DIM flag
.,B2E7 D0 62    BNE $B34B       exit if this was a DIM command
                                else, find element
.,B2E9 C8       INY             set index to # of dimensions, the dimension indeces
                                are on the stack and will be removed as the position
                                of the array element is calculated
.,B2EA B1 5F    LDA ($5F),Y     get array's dimension count
.,B2EC 85 0B    STA $0B         save it
.,B2EE A9 00    LDA #$00        clear byte
.,B2F0 85 71    STA $71         clear array data pointer low byte
.,B2F2 85 72    STA $72         save array data pointer high byte
.,B2F4 C8       INY             increment index, point to array bound high byte
.,B2F5 68       PLA             pull array index low byte
.,B2F6 AA       TAX             copy to X
.,B2F7 85 64    STA $64         save index low byte to FAC1 mantissa 3
.,B2F9 68       PLA             pull array index high byte
.,B2FA 85 65    STA $65         save index high byte to FAC1 mantissa 4
.,B2FC D1 5F    CMP ($5F),Y     compare with array bound high byte
.,B2FE 90 0E    BCC $B30E       branch if within bounds
.,B300 D0 06    BNE $B308       if outside bounds do bad subscript error
                                else high byte was = so test low bytes
.,B302 C8       INY             index to array bound low byte
.,B303 8A       TXA             get array index low byte
.,B304 D1 5F    CMP ($5F),Y     compare with array bound low byte
.,B306 90 07    BCC $B30F       branch if within bounds
.,B308 4C 45 B2 JMP $B245       do bad subscript error
.,B30B 4C 35 A4 JMP $A435       do out of memory error then warm start
.,B30E C8       INY             index to array bound low byte
.,B30F A5 72    LDA $72         get array data pointer high byte
.,B311 05 71    ORA $71         OR with array data pointer low byte
.,B313 18       CLC             clear carry for either add, carry always clear here ??
.,B314 F0 0A    BEQ $B320       branch if array data pointer = null, skip multiply
.,B316 20 4C B3 JSR $B34C       compute array size
.,B319 8A       TXA             get result low byte
.,B31A 65 64    ADC $64add index low byte from FAC1 mantissa 3
.,B31C AA       TAX             save result low byte
.,B31D 98       TYAget result high byte
.,B31E A4 22    LDY $22         restore index
.,B320 65 65    ADC $65add index high byte from FAC1 mantissa 4
.,B322 86 71    STX $71save array data pointer low byte
.,B324 C6 0B    DEC $0B         decrement dimensions count
.,B326 D0 CA    BNE $B2F2       loop if dimensions still to do
.,B328 85 72    STA $72save array data pointer high byte
.,B32A A2 05    LDX #$05        set default element size
.,B32C A5 45    LDA $45         get variable name 1st byte
.,B32E 10 01    BPL $B331       branch if not string or floating point array
.,B330 CA       DEX             decrement element size, $04
.,B331 A5 46    LDA $46         get variable name 2nd byte
.,B333 10 02    BPL $B337       branch if not integer or string
.,B335 CA       DEX             decrement element size, $03
.,B336 CA       DEX             decrement element size, $02
.,B337 86 28    STX $28         save dimension size low byte
.,B339 A9 00    LDA #$00        clear dimension size high byte
.,B33B 20 55 B3 JSR $B355       compute array size
.,B33E 8A       TXA             copy array size low byte
.,B33F 65 58    ADC $58         add array data start pointer low byte
.,B341 85 47    STA $47         save as current variable pointer low byte
.,B343 98       TYA             copy array size high byte
.,B344 65 59    ADC $59         add array data start pointer high byte
.,B346 85 48    STA $48         save as current variable pointer high byte
.,B348 A8       TAY             copy high byte to Y
.,B349 A5 47    LDA $47         get current variable pointer low byte
                                pointer to element is now in AY
.,B34B 60       RTS             
                                compute array size, result in XY
.,B34C 84 22    STY $22         save index
.,B34E B1 5F    LDA ($5F),Y     get dimension size low byte
.,B350 85 28    STA $28         save dimension size low byte
.,B352 88       DEY             decrement index
.,B353 B1 5F    LDA ($5F),Y     get dimension size high byte
.,B355 85 29    STA $29         save dimension size high byte
.,B357 A9 10    LDA #$10        count = $10 (16 bit multiply)
.,B359 85 5D    STA $5D         save bit count
.,B35B A2 00    LDX #$00        clear result low byte
.,B35D A0 00    LDY #$00        clear result high byte
.,B35F 8A       TXA             get result low byte
.,B360 0A       ASL             *2
.,B361 AA       TAX             save result low byte
.,B362 98       TYA             get result high byte
.,B363 2A       ROL             *2
.,B364 A8       TAY             save result high byte
.,B365 B0 A4    BCS $B30B       if overflow go do "Out of memory" error
.,B367 06 71    ASL $71         shift element size low byte
.,B369 26 72    ROL $72         shift element size high byte
.,B36B 90 0B    BCC $B378       skip add if no carry
.,B36D 18       CLC             else clear carry for add
.,B36E 8A       TXA             get result low byte
.,B36F 65 28    ADC $28         add dimension size low byte
.,B371 AA       TAX             save result low byte
.,B372 98       TYA             get result high byte
.,B373 65 29    ADC $29         add dimension size high byte
.,B375 A8       TAY             save result high byte
.,B376 B0 93    BCS $B30B       if overflow go do "Out of memory" error
.,B378 C6 5D    DEC $5D         decrement bit count
.,B37A D0 E3    BNE $B35F       loop until all done
.,B37C 60       RTS             
                                perform FRE()
.,B37D A5 0D    LDA $0D         get data type flag, $FF = string, $00 = numeric
.,B37F F0 03    BEQ $B384       branch if numeric
.,B381 20 A6 B6 JSR $B6A6       pop string off descriptor stack, or from top of string
                                space returns with A = length, X=$71=pointer low byte,
                                Y=$72=pointer high byte
                                FRE(n) was numeric so do this
.,B384 20 26 B5 JSR $B526       go do garbage collection
.,B387 38       SEC             set carry for subtract
.,B388 A5 33    LDA $33         get bottom of string space low byte
.,B38A E5 31    SBC $31         subtract end of arrays low byte
.,B38C A8       TAY             copy result to Y
.,B38D A5 34    LDA $34         get bottom of string space high byte
.,B38F E5 32    SBC $32         subtract end of arrays high byte

                                *** convert fixed integer AY to float FAC1
.,B391 A2 00    LDX #$00        set type = numeric
.,B393 86 0D    STX $0D         clear data type flag, $FF = string, $00 = numeric
.,B395 85 62    STA $62         save FAC1 mantissa 1
.,B397 84 63    STY $63         save FAC1 mantissa 2
.,B399 A2 90    LDX #$90        set exponent=2^16 (integer)
.,B39B 4C 44 BC JMP $BC44       set exp = X, clear FAC1 3 and 4, normalise and return

                                *** perform POS()
.,B39E 38       SEC             set Cb for read cursor position
.,B39F 20 F0 FF JSR $FFF0       read/set X,Y cursor position
.,B3A2 A9 00    LDA #$00        clear high byte
.,B3A4 F0 EB    BEQ $B391       convert fixed integer AY to float FAC1, branch always
                                check not Direct, used by DEF and INPUT
.,B3A6 A6 3A    LDX $3A         get current line number high byte
.,B3A8 E8       INX             increment it
.,B3A9 D0 A0    BNE $B34B       return if not direct mode
                                else do illegal direct error
.,B3AB A2 15    LDX #$15        error $15, illegal direct error
.:B3AD 2C       .BYTE $2C       makes next line BIT $1BA2
.,B3AE A2 1B    LDX #$1B        error $1B, undefined function error
.,B3B0 4C 37 A4 JMP $A437       do error #X then warm start
```
