# Kick Assembler: Vector and Matrix Values

**Summary:** Introduces Kick Assembler value types Vector(x,y,z) and Matrix (4x4). Describes vector creation and arithmetic (getX/getY/getZ, +, -, scaling, dot product, cross product X()), and Matrix creation plus get/set access to 4x4 entries (Matrix(), Matrix.get, Matrix.set).

**Vectors**

Vectors are 3-component values created with `Vector(x, y, z)`. Example creation:

- `.var v1 = Vector(1, 2, 3)`
- `.var v2 = Vector(0, 0, 2)`

Supported operations and functions:

- **Accessors:**
  - `get(n)`: Returns the nth coordinate (x=0, y=1, z=2).
  - `getX()`: Returns the x coordinate.
  - `getY()`: Returns the y coordinate.
  - `getZ()`: Returns the z coordinate.
- **Arithmetic:**
  - `+`: Vector addition.
  - `-`: Vector subtraction.
- **Scaling:**
  - `* Number`: Multiplies each coordinate by a scalar.
  - `/ Number`: Divides each coordinate by a scalar.
- **Dot Product:**
  - `* Vector`: Returns the dot product of two vectors.
- **Cross Product:**
  - `X(v)`: Returns the cross product between two vectors.

Examples:

- `.var v1PlusV2 = v1 + v2`
- `.print "V1 scaled by 10 is " + (v1 * 10)`
- `.var dotProduct = v1 * v2`
- `.var crossProduct = v1.X(v2)`

**Matrices**

Matrix values represent a 4x4 matrix. Create with `Matrix()` (creates an identity matrix) or with other constructor functions. Access and modify entries with `get` and `set` methods:

- `matrix.get(row, col)`: Retrieves the value at the specified row and column.
- `matrix.set(row, col, value)`: Sets the value at the specified row and column.

Example:

- `.var matrix = Matrix() // Creates an identity matrix`
- `.eval matrix.set(2, 3, 100)`
- `.print "Matrix.get(2,3)=" + matrix.get(2, 3)`
- `.print "The entire matrix=" + matrix`

In 3D graphics, matrices are typically used to describe transformations of a vector space, such as moving the coordinates, scaling them, rotating them, etc. The `Matrix()` function creates an identity matrix, which leaves the coordinates unchanged. By using the `set` function, you can construct any matrix you like. However, Kick Assembler provides constructor functions that create the most common transformation matrices:

- `RotationMatrix(aX, aY, aZ)`: Creates a rotation matrix where `aX`, `aY`, and `aZ` are the angles rotated around the x, y, and z axes, respectively. The angles are given in radians.
- `ScaleMatrix(sX, sY, sZ)`: Creates a scale matrix where the x coordinate is scaled by `sX`, the y coordinate by `sY`, and the z coordinate by `sZ`.
- `MoveMatrix(mX, mY, mZ)`: Creates a move matrix that moves `mX` along the x-axis, `mY` along the y-axis, and `mZ` along the z-axis.
- `PerspectiveMatrix(zProj)`: Creates a perspective projection where the eye-point is placed at (0,0,0) and coordinates are projected on the XY-plane where z=`zProj`.

You can multiply matrices to combine their transformations. The transformation is read from right to left. For example, to move the space 10 units along the x-axis and then rotate it 45 degrees around the z-axis:

- `.var m = RotationMatrix(0, 0, toRadians(45)) * MoveMatrix(10, 0, 0)`

To transform a coordinate, multiply the matrix by the vector:

- `.var v = m * Vector(10, 0, 0)`
- `.print "Transformed v=" + v`

## Source Code

```text
.var v1 = Vector(1, 2, 3)
.var v2 = Vector(0, 0, 2)

.var v1PlusV2 = v1 + v2
.print "V1 scaled by 10 is " + (v1 * 10)
.var dotProduct = v1 * v2
.var crossProduct = v1.X(v2)

.var matrix = Matrix() // Creates an identity matrix
.eval matrix.set(2, 3, 100)
.print "Matrix.get(2,3)=" + matrix.get(2, 3)
.print "The entire matrix=" + matrix

.var m = RotationMatrix(0, 0, toRadians(45)) * MoveMatrix(10, 0, 0)
.var v = m * Vector(10, 0, 0)
.print "Transformed v=" + v
```

## References

- [Kick Assembler Manual: Making 3D Calculations](https://theweb.dk/KickAssembler/KickAssembler.pdf)