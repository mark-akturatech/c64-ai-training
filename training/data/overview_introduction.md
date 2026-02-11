# ca65 — short introduction

**Summary:** ca65 is a macro assembler for 6502-family CPUs (6502, 65C02, 65816) used as the assembler companion to the cc65 cross-compiler but usable standalone; historically it replaces ra65 (from cc65) and reuses parts of the older a816 assembler.

## Overview
ca65 is a reimplementation intended to replace ra65 (the assembler bundled with the original cc65 C compiler). It is a full-featured macro assembler designed to handle the 6502, 65C02, and 65816 instruction sets and addressing modes. ca65 is distributed as part of a suite that also contains a linker and archiver for use with cc65, but it can be used independently for assembly of 6502-family source.

## Purpose and motivation
The author rewrote the assembler because ra65 had limitations and restrictive copyright terms that prevented desired functionality. The result is a new assembler/linker/archiver suite designed with those limitations removed and with features and design goals explained elsewhere (see references).

## Relation to cc65
ca65 is provided as the companion assembler for the cc65 cross-compiler (C compiler targeting 6502-family systems). When used with cc65, ca65 assembles output from the compiler and integrates with the suite's linker/archiver tools. ca65 may also be invoked directly from the command line to assemble standalone projects.

## Origins and code reuse
Some parts of ca65 — notably portions of code generation and routines for symbol-table handling — were derived from an earlier cross-assembler written by the same author named a816. The remainder was implemented anew to meet the suite’s design criteria and licensing goals.

## References
- "design_criteria" — expands on design goals that motivated ca65
- "usage_overview" — expands on how to run ca65 from the command line
