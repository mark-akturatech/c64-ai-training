# Assembler Output: Hex Files and Loaders

**Summary:** Most assemblers emit an intermediate hex file (hexadecimal format) containing program data and placement info; a loader program translates that hex file into a binary image and places the data at the proper memory addresses for execution.

## Description
Assemblers typically produce an intermediate file (commonly a hex file) that contains all information needed about a program in hexadecimal form. Hex files encode program bytes and address/placement information in a format suited for transmission or storage across systems (binary blobs are harder to transfer). A loader reads the hex file, converts the encoded data into a binary image, and writes those bytes into the correct locations in the target machine's memory so the program can run.

(“Hex file” = text representation of bytes in hexadecimal; “loader” = program that interprets and installs that representation into memory.)

## References
- "absolute_addresses_in_listings" — expands on why the assembler/listing must record where code and data will be placed before producing hex output
- "loader_relocation_options" — describes loader functions and possible relocation options during hex-to-binary translation
