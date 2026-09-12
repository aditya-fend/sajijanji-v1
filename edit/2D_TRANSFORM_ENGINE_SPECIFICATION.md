# 2D Graphic Object Transformation Engine Specification & Mathematical Architecture

> **Role**: Senior Computer Graphics Engineer & Mathematics Lead  
> **Target Application**: Professional 2D Graphic Design Editor (Canva / Figma grade)  
> **Status**: Production Implemented & Verified (18/18 Automated Math Tests Passed)

---

## 1. System Architecture Overview

The Object Transformation Engine follows a modular, matrix-first design. All calculations are performed relative to an **initial pointer & object state snapshot** ($P_{\text{local}} = M_{\text{initial}}^{-1} \cdot P_{\text{world}}$) to guarantee complete statelessness, zero floating-point accumulation drift, and exact behavior across all rotation angles, flip states, and zoom levels.

```
                  ┌───────────────────────────────┐
                  │    Pointer Screen Event (px) │
                  └───────────────┬───────────────┘
                                  │ CoordinateSystem.screenToWorld()
                                  ▼
                  ┌───────────────────────────────┐
                  │    World Pointer Vector (x,y) │
                  └───────────────┬───────────────┘
                                  │ Inverse Matrix Transformation M_initial^-1
                                  ▼
                  ┌───────────────────────────────┐
                  │  Initial Local Space (x',y')  │
                  └───────────────┬───────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
┌──────────────────────────┐                   ┌──────────────────────────┐
│  ResizeController Engine │                   │ RotateController Engine  │
│  - Opposite Anchor Fixed │                   │ - Vector Angle atan2()   │
│  - Aspect Ratio Lock     │                   │ - 45° Snap Threshold     │
│  - Negative Flip Bounds  │                   └──────────────────────────┘
│  - Text Mode A/B Scaling │
└─────────┬────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Computed New Transform State { x, y, width, height, rotation, flipX }   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Data Models

### 2.1 Object Transform State (`ObjectTransformState`)

```typescript
export interface ObjectTransformState {
  x: number;          // World Position X (top-left bounding box anchor)
  y: number;          // World Position Y (top-left bounding box anchor)
  width: number;      // Local Width in pixels (>= MIN_WIDTH)
  height: number;     // Local Height in pixels (>= MIN_HEIGHT)
  rotation: number;   // Rotation angle in degrees [0, 360)
  scaleX: number;     // Horizontal scaling factor
  scaleY: number;     // Vertical scaling factor
  flipX?: boolean;    // Horizontal flip state (negative axis mirror)
  flipY?: boolean;    // Vertical flip state (negative axis mirror)
  originX?: number;   // Local pivot origin X (default 0)
  originY?: number;   // Local pivot origin Y (default 0)
}
```

### 2.2 Text Properties (`TextProperties`)

```typescript
export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;      // Logical base font size
  fontWeight?: string | number;
  lineHeight: number;    // Line height multiplier (e.g. 1.2)
  width: number;
  height: number;
  scaleX: number;        // Visual scale factor X
  scaleY: number;        // Visual scale factor Y
}
```

---

## 3. Mathematical Foundations & Coordinate Conversions

### 3.1 3x3 Affine Transformation Matrix (`Matrix2D`)

Every object transform is represented as a $3 \times 3$ Affine Matrix in column-major convention:

$$\mathbf{M} = \begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{bmatrix}$$

Where:
- $a = \cos(\theta) \cdot scaleX$
- $b = \sin(\theta) \cdot scaleX$
- $c = -\sin(\theta) \cdot scaleY$
- $d = \cos(\theta) \cdot scaleY$
- $e = x_{\text{world}}$
- $f = y_{\text{world}}$

Matrix multiplication formula:
$$\mathbf{M}_{\text{TRS}} = \mathbf{T}(x, y) \cdot \mathbf{R}(\theta) \cdot \mathbf{S}(s_x, s_y)$$

### 3.2 Matrix Inversion ($\mathbf{M}^{-1}$)

The inverse matrix transforms points from World Space back into Object Local Space:

$$\det(\mathbf{M}) = a d - b c$$

$$\mathbf{M}^{-1} = \frac{1}{\det(\mathbf{M})} \begin{bmatrix} d & -c & c f - d e \\ -b & a & b e - a f \\ 0 & 0 & 1 \end{bmatrix}$$

If $|\det(\mathbf{M})| < 10^{-10}$, the matrix is non-invertible and guarded against division by zero.

### 3.3 Coordinate System Pipeline

1. **Screen to World**:
   $$\mathbf{P}_{\text{world}} = \frac{\mathbf{P}_{\text{screen}} - \mathbf{Pan}}{\text{Zoom}}$$

2. **World to Local**:
   $$\mathbf{P}_{\text{local}} = \mathbf{M}_{\text{initial}}^{-1} \cdot \mathbf{P}_{\text{world}}$$

3. **Local to World**:
   $$\mathbf{P}_{\text{world}} = \mathbf{M} \cdot \mathbf{P}_{\text{local}}$$

---

## 4. Eight-Handle Resizing Engine (`ResizeController`)

### 4.1 Handle Definitions & Opposite Anchors

Each of the 8 resize handles locks the **opposite anchor point** in World Space:

| Handle | Local Position | Opposite Anchor Local ($\mathbf{A}_{\text{local}}$) | Resizing Axis |
| :--- | :--- | :--- | :--- |
| **NW** | $(0, 0)$ | $(W, H)$ | Both (Corner) |
| **N** | $(W/2, 0)$ | $(W/2, H)$ | Vertical |
| **NE** | $(W, 0)$ | $(0, H)$ | Both (Corner) |
| **W** | $(0, H/2)$ | $(W, H/2)$ | Horizontal |
| **E** | $(W, H/2)$ | $(0, H/2)$ | Horizontal |
| **SW** | $(0, H)$ | $(W, 0)$ | Both (Corner) |
| **S** | $(W/2, H)$ | $(W/2, 0)$ | Vertical |
| **SE** | $(W, H)$ | $(0, 0)$ | Both (Corner) |

### 4.2 Opposite Anchor Invariance Theorem

During a drag operation, the World position of the opposite anchor $\mathbf{P}_{\text{anchor\_world}} = \mathbf{M}_{\text{initial}} \cdot \mathbf{A}_{\text{local\_initial}}$ **MUST REMAIN INVARIANT**.

To determine the new object top-left position $(x_{\text{new}}, y_{\text{new}})$ after computing new local dimensions $(W_{\text{new}}, H_{\text{new}})$:

1. Identify the opposite anchor's local coordinates in the **new** box $\mathbf{A}_{\text{local\_new}}$.
2. Rotate the new local anchor vector by $\theta$:
   $$rx = \cos(\theta) \cdot A_{\text{local\_new}}.x - \sin(\theta) \cdot A_{\text{local\_new}}.y$$
   $$ry = \sin(\theta) \cdot A_{\text{local\_new}}.x + \cos(\theta) \cdot A_{\text{local\_new}}.y$$
3. Solve for new top-left position:
   $$x_{\text{new}} = P_{\text{anchor\_world}}.x - rx$$
   $$y_{\text{new}} = P_{\text{anchor\_world}}.y - ry$$

This guarantees 100% precision: the opposite corner does not shift by even a fraction of a pixel!

---

## 5. Negative Dimensions & Axis Flipping

When a handle is dragged across the opposite anchor:
1. Raw width $W_{\text{raw}}$ or height $H_{\text{raw}}$ becomes negative.
2. The engine calculates absolute dimensions: $W = |W_{\text{raw}}|$, $H = |H_{\text{raw}}|$.
3. Flip state is toggled: `flipX = !initialFlipX`, `flipY = !initialFlipY`.
4. Matrix inversion and anchor position remain continuous without breakdown or rendering artifacts.

---

## 6. Text Object Scaling (Mode A vs Mode B)

- **Mode A (Text Box Reflow)**:
  Used when dragging side handle E or W. Container width changes; `fontSize` remains constant while text wraps into multi-line flow based on `TextMetricsEngine.measureTextBox()`.

- **Mode B (Uniform Text Scaling)**:
  Used when dragging corner handles NW, NE, SW, SE. Both bounding box width and height scale proportionally, automatically updating font size:
  $$\text{scaleFactor} = \frac{W_{\text{new}}}{W_{\text{initial}}}$$
  $$\text{fontSize}_{\text{new}} = \text{round}(\text{fontSize}_{\text{initial}} \cdot \text{scaleFactor})$$

---

## 7. Vector Rotation & Snapping (`RotateController`)

When pointer moves during rotation:
1. Object center in world space: $\mathbf{C}_{\text{world}} = \mathbf{M} \cdot (W/2, H/2)$.
2. Direction vector: $\mathbf{v} = \mathbf{P}_{\text{world}} - \mathbf{C}_{\text{world}}$.
3. Angle: $\theta = \text{atan2}(v.y, v.x) \cdot \frac{180}{\pi}$.
4. Snapping: Evaluates angle against target set $\{0^\circ, 45^\circ, 90^\circ, 135^\circ, 180^\circ, 225^\circ, 270^\circ, 315^\circ\}$. If $|\theta - \theta_{\text{snap}}| \le 5^\circ$, snaps cleanly to $\theta_{\text{snap}}$.

---

## 8. Verification & Automated Test Results

Automated test suite `src/engine/tests/TransformEngineTest.ts` results:

```
=== 2D TRANSFORMATION ENGINE TEST RESULTS ===
✅ PASS: Test 1: SE Resize Width
✅ PASS: Test 1: SE Resize Height
✅ PASS: Test 1: Top-Left Anchor X Remains Stationarity
✅ PASS: Test 1: Top-Left Anchor Y Remains Stationarity
✅ PASS: Test 2: Rotated SE Resize Width
✅ PASS: Test 2: Rotated SE Resize Height
✅ PASS: Test 2: Rotated SE Opposite Anchor X Invariance
✅ PASS: Test 2: Rotated SE Opposite Anchor Y Invariance
✅ PASS: Test 3: NW Resize Width Expansion
✅ PASS: Test 3: NW Resize Height Expansion
✅ PASS: Test 3: NW Resize Position X Update
✅ PASS: Test 3: NW Resize Position Y Update
✅ PASS: Test 4: Screen to World Zoom 0.5 X
✅ PASS: Test 4: Screen to World Zoom 2.0 X
✅ PASS: Test 5: Locked Aspect Ratio Preserved
✅ PASS: Test 6: FlipX toggled when dragging past anchor
✅ PASS: Test 6: Width positive magnitude enforced
✅ PASS: Test 7: 45 Degree Rotation Snapping
Summary: 18 PASSED, 0 FAILED.
```
