# Wait for serial bus end after send ($EDCC-$EDDC)

**Summary:** ROM routine at $EDCC–$EDDC disables interrupts (SEI), forces serial DATA low, raises ATN and CLK (IEC serial bus lines), polls serial status via a JSR that sets condition flags, loops while the clock line is reported high, then restores interrupts (CLI) and RTS. Searchable terms: $EDCC, SEI, CLI, JSR $EEA9, BMI, ATN (IEC), serial clock, serial data.

## Description
This short ROM sequence is used immediately after transmitting on the C64 IEC serial bus to wait until the bus transaction has completed before returning control. Steps performed, in order:

- SEI ($EDCC): disable interrupts to protect timing during the end-of-transaction sequence.
- JSR $EEA0 ($EDCD): call routine to force serial DATA line low (drive DATA low).
- JSR $EDBE ($EDD0): call routine to set ATN high (assert Attention line — ATN).
- JSR $EE85 ($EDD3): call routine to set serial CLOCK line high (drive CLK high).
- JSR $EEA9 ($EDD6): call routine that samples serial DATA/CLOCK status and sets processor flags according to the sampled lines (N/Z/C etc).
- BMI $EDD6 ($EDD9): branch back and repeat the status read while the sampled condition indicates the clock line is high (BMI = branch if negative flag set; here used to detect clock state).
- CLI ($EDDB): re-enable interrupts when the clock has gone low and the transaction end is detected.
- RTS ($EDDC): return to caller (return address mentioned as "return address from patch 6" in the original comment).

The polling loop ensures the ROM waits for the IEC CLK transitions to complete before clearing the protected state and returning, preventing bus contention or missed ACK/handshake edges.

## Source Code
```asm
; wait for the serial bus end after send
; return address from patch 6
.,EDCC 78       SEI             ; disable the interrupts
.,EDCD 20 A0 EE JSR $EEA0       ; set the serial data out low
.,EDD0 20 BE ED JSR $EDBE       ; set serial ATN high
.,EDD3 20 85 EE JSR $EE85       ; set the serial clock out high
.,EDD6 20 A9 EE JSR $EEA9       ; get the serial data status in Cb
.,EDD9 30 FB    BMI $EDD6       ; loop if the clock is high
.,EDDB 58       CLI             ; enable the interrupts
.,EDDC 60       RTS
```

## References
- "serial_pin_control_and_1ms_delay" — routines to set DATA/CLK/ATN high/low and timing delays  
- "send_secondary_address_after_listen_and_talk_set_atn" — context where ATN/secondary-address send is used
