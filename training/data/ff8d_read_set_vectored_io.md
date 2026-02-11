# $FF8D — Read/Set vectored I/O

**Summary:** KERNAL entry $FF8D manages vectored I/O jump addresses stored in RAM. With the processor carry set it reads (stores) the current RAM vectors into a user list pointed to by X/Y; with carry clear it writes (copies) a user list from X/Y back into the system RAM vectors.

## Description
This KERNAL routine reads or writes the system's vectored I/O jump addresses (the RAM vector table). Behavior is selected by the processor carry flag at call time:

- Carry = 1: copy the current contents of the system RAM vectors into a list pointed to by the X and Y registers.
- Carry = 0: copy a user-supplied list (pointed to by X and Y) into the system RAM vectors, overwriting the existing RAM vectors.

The routine requires care: the recommended workflow is to first read the entire set of vectors into a user buffer, alter only the desired entries in that buffer, then write the complete buffer back to the system vectors. This avoids unintentionally corrupting vectors you did not intend to change.

(X and Y point to the user-area address used for the transfer.)

## References
- "ff8a_restore_default_io_vectors" — expands on restoring default vector values and related vector handling routines

## Labels
- READ_SET_VECTORED_IO
