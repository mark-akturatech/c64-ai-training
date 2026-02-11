# KERNAL GETIN/CHRIN device dispatchers (GETIN $FFE4, CHRIN $FFCF)

**Summary:** Describes the KERNAL device-dispatch logic for GETIN ($FFE4) and CHRIN ($FFCF): how DFLTN ($0099) selects keyboard ($00), RS232 ($02) or screen ($03) paths, use of keyboard buffer NDX ($00C6), CRSW ($00D0), PNTR/TBLX ($00D3/$00D6) for screen input, and calls into RS232/serial routines ($F086, $F199, $F80D, $F841, $FE1C, $E5B4, $E632).

## Behavior overview

- DFLTN ($0099) selects the input device:
  - $00 = keyboard: GETIN reads from the keyboard queue via NDX ($00C6) and jumps into the keyboard buffer fetch routine ($E5B4).
  - $02 = RS232: both GETIN and CHRIN dispatch to RS232 handlers (calls to $F086 and a CHRIN serial path invoking $F199 / $F80D / $F841). CHRIN obtains two bytes so EOF/status can be signalled (ST = #$40).
  - $03 = screen: CHRIN/INPUT path reads from the screen input routine (sets CRSW, copies PNTR/TBLX into local buffers and jumps to $E632).
  - Any other device value branches to the higher-level INPUT routine.

- GETIN ($FFE4 vector):
  - Loads DFLTN ($0099).
  - If keyboard ($00) then checks NDX ($00C6): if non-zero, disables interrupts (SEI) and JMPs $E5B4 to pull a character from the keyboard buffer and return in A.
  - If RS232 ($02) preserves Y in $0097, JSR $F086 to fetch from RS232, restores Y from $0097, then returns.
  - Otherwise falls through to INPUT.

- CHRIN ($FFCF vector):
  - If DFLTN = $00 (keyboard) or $03 (screen) it prepares screen/cursor state and JMPs $E632 (INPUT/GET-from-screen handler). Specifically:
    - For device $00: copies PNTR ($00D3) -> $00CA and TBLX ($00D6) -> $00C9 then JMP $E632.
    - For device $03: stores CRSW flag into $00D0, copies LNMX ($00D5) -> $00C8 (INDX end-of-logical-line), then JMP $E632.
  - If RS232 ($02) CHRIN executes a serial input sequence:
    - Uses $0097 as a temporary save area for X/Y (stores STX/$97 or STY/$97 as appropriate), calls $F199 (which in turn uses $F80D etc).
    - On certain conditions it calls $FE1C with A=#$40 to signal EOF (ST = #$40), decrements $00A6, restores registers, and returns.
    - Additional RS232 status/byte fetches are performed via $F80D and $F841; when a buffer load is performed the routine reads from ($B2),Y into A for the returned byte.

- Temporary/working zero-page usage:
  - $0097 used as a temporary save slot for X/Y when calling RS232 helpers.
  - Several local copies are made (PNTR -> $00CA, TBLX -> $00C9, LNMX -> $00C8) for the screen INPUT path.

- Return/result conventions:
  - CHRIN returns two bytes so EOF can be indicated (status ST = #$40 per calling of $FE1C).
  - GETIN returns a single byte in A.

## Source Code
```asm
                                *** GETIN: GET a BYTE
                                The KERNAL routine GETIN ($ffe4) is vectored to this
                                routine. It load a character into fac#1 from the external
                                device indicated by DFLTN. Thus, if device = 0, GET is
                                from the keyboard buffer. If device = 2, GET is from the
                                RS232 port. If neither of these devices then GET is
                                further handled by the next routine, INPUT.
.,F13E A5 99    LDA $99         DFLTN, default input device.
.,F140 D0 08    BNE $F14A       not keyboard
.,F142 A5 C6    LDA $C6         NDX, number of keys in keyboard queue
.,F144 F0 0F    BEQ $F155       buffer empty, exit
.,F146 78       SEI             disable interrupts
.,F147 4C B4 E5 JMP $E5B4       get character from keyboard buffer, and exit
.,F14A C9 02    CMP #$02        RS232
.,F14C D0 18    BNE $F166       nope, try next device
.,F14E 84 97    STY $97         temp store
.,F150 20 86 F0 JSR $F086       get character from RS232
.,F153 A4 97    LDY $97         retrieve (Y)
.,F155 18       CLC
.,F156 60       RTS

                                *** CHRIN: INPUT A BYTE
                                The KERNAL routine CHRIN ($ffcf) is vectored to this
                                routine. It is similar in function to the GET routine
                                above, and also provides a continuation to that routine.
                                If the input device is 0 or 3, ie. keyboard or screen,
                                then input takes place from the screen. INPUT/GET from
                                other devices are performed by calls to the next routine.
                                Two bytes are input from the device so that end of file
                                can be set if necessary (ie. ST = #40)
.,F157 A5 99    LDA $99         DFLTN, default input
.,F159 D0 0B    BNE $F166       not keyboard, next device
.,F15B A5 D3    LDA $D3         PNTR, cursor column on  screen
.,F15D 85 CA    STA $CA         >LXSP, cursor position at start
.,F15F A5 D6    LDA $D6         TBLX, cursor line number
.,F161 85 C9    STA $C9         <LXSP
.,F163 4C 32 E6 JMP $E632       input from screen or keyboard
.,F166 C9 03    CMP #$03        screen
.,F168 D0 09    BNE $F173       nope, next device
.,F16A 85 D0    STA $D0         CRSW, flag INPUT/GET from keyboard
.,F16C A5 D5    LDA $D5         LNMX, physical screen line length
.,F16E 85 C8    STA $C8         INDX, end of logical line for input
.,F170 4C 32 E6 JMP $E632       input from screen of keyboard
.,F173 B0 38    BCS $F1AD
.,F175 C9 02    CMP #$02        RS232
.,F177 F0 3F    BEQ $F1B8       yes, get data from RS232 port
.,F179 86 97    STX $97
.,F17B 20 99 F1 JSR $F199
.,F17E B0 16    BCS $F196
.,F180 48       PHA
.,F181 20 99 F1 JSR $F199
.,F184 B0 0D    BCS $F193
.,F186 D0 05    BNE $F18D
.,F188 A9 40    LDA #$40
.,F18A 20 1C FE JSR $FE1C
.,F18D C6 A6    DEC $A6
.,F18F A6 97    LDX $97
.,F191 68       PLA
.,F192 60       RTS
.,F193 AA       TAX
.,F194 68       PLA
.,F195 8A       TXA
.,F196 A6 97    LDX $97
.,F198 60       RTS
.,F199 20 0D F8 JSR $F80D
.,F19C D0 0B    BNE $F1A9
.,F19E 20 41 F8 JSR $F841
.,F1A1 B0 11    BCS $F1B4
.,F1A3 A9 00    LDA #$00
.,F1A5 85 A6    STA $A6
.,F1A7 F0 F0    BEQ $F199
.,F1A9 B1 B2    LDA ($B2),Y
.,F1AB 18       CLC
.,F1AC 60       RTS
```

## Key Registers
- $0099 - KERNAL variable - DFLTN (default input device selector)
- $00C6 - KERNAL variable - NDX (keyboard queue count/index)
- $0097 - KERNAL zero-page temp - temporary save area for X/Y during RS232 calls
- $00CA - KERNAL temp - stores PNTR (>LXSP) for screen INPUT path
- $00C9 - KERNAL temp - stores TBLX (<LXSP) for screen INPUT path
- $00C8 - KERNAL temp - INDX, end of logical line for screen input (copied from LNMX)
- $00D0 - KERNAL variable - CRSW (flag for INPUT/GET from keyboard/screen)
- $00D3 - KERNAL variable - PNTR (cursor column on screen)
- $00D5 - KERNAL variable - LNMX (physical screen line length)
- $00D6 - KERNAL variable - TBLX (cursor line number)
- $00A6 - KERNAL variable - used as counter modified in RS232 CHRIN path
- $00B2 - KERNAL pointer - used in LDA ($B2),Y fetch in RS232 return sequence

## References
- "keyboard_input_and_screen_output" — expands on keyboard buffer format and input echo behavior
- "rs232_buffers_input_and_idle" — expands on RS232 get functions and status handling

## Labels
- GETIN
- CHRIN
- DFLTN
- NDX
- CRSW
- PNTR
- TBLX
- LNMX
