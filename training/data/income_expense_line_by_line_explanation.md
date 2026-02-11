# Income/Expense BASIC example — Line-by-line explanation

**Summary:** Line-by-line breakdown of a Commodore 64 BASIC income/expense example with searchable terms: line numbers (5,10,20,...,230), BASIC statements (PRINT, INPUT), arithmetic (C=A*B), formatted PRINT usage, screen clear, percentage calculations, and a time delay loop.

**Line-by-Line Explanation**

- **Line 5**: Clears the screen using `PRINT CHR$(147)`, where CHR$(147) is the PETSCII code for clearing the screen.
- **Line 10**: Prompts the user to input the total income with `INPUT "TOTAL INCOME"; I`.
- **Line 20**: Inserts a blank line for visual spacing using `PRINT`.
- **Line 30**: Prompts for the first expense category with `INPUT "EXPENSE CATEGORY 1"; E1$`.
- **Line 40**: Prompts for the first expense amount with `INPUT "EXPENSE AMOUNT 1"; E1`.
- **Line 50**: Inserts a blank line using `PRINT`.
- **Line 60**: Prompts for the second expense category with `INPUT "EXPENSE CATEGORY 2"; E2$`.
- **Line 70**: Prompts for the second expense amount with `INPUT "EXPENSE AMOUNT 2"; E2`.
- **Line 80**: Inserts a blank line using `PRINT`.
- **Line 90**: Prompts for the third expense category with `INPUT "EXPENSE CATEGORY 3"; E3$`.
- **Line 100**: Prompts for the third expense amount with `INPUT "EXPENSE AMOUNT 3"; E3`.
- **Line 110**: Clears the screen again using `PRINT CHR$(147)`.
- **Line 120**: Calculates the total expenses with `E = E1 + E2 + E3`.
- **Line 130**: Calculates the percentage of total expenses relative to income with `P = (E / I) * 100`.
- **Line 140**: Displays the total income with `PRINT "TOTAL INCOME: "; I`.
- **Line 150**: Displays the total expenses with `PRINT "TOTAL EXPENSES: "; E`.
- **Line 160**: Displays the net income (income minus expenses) with `PRINT "NET INCOME: "; I - E`.
- **Line 170**: Inserts a blank line using `PRINT`.
- **Lines 180–200**: Calculates and displays the percentage each expense contributes to the total expenses:
  - **Line 180**: `PE1 = (E1 / E) * 100`
  - **Line 190**: `PE2 = (E2 / E) * 100`
  - **Line 200**: `PE3 = (E3 / E) * 100`
- **Line 210**: Inserts a blank line using `PRINT`.
- **Line 220**: Displays each expense category with its corresponding percentage:
  - `PRINT E1$; ": "; PE1; "%"`
  - `PRINT E2$; ": "; PE2; "%"`
  - `PRINT E3$; ": "; PE3; "%"`
- **Line 230**: Implements a time delay loop to pause before the program ends:
  - `FOR T = 1 TO 500: NEXT T`

## Source Code

```basic
5 PRINT CHR$(147)
10 INPUT "TOTAL INCOME"; I
20 PRINT
30 INPUT "EXPENSE CATEGORY 1"; E1$
40 INPUT "EXPENSE AMOUNT 1"; E1
50 PRINT
60 INPUT "EXPENSE CATEGORY 2"; E2$
70 INPUT "EXPENSE AMOUNT 2"; E2
80 PRINT
90 INPUT "EXPENSE CATEGORY 3"; E3$
100 INPUT "EXPENSE AMOUNT 3"; E3
110 PRINT CHR$(147)
120 E = E1 + E2 + E3
130 P = (E / I) * 100
140 PRINT "TOTAL INCOME: "; I
150 PRINT "TOTAL EXPENSES: "; E
160 PRINT "NET INCOME: "; I - E
170 PRINT
180 PE1 = (E1 / E) * 100
190 PE2 = (E2 / E) * 100
200 PE3 = (E3 / E) * 100
210 PRINT
220 PRINT E1$; ": "; PE1; "%"
230 FOR T = 1 TO 500: NEXT T
```

## References

- Commodore 64 Programmer's Reference Guide, Chapter 1: BASIC Programming Rules
- Commodore 64 User's Guide, Chapter 4: Programming in BASIC