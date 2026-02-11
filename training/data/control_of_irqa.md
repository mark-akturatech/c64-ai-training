# Control of /IRQA (CRA bits 6–7, CA1/CA2)

**Summary:** CRA bit 7 and bit 6 are the CA1 and CA2 interrupt flags respectively; they are set by an active transition on the CA1/CA2 inputs and can be masked by CRA bit 0 (CA1) and CRA bit 3 (CA2). Both flag bits (CRA bit 6 and bit 7) are cleared by a "Read Peripheral Output Register A" operation (reading Port A).

## Control of /IRQA
- CRA bit 7 (MSB) is set whenever the CA1 interrupt input sees an active transition. The interrupt request signaled by this flag can be disabled by clearing CRA bit 0 (setting bit 0 = 0).
- CRA bit 6 is set whenever the CA2 interrupt input sees an active transition. The interrupt request signaled by this flag can be disabled by clearing CRA bit 3 (setting bit 3 = 0).
- Both CRA bit 6 and CRA bit 7 are reset (cleared) by performing a "Read Peripheral Output Register A" operation — i.e., the processor reads the Port A peripheral I/O register.
- (“Active transition” is used by the source text; the source does not specify which edge/polarity.)

## References
- "6520_interrupt_request_line" — expands on how ISO flags map to /IRQA line

## Labels
- CRA
- CA1
- CA2
- IRQA
