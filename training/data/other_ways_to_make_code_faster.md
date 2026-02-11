# Higher-level optimization — change data or algorithm

**Summary:** Higher-level optimization for C-64 demos: change the data layout or the algorithm to enable faster routines; reformatting data often permits simpler, faster code and can cut runtime substantially.

## Overview
Optimize the algorithm first, then tune constant factors. Avoid brute-force approaches when a different algorithm or a smarter data representation can reduce work. In practice you can "cheat" by choosing or preformatting data so the routine does less processing (and thus runs faster), sometimes halving execution time.

## References
(omitted — no cross-references in source)
