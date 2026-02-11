# Post-pack bugs: uninitialized memory and packer issues

**Summary:** Post-pack demo bugs often come from uninitialized memory or, less commonly, a buggy packer/cruncher; searchable terms: packers, crunchers, uninitialized memory, demo packing, Sledgehammer II, The Cruncher AB.

## Cause and symptoms
Two common causes when "everything works until I pack it":

- Buggy packer/cruncher: a packer could corrupt code or data during compression/expansion. This is uncommon for widely used tools, but possible.
- Uninitialized memory assumptions: more frequently, the demo relies on memory that happened to be zero (or another value) at build/run time. Packing changes memory layout/contents, so those formerly reliable locations may now contain different values and cause different behavior.

If the demo behaves differently with different packers/crunchers, the problem is more likely memory assumptions than a packer bug.

## Recommended actions
- Try different packers/crunchers. Prefer tools widely used by the scene (the source notes that Sledgehammer II and The Cruncher AB are unlikely to be buggy because they have been used extensively).
- Ensure all memory your demo relies on is explicitly initialized before use (clear buffers, set tables, initialize zero-page and RAM variables).
- If behavior changes between packers, assume uninitialized memory first and audit/initialize variables and data areas.

## References
- "packers_and_crunchers" — expands on packers/crunchers differences and reliability