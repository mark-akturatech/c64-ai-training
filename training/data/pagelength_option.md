# ca65 --pagelength option

**Summary:** The command-line option `--pagelength n` for ca65 sets the number of lines per listing page (listing generation/formatting). See the `.PAGELENGTH` directive for more information.

## Description
The `--pagelength n` option sets the length of a listing page in lines when generating assembler listings. The numeric parameter `n` is the number of text lines per page. This option affects only listing output (see the `.PAGELENGTH` assembler directive for directive-based control).

Use this option on the ca65 command line to override or specify page length for listing generation and formatting (listing output).

## References
- "listing_option" — expands on listing generation and formatting options
- ".PAGELENGTH" — directive controlling listing page length (see for directive usage and additional details)