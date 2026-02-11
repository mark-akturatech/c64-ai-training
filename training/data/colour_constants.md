# Kick Assembler — C64 colour constants and 3D vector support

**Summary:** Kick Assembler includes built-in C64 colour constants (BLACK=0 ... LIGHT_GRAY=15) for use with VIC-II registers like $D020 and $D021, and provides Vector and Matrix value types with functions/operators (get, getX/getY/getZ, +, -, *, /, X) for 3D calculations.

**C64 colour constants**
Kick Assembler defines named colour constants (Table 14.2) as immediate numeric values for direct use with hardware registers. These constants map directly to the C64 colour palette (0–15) and can be used in assembly expressions and STA to VIC-II color registers (example: border and background).

Defined constants and numeric values:
- BLACK = 0
- WHITE = 1
- RED = 2
- CYAN = 3
- PURPLE = 4
- GREEN = 5
- BLUE = 6
- YELLOW = 7
- ORANGE = 8
- BROWN = 9
- LIGHT_RED = 10
- DARK_GRAY / DARK_GREY = 11
- GRAY / GREY = 12
- LIGHT_GREEN = 13
- LIGHT_BLUE = 14
- LIGHT_GRAY / LIGHT_GREY = 15

Example usage (sets border and background):
- lda #BLACK
- sta $D020
- lda #WHITE
- sta $D021

(Registers $D020 and $D021 are VIC-II colour registers; use immediate (#) values.)

**3D vector and matrix support**
Kick Assembler supports Vector and Matrix values for 3D calculations. Vectors are created with Vector(x,y,z) and support coordinate accessors and common vector arithmetic via built-in functions/operators. Matrices are created with Matrix() and can be used for transformations such as scaling, rotation, and translation.

Vector creation and examples:
- .var v1 = Vector(1,2,3)
- .var v2 = Vector(0,0,2)
- Access: get(n) where x=0, y=1, z=2
- Accessors: getX(), getY(), getZ()
- Arithmetic: addition, subtraction, scaling, dot product, division, and cross product are supported
- Examples:
  - .var v1PlusV2 = v1 + v2
  - .var scaled = v1 * 10
  - .var dotProduct = v1 * v2
  - .var divided = v1 / 2
  - .var crossProduct = v1.X(v2)
  - .print "V1 scaled by 10 is " + (v1 * 10)

List of vector functions/operators (from Table 14.3):
- get(n) — Returns the n'th coordinate (x=0, y=1, z=2).
- getX() — Returns the x coordinate.
- getY() — Returns the y coordinate.
- getZ() — Returns the z coordinate.
- + — Vector addition (Vector(1,2,3) + Vector(2,3,4)).
- - — Vector subtraction (Vector(1,2,3) - Vector(2,3,4)).
- * Number — Scale vector by a number (Vector(1,2,3) * 4.2).
- * Vector — Dot product (Vector(1,2,3) * Vector(2,3,4)).
- / Number — Divides each coordinate by a factor and returns the result (Vector(1,2,3) / 2).
- X(Vector) — Returns the cross product between two vectors (Vector(0,1,0).X(Vector(1,0,0))).

Matrix creation and examples:
- .var matrix = Matrix() // Creates an identity matrix
- .eval matrix.set(2,3,100)
- .print "Matrix.get(2,3)=" + matrix.get(2,3)
- .print "The entire matrix=" + matrix

Matrix constructors:
- Matrix() — Creates an identity matrix.
- RotationMatrix(aX,aY,aZ) — Creates a rotation matrix where aX, aY, and aZ are the angles rotated around the x, y, and z axes (angles in radians).
- ScaleMatrix(sX,sY,sZ) — Creates a scale matrix where the x coordinate is scaled by sX, the y-coordinate by sY, and the z-coordinate by sZ.
- MoveMatrix(mX,mY,mZ) — Creates a move matrix that moves mX along the x-axis, mY along the y-axis, and mZ along the z-axis.
- PerspectiveMatrix(zProj) — Creates a perspective projection where the eye-point is placed in (0,0,0) and coordinates are projected on the XY-plane where z=zProj.

Matrix functions/operators:
- get(n,m) — Gets the value at row n, column m.
- set(n,m,value) — Sets the value at row n, column m.
- * Vector — Returns the product of the matrix and a vector.
- * Matrix — Returns the product of two matrices.

Example of combining transformations:
- .var m = RotationMatrix(0,0,toRadians(45)) * MoveMatrix(10,0,0)
- .var v = m * Vector(10,0,0)
- .print "Transformed v=" + v

## Source Code
```asm
; Example: using built-in colour constants with VIC-II registers
lda #BLACK
sta $D020
lda #WHITE
sta $D021
```

```text
; Colour constants (Table 14.2)
BLACK=0
WHITE=1
RED=2
CYAN=3
PURPLE=4
GREEN=5
BLUE=6
YELLOW=7
ORANGE=8
BROWN=9
LIGHT_RED=10
DARK_GRAY/DARK_GREY=11
GRAY/GREY=12
LIGHT_GREEN=13
LIGHT_BLUE=14
LIGHT_GRAY/LIGHT_GREY=15
```

```asm
; Vector examples (Kick Assembler syntax)
.var v1 = Vector(1,2,3)
.var v2 = Vector(0,0,2)
.var v1PlusV2 = v1 + v2
.print "V1 scaled by 10 is " + (v1 * 10)
.var dotProduct = v1 * v2
.var divided = v1 / 2
.var crossProduct = v1.X(v2)
```

```text
; Table 14.3 Vector Value Functions
Function/Operator    Example                          Description
get(n)               -                                Returns the n'th coordinate (x=0, y=1, z=2).
getX()               -                                Returns the x coordinate.
getY()               -                                Returns the y coordinate.
getZ()               -                                Returns the z coordinate.
+                    Vector(1,2,3) + Vector(2,3,4)    Returns the sum of two vectors.
-                    Vector(1,2,3) - Vector(2,3,4)    Returns the result of a subtraction between the two vectors.
* Number             Vector(1,2,3) * 4.2              Returns the vector scaled by a number.
* Vector             Vector(1,2,3) * Vector(2,3,4)    Returns the dot product.
/ Number             Vector(1,2,3) / 2                Divides each coordinate by a factor and returns the result.
X(Vector)            Vector(0,1,0).X(Vector(1,0,0))   Returns the cross product between two vectors.
```

```asm
; Matrix examples (Kick Assembler syntax)
.var matrix = Matrix() // Creates an identity matrix
.eval matrix.set(2,3,100)
.print "Matrix.get(2,3)=" + matrix.get(2,3)
.print "The entire matrix=" + matrix

; Combining transformations
.var m = RotationMatrix(0,0,toRadians(45)) * MoveMatrix(10,0,0)
.var v = m * Vector(10,0,0)
.print "Transformed v=" + v
```

## Key Registers
- $D020 - VIC-II - Border color register (set border color)
- $D021 - VIC-II - Background (screen) color register

## References
- "Kick Assembler Manual" — C64 colour constants and Vector functions (source excerpt)

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GRAY
- GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
