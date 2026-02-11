# Reading the disk directory with OPEN "$" and GET# (READDIR.PRG)

**Summary:** Demonstrates how to open the disk directory as a sequential file using `OPEN ... "$"` and read entries with `GET#`. Explains the directory format, where file sizes are stored as line numbers and filenames are enclosed in quotes. Includes the BASIC listing for `READDIR.PRG`.

**Directory format and method**

The disk directory can be accessed and read like a sequential file by using "$" as the filename in the `OPEN` statement and then reading bytes with `GET#`. The directory format mirrors that of a program file: file sizes are stored in the line-number fields, and filenames are enclosed in quotes.

The provided `READDIR.PRG` BASIC program:

- Opens the directory device using `OPEN 1,8,2,"$"`.
- Skips over the BAM/header bytes by reading 141 bytes.
- Reads the disk name, disk ID, and OS string fields from the directory header.
- Iterates over directory entries (reading entries 8 at a time), extracting:
  - File type byte.
  - Filename (constructs strings, filtering out characters 96 and 160).
  - Low and high bytes of the file length, combining them into a decimal length using `l = asc(l$+chr$(0)) + 256*asc(h$+chr$(0))`.
- Prints the length, type, and name for entries with non-zero length.

**Note:** There is a discrepancy in the opening syntax between the descriptive paragraph (`OPEN 5,8,5,"$"`) and the supplied program (`OPEN 1,8,2,"$"`).

No hardware register information is required for this routine; it reads the directory via the standard IEC (serial bus) file/device mechanism.

## Source Code

```basic
10 open 1,8,2,"$"
20 for x=1 to 141:get#1,a$:next:rem skip over bam
30 t$(0)="del":t$(1)="seq":t$(2)="prg":t$(3)="usr":t$(4)="rel"
40 j=17:gosub 500:rem disk name
50 n$=b$
60 j=2:rem set length of id string
70 gosub 500
80 i$=b$
85 get#1,a$
90 j=2:rem set length of operating system string
100 gosub 500
110 o$=b$
120 for l=1 to 88
130 get#1,a$:rem get rest of block
140 next
160 print chr$(147) "disk name:"n$,"id:"i$,"os:"o$
161 print "length","type","name"
165 for p=1 to 8
170 get#1,t$,a$,a$:rem file type
180 if t$="" then t$ = chr$(128)
190 j=15:rem set length of file name string
200 gosub 500
210 n$=b$
220 get#1,a$,a$,a$,a$,a$,a$,a$,a$,a$,a$,l$,h$:rem low & high bytes \
     of file length
225 l=asc(l$+chr$(0))+256*asc(h$+chr$(0)):if l=0 then 260
227 if st then close 1:end
230 print l,t$(asc(t$)-128),n$
250 if p < 8 then get#1,a$,a$
260 next p:goto 165
500 b$="":rem string building routine
510 for l=0 to j
520 get#1,a$
530 if a$<>chr$(96) then if a$<>chr$(160) then b$=b$ + a$
540 next
550 return
```

Raw tokenized/transfer block (uuencoded / tokenized PRG) for retrieval:
