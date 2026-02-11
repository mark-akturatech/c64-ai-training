# RIBUF ($F7-$F8) — RS-232 Input Buffer Pointer

**Summary:** RIBUF at $F7-$F8 is the KERNAL pointer to the currently active 256-byte RS-232 input buffer for device 2 (RS-232). OPENing device 2 allocates two 256-byte buffers at the top of memory and BASIC executes a CLR when opening the device.

## Description
When the RS-232 channel (device number 2) is opened, the KERNAL allocates two 256-byte input buffers at the top of memory. The 16-bit pointer stored at $F7-$F8 (RIBUF) holds the address of the buffer currently used to accumulate received characters.

Because the buffers are placed at the top of memory, BASIC programs should OPEN device 2 before assigning large variables or arrays; OPEN triggers a CLR (clear top-of-memory) which can relocate or reinitialize the top-of-memory region and prevent accidental overwriting of data previously placed there. (CLR = BASIC memory clear/top-of-memory setup)

## Key Registers
- $F7-$F8 - KERNAL - RIBUF: pointer to the currently active 256-byte RS-232 input buffer (device 2)

## References
- "robuf_rs232_output_buffer_pointer" — paired output buffer pointer used for RS-232 device 2

## Labels
- RIBUF
