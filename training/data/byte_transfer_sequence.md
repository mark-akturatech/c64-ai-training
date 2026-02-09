# IEC Layer 2: Basic Byte Transmission Sequence (Commodore IEC Serial Bus)

**Summary:** IEC Layer 2 byte transfer: sender (host/peripheral) controls CLK, receivers control DATA between bytes; bits are transferred LSB-first on DATA with CLK-driven sample windows and both data-valid and data-invalid phases held a minimum of 60 µs.

## Protocol Overview
The sender (device initiating the byte transfer) exclusively controls the CLK line for the duration of a byte transfer. Receivers (one or more devices on the bus) control the DATA line between bytes to indicate readiness or to acknowledge. Individual bits of a byte are placed on DATA by the sender and sampled according to the CLK transitions; bytes are sent least-significant-bit first.

## Byte Transmission Sequence
1. Sender releases CLK to indicate "ready to send" (CLK goes high/tri-stated depending on interface electricals).  
2. Receivers release DATA when they are ready to receive (DATA line released/high by pull-up).  
3. Sender pulls CLK (this phase indicates data on DATA is NOT yet valid).  
4. Sender places the bit value on DATA (LSB first).  
5. Sender releases CLK (data valid period) — this data-valid phase must be held at least 60 µs.  
6. Sender pulls CLK again (data no longer valid) — this data-invalid phase must be held at least 60 µs.  
7. Repeat steps 4–6 for all 8 bits of the byte (LSB first).  
8. After the 8 bits, receivers pull DATA to signal busy/acknowledge (DATA asserted by receiver).  
9. Repeat the entire sequence for the next byte or end the transmission.

## Timing Constraints
- Data-valid hold (CLK released with valid DATA on line): minimum 60 µs.  
- Data-invalid hold (CLK pulled while DATA may change for next bit): minimum 60 µs.  
These hold times apply per bit (i.e., for each of the 8 bit cycles per byte).

## References
- "iec_layer1_electrical" — expands on pin roles for CLK and DATA (electrical behaviour).  
- "timing_evolution_on_commodore_models" — history and practical hold-times across models.