# ca65 Users Guide — Memory model summary

**Summary:** The default address size of a segment in ca65 depends on the chosen memory model (e.g., near/far/huge). Labels inherit their address size from the segment they are declared in, so switching the memory model changes the default address size for segments and therefore for labels declared within them.

## Memory model behavior
The address-size default applied to a segment is determined by the currently selected memory model. Because symbols (labels) declared in a segment inherit that segment's address size, changing the memory model is an efficient way to change the address size of many symbols at once (e.g., switching between near/far/huge models).

## References
- "address_sizes_and_memory_models" — expands on address-size inheritance and memory models
