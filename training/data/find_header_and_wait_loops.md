# WAIT OUT DATA loops (JSR *F510, JSR *F556, READ1/READ2)

**Summary:** Shows initial calls to FIND HEADER (JSR *F510) and FIND SYNC (JSR *F556) followed by two GCR-style wait loops (READ1 and READ2) that use the 6502 V (overflow) flag, LDX/DEX and branch instructions (BVC, CLV, BNE) to count incoming bytes.

## Description
This chunk contains the entry sequence and two timing/counting loops used to wait for incoming GCR-encoded bytes. Behavior:

- The code first calls two subroutines: FIND HEADER (JSR *F510) and FIND SYNC (JSR *F556). These locate the start of a data block (details of those routines are not included here).
- Two separate wait/count loops follow (READ1 and READ2). Each loop uses the processor V (overflow) flag as a hardware-set “byte available”/synchronization trigger:
  - BVC READx — loop while V is clear (V==0), effectively waiting until the hardware or previous code sets V to indicate an incoming byte/event.
  - CLV — clear the V flag once the event is detected so the next BVC will wait for the next event.
  - DEX / BNE READx — decrement X and loop until X underflows back to zero, using X as a byte counter.
- Sequence effect:
  - The first loop initializes X to 0 (LDX #«00). After the first detected event it decrements X (0 -> 255), then each subsequent event decrements X until it reaches 0 again. This performs 256 event waits (one wrap-around) before falling through.
  - The second loop initializes X to «45 (LDX #«45) and then performs that many event waits (value dependent on assembler radix/notation used by the source).
- This construct is a tight, low-level timing/counting mechanism that relies on asynchronous setting of the V flag by hardware or I/O-handling code (typical for GCR bit/byte signaling in tape/drive interfaces).

Notes:
- The source uses the notation « for immediates (e.g., #«00, #«45). The meaning (hex vs decimal) is not defined here — see assembler directives/origin chunk for notation conventions.
- The code assumes an external source sets the V flag each time a byte or sync event is received; those signal generators are outside this snippet.

## Source Code
```asm
    200  JSR  *F510  ;   FIND  HEADER 
    210  JSR  *F556  ;   FIND  SYNC 
    220  ; 

    230  ;«  WAIT  OUT  DATA  * 
    240  ; 

    250  LDX  #«00 

    260  READl   BVC  READl 

    270  CLV 

    280  DEX 

    290  BNE  READl 

    300  ; 

    310  LDX  #«45 

    320  READ2  BVC  READ2 

    330  CLV 

    340  DEX 

    350  BNE  READ2 
```

## References
- "assembler_directives_and_origin" — expands on origin and assembler directives used for assembling these routines
- "write_mode_data_and_write_loops" — expands on subsequent code that switches data direction and emits overwrite bytes after the wait loops