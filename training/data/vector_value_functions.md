# Kick Assembler — Vector and Matrix Functions/Operators

**Summary:** Kick Assembler provides comprehensive support for 3D calculations through vector and matrix operations. This includes functions for vector manipulation (e.g., `get(n)`, `getX()`, `getY()`, `getZ()`) and operators for arithmetic and product calculations. Matrix support encompasses constructors for identity, rotation, scaling, translation, and perspective transformations, along with functions for element access and matrix-vector multiplication.

**Vector Functions and Operators**

- **get(n)** — Returns the nth coordinate of a vector. Indexing is zero-based: `x=0`, `y=1`, `z=2`. ([theweb.dk](https://theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))
- **getX()**, **getY()**, **getZ()** — Accessors for the x, y, and z components, respectively.
- **Operators:**
  - `+` — Vector addition (component-wise).
  - `-` — Vector subtraction (component-wise).
  - `* Number` — Scales the vector by a scalar (component-wise multiplication).
  - `* Vector` — Computes the dot product, resulting in a scalar.
  - `/ Number` — Divides the vector by a scalar (component-wise).
  - `X(v)` — Computes the cross product with vector `v`, resulting in a vector.

**Matrix Constructors and Usage**

- **Matrix()** — Creates an identity 4x4 matrix.
- **RotationMatrix(aX, aY, aZ)** — Creates a rotation matrix with angles `aX`, `aY`, and `aZ` (in radians) around the x, y, and z axes, respectively.
- **ScaleMatrix(sX, sY, sZ)** — Creates a scaling matrix that scales x by `sX`, y by `sY`, and z by `sZ`.
- **MoveMatrix(mX, mY, mZ)** — Creates a translation matrix that moves by `mX`, `mY`, and `mZ` along the x, y, and z axes, respectively.
- **PerspectiveMatrix(zProj)** — Creates a perspective projection matrix where the eye-point is at (0,0,0), projecting coordinates onto the XY plane at `z = zProj`.

**Combining Transformations:**

- Matrices multiply such that transformations are applied right-to-left. For example, to first move by (10,0,0) and then rotate 45° about the z-axis:
  - `.var m = RotationMatrix(0,0,toRadians(45)) * MoveMatrix(10,0,0)`
- To transform a vector by applying the matrix transformation:
  - `.var v = m * Vector(10,0,0)`

**Matrix Functions**

- **get(n, m)** — Retrieves the matrix element at row `n`, column `m`. Indexing is zero-based. ([theweb.dk](https://theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))
- **set(n, m, value)** — Sets the matrix element at row `n`, column `m` to `value`.
- **`* Vector`** — Multiplies a 4x4 matrix by a vector, applying the matrix transformation to the vector.
- **`* Matrix`** — Multiplies two matrices, resulting in a combined transformation matrix.

## Source Code

```text
; Example usage (Kick Assembler script style)
; Construct a combined transform: move 10 on X, then rotate 45 degrees around Z
.var m = RotationMatrix(0,0,toRadians(45)) * MoveMatrix(10,0,0)

; Transform vector (10,0,0)
.var v = m * Vector(10,0,0)

.print "Transformed v=" + v

; Matrix value constructors (from source, Table 14.4)
; Matrix()                - Creates an identity matrix.
; RotationMatrix(aX,aY,aZ) - Rotation by aX,aY,aZ (radians) about X,Y,Z axes.
; ScaleMatrix(sX,sY,sZ)   - Scale x,y,z by sX,sY,sZ.
; MoveMatrix(mX,mY,mZ)    - Translate by mX,mY,mZ.
; PerspectiveMatrix(zProj)- Perspective projection to plane z = zProj.

; Matrix functions (from source, Table 14.5)
; get(n,m)    - Gets the value at n,m.
; set(n,m,val)- Sets the value at n,m.
; *Vector      - Multiply matrix by a Vector (apply transform).
; *Matrix      - Multiply matrix by another Matrix (combine transforms).
```

## References

- "making_3d_calculations_intro" — expands on vector basics and examples

**Note:** The information provided is based on the Kick Assembler manual. For more detailed explanations and examples, refer to the official documentation.