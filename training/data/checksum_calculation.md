# Datassette 192-byte block checksum (XOR)

**Summary:** Datassette block checksum for a 192-byte payload: initialize checksum = $00 then sequentially XOR each payload byte (bitwise XOR). One-byte checksum per block is used to help detect tape dropouts and corruption.

## Checksum algorithm
The checksum protects a 192-byte payload by computing a single byte through sequential XOR operations. Procedure:
- Initialize checksum = $00.
- For each of the 192 payload bytes, perform checksum = checksum XOR payload_byte.
- The resulting one-byte value is stored with the block and used to verify integrity on read.

This method provides a simple parity-like integrity check for tape dropouts and general corruption. See referenced "data_block_structure" for how the checksum is included per block copy.

## Source Code
```text
checksum = $00 XOR byte1 XOR byte2 XOR ... XOR byte192
```

## References
- "data_block_structure" — expands on one-byte checksum included per block copy
