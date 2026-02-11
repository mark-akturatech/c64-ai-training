# MAILLIST.PRG — BASIC relative-file mailing list sample

**Summary:** Example Commodore 64 BASIC program demonstrating relative-file access via OPEN/PRINT# to device 8, positioning with CHR$ bytes to set record number/field length, read/write loops, and an error-check subroutine that handles RECORD NOT PRESENT (error 50). Includes advice and an example for pre-creating large relative files.

## Description
This BASIC program implements a simple mailing-list manager using a DOS relative file. It stores up to eight fields per record (field lengths defined in an array a()), opens the disk command and data channels, and uses DOS secondary packet commands (built with PRINT# and CHR$) to position to a record and read or write fields.

Key behaviors and implementation notes (preserved exactly from the source):
- Field lengths are in a(1)–a(8). The program sets these at startup: a(1)=12, a(2)=15, a(3)=20, a(4)=20, a(5)=12, a(6)=2, a(7)=9, a(8)=10.
- Two channels are opened to the disk device (device 8): a command/packet channel and a data channel for the relative file "mailing list".
- The program issues DOS packet commands with PRINT#1, "p" + CHR$(...) to position and set a field length for each field of a record; the disk response is read on the data channel (INPUT#2,...).
- Record numbers are sent as two bytes: low byte (r1) and high byte (r2) where r2 = INT(r/256); r1 = r - 256*r2.
- Record 1 is used as a header that stores the current highest-used record number (variable x). The program prevents reading beyond x and forces writes beyond x to the next higher record.
- The read loop asks for a record number, validates bounds (r>=2 and r<=x), then for each of the eight fields sends a positioning/length packet and reads the returned field data printed for user.
- The write loop asks for a record number (limited to 500 by the code), allows creation of the next record if r>x (it sets r=x+1), and for each field sends the packet, accepts user input, truncates to the field length when necessary, and writes the field data. After writing a new highest record the program updates the header record with the new x value.
- Error checking is centralized in a subroutine (900). It reads the disk response packet via INPUT#1,a,b$,c,d. If the returned error code is below 20 it is ignored (return). If the code is 50 (RECORD NOT PRESENT) the code prints the returned b$ when in read mode (j$="r"); for other errors the code prints the packet and stops BASIC.
- Because creating intermediate records on demand is slow, the source recommends pre-creating a record at the projected end of the file (for example record #1000) so DOS allocates intermediate records up front.

Caveats from source:
- The program refuses reads for records <2 (record 1 reserved for header) and forces writes beyond the end to the next higher record.
- Error 50 is specially handled; other DOS errors are printed and the program stops.

## Source Code
```basic
5 a(1)=12: a(2)=15: a(3)=20: a(4)=20: a(5)=12: a(6)=2: a(7)=9: a(8)=10
9 rem open relative file called "mailing list"
10 open 1,8,15:open 2,8,3,"0:mailing list,l,"+chr$(108):gosub 900
20 print#1,"p" chr$(3+96) chr$(1) chr$(0) chr$(1):input#2,x$: x=val(x$): if x=0 then x=2
30 input "read,write,or end";j$:if j$="e" then close 2:close 1:end
40 if j$="w" then 200
50 print:input "record #";r:if r<0 or r>x then 50:rem read rout
60 if r<2 then 30
70 r1=r:r2=0:if r1>256 then r2=int(r1/256):r1=r1-256*r2
80 restore:data 1,first name,14,last name,30,address1,51,address2
90 data 72,city,85,state,88,zip,98,phone#
100 for l=1 to 8:read a,a$:print#1,"p" chr$(3+96) chr$(r1) chr$(r2) chr$(a):gosub 900
110 on a/50 goto 50
115 input#2,z$:print a$,z$:next:goto 50
200 print:input "record #";r:if r<0 or r>500 then 200:rem write rout
210 if r<2 then 30
215 if r>x then r=x+1:print:print "record#"; r
220 r1=r:r2=0:if r>255 then r2=int(r1/256):r1=r1-256*r2
230 restore:for l=1 to 8:read a,a$:print#1,"p" chr$(3+96)chr$(r1) chr$(r2) chr$(a)
232 gosub 900
235 print a$;:input z$:if len(z$)>a(l) then z$=left$(z$,a(l))
240 print#2,z$:gosub 900:next:if r>x then x=r
245 print#1,"p" chr$(3+96) chr$(1) chr$(0) chr$(1)
250 print#2,x:gosub 900:goto 200
900 input#1,a,b$,c,d:if a<20 then return:rem error check rout
910 if a<>50 then print a;b$,c;d:stop:return
920 if j$="r" then print b$
930 return
```

Example from source for pre-creating a large relative file (as shown):
```basic
OPEN 1, 8, 15: OPEN 2, 8, 2, "0:REL,L," + CHR$(60)
PRINT#1, "P" CHR$(2+96) CHR$(0) CHR$(4) CHR$(1)
PRINT#2, "END"
CLOSE 2: CLOSE 1
```

(The original distributed package also included the binary PRG data for MAILLIST.PRG in uuencoded form; that raw uuencoded block is preserved below for retrieval.)

```text
begin 644 MAILLIST.PRG
M`0A)"`4`02@Q*;(Q,CH@02@R*;(Q-3H@02@S*;(R,#H@02@T*;(R,#H@02@U
M*;(Q,CH@02@V*;(R.B!!*#<ILCDZ02@X*;(Q,`!X"`D`CR!/4$5.(%)%3$%4
M259%($9)3$4@0T%,3$5$(")-04E,24Y'($Q)4U0B`*X("@"?(#$L."PQ-3J?
M(#(L."PS+"(P.DU!24Q)3D<@3$E35"Q,+"*JQR@Q,#@I.HT@.3`P`.L(%`"8
M,2PB4"(@QR@SJCDV*2#'*#$I(,<H,"D@QR@Q*3J$,BQ8)#I8LL4H6"0I.B"+
M(%BR,""G(%BR,@`="1X`A2`B4D5!1"Q74DE412Q/4B!%3D0B.THD.HL@2B2R
M(D4B(*<@H"`R.J`@,3J``#`)*`"+($HDLB)7(B"G(#(P,`!B"3(`F3J%(")2
M14-/4D0@(R([4CJ+(%*S,""P(%*Q6""G(#4P.H\@4D5!1"!23U54`'$)/`"+
M(%*S,B"G(#,P`*0)1@!2,;)2.E(RLC`ZBR!2,;$R-38@IR!2,K*U*%(QK3(U
M-BDZ4C&R4C&K,C4VK%(R`-X)4`",.H,@,2Q&25)35"!.04U%+#$T+$Q!4U0@
M3D%-12PS,"Q!1$1215-3,2PU,2Q!1$1215-3,@`&"EH`@R`W,BQ#2519+#@U
M+%-4051%+#@X+%I)4"PY."Q02$].12,`0`ID`($@3+(Q(*0@.#J'($$L020Z
MF#$L(E`B(,<H,ZHY-BD@QRA2,2D@QRA2,BG'*$$I.HT@.3`P`%`*;@"1($&M
M-3`@B2`U,`!I"G,`A#(L6B0ZF2!!)"Q:)#J".HD@-3``GPK(`)DZA2`B4D5#
M3U)$(",B.U(ZBR!2LS`@L"!2L34P,""G(#(P,#J/(%=2251%(%)/550`K@K2
M`(L@4K,R(*<@,S``T0K7`(L@4K%8(*<@4K)8JC$ZF3J9(")214-/4D0C(CL@
M4@`#"]P`4C&R4CI2,K(P.HL@4K$R-34@IR!2,K*U*%(QK3(U-BDZ4C&R4C&K
M,C4VK%(R`#D+Y@",.H$@3+(Q(*0@.#J'($$L020ZF#$L(E`B(,<H,ZHY-BG'
M*%(Q*2#'*%(R*2#'*$$I`$,+Z`"-(#DP,`!O"^L`F2!!)#LZA2!:)#J+(,,H
M6B0IL4$H3"D@IR!:)++(*%HD+$$H3"DI`(T+\`"8,BQ:)#J-(#DP,#J".HL@
M4K%8(*<@6+)2`*\+]0"8,2PB4"(@QR@SJCDV*2#'*#$I(,<H,"D@QR@Q*0#$
M"_H`F#(L6#J-(#DP,#J)(#(P,`#R"X0#A#$L02Q")"Q#+$0ZBR!!LS(P(*<@
MCCJ/($524D]2($-(14-+(%)/550`#PR.`XL@0;.Q-3`@IR"9($$[0B0L0SM$
A.I`ZC@`C#)@#BR!*)+(B4B(@IR"9($(D`"D,H@..````
`
end
```

## References
- "create_relative_file_instructions_and_notes" — expands on POSITION command usage, CHR$(position) semantics, and write/read steps
- "relfile_program_constructor_and_read_example" — another sample RELFILE.PRG demonstrating construction and reading of relative files