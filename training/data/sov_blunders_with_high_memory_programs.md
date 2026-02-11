# SOV and Loading Machine Language into High Memory (C64)

**Summary:** Loading machine‑language modules directly into high memory (e.g. $C000-$CFFF) using the programmed LOAD can leave SOV (start‑of‑variables) positioned immediately above the module, causing OUT OF MEMORY when BASIC variables are needed; recommended order: load high‑memory ML first, then LOAD the BASIC program so TOM and SOV are set correctly (may require adjusting TOM and issuing NEW between loads).

## Problem
- Using a direct LOAD (addressed/programmed LOAD) to place a machine language module into high memory sets SOV immediately above that block.  
- If BASIC is already resident, or if you load ML after BASIC, SOV can end up too high and there will be no room for BASIC variables, producing OUT OF MEMORY on most operations.
- The same class of error occurs when placing ML into the cassette buffer (direct load) after BASIC — it corrupts the SOV placement and breaks BASIC variable space.

## Recommended procedure
- Load the machine language module into high memory first (so it occupies its intended high region).  
- Then load the BASIC program; the second load will reposition TOM and SOV appropriately, restoring room for variables.  
- You may need to adjust the top‑of‑memory pointer (TOM) and use NEW between loads to ensure the system accepts the next LOAD command — if the system reports OUT OF MEMORY you may not be able to issue the next LOAD until TOM/SOV are fixed.

## References
- "where_to_put_machine_language_programs" — expands on order of loads and pointer adjustments
