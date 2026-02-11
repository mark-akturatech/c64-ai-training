# FUNDSP (41042-41087 / $A052-$A07F): Function dispatch vector table

**Summary:** FUNDSP at $A052-$A07F is the BASIC function dispatch vector table (tokens 180..202), containing two-byte vectors that point to the ROM routine addresses which implement BASIC functions (SGN, INT, ABS, USR, FRE, POS, SQR, RND, LOG, EXP, COS, SIN, TAN, ATN, PEEK, LEN, STR$, VAL, ASC, CHR$, LEFT$, RIGHT$, MID$).

## Description
This table holds two-byte vectors (pointers) that select the ROM routine to evaluate a BASIC function token found during expression parsing. When a function token is encountered, the expression inside the parentheses is evaluated first by the routines starting at 44446 ($AD9E); after that evaluation this dispatch table (FUNDSP) is used to locate and jump to the specific function evaluator.

Notable details reproduced from the source:
- Vectors correspond to token numbers 180 ($B4) through 202 ($CA).
- The USR function's vector contains the value 784 ($0310), which is the address of a JMP instruction that precedes the user-supplied vector (i.e., the ROM JMP at $0310 transfers control to the user vector).
- The table can be used to locate the absolute ROM addresses of the function implementations.

**[Note: Source may contain an error — the listing repeats token 180 for COS; the COS token should be $BE (decimal 190).]**

## Source Code
```text
41042-41087   $A052-$A07F    FUNDSP
                             TABLE
Function Dispatch Vector Table

This table contains two-byte vectors, each of which points to the
address of one of the routines that performs a BASIC function.

A function is distinguished by a following argument, in parentheses.
The expression in the parentheses is first evaluated by the routines
which begin at 44446 ($AD9E).  Then this table is used to find the
address of the function that corresponds to the token number of the
function to be executed.

The substance of this table, which can be used for locating the
addresses of these routines, is reproduced below.  Note that the
address for the USR function is 784 ($310), which is the address of
the JMP instruction which precedes the user-supplied vector.

Token #   Function     Routine Address
180 $B4   SGN          48185 $BC39
181 $B5   INT          48332 $BCCC
182 $B6   ABS          48216 $BC58
183 $B7   USR            784 $0310
184 $B8   FRE          45949 $B37D
185 $B9   POS          45982 $B39E
186 $BA   SQR          49009 $BF71
187 $BB   RND          57495 $E097
188 $BC   LOG          45794 $B9EA
189 $BD   EXP          49133 $BFED
180 $BE   COS          57956 $E264
191 $BF   SIN          57963 $E26B
192 $C0   TAN          58036 $E2B4
193 $C1   ATN          58126 $E30E
194 $C2   PEEK         47117 $B80D
195 $C3   LEN          46972 $B77C
196 $C4   STR$         46181 $B465
197 $C5   VAL          47021 $B7AD
198 $C6   ASC          46987 $B78B
199 $C7   CHR$         46828 $B6EC
200 $C8   LEFT$        46848 $B700
201 $C9   RIGHT$       46892 $B72C
202 $CA   MID$         46903 $B737

41088-41117   $A080-$A09D    OPTAB
```

## Key Registers
- $A052-$A07F - ROM (FUNDSP) - BASIC function dispatch vector table (tokens $B4..$CA / decimal 180..202)
- $A080-$A09D - ROM (OPTAB) - Operator dispatch table (see OPTAB / operator evaluation)

## References
- "optab_operator_dispatch_table" — operator dispatch table / interactions with function evaluation in OPTAB