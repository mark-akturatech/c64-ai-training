# Kick Assembler: Matrix(), RotationMatrix, ScaleMatrix, MoveMatrix, PerspectiveMatrix

**Summary:** Describes Kick Assembler matrix constructors (Matrix() identity, RotationMatrix(aX,aY,aZ) — radians, ScaleMatrix(sX,sY,sZ), MoveMatrix(mX,mY,mZ), PerspectiveMatrix(zProj), multiplication order (read right-to-left), and vector transformation via Matrix()*Vector(x,y,z). Includes a precalc example that animates and projects a rotating cube.

**Matrix constructors and behavior**
- **Matrix()** — Returns the identity matrix.
- **RotationMatrix(aX,aY,aZ)** — Constructs a rotation matrix from Euler angles aX, aY, aZ (angles in radians).
- **ScaleMatrix(sX,sY,sZ)** — Constructs a diagonal scale matrix that scales X/Y/Z by sX/sY/sZ.
- **MoveMatrix(mX,mY,mZ)** — Constructs a translation matrix that moves coordinates by the vector (mX,mY,mZ).
- **PerspectiveMatrix(zProj)** — Constructs a projection matrix that projects 3D points onto the plane z = zProj (zProj is the projection-plane Z coordinate).

**Multiplication and vector transform**
- **Matrix * Vector(x,y,z)** — Transforms the vector by the matrix, returning the resulting vector (order: single matrix applied to vector).
- **Matrix * Matrix** — Returns the product of two matrices.
- **Matrix multiplication order:** When composing transforms as M = A * B * C, the effective transform applied to a vector v is A * (B * (C * v)). Therefore, composition reads right-to-left: the rightmost matrix is applied first.

**Example: precalculating a rotating cube**
- The example macro `PrecalcObject(object, animLength, nrOfXrot, nrOfYrot, nrOfZrot)` precalculates `animLength` frames of a cube rotating `nrOfXrot`/`nrOfYrot`/`nrOfZrot` times around X/Y/Z respectively.
- For each frame, angles are computed with `toRadians(frameNr*360*nrOfXrot/animLength)` etc., then the composite transform used is:
  `ScaleMatrix(120,120,0) * PerspectiveMatrix(zp) * MoveMatrix(0,0,zp+5) * RotationMatrix(aX,aY,aZ)`
  - Because of right-to-left application, `RotationMatrix` is applied first, then `Move`, then `Perspective`, then `Scale`.
- The transformed coordinates for each frame are stored in a list of frames and finally written out (via `.fill` + rounding) at label `cubeCoords`, with `.align $100` before the data placement.

## Source Code
```asm
//-------------------------------------------------------------------------------//
// Objects
//-------------------------------------------------------------------------------//
.var Cube = List().add(
    Vector(1,1,1), Vector(1,1,-1), Vector(1,-1,1), Vector(1,-1,-1),
    Vector(-1,1,1), Vector(-1,1,-1), Vector(-1,-1,1), Vector(-1,-1,-1)
)

//-------------------------------------------------------------------------------//
// Macro for doing the precalculation
//-------------------------------------------------------------------------------//
.macro PrecalcObject(object, animLength, nrOfXrot, nrOfYrot, nrOfZrot) {
    // Rotate the coordinate and place the coordinates of each frame in a list
    .var frames = List()
    .for (var frameNr = 0; frameNr < animLength; frameNr++) {
        // Set up the transform matrix
        .var aX = toRadians(frameNr * 360 * nrOfXrot / animLength)
        .var aY = toRadians(frameNr * 360 * nrOfYrot / animLength)
        .var aZ = toRadians(frameNr * 360 * nrOfZrot / animLength)
        .var zp = 2.5 // z-coordinate for the projection plane

        .var m = ScaleMatrix(120, 120, 0) *
                 PerspectiveMatrix(zp) *
                 MoveMatrix(0, 0, zp + 5) *
                 RotationMatrix(aX, aY, aZ)

        // Transform the coordinates
        .var coords = List()
        .for (var i = 0; i < object.size(); i++) {
            .eval coords.add(m * object.get(i))
        }
        .eval frames.add(coords)
    }
    // Dump the list to the memory
    .for (var frameNr = 0; frameNr < animLength; frameNr++) {
        .for (var coordNr = 0; coordNr < object.size(); coordNr++) {
            .for (var xy = 0; xy < 2; xy++) {
                .fill 1, $80 + round(frames.get(frameNr).get(coordNr).get(xy))
            }
        }
    }
}

//-------------------------------------------------------------------------------//
// The vector data
//-------------------------------------------------------------------------------//
.align $100
cubeCoords: PrecalcObject(Cube, 256, 2, -1, 1)
```

## References
- "vector_value_functions" — expands on applying matrices to vectors and related helper functions.