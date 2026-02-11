# ASCII and CHR$ Codes (PRINT CHR$(X): 0–63)

**Summary:** Table of printable output for PRINT CHR$(X) for character codes $00–$3F (0–63), and note that PRINT ASC("x") returns the numeric code for a typed character. Covers control characters, cursor/color keys, punctuation, digits and basic symbols.

## Mapping 0–63
This table shows what appears when you execute PRINT CHR$(X) for X = 0..63. (PRINT ASC("x") returns the numeric value for a typed character; useful with GET or when emitting control/keyboard codes that cannot be quoted.)

## Source Code
```text
0   -> (no visible character)
1   -> (no visible character)
2   -> (no visible character)
3   -> (no visible character)
4   -> (no visible character)
5   -> {white}
6   -> (no visible character)
7   -> (no visible character)
8   -> disSHIFT+C=
9   -> enaSHIFT+C=
10  -> (no visible character)
11  -> (no visible character)
12  -> (no visible character)
13  -> return
14  -> lower case
15  -> (no visible character)
16  -> (no visible character)
17  -> {down}
18  -> {rvs on}
19  -> {home}
20  -> {del}
21  -> (no visible character)
22  -> (no visible character)
23  -> (no visible character)
24  -> (no visible character)
25  -> (no visible character)
26  -> (no visible character)
27  -> (no visible character)
28  -> {red}
29  -> {right}
30  -> {green}
31  -> {blue}
32  -> SPACE
33  -> !
34  -> "
35  -> #
36  -> $
37  -> %
38  -> &
39  -> '
40  -> (
41  -> )
42  -> *
43  -> +
44  -> ,
45  -> -
46  -> .
47  -> /
48  -> 0
49  -> 1
50  -> 2
51  -> 3
52  -> 4
53  -> 5
54  -> 6
55  -> 7
56  -> 8
57  -> 9
58  -> :
59  -> ;
60  -> <
61  -> =
62  -> >
63  -> ?
```

## References
- "ascii_chr_codes_68_183" — continued CHR$ table covering codes 68–183 (letters, function keys, extended graphics/colors)
- "ascii_chr_codes_184_191_and_extended_mappings" — remaining CHR$ values and extended-code mapping notes (184–255)

## Labels
- WHITE
- RED
- GREEN
- BLUE
