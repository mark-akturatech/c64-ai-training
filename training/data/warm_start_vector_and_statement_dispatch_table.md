# STMDSP (Statement Dispatch Vector Table) and Warm Start ($A002-$A051)

**Summary:** Covers the Warm Start Vector at $A002-$A003 (BRK/WARM start entry for BASIC), the ASCII identifier at $A004-$A00B ("CBMBASIC"), and the STMDSP statement-dispatch vector table at $A00C-$A051 which maps BASIC statement tokens (128..162) to their routine addresses; mentions NEWSTT ($A7AE) and CHRGET dispatch mechanism.

## Warm Start Vector ($A002-$A003)
The Warm Start Vector at $A002-$A003 points to the ROM entry used to reset BASIC after the STOP/RESTORE key combination (and is the same vector used for BRK). Entering BASIC through this vector preserves the program in memory (it performs a warm restart rather than a cold reset). See the current warm start entry at $E37B for the primary entry point.

## ASCII identifier ($A004-$A00B)
The eight bytes at $A004-$A00B contain the ASCII characters "CBMBASIC". This appears to be an identifier stored in ROM and is not referenced elsewhere in the BASIC code.

## Statement Dispatch Vector Table — STMDSP ($A00C-$A051)
STMDSP is a table of two-byte vectors (stored in the ROM area $A00C-$A051). Each vector points to one byte before the entry of the routine that implements a BASIC statement. The dispatcher mechanism works as follows:
- When the interpreter needs to execute a statement, NEWSTT (located at $A7AE / 42926) pushes the table entry (address-1) onto the stack and transfers control to CHRGET.
- CHRGET terminates with an RTS; that RTS pulls the stored address-1, increments it (restoring the actual address), and places it in the program counter — effectively jumping into the statement handler.
- Because the table stores address-1 entries, the reproduced routine addresses below show the actual target (address after increment).

This table is useful for locating and disassembling the ROM routines that implement specific BASIC statements.

## Source Code
```text
; STMDSP: Statement Dispatch Vector Table (stored as address-1 in ROM)
; Reproduced here with actual routine addresses (address after increment).

Token #   Statement   Routine Address (decimal)   Routine Address (hex)
128 $80   END         43057                       $A831
129 $81   FOR         42818                       $A742
130 $82   NEXT        44318                       $AD1E
131 $83   DATA        43256                       $A8F8
132 $84   INPUT#      43941                       $ABA5
133 $85   INPUT       43967                       $ABBF
134 $86   DIM         45185                       $B081
135 $87   READ        44038                       $AC06
136 $88   LET         43429                       $A9A5
137 $89   GOTO        43168                       $A8A0
138 $8A   RUN         43121                       $A871
139 $8B   IF          43304                       $A928
140 $8C   RESTORE     43037                       $A81D
141 $8D   GOSUB       43139                       $A883
142 $8E   RETURN      43218                       $A8D2
143 $8F   REM         43323                       $A93B
144 $90   STOP        43055                       $A82F
145 $91   ON          43339                       $A94B
146 $92   WAIT        47149                       $B82D
147 $93   LOAD        57704                       $E168
148 $94   SAVE        57686                       $E156
149 $95   VERIFY      57701                       $E165
150 $96   DEF         46003                       $B3B3
151 $97   POKE        47140                       $B824
152 $98   PRINT#      43648                       $AA80
153 $99   PRINT       43680                       $AAA0
154 $9A   CONT        43095                       $A857
155 $9B   LIST        42652                       $A69C
156 $9C   CLR         42590                       $A65E
157 $9D   CMD         43654                       $AA86
158 $9E   SYS         57642                       $E12A
159 $9F   OPEN        57790                       $E1BE
160 $A0   CLOSE       57799                       $E1C7
161 $A1   GET         43899                       $AB7B
162 $A2   NEW         42562                       $A642
```

## Key Registers
- $A002-$A003 - Warm Start Vector - address used for STOP/RESTORE and BRK entry into BASIC
- $A004-$A00B - ROM data - ASCII "CBMBASIC"
- $A00C-$A051 - STMDSP - Statement Dispatch Vector Table (tokens 128..162 -> routine vectors)

## References
- "fndfor_and_crunch_qplop" — expands on related BASIC routines that interact with STMDSP during parsing/execution
- "warm_start_entry_point_58235_$E37B" — the current warm start entry point referenced in the ROM (see $E37B)

## Labels
- STMDSP
- NEWSTT
- CHRGET
