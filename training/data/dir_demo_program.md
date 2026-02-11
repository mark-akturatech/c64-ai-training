# DIR — Demonstration disk directory reader (BASIC + tokenized PRG)

**Summary:** Tokenized Commodore 64 BASIC program that opens device 8 (disk drive) command and data channels, issues the "$0" directory command (track 18 / sector 0), reads and parses directory entries (file size and filename), provides interactive disk command entry via the command channel, and includes the tokenized PRG image (uuencoded) as stored on disk.

## Description
This chunk contains a complete BASIC listing for a demonstration directory reader named "DIR" and the accompanying tokenized PRG data (uuencoded). The BASIC program:
- Opens the command channel to device 8 (open 2,8,15) and the directory/data channel (open 1,8,0,"$0").
- Uses get#1 to read raw bytes from the directory listing returned by the drive (directory is on track 18 sector 0).
- Parses the two-byte file size (low/high), prints file size and filename fields (skipping quotes and spaces).
- Supports interactive disk commands sent to the command channel (reads user input, prints drive response).
- Provides simple UI commands: d (directory), . or > (raw disk command), s (disk status), q (quit).

Included as reference is the tokenized binary of the program as stored on disk (begin 644 DIR.PRG ... end), presented in uuencode form.

No registers or hardware-specific bitmaps are included in this chunk (pure BASIC + file image).

## Source Code
```basic
4 open 2,8,15
5 print "{clear}":goto 10000
10 open 1,8,0,"$0"
20 get#1,a$,b$
30 get#1,a$,b$
40 get#1,a$,b$
50 c=0
60 if a$<>"" then c=asc(a$)
70 if b$<>"" then c=c+asc(b$)*256
80 print "{reverse on}" mid$(str$(c),2);tab(3);"{reverse off}";
90 get#1,b$:if st<>0 then 1000
100 if b$<>chr$(34) then 90
110 get#1,b$:if b$<>chr$(34)then printb$;:goto110
120 get#1,b$:if b$=chr$(32) then 120
130 print tab(18);:c$=""
140 c$=c$+b$:get#1,b$:if b$<>"" then 140
150 print "{reverse on}" left$(c$,3)
160 get t$:if t$<>"" then gosub 2000
170 if st=0 then 30
1000 print" blocks free"
1010 close 1:goto 10000
2000 if t$="q" then close 1:end
2010 get t$:if t$="" then 2000
2020 return
4000 rem disk command
4010 c$="":print">";
4011 get b$:if b$="" then 4011
4012 print b$;:if b$=chr$(13) then 4020
4013 c$=c$+b$:goto 4011
4020 print#2,c$
5000 print "{reverse on}";
5010 get#2,a$:print a$;:if a$<>chr$(13) goto 5010
5020 print "{reverse off}"
10000 print "d-directory"
10010 print ">-disk command"
10020 print "q-quit program"
10030 print "s-disk status"
10100 get a$:if a$="" then 10100
10200 if a$="d" then 10
10300 if a$="." or a$=">" then 4000
10310 if a$="q" then end
10320 if a$="s" then 5000
10999 goto 10100
```

```text
begin 644 DIR.PRG
M`0@."`0`GR`R+#@L,34`(`@%`)D@(I,B.HD@,3`P,#``,0@*`)\@,2PX+#`L
M(B0P(@`_"!0`H2,Q+$$D+$(D`$T('@"A(S$L020L0B0`6P@H`*$C,2Q!)"Q"
M)`!C"#(`0[(P`'H(/`"+($$DL[$B(B"G($.RQBA!)"D`EPA&`(L@0B2SL2(B
M(*<@0[)#JL8H0B0IK#(U-@"T"%``F2`B$B(@RBC$*$,I+#(I.Z,S*3LBDB([
M`,X(6@"A(S$L0B0ZBR!35+.Q,""G(#$P,#``XPAD`(L@0B2SL<<H,S0I(*<@
M.3``!0EN`*$C,2Q")#J+($(DL[''*#,T*:<@F4(D.SJ),3$P`"$)>`"A(S$L
M0B0ZBR!")++'*#,R*2"G(#$R,``S"8(`F2"C,3@I.SI#)+(B(@!6"8P`0R2R
M0R2J0B0ZH2,Q+$(D.HL@0B2SL2(B(*<@,30P`&@)E@"9("(2(B#(*$,D+#,I
M`(,)H`"A(%0D.HL@5"2SL2(B(*<@C2`R,#`P`),)J@"+(%-4LC`@IR`S,`"G
M">@#F2(@0DQ/0TM3($92144B`+<)\@.@(#$ZB2`Q,#`P,`#,"=`'BR!4)+(B
M42(@IR"@(#$Z@`#D"=H'H2!4)#J+(%0DLB(B(*<@,C`P,`#J">0'C@#]":`/
MCR!$25-+($-/34U!3D0`#0JJ#T,DLB(B.IDB/B([`"4*JP^A($(D.HL@0B2R
M(B(@IR`T,#$Q`$$*K`^9($(D.SJ+($(DLL<H,3,I(*<@-#`R,`!5"JT/0R2R
M0R2J0B0ZB2`T,#$Q`%\*M`^8,BQ#)`!J"H@3F2`B$B([`(X*DA.A(S(L020Z
MF2!!)#LZBR!!)+.QQR@Q,RD@B2`U,#$P`)@*G!.9("*2(@"L"A`GF2`B1"U$
M25)%0U1/4EDB`,,*&B>9("(^+41)4TL@0T]-34%.1"(`V@HD)YD@(E$M455)
M5"!04D]'4D%-(@#P"BXGF2`B4RU$25-+(%-405154R(`"0MT)Z$@020ZBR!!
M)+(B(B"G(#$P,3`P`!L+V">+($$DLB)$(B"G(#$P`#@+/"B+($$DLB(N(B"P
M($$DLB(^(B"G(#0P,#``20M&*(L@022R(E$B(*<@@`!="U`HBR!!)+(B4R(@
5IR`U,#`P`&D+]RJ)(#$P,3`P````
`
end
```

## References
- "appendix_c_demo_disk_programs_header" — expands on Appendix C container
- "view_bam_demo_program" — related demonstration program for viewing BAM
