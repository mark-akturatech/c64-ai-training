# Kick Assembler: -asminfo option

**Summary:** Describes Kick Assembler's -asminfo option (command-line flag) and the asminfo output sections ([libraries], [directives], [preprocessorDirectives], [files], [syntax], [errors]). Covers which sections are predefined vs. source-specific and example ways to request subsets (e.g. allPredefined, allPredefined|errors). Mentions output file control via -asminfofile.

## Description
The -asminfo option makes Kick Assembler produce a machine-readable report of assembler metadata and analysis. The report contains named sections (bracketed names) describing predefined items (libraries, directives, preprocessor directives) and information derived from the assembled sources (files, syntax info, errors). You can request the full report or specific categories.

## asminfo sections and category classification
Each asminfo section is emitted under a bracketed heading (e.g. [libraries]) in the output file. Sections are classified as either predefined (global definitions shipped with Kick Assembler) or source-specific (derived from the current assembly):

- [libraries] — predefined  
  - The defined libraries: functions and constants provided by Kick Assembler or installed libraries.

- [directives] — predefined  
  - The defined assembler directives (e.g., DB, DW, EQU-style directives provided by Kick).

- [preprocessorDirectives] — predefined  
  - The defined preprocessor directives (macros and preprocessor commands).

- [files] — sourceSpecific  
  - The files involved in the assembling (source files, included files).

- [syntax] — sourceSpecific  
  - Syntax information for the given files (parsed tokens, recognized constructs for the specific source).

- [errors] — sourceSpecific  
  - Errors found during assembling (parse/semantic/other errors tied to the current assembly).

## Requesting subsets and examples
- Request the entire report:
  - asminfo argument "all" generates all available sections.
- Request all predefined sections only:
  - asminfo argument "allPredefined" (returns predefined sections: libraries, directives, preprocessorDirectives).
- Combine section selectors with | (pipe) to request multiple parts:
  - Example: "allPredefined|errors" returns all predefined sections plus the source-specific errors section.
- Output file:
  - Default output is asminfo.txt (in the working directory) unless overridden with -asminfofile <filename>.

## Source Code
```text
# Example command to request all asminfo and write default asminfo.txt
java -jar KickAss.jar mysource.asm -asminfo all

# Example command to request only predefined sections and errors, custom output file
java -jar KickAss.jar mysource.asm -asminfo allPredefined|errors -asminfofile custom_asminfo.txt
```

## References
- "asminfo_sections_details" — expands on details of asminfo sections
