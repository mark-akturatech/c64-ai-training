# RELFILE.PRG — Relative-file BASIC program (Commodore 64)

**Summary:** Demonstrates creating and using a Commodore DOS relative file with OPEN, print#1 positioning ("p" + chr$ sequences), data channel I/O (print#2 / input#2), device 8, the error channel (open 15 / input#15), function-key scanning (GET s$ + chr$ codes), and tok64 directives.

## Program description
This standalone BASIC program constructs a relative file on device 8, writes five records (each split into two fields), optionally allows record replacement, and demonstrates reading the file back. Important implementation details and behaviors are preserved exactly as in the listing:

- File creation:
  - Uses OPEN 2,8,2,z$+",l,"+chr$(50) — creates a relative file named z$ with record length 50 (chr$(50) used to supply the record-length byte in the create command string).
  - OPEN 1,8,15 opens the command/error channel to device 8 (secondary address 15) for sending DOS commands and reading error information.

- Positioning the record pointer:
  - The program sends positioning commands to the command channel with lines like:
    print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(1)
  - The "p" + chr$ sequence is used to position the relative-file record pointer before read/write operations. The listing uses two variants: chr$(1) to position for field 1 and chr$(25) to position for field 2 (25th character offset).

- Data I/O:
  - Channel 2 (opened for the file) is used for writing and reading records via print#2 and input#2.
  - The program writes a$(i) as the first field and c$(i) as the second field after positioning.

- Error channel:
  - Subroutine at 2000 opens channel 15 to device 8 and INPUT#15 to read and print DOS error information returned by the disk drive.

- Function-key scanning:
  - Subroutine at 5000 polls GET s$ until a non-empty key code appears; maps function-key CHR$(133), CHR$(134), CHR$(135) to jump targets (lines 6, 100, 2000 respectively).

- Hardcopy / printer handling:
  - Subroutine at 6000 waits for user to press F7 (CHR$(136)) for hardcopy or 'c' to continue. If hardcopy requested it opens device 4 (printer) with OPEN 4,4 and CMD 4 then PRINT#4 to send a human-readable dump of the in-memory a$(i)/c$(i) arrays.

- Record replacement:
  - Subroutine at 8000 prompts for the record number, new field 1 and field 2 values, repositions the pointer for field 1 and field 2 (using the same "p" + chr$ sequences) and overwrites the record fields.

- Notes and alternate read modes:
  - Comments at line numbers 7000+ document how to modify the loop at 110/115 to read records in reverse order, or to mix reading first-field/last-field patterns by changing the chr$(i)/chr$(k) value used in the pointer positioning.

The program includes simple delays and user prompts and ends with the stop tok64 directive.

## Source Code
```basic
start tok64 relfile.prg
 1 rem relative file program
 2 dim a$(5):dim c$(5):print"{clear}"
 3 print "hit f1 to construct a relative file"
 4 print "hit f3 to read a relative file"
 5 print "hit f5 to read the error channel":gosub 5000
 6 input "enter relative file name";z$
 8 open 2,8,2,z$+",l,"+chr$(50):rem create the relative file
 9 open 1,8,15
 11 gosub 1000
 20 for i=1 to 5
 30 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(1):rem position the \
    record pointer
 40 print "enter a name"
 50 input a$(i)
 60 print#2,a$(i)
 63 input "enter additional info";c$(i)
 65 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(25):rem position \
    pointer to 25th character
 67 print#2,c$(i)
 70 next i
 75 print "do you wish to replace a record":input d$
 76 if d$="n" then 80
 77 gosub 8000
 78 go to 75
 80 print "the relative file is constructed"
 82 for de=1 to 2500: next de: gosub 6000
 85 close 2
 90 end:stop
 100 input "enter desired file to read";z$
 105 open 2,8,2,z$:open 1,8,15
 106 print "reading " z$
 110 for i=1 to 5
 115 rem for i=5 to 1 step -1
 130 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(1)
 160 input#2,a$(i)
 170 print "record#(" i ")=", a$(i)
 175 k=6-i
 177 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(25)
 179 input#2,c$(i):print "additional info:";c$(i)
 180 next i
 181 print "do you wish to replace a record":input d$
 182 if d$="n" then 185
 183 gosub 8000
 184 go to 181
 185 gosub 1000
 186 j=i+1
 190 print "end of read":for de=1 to 1500:next de:gosub 6000:\
     close 2:close 1:end
 1000 input#1,a,b$,c,d:if a<20 then return
 1001 if a<>50 then print a,b$,c,d :stop: return
 1999 end
 2000 open 15,8,15
 2001 input#15,a,b$,c,d
 2002 print a,b$,c,d
 2003 close 15:end
 5000 get s$:if s$="" then 5000: rem scan keyboard for function \
      key chr$ codes
 5001 if s$=chr$(133) then 6: rem assign f1 function key
 5002 if s$=chr$(134) then 100: rem assign f3 function key
 5003 if s$=chr$(135) then 2000: rem assign f5 function key
 5004 return
 6000 print "{clear}hit f7: for hard copy or c to continue"
 6001 get p$: if p$<>chr$(136) and p$="c" then return
 6002 for de=1 to 500: next de: if p$ ="" or p$<>chr$(136) then 6000
 6003 open 4,4:cmd 4
 6004 print#4,"the " z$ " file consists of:"
 6005 for i=1 to 5
 6010 print#4,"record #";i;"=";a$(i)
 6012 print#4,"additional info ";i;"=";c$(i)
 6015 next i
 6020 close 4:return
 7000 rem to read in records in reverse order remove the rem in \
      line #115 and
 7002 rem put a rem before line#110
 7005 rem to read the 1st field of the 1st record and the 2nd \
      field of the last
 7007 rem replace the chr$(i) in line 177 with chr$(k)
 8000 print "which record # do you want replaced":input i
 8001 input "enter new record";a$(i)
 8002 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(1):rem position \
      file pointer
 8003 print#2,a$(i)
 8004 input "enter new record (field 2)";c$(i)
 8005 print#1,"p" chr$(2+96)chr$(i)chr$(0)chr$(25):rem position \
      file pointer
 8007 print#2,c$(i)
 8009 print "record#";i;" has been replaced"
 8010 return
stop tok64
```

## References
- "relfile_prg_encoded_dump" — encoded/tokenized distribution (begin 644 ... end)