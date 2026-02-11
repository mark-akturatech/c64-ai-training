# Saving machine-language stored in the cassette buffer (VIC / C64)

**Summary:** On the VIC and Commodore 64 a machine-language program placed in the cassette buffer can be destroyed by SAVE-to-tape and by some disk operations (4.0 BASIC) because those routines use the cassette buffer as workspace; reloading also risks failure due to BASIC pointer issues, especially the start-of-variables pointer.

## Problem description
On the VIC and Commodore 64 the cassette buffer is used both as temporary storage for machine-language routines and as a workspace by the built-in SAVE and (in Commodore 4.0 BASIC) certain disk commands. If a machine-language program resides in that buffer, issuing SAVE-to-tape will overwrite the buffer contents before they can be written out. Similarly, 4.0 BASIC disk commands reuse the cassette buffer area as a work area and can destroy any machine-language code located there.

Beyond the immediate loss of the code in RAM, a correctly saved and later reloaded program can still fail to run safely because of BASIC memory pointers — most notably the start-of-variables pointer. These pointers affect how BASIC allocates and interprets memory; if they are not restored or adjusted correctly when machine code is reloaded, execution or data access can behave incorrectly. The pointer-related issues and how to solve them are treated in detail in Chapter 6 of the source.

Workarounds referenced in the source include storing machine code as BASIC DATA statements and reconstructing it in RAM with POKE (see referenced material).

## References
- "storing_data_message_and_basic_call_loops" — expands on why saving the example program is problematic on some machines  
- "stopgap_save_using_data_and_poke" — expands on workaround: store code as BASIC DATA and reconstruct with POKE
