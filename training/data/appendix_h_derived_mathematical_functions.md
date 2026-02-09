# Appendix H — Deriving mathematical functions in Commodore BASIC

**Summary:** BASIC equivalents for mathematical functions not built into Commodore 64 BASIC (secant, cosecant, cotangent, inverse trig, hyperbolic functions and inverses) expressed using ATN, EXP, LOG, SQR, SGN and the usual arithmetic; includes domain notes where the original source appears inconsistent.

## BASIC equivalents (cleaned / corrected)
Use the following expressions in Commodore BASIC (ATN, EXP, LOG, SQR, SGN). π (pi) must be provided explicitly when required.

- SEC(X)   = 1 / COS(X)
- CSC(X)   = 1 / SIN(X)
- COT(X)   = 1 / TAN(X)

- ARCSIN(X)  = ATN( X / SQR(-X*X + 1) )
- ARCCOS(X)  = -ATN( X / SQR(-X*X + 1) ) + PI/2
  - (PI must be supplied as a numeric literal)

- ARCSEC(X)  = ARCCOS(1 / X)          (use ARCCOS on 1/X)
- ARCCSC(X)  = ARCSIN(1 / X)          (use ARCSIN on 1/X)

- ARCOT(X)   = PI/2 - ATN(X)
  **[Note: Source lists ARCOT as ATN(X)+PI/2; that appears to be an error — correct identity is PI/2 - ATN(X).]**

- SINH(X)  = (EXP(X) - EXP(-X)) / 2
- COSH(X)  = (EXP(X) + EXP(-X)) / 2
- TANH(X)  = (EXP(X) - EXP(-X)) / (EXP(X) + EXP(-X))
  **[Note: Source's TANH formula appears corrupted; above is the standard identity.]**

- SECH(X)  = 2 / (EXP(X) + EXP(-X))
- CSCH(X)  = 2 / (EXP(X) - EXP(-X))
- COTH(X)  = (EXP(X) + EXP(-X)) / (EXP(X) - EXP(-X))
  **[Note: Source's COTH formula appears corrupted; above is the standard identity.]**

- ARCSINH(X)  = LOG( X + SQR( X*X + 1 ) )
- ARCCOSH(X)  = LOG( X + SQR( X*X - 1 ) )
- ARCTANH(X)  = LOG( (1 + X) / (1 - X) ) / 2

- ARCSECH(X)  = LOG( (1 / X) + SQR( 1 / (X*X) - 1 ) )
  **[Note: Source entry for ARCSECH is truncated; standard form used above.]**

- ARCCSCH(X)  = LOG( (1 / X) + SQR( 1 / (X*X) + 1 ) )
  **[Note: Source entry for ARCCSCH is truncated/garbled; standard form used above. For negative X you may need SGN(X) adjustments for principal value.]**

- ARCCOTH(X)  = LOG( (X + 1) / (X - 1) ) / 2

Domain reminders (implicit):
- Use SQR only on non-negative arguments; apply domain checks (e.g., |X| ≤ 1 for ARCSIN).
- Some inverse hyperbolic and inverse trig forms require selection of principal branch and sign handling (SGN) for negative inputs.

## Source Code
```text
+------------------------------+----------------------------------------+
|           FUNCTION           |            BASIC EQUIVALENT            |
+------------------------------+----------------------------------------+
|  SECANT                      |  SEC(X)=1/COS(X)                       |
|  COSECANT                    |  CSC(X)=1/SIN(X)                       |
|  COTANGENT                   |  COT(X)=1/TAN(X)                       |
|  INVERSE SINE                |  ARCSIN(X)=ATN(X/SQR(-X*X+1))          |
|  INVERSE COSINE              |  ARCCOS(X)=-ATN(X/SQR(-X*X+1))+{pi}/2  |
|  INVERSE SECANT              |  ARCSEC(X)=ATN(X/SQR(X*X-1))           |
|  INVERSE COSECANT            |  ARCCSC(X)=ATN(X/SQR(X*X-1))           |
|                              |    +(SGN(X)-1*{pi}/2                   |
|  INVERSE COTANGENT           |  ARCOT(X)=ATN(X)+{pi}/2                |
|  HYPERBOLIC SINE             |  SINH(X)=(EXP(X)-EXP(-X))/2            |
|  HYPERBOLIC COSINE           |  COSH(X)=(EXP(X)+EXP(-X))/2            |
|  HYPERBOLIC TANGENT          |  TANH(X)=EXP(-X)/(EXP(X)+EXP(-X))*2+1  |
|  HYPERBOLIC SECANT           |  SECH(X)=2/(EXP(X)+EXP(-X))            |
|  HYPERBOLIC COSECANT         |  CSCH(X)=2/(EXP(X)-EXP(-X))            |
|  HYPERBOLIC  COTANGENT       |  COTH(X)=EXP(-X)/(EXP(X)-EXP(-X))*2+1  |
|  INVERSE HYPERBOLIC SINE     |  ARCSINH(X)=LOG(X+SQR(X*X+1))          |
|  INVERSE HYPERBOLIC COSINE   |  ARCCOSH(X)=LOG(X+SQR(X*X-1))          |
|  INVERSE HYPERBOLIC TANGENT  |  ARCTANH(X)=LOG((1+X)/(1-X))/2         |
|  INVERSE HYPERBOLIC SECANT   |  ARCSECH(X)=LOG((SQR(-X*X+1)+1/X)      |
|  INVERSE HYPERBOLIC COSECANT |  ARCCSCH(X)=LOG((SGN(X)*SQR(X*X+1/X)   |
|  INVERSE HYPERBOLIC COTANGENT|  ARCCOTH(X)=LOG((X+1)/(X-1))/2         |
+------------------------------+----------------------------------------+
```

## References
- "appendix_a_basic_abbreviations" — using abbreviated BASIC keywords when typing formula implementations