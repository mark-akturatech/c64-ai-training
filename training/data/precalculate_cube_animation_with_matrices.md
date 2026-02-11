# Kick Assembler — PrecalcObject Rotating-Cube Example & AsmInfo (-asminfo) Usage

**Summary:** This document details a Kick Assembler example that precalculates frames of a rotating cube animation using macros and matrix utilities. It also explains the `-asminfo` option, which outputs assembler metadata for editor integration.

**Precalculation Example — Rotating Cube**

This example demonstrates how to use Kick Assembler to precalculate an animation of a rotating cube projected onto the plane z=2.5. The source defines a list of 8 vectors representing the cube and utilizes the `PrecalcObject` macro:

- **Macro Definition:**
  - `PrecalcObject(object, animLength, nrOfXrot, nrOfYrot, nrOfZrot)`

The macro computes frames by constructing a composite transformation matrix:

`m = ScaleMatrix * PerspectiveMatrix * MoveMatrix * RotationMatrix`

It then transforms the cube's coordinates and stores them in memory. The example uses the `.align` directive to align data in memory:

- `.align $100`
- `PrecalcObject(Cube, 256, 2, -1, 1)`

**Details:**

- **Cube Definition:** The cube is defined by 8 vectors representing its vertices.

- **Macro Implementation:**
  - The `PrecalcObject` macro performs the following steps:
    1. Calculates rotation angles for each frame based on the total number of frames (`animLength`) and the number of rotations around each axis (`nrOfXrot`, `nrOfYrot`, `nrOfZrot`).
    2. Constructs the transformation matrix `m` by multiplying the `ScaleMatrix`, `PerspectiveMatrix`, `MoveMatrix`, and `RotationMatrix`.
    3. Applies the transformation matrix to each vertex of the cube to obtain the transformed coordinates for each frame.
    4. Stores the transformed coordinates in memory, aligning the data using `.align $100`.

- **Matrix Constructors:**
  - `ScaleMatrix(sX, sY, sZ)`:
    - Creates a scale matrix where the x-coordinate is scaled by `sX`, the y-coordinate by `sY`, and the z-coordinate by `sZ`.
  - `PerspectiveMatrix(zProj)`:
    - Creates a perspective projection where the eye-point is placed at (0,0,0) and coordinates are projected onto the XY-plane at `z=zProj`.
  - `MoveMatrix(mX, mY, mZ)`:
    - Creates a move matrix that translates by `mX` along the x-axis, `mY` along the y-axis, and `mZ` along the z-axis.
  - `RotationMatrix(aX, aY, aZ)`:
    - Creates a rotation matrix where `aX`, `aY`, and `aZ` are the angles rotated around the x, y, and z axes, respectively. The angles are given in radians.

**Note:** The example references Kick Assembler's vector and matrix utilities, such as `vector_value_functions` and `matrix_value_constructors_and_usage`.

**AsmInfo Option (-asminfo)**

Kick Assembler can emit structured information about built-in directives, libraries, and source-specific syntax/errors using the `-asminfo` option.

**Usage:**

- To generate assembler information:
  - `java -jar KickAss.jar mysource.asm -asminfo all`
    - Writes output to "asminfo.txt" by default.
- To specify an output file:
  - `java -jar KickAss.jar mysource.asm -asminfo all -asminfofile myAsmInfo.txt`

**Selectable Info Categories:**

- `all`:
  - Exports all predefined and source-specific assembler information.
- `allPredefined`:
  - Exports all predefined assembler information.
- You can combine multiple selections using the '|' (pipe) character, e.g., `allPredefined|errors`.

**Output Format:**

The output file is divided into labeled sections. Example sections include:

- `[libraries]`:
  - Lists bundled library functions and constants.
  - Format: `Library;kind;name;[argcount]`
- `[directives]`:
  - Lists directive names, aliases, and short help texts.
- `[files]`:
  - Lists included and processed files with indices and paths.
- `[syntax]`:
  - Provides syntax locations and token classifications for editor integration.
- `[errors]`:
  - Lists assembler errors, if requested.

The `asminfo` output is intended for editor integration, providing real-time error and syntax feedback, as well as contextual help for directives and libraries. The interface may change; contact the author if you rely on it.

## Source Code

```asm
; Define the cube's vertices
.const Cube = List(
    Vector(-1, -1, -1),
    Vector( 1, -1, -1),
    Vector( 1,  1, -1),
    Vector(-1,  1, -1),
    Vector(-1, -1,  1),
    Vector( 1, -1,  1),
    Vector( 1,  1,  1),
    Vector(-1,  1,  1)
)

; Macro to precalculate the animation frames
.macro PrecalcObject(object, animLength, nrOfXrot, nrOfYrot, nrOfZrot) {
    .var frames = List()
    .for (var frameNr = 0; frameNr < animLength; frameNr++) {
        .var aX = toRadians(frameNr * 360 * nrOfXrot / animLength)
        .var aY = toRadians(frameNr * 360 * nrOfYrot / animLength)
        .var aZ = toRadians(frameNr * 360 * nrOfZrot / animLength)
        .var zp = 2.5 ; z-coordinate for the projection plane
        .var m = ScaleMatrix(120, 120, 0) *
                 PerspectiveMatrix(zp) *
                 MoveMatrix(0, 0, zp + 5) *
                 RotationMatrix(aX, aY, aZ)
        ; Transform the coordinates
        .var coords = List()
        .for (var i = 0; i < object.size(); i++) {
            .eval coords.add(m * object.get(i))
        }
        .eval frames.add(coords)
    }
    ; Dump the list to memory
    .for (var coordNr = 0; coordNr < object.size(); coordNr++) {
        .for (var xy = 0; xy < 2; xy++) {
            .fill animLength, $80 + round(frames.get(i).get(coordNr).get(xy))
        }
    }
}

; Align data in memory
.align $100
; Precalculate 256-frame animation, rotate 2 times around X, -1 around Y, 1 around Z
PrecalcObject(Cube, 256, 2, -1, 1)
```

```text
; Example asminfo.txt output snippet (illustrative)
[libraries]
Math;constant;PI
Math;constant;E
Math;function;abs;1
Math;function;acos;1
...
[directives]
.text;.text "hello";Dumps text bytes to memory.
.by;.by $01,$02,$03;An alias for '.byte'.
...
[files]
0;KickAss.jar:/include/autoinclude.asm
1;mySource.asm
[syntax]
symbolReference;38,8,38,17,0
symbolReference;41,20,41,26,0
functionCall;41,8,41,18,0
symbolReference;56,8,56,17,0
...
[errors]
...
```

## References

- "matrix_value_constructors_and_usage" — expands on matrix constructors used in the example.
- "vector_value_functions" — expands on vector math used in the example.