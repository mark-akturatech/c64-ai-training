# INCOME/EXPENSE BASIC example (C64)

**Summary:** Commodore 64 BASIC program demonstrating INPUT and PRINT for collecting a numeric monthly income and three expense categories (string names e1$..e3$ and numeric amounts e1..e3), calculating totals and percentages, screen clearing ({clear}), a short delay loop, and a repeat prompt.

## Program description
This BASIC listing interactively prompts for:
- monthly income (numeric variable IN)
- three expense category names (e1$, e2$, e3$) and their numeric amounts (e1, e2, e3)

Behavior and calculations:
- Total expenses e = e1 + e2 + e3
- ep = e / in  (fraction of income used by expenses)
- Prints income, total expenses, balance (in - e), each expense category with its percent of total expenses ((ei / e) * 100), and the percent of income used (ep * 100)
- A simple delay loop (for x = 1 to 5000 : next) provides a pause before the repeat prompt
- At the end the program asks "repeat? (y or n)" and jumps back to line 5 if the user answers "y"

Variables and types:
- IN, e1, e2, e3, e, ep, x — numeric (floating-point in Commodore BASIC)
- e1$, e2$, e3$, y$ — string
- The listing uses PRINT to mix string variables and expressions (the listing places string literals adjacent to variables). (If your interpreter requires explicit separators, use PRINT e1$; "="; (e1/e)*100; "% of total expenses".)

Important constraints (preserved from the listing):
- IN must not be 0 (division by zero when computing ep)
- E1, E2, E3 must not all be 0 simultaneously (division by zero when computing expense percents)

Runtime notes (from source behavior):
- If total expenses e = 0, expressions (e1/e)*100 etc. will cause division by zero runtime errors; the source enforces this by the stated constraint rather than checking in code.
- INPUT expects numeric input for numeric variables; entering non-numeric input for numeric variables will produce an error in BASIC.

## Source Code
```basic
start tok64 page20.prg
 5 print"{clear}"
 10 print"monthly income":input in
 20 print
 30 print"expense category 1":input e1$
 40 print"expense amount":input e1
 50 print
 60 print"expense category 2":input e2$
 70 print"expense amount":input e2
 80 print
 90 print"expense category 3":input e3$
100 print"expense amount":input e3
110 print"{clear}"
120 e=e1+e2+e3
130 ep=e/in
140 print"monthly income: $"in
150 print"total expenses: $"e
160 print"balance equals: $"in-e
170 print
180 print e1$"="(e1/e)*100"% of total expenses"
190 print e2$"="(e2/e)*100"% of total expenses"
200 print e3$"="(e3/e)*100"% of total expenses"
210 print
220 print"your expenses="ep*100"% of your total income"
230 forx=1to5000:next:print
240 print"repeat? (y or n)":input y$:if y$="y"then 5
250 print"{clear}":end
stop tok64
```

```text
+-----------------------------------------------------------------------+
| NOTE:IN can NOT = 0, and E1, E2, E3 can NOT all be 0 at the same time.|
+-----------------------------------------------------------------------+
```

## References
- "using_input_statement" — INPUT usage in BASIC (expanded examples)