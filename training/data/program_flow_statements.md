# COMMODORE 64 — PROGRAM FLOW (BASIC Control Statements)

**Summary:** Describes BASIC control-flow statements on the C64: GOTO, IF ... THEN, FOR ... TO ... STEP ... / NEXT (NEXT A optional), GOSUB / RETURN (subroutine call/return), and computed branches ON X GOTO / ON X GOSUB. Includes short examples in Commodore BASIC.

## Statements
- GOTO X  
  Branches execution to line X.

- IF <condition> THEN <statement>  
  If the assertion is true, execute the following part of the statement (the code after THEN). If the assertion is false, execution continues with the next program line.

- FOR var = start TO end [STEP n]  
  Begins a numeric loop. Executes all statements between the FOR and its corresponding NEXT, with var taking values from start to end in increments of STEP n. STEP defaults to 1 if omitted.

- NEXT [var]  
  Marks the end of the loop and returns control to the matching FOR. The loop variable name after NEXT is optional.

- GOSUB line  
  Branches to a subroutine beginning at the specified line. The return address (the statement following the GOSUB) is pushed so RETURN can resume execution.

- RETURN  
  Marks the end of a subroutine; returns execution to the statement following the most recent GOSUB.

- ON expr GOTO a,b,...  
  Computed GOTO: evaluates expr and branches to the Nth line number in the list where N is the value of expr (1-based). If expr equals 1, branch to the first listed line number, etc.

- ON expr GOSUB a,b,...  
  Computed GOSUB: same indexing as ON ... GOTO but performs a subroutine call to the chosen line.

## Source Code
```basic
10 REM GOTO example
20 PRINT "START"
30 GOTO 70
40 PRINT "THIS WILL BE SKIPPED"
50 GOTO 90
60 REM UNUSED
70 PRINT "JUMPED TO 70"
80 GOTO 100
90 PRINT "THIS WOULD HAVE BEEN HERE"
100 PRINT "END"

200 REM IF ... THEN example
210 A = 5
220 IF A = 5 THEN PRINT "A IS FIVE"
230 IF A <> 5 THEN PRINT "A IS NOT FIVE"  : REM executes next line if false

300 REM FOR ... NEXT example (STEP 2)
310 FOR I = 1 TO 10 STEP 2
320 PRINT I
330 NEXT I

400 REM NEXT without variable (variable optional)
410 FOR J = 1 TO 3
420 PRINT "J=";J
430 NEXT     : REM matches the FOR above

500 REM GOSUB / RETURN example
510 PRINT "CALL SUBROUTINE"
520 GOSUB 2000
530 PRINT "BACK FROM SUB"
540 END

2000 REM Subroutine at line 2000
2010 PRINT "IN SUBROUTINE"
2020 RETURN

3000 REM ON X GOTO and ON X GOSUB examples
3010 X = 2
3020 ON X GOTO 3100,3200,3300  : REM if X=2 jumps to 3200
3030 ON X GOSUB 3400,3500     : REM if X=1 calls 3400, if X=2 calls 3500
3040 END

3100 PRINT "GOTO TARGET 1" : RETURN
3200 PRINT "GOTO TARGET 2" : RETURN
3300 PRINT "GOTO TARGET 3" : RETURN

3400 PRINT "GOSUB TARGET 1" : RETURN
3500 PRINT "GOSUB TARGET 2" : RETURN
```

## References
- "input_output_commands" — I/O commands often used within control flow (INPUT/PRINT/DATA)
- "system_commands" — program execution commands (RUN, STOP, CONT) that interact with program flow
