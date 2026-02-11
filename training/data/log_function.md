# COMMODORE 64 - LOG(numeric): natural logarithm

**Summary:** LOG(<numeric>) returns the natural logarithm (base e) of its numeric argument in Commodore BASIC; passing zero or a negative value causes the BASIC error ?ILLEGAL QUANTITY. Change-of-base for base‑10: LOG(ARG)/LOG(10).

## Description
TYPE: Floating-Point Function  
FORMAT: LOG(<numeric>)

Action: Returns the natural logarithm (log to the base of e) of the argument. If the argument is zero or negative the BASIC error message ?ILLEGAL QUANTITY will occur.

Change of base (example): compute logarithm base 10 of ARG with NUM = LOG(ARG)/LOG(10).

See Source Code for short BASIC examples.

## Source Code
```basic
25 PRINT LOG(45/7)
  1.86075234

10 NUM=LOG(ARG)/LOG(10)  (Calculates the LOG of ARG to the base 10)
```

## References
- "exp_function" — expands on EXP and LOG inverse relationship