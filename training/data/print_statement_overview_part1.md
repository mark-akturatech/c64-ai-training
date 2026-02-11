# PRINT (Commodore 64 BASIC)

**Summary:** PRINT statement syntax and behavior: "PRINT [<variable>][<,/;><variable>]..." — output-list expressions (any type), blank-line behavior, punctuation roles (blanks, commas, semicolons), 80-character logical line divided into eight 10-character zones, and how commas/semicolons position the next printed item.

**Syntax and action**
FORMAT: PRINT [<variable>][<,/;><variable>]...

Action: PRINT writes items from an output-list to the current device (normally the screen). CMD may redirect PRINT output to another device. If no output-list is present, a blank line is printed. The output-list may contain one or more expressions (variables or expressions of any type).

**Punctuation and positioning rules**
- The punctuation characters that separate items in the output-list are blanks, commas, or semicolons.
- The logical screen line for PRINT is 80 characters wide and divided into 8 print zones of 10 columns each.
- A comma in the output-list causes the next value to be printed at the beginning of the next 10-character zone.
- A semicolon causes the next value to be printed immediately following the previous value (no zone advance).
- The position of each printed item is therefore determined by which punctuation separates it from the previous item.

**Exceptions to the comma/semicolon zone-placement rule**
1. Numeric items are followed by an added space.
2. Positive numbers have a space preceding them.

**Behavior of blanks as separators**
- Using blanks or no punctuation between string constants or variable names has the same effect as a semicolon.
- Blanks between a string and a numeric item or between two numeric items will stop output without printing the second item.

**Examples demonstrating comma vs semicolon placement and the behavior of blanks as separators**

1. **Using commas to separate items:**
   Output:
   Explanation: Commas move the cursor to the start of the next 10-character zone.

2. **Using semicolons to separate items:**
   Output:
   Explanation: Semicolons print items immediately after the previous item without additional spacing.

3. **Using blanks between string constants:**
   Output:
   Explanation: Blanks between string constants have the same effect as a semicolon; items are printed immediately adjacent to each other.

4. **Using blanks between a string and a numeric item:**
   Output:
   Explanation: Blanks between a string and a numeric item stop output without printing the numeric item.

5. **Using blanks between two numeric items:**
   Output:
   Explanation: Blanks between two numeric items stop output without printing the second numeric item.

## Source Code

   ```basic
   PRINT "TOTAL:", 95, "SHORTAGE:", 15
   ```

   ```
   TOTAL:     95           SHORTAGE:     15
   ```

   ```basic
   PRINT "TOTAL:"; 95; "SHORTAGE:"; 15
   ```

   ```
   TOTAL: 95SHORTAGE: 15
   ```

   ```basic
   PRINT "HELLO" "WORLD"
   ```

   ```
   HELLOWORLD
   ```

   ```basic
   PRINT "VALUE" 100
   ```

   ```
   VALUE
   ```

   ```basic
   PRINT 10 20
   ```

   ```
   10
   ```


## References
- "print_statement_exceptions_and_output_rules" — expands on the two exceptions and further punctuation rules
- "print_statement_examples" — sample programs and examples showing PRINT behavior and punctuation effects