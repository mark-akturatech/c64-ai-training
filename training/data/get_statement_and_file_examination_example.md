# GET# — retrieve raw bytes from a file (BASIC)

**Summary:** GET# file#, variable list reads raw bytes from a sequential disk file one character at a time (including CR, commas, separators). Prefer string variables (A$) because receiving non-numeric data into numeric variables causes a BASIC error; GET# is safer than INPUT# for examining arbitrary or damaged files.

## Behavior and usage
- FORMAT: GET# file#, variable list
- GET# returns data byte-by-byte from the open sequential file. Every character is returned, including separators (CR, comma, etc.), so you can inspect file structure exactly.
- Use string variables (A$, B$, ...) to avoid runtime errors: if a non-numeric byte is stored into a numeric variable, BASIC raises an error; storing numeric data into a string is safe.
- You can request multiple variables in a single GET#; each variable consumes the next character(s) from the file in sequence.
- GET# is preferable to INPUT# when examining files with unknown contents or possible corruption because INPUT# has limits on characters between separators; GET# does not.
- Typical flow when using disk device 8:
  - OPEN 15,8,15 opens the command channel to device 8.
  - OPEN n,8,n,"0:filename,type,r" opens the file as a sequential file on device 8 (the example uses handle 5).
  - Use GET# on the file handle to read bytes; use the command channel (OPEN 15...) and INPUT#15 to read resulting status lines if necessary.
- Example intent of sample program: prompt for filename and type, open the file for reading, then loop GET# to read and print the ASCII code of each byte until end-of-file or an error/status indicates closure.

## Source Code
```text
      |   | 1 |-->|   | 3 |-->|   | 5 |-->|   | 7 |-->| CR|eof|   |
 -----+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
 char | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15|
```

```basic
start tok64 examfile.prg
 10 input "file name";f$
 20 input "file type";t$
 30 t$ = left$ (t$,1)
 40 if t$<>"s" then if t$<>"p" then if t$<>"u" then 20
 45 open 15,8,15
 50 open 5,8,5,"0:" + f$ + "," + t$ + ",r"
 60 gosub 200
 70 get#5, a$
 80 if st=0 then 90
 85 if st=64 then close 5,15:end
 87 print st:stop
 90 print asc(a$ + chr$(0))
 100 goto 70
 200 input#15,a$,b$,c$,d$
 210 if val(a$)> 0 then printa$,b$,c$,d$:stop
 220 return
stop tok64
```

```text
begin 644 EXAMFILE.PRG
M`0@6"`H`A2`B1DE,12!.04U%(CM&)``K"!0`A2`B1DE,12!465!%(CM4)``]
M"!X`5"0@LB#(("A4)"PQ*0!H""@`BR!4)+.Q(E,B(*<@BR!4)+.Q(E`B(*<@
MBR!4)+.Q(E4B(*<@,C``=@@M`)\@,34L."PQ-0">"#(`GR`U+#@L-2PB,#HB
M(*H@1B0@JB`B+"(@JB!4)""J("(L4B(`J`@\`(T@,C`P`+0(1@"A(S4L($$D
M`,0(4`"+(%-4LC`@IR`Y,`#;"%4`BR!35+(V-""G(*`@-2PQ-3J``.8(5P"9
M(%-4.I``^0A:`)D@QBA!)""J(,<H,"DI``()9`")(#<P`!8)R`"$,34L020L
M0B0L0R0L1"0`-@G2`(L@Q2A!)"FQ(#`@IR"9020L0B0L0R0L1"0ZD``\"=P`
$C@``````
`
end
```

## References
- "reading_directory_program_and_description" — expands on using GET# to read the directory when opened as a sequential file