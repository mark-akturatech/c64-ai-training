# Send secondary address after LISTEN/TALK (deferred Tx, set serial ATN)

**Summary:** Routines to save a deferred transmit byte in zero page ($0095), call the serial transmit helper (JSR $ED36) to set serial clock/data and transmit the byte, and a small routine that reads/modifies VIA/CIA port A at $DD00 to set serial ATN. Contains assembly-level addresses $0095 and $DD00 and the JSR target $ED36.

## Description
This chunk contains three small routines:

- Two nearly identical entry points (for use after LISTEN and after TALK) that store the deferred transmit byte into zero page location $0095 then call the helper at $ED36 which sets serial clock/data lines, waits, and transmits the saved byte.
- A short routine that modifies the parallel port at $DD00 (VIA 2 / CIA 2 Data Register A) to set the serial ATN line. It reads $DD00, ANDs with #$F7 (clears bit 3), and writes back to $DD00.

Notes:
- The deferred transmit byte slot used is zero page $0095.
- The helper that performs clock/data setup and the actual transmission is at $ED36 (not included here).
- The code refers to "VIA 2 DRA"; on the C64 the chip at $DD00 is CIA 2 (6526). **[Note: Source may contain an error — calls the chip "VIA 2" while the C64 uses CIA 2 at $DD00.]**

## Source Code
```asm
                                *** send secondary address after LISTEN
.,EDB9 85 95    STA $95         save the defered Tx byte
.,EDBB 20 36 ED JSR $ED36       set the serial clk/data, wait and Tx the byte

                                *** set serial ATN high
.,EDBE AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EDC1 29 F7    AND #$F7        mask xxxx 0xxx, set serial ATN high
.,EDC3 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EDC6 60       RTS             

                                *** send secondary address after TALK
.,EDC7 85 95    STA $95         save the defered Tx byte
.,EDC9 20 36 ED JSR $ED36       set the serial clk/data, wait and Tx the byte
```

## Key Registers
- $0095 - Zero Page - saved deferred transmit byte
- $DD00-$DD0F - CIA 2 - Port A / CIA 2 I/O registers (code reads/writes $DD00 to control serial ATN)

## References
- "serial_pin_control_and_1ms_delay" — expands on sets/reads VIA 2 DRA to control ATN/clock/data lines
- "wait_for_serial_bus_end_after_send" — expands on follow-up: wait for bus end after sending