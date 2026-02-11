# KERNAL TIME routines — UDTIM / SETTIM / RDTIM (CBM English disassembly)

**Summary:** Disassembly of the Commodore 64 KERNAL TIME library routines UDTIM (update time), SETTIM (set time), and RDTIM (read time). Operates on zero-page time bytes $A0-$A2 (TIME, TIME+1, TIME+2), uses CIA1 keyboard ports ($DC00/$DC01) for STOP-key handling and 6526 timer synchronization (read-settle technique).

## Overview
This chunk documents three compact KERNAL routines:

- UDTIM — Increment BCD-style time held at zero-page addresses $A0 (hours MSD), $A1 (minutes), $A2 (seconds). Typically called once per 60th second (driven by 6526 timers). Increments the three-byte time (least-significant byte first), detects 23:59:59 rollover via a chained SBC test and, if rollover is detected, clears the three time bytes to zero and performs STOP-key detection/handling before returning.

- SETTIM — Stores caller-supplied time into the TIME bytes with interrupts disabled. Convention: A = LSD (seconds), X = next significant (minutes), Y = MSD (hours). Uses SEI/CLI to prevent time updates during store.

- RDTIM — Reads the TIME bytes into registers with interrupts disabled: A = LSD (seconds), X = next (minutes), Y = MSD (hours).

Key behavioral details preserved from the disassembly:
- Time bytes are treated in BCD-like fashion by byte-wise INCs and a multi-byte SBC-based rollover test.
- Rollover detection: after incrementing, the routine executes SEC then performs SBC #$01 against seconds, SBC #$1A against minutes, and SBC #$4F against hours; the branch on carry determines whether a rollover occurred (the disassembly uses that chain to decide zeroing).
- When a rollover occurs the routine zeroes $A0-$A2, then performs a keyboard scan sequence to capture/set the STOP-key flag for other routines (STKEY stored at $91).
- To avoid sampling transient states from the CIA keyboard lines, the code reads the ROWS register ($DC01) twice and loops until two consecutive reads match — a simple "read-settle" debounce technique for 6526 inputs.
- The code momentarily writes COLM ($DC00) during STOP-key handling to perform a keyboard-column scan. It preserves the observed keyboard pattern into STKEY ($91) for other modules to inspect.
- Both SETTIM and RDTIM use SEI to prevent concurrent time updates during read/store; SETTIM issues CLI before returning.

No algorithmic changes or extra notes are introduced beyond the original disassembly; code listing below is the verbatim reference.

## Source Code
```asm
                                .LIB   TIME
                                ;***********************************
                                ;*                                 *
                                ;* TIME                            *
                                ;*                                 *
                                ;*CONSISTS OF THREE FUNCTIONS:     *
                                ;* (1) UDTIM-- UPDATE TIME. USUALLY*
                                ;*     CALLED EVERY 60TH SECOND.   *
                                ;* (2) SETTIM-- SET TIME. .Y=MSD,  *
                                ;*     .X=NEXT SIGNIFICANT,.A=LSD  *
                                ;* (3) RDTIM-- READ TIME. .Y=MSD,  *
                                ;*     .X=NEXT SIGNIFICANT,.A=LSD  *
                                ;*                                 *
                                ;***********************************
                                ;INTERRUPTS ARE COMING FROM THE 6526 TIMERS
                                ;
.,F69B A2 00    LDX #$00        UDTIM  LDX #0          ;PRE-LOAD FOR LATER
                                ;
                                ;HERE WE PROCEED WITH AN INCREMENT
                                ;OF THE TIME REGISTER.
                                ;
.,F69D E6 A2    INC $A2         UD20   INC TIME+2
.,F69F D0 06    BNE $F6A7       BNE    UD30
.,F6A1 E6 A1    INC $A1         INC    TIME+1
.,F6A3 D0 02    BNE $F6A7       BNE    UD30
.,F6A5 E6 A0    INC $A0         INC    TIME
                                ;
                                ;HERE WE CHECK FOR ROLL-OVER 23:59:59
                                ;AND RESET THE CLOCK TO ZERO IF TRUE
                                ;
.,F6A7 38       SEC             UD30   SEC
.,F6A8 A5 A2    LDA $A2         LDA    TIME+2
.,F6AA E9 01    SBC #$01        SBC    #$01
.,F6AC A5 A1    LDA $A1         LDA    TIME+1
.,F6AE E9 1A    SBC #$1A        SBC    #$1A
.,F6B0 A5 A0    LDA $A0         LDA    TIME
.,F6B2 E9 4F    SBC #$4F        SBC    #$4F
.,F6B4 90 06    BCC $F6BC       BCC    UD60
                                ;
                                ;TIME HAS ROLLED--ZERO REGISTER
                                ;
.,F6B6 86 A0    STX $A0         STX    TIME
.,F6B8 86 A1    STX $A1         STX    TIME+1
.,F6BA 86 A2    STX $A2         STX    TIME+2
                                ;
                                ;SET STOP KEY FLAG HERE
                                ;
.,F6BC AD 01 DC LDA $DC01       UD60   LDA ROWS        ;WAIT FOR IT TO SETTLE
.,F6BF CD 01 DC CMP $DC01       CMP    ROWS
.,F6C2 D0 F8    BNE $F6BC       BNE    UD60            ;STILL BOUNCING
.,F6C4 AA       TAX             TAX                    ;SET FLAGS...
.,F6C5 30 13    BMI $F6DA       BMI    UD80            ;NO STOP KEY...EXIT  STOP KEY=$7F
.,F6C7 A2 BD    LDX #$BD        LDX    #$FF-$42        ;CHECK FOR A SHIFT KEY (C64 KEYBOARD)
.,F6C9 8E 00 DC STX $DC00       STX    COLM
.,F6CC AE 01 DC LDX $DC01       UD70   LDX ROWS        ;WAIT TO SETTLE...
.,F6CF EC 01 DC CPX $DC01       CPX    ROWS
.,F6D2 D0 F8    BNE $F6CC       BNE    UD70
.,F6D4 8D 00 DC STA $DC00       STA    COLM            ;!!!!!WATCH OUT...STOP KEY .A=$7F...SAME AS COLMS WAS...
.,F6D7 E8       INX             INX                    ;ANY KEY DOWN ABORTS
.,F6D8 D0 02    BNE $F6DC       BNE    UD90            ;LEAVE SAME AS BEFORE...
.,F6DA 85 91    STA $91         UD80   STA STKEY       ;SAVE FOR OTHER ROUTINES
.,F6DC 60       RTS             UD90   RTS
.,F6DD 78       SEI             RDTIM  SEI             ;KEEP TIME FROM ROLLING
.,F6DE A5 A2    LDA $A2         LDA    TIME+2          ;GET LSD
.,F6E0 A6 A1    LDX $A1         LDX    TIME+1          ;GET NEXT MOST SIG.
.,F6E2 A4 A0    LDY $A0         LDY    TIME            ;GET MSD
.,F6E4 78       SEI             SETTIM SEI             ;KEEP TIME FROM CHANGING
.,F6E5 85 A2    STA $A2         STA    TIME+2          ;STORE LSD
.,F6E7 86 A1    STX $A1         STX    TIME+1          ;NEXT MOST SIGNIFICANT
.,F6E9 84 A0    STY $A0         STY    TIME            ;STORE MSD
.,F6EB 58       CLI             CLI
.,F6EC 60       RTS             RTS
                                .END
```

## Key Registers
- $A0-$A2 - Zero page - TIME (three bytes: $A0 = MSD hours, $A1 = minutes, $A2 = seconds; BCD-style incrementing)
- $0091 - Zero page - STKEY (saved STOP-key pattern used by other routines)
- $DC00-$DC0F - CIA 1 (6526) - keyboard/joystick ports; relevant here:
  - $DC00 - COLM (keyboard column output/read during scan)
  - $DC01 - ROWS (keyboard rows input; read twice to wait for settling/debounce)

## References
- "init_library" — initializes timer hardware and vectors used by TIME
- "error_handler_library" — how STOP key handling interacts with ERROR/STOP routines

## Labels
- UDTIM
- SETTIM
- RDTIM
- TIME
- STKEY
- COLM
- ROWS
