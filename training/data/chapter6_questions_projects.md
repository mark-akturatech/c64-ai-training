# BASIC+ML: divide-by-two, bootstrap loaders, sprite/screen loaders, and a BASIC-variable rename (dangerous)

**Summary:** Example BASIC + 6502 machine language snippets demonstrating BASIC↔ML data exchange with POKE/PEEK, SYS entry, a DATA/READ bootstrap to place ML into RAM, a simple LOAD+SYS cassette/disk bootstrap pattern, examples for loading sprite/screen blocks into RAM (for later VIC-II setup), and a warned sketch for renaming a tokenized BASIC variable by editing BASIC program memory.

**Divide a POKEd value by two (BASIC <-> ML, safe example)**

Description
- BASIC reads a byte 0..255, POKEs it into RAM, calls a tiny ML routine via SYS which divides the byte by two (logical shift right), ML stores result back at the same address, BASIC PEEKS and prints it.
- Uses absolute addressing; ML is placed at $C000 (49152 decimal). The data byte is stored at $0200 (512 decimal) in this example.

Implementation notes
- ML uses LDA (absolute), LSR A, STA (absolute), RTS.
- Two loader options shown: (A) BASIC DATA/READ loader that POKEs ML into RAM, (B) manual POKE of opcode bytes.

## Source Code
```basic
10 INPUT "ENTER 0-255":N
20 IF N<0 OR N>255 THEN PRINT "OUT OF RANGE":GOTO 10
30 POKE 512,N           :REM store value at $0200
40 GOSUB 200             :REM load ML into $C000
50 SYS 49152             :REM call ML at $C000
60 PRINT "RESULT=";PEEK(512)
70 END

200 REM --- LOAD ML INTO $C000 USING DATA/READ ---
210 DATA 173,0,2,10,141,0,2,96
220 FOR I=0 TO 7
230 READ B
240 POKE 49152+I,B
250 NEXT I
260 RETURN
```

```asm
; Machine code (for listing/reference) placed at $C000:
;   LDA $0200
;   LSR A
;   STA $0200
;   RTS

        *=$C000
C000:   AD 00 02     ; LDA $0200
C003:   0A           ; LSR A
C004:   8D 00 02     ; STA $0200
C007:   60           ; RTS

; bytes: $AD,$00,$02,$0A,$8D,$00,$02,$60
```

Alternative direct POKE (BASIC) instead of DATA/READ:
```basic
100 DIM M(7)
110 M(0)=173:M(1)=0:M(2)=2:M(3)=10:M(4)=141:M(5)=0:M(6)=2:M(7)=96
120 FOR I=0 TO 7:POKE 49152+I,M(I):NEXT I
130 SYS 49152
```

Notes
- The ML routine divides by two using LSR (logical shift right), which discards the low bit (no rounding up). For signed interpretation a different algorithm is required.

**BASIC bootstrap to load a previously saved program (cassette/disk) and SYS it**

Description
- Typical pattern: load the binary or ML program (from tape or disk) so it resides at its saved start address, then SYS to the entry point. The start address depends on how the program was saved (header or user-specified load address). Replace start_address below with the known load address.

Examples (replace "FILENAME" and start_address as appropriate)

Disk (1541) example:

Cassette example:

Notes
- Many saved ML programs include a two-byte load address header. After LOAD the bytes land at that address; you must SYS to the correct entry (the program's saved start).
- If you don't know the entry address, use a small BASIC data bootstrap (see first example) to place a tiny ML entry routine at a fixed address which then jumps to the cassette buffer location.

Bootstrapping from an explicit cassette buffer:
- The cassette buffer is located at memory address 828 ($033C) and spans 192 bytes up to address 1019 ($03FB). ([vic-20.it](https://www.vic-20.it/wp-content/uploads/2020/12/Cassette_Book_for_the_Commodore-64_and_VIC-20.pdf?utm_source=openai))
- If your tape utility places the block at this buffer address, simply SYS to that address after the cassette load finishes.

**Boot loaders for sprites or whole screens (general method)**

Description
- The usual pattern for sprite/charset/screen bootstraps:
  1. Read the raw 64-byte sprite blocks (or 8 KB screen/charset blocks) into a free RAM area.
  2. Point the VIC-II to the data (sprite pointers or character base), or copy the screen/charset into the VIC-visible RAM area.
  3. Optionally install an ML entry that sets VIC registers and returns to BASIC or runs a demo.

Example: BASIC + DATA loader that writes three 64-byte sprites at $3000..$307F (change addresses as needed); after loading you must update VIC sprite pointers to point to those 64-byte pages (pointer = (address/64) & $FF).

Notes
- The actual write to VIC-II registers and the sprite-pointer table depends on machine (C64) registers and where the VIC expects pointers; update those registers from ML or BASIC POKE once you know the pointer table address and register mapping.
- For whole-screen or charset loads, load the block into the target RAM area (e.g., $2000 for screen memory, or banked RAM for charsets) and then set VIC registers or pointers accordingly.

**Machine language to change a BASIC variable name — WARNING: dangerous, advanced**

Description and warning
- BASIC on the C64 stores the tokenized program and variable names in the BASIC program area. Editing this in-place can corrupt program structure, create duplicate variable symbols, or crash the interpreter. Only attempt with backups and in controlled test programs.
- This example gives a minimal, constrained approach: overwrite a tokenized variable name at a known byte address in BASIC program memory. It does not attempt to parse the full token table or update cross-references; it simply overwrites bytes at the supplied address with a new name and NUL-terminates the token as appropriate. Use only when you can locate the exact byte offset of the variable name in the token stream.

Operation contract
- Input to ML:
  - AddrLow/AddrHigh in zero page (pointer to the first byte of the tokenized variable name to change)
  - NewNameAddrLow/NewNameAddrHigh in zero page (pointer to a scratch area containing the new ASCII token bytes)
  - NewNameLength in zero page (length in bytes, must not exceed original name length)
- Behavior:
  - Copies NewNameLength bytes over the existing name bytes.
  - If new name shorter than original, pads the rest with $00 (or appropriate token terminator based on actual token stream).
  - Returns with RTS.

CAVEAT: Real BASIC tokenized format uses token bytes, length encoding, and possible pointer structures — a robust implementation must parse tokens and update symbol tables.

Example (assembly skeleton; must be adapted and used with extreme caution):

Example BASIC usage (dangerous toy example — addresses must be determined by examining the tokenized BASIC image):

Notes and safety
- This skeleton does not handle token-byte formats, length tokens, or BASIC's internal symbol table adjustments.
- A correct implementation must:
  - Locate BASIC program start and end (using the BASIC pointers in zero page),
  - Parse the tokenized line stream,
  - Locate the variable token (compare tokenized name bytes),
  - Update or re-tokenize names consistently,
  - Update any variable symbol table entries (if required).
- Use extreme caution: always work on a copy of the program in RAM first, and test on trivial programs.

## Source Code

```basic
10 PRINT "INSERT DISK WITH FILENAME 'HELLO'":PRINT "PRESS RETURN"
20 GET A$:IF A$="" THEN 20
30 LOAD "HELLO",8,1    :REM loads binary into its saved address (use ,1 if saved with start address)
40 SYS 12288            :REM example: call entry at $3000 (decimal 12288) - change to actual entry
```

```basic
10 PRINT "PRESS PLAY ON TAPE"
20 LOAD "HELLO",1,1     :REM loads program to address embedded in tape header
30 SYS 12288            :REM change to the program's actual load/entry address
```

```basic
100 REM LOAD THREE SPRITES INTO $3000
110 DATA S0_0,S0_1,...,S0_63   :REM sprite 0 bytes (64 entries)
120 DATA S1_0,...,S1_63        :REM sprite 1
130 DATA S2_0,...,S2_63        :REM sprite 2
140 REM Example loader (sketch)
150 ADDR=12288 :REM $3000 decimal
160 FOR I=0 TO 191
170 READ B
180 POKE ADDR+I,B
190 NEXT I
200 PRINT "SPRITES LOADED TO";ADDR
210 REM To use: set VIC sprite pointer table entries to ADDR/64 for each sprite
```

```asm
; Inputs (zero page usage example; choose free zero page locations in your program):
; $FB/$FC - pointer to variable name location (low/high)
; $F8/$F9 - pointer to new name bytes (low/high)
; $F7    - new name length (N)

        *=$C100
ML_RENAME:
        LDY #0
COPY_LOOP:
        LDA ($F8),Y     ; load byte from new name
        STA ($FB),Y     ; store into BASIC token stream (overwrite)
        INY
        CPY $F7
        BNE COPY_LOOP
        RTS
```

```basic
100 REM -- DANGEROUS: setup pointers for ML_RENAME --
110 REM Assume we have located the byte offset of the variable name "X" in the token stream: OFFSET
120 OFFSET = 3000 :REM replace with actual byte offset of token in memory
130 POKE 249, OFFSET AND 255      :REM $F9 low (pointer to new name) - example only
140 POKE 250, OFFSET \ 256        :REM $FA high (pointer) - adjust layout to your zero page convention
150 REM Fill new name bytes in memory and call ML_RENAME via SYS
```

## References
- "data_exchange_methods_between_basic_and_machine_language" — practical ML
