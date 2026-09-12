# Dokumentasi Lengkap Logic & Algoritma Engine Editor 2D (Pure Vector & Affine Matrix)

Dokumen ini berisi penjelasan matematis murni, arsitektur perangkat lunak, serta alur pipeline kalkulasi **Engine Transformasi Objek 2D** pada proyek editor desain undangan ini.

---

## 📋 Daftar Isi

1. [Pipeline Kalkulasi Vektor Murni (Vector Projection Pipeline)](#1-pipeline-kalkulasi-vektor-murni-vector-projection-pipeline)
2. [Sistem Koordinat Tiga Lapis (Three-Tier Coordinate System)](#2-sistem-koordinat-tiga-lapis-three-tier-coordinate-system)
3. [Basis Sumbu Lokal & Proyeksi Vektor (Vector Projection & Dot Product)](#3-basis-sumbu-lokal--proyeksi-vektor-vector-projection--dot-product)
4. [Kalkulasi Center Objek & Opposite Anchor Invariansi](#4-kalkulasi-center-objek--opposite-anchor-invariansi)
5. [Skala Objek Teks: Base Font Size Immutable & Visual Scale](#5-skala-objek-teks-base-font-size-immutable--visual-scale)
6. [Penanganan Dimensi Negatif & Axis Flipping](#6-penanganan-dimensi-negatif--axis-flipping)
7. [Algoritma Rotasi Vektor & Snapping Sudut 45°](#7-algoritma-rotasi-vektor--snapping-sudut-45)
8. [Hit Testing & Rotated Cursor Presisi](#8-hit-testing--rotated-cursor-presisi)
9. [Hasil Pengujian Unit Test Otomatis](#9-hasil-pengujian-unit-test-otomatis)

---

## 1. Pipeline Kalkulasi Vektor Murni (Vector Projection Pipeline)

Engine transformasi berjalan dengan pipeline vektor murni berikut pada setiap event `pointermove`:

```
WORLD POINTER
      ↓
OBJECT CENTER
      ↓
LOCAL AXIS BASIS (ux, uy)
      ↓
VECTOR PROJECTION (v · ux, v · uy)
      ↓
ANCHOR-PRESERVING RESIZE
      ↓
NEW WIDTH / HEIGHT
      ↓
NEW CENTER (centerNew = anchorWorld - rotate(anchorLocalNew - centerLocalNew, θ))
      ↓
AFFINE TRANSFORM MATRIX
      ↓
RENDER
```

### Prinsip **Stateless Calculation**:
$$\text{currentTransform} = \text{calculateFrom}(\text{initialTransform}, \text{initialPointer}, \text{currentPointer}, \text{activeHandle})$$
- **JANGAN** menggunakan `previousTransform` atau akumulasi delta (`width += deltaX`).
- **JANGAN** mengubah `baseFontSize` secara inkremental (`fontSize += delta`).
- **JANGAN** melakukan `Math.round()` intermediate per-frame yang menyebabkan kuantisasi drift.

---

## 2. Sistem Koordinat Tiga Lapis (Three-Tier Coordinate System)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SCREEN SPACE (DOM Pointer px)                            │
│    Koordinat event mouse pada layar browser (e.clientX/Y)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ CoordinateSystem.screenToWorld()
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. WORLD SPACE (Canvas Space)                               │
│    Koordinat global canvas independen terhadap Pan & Zoom   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Inverse Matrix M_initial^-1 / Local Axis Projection
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. LOCAL SPACE (Object Space)                               │
│    Koordinat lokal objek di mana top-left objek adalah (0,0)│
└─────────────────────────────────────────────────────────────┘
```

1. **Screen ke World**:
   $$\mathbf{P}_{\text{world}} = \frac{\mathbf{P}_{\text{screen}} - \mathbf{Pan}}{\text{Zoom}}$$

---

## 3. Basis Sumbu Lokal & Proyeksi Vektor (Vector Projection & Dot Product)

Untuk objek yang terotasi dengan sudut $\theta$ (dalam radian $\text{rad} = \theta \cdot \frac{\pi}{180}$):

### Unit Basis Sumbu Lokal di World Space:
$$\mathbf{u}_x = (\cos\theta, \sin\theta)$$
$$\mathbf{u}_y = (-\sin\theta, \cos\theta)$$

### Proyeksi Vektor (*Dot Product*):
Vektor dari Opposite Anchor di World Space ke Pointer World saat ini:
$$\mathbf{v} = \mathbf{P}_{\text{world\_current}} - \mathbf{P}_{\text{anchor\_world}}$$

Proyeksi scalar pada sumbu lokal $X$ dan $Y$:
$$proj_x = \mathbf{v} \cdot \mathbf{u}_x = v.x \cdot \cos\theta + v.y \cdot \sin\theta$$
$$proj_y = \mathbf{v} \cdot \mathbf{u}_y = -v.x \cdot \sin\theta + v.y \cdot \cos\theta$$

### Matriks Dimensi Mentah berdasarkan Proyeksi:

| Handle | Proyeksi $X$ ($proj_x$) | Proyeksi $Y$ ($proj_y$) | Raw Width ($W_{\text{raw}}$) | Raw Height ($H_{\text{raw}}$) |
| :--- | :--- | :--- | :--- | :--- |
| **SE** | $+proj_x$ | $+proj_y$ | $proj_x$ | $proj_y$ |
| **NW** | $-proj_x$ | $-proj_y$ | $-proj_x$ | $-proj_y$ |
| **NE** | $+proj_x$ | $-proj_y$ | $proj_x$ | $-proj_y$ |
| **SW** | $-proj_x$ | $+proj_y$ | $-proj_x$ | $proj_y$ |
| **E** | $+proj_x$ | — | $proj_x$ | $H_{\text{initial}}$ |
| **W** | $-proj_x$ | — | $-proj_x$ | $H_{\text{initial}}$ |
| **S** | — | $+proj_y$ | $W_{\text{initial}}$ | $proj_y$ |
| **N** | — | $-proj_y$ | $W_{\text{initial}}$ | $-proj_y$ |

---

## 4. Kalkulasi Center Objek & Opposite Anchor Invariansi

Setelah $W_{\text{new}}$ dan $H_{\text{new}}$ diperoleh dari proyeksi vektor:

1. **Pusat Lokal Baru Objek**:
   $$\mathbf{C}_{\text{local\_new}} = \left( \frac{W_{\text{new}}}{2}, \frac{H_{\text{new}}}{2} \right)$$

2. **Vektor dari Pusat Lokal Baru ke Local Anchor Baru**:
   $$\mathbf{d}_{\text{local}} = \mathbf{A}_{\text{local\_new}} - \mathbf{C}_{\text{local\_new}}$$

3. **Rotasikan Vektor ke World Space**:
   $$\mathbf{d}_{\text{world}} = \text{rotate}(\mathbf{d}_{\text{local}}, \theta)$$

4. **Pusat World Baru Objek (Menjaga Invariansi Opposite Anchor di World Space)**:
   $$\mathbf{C}_{\text{world\_new}} = \mathbf{P}_{\text{anchor\_world}} - \mathbf{d}_{\text{world}}$$

5. **Posisi Top-Left Baru Objek di World Space**:
   $$\mathbf{Pos}_{\text{world\_new}} = \mathbf{C}_{\text{world\_new}} - \text{rotate}(\mathbf{C}_{\text{local\_new}}, \theta)$$

---

## 5. Skala Objek Teks: Base Font Size Immutable & Visual Scale

- `baseFontSize` bersifat **IMMUTABLE** selama drag.
- Ukuran visual font dihitung langsung secara kontinu tanpa pembulatan intermedier:
  $$\text{visualFontSize} = \text{baseFontSize} \cdot \text{uniformScale}$$
- Pembulatan desimal tidak dilakukan di setiap `pointermove` untuk mencegah kesalahan akumulasi skala (*quantization drift*).

---

## 6. Penanganan Dimensi Negatif & Axis Flipping

Ketika kursor ditarik menyeberangi opposite anchor:
1. $W_{\text{raw}} < 0 \implies W_{\text{new}} = |W_{\text{raw}}|$, `flipX = !initialFlipX`
2. $H_{\text{raw}} < 0 \implies H_{\text{new}} = |H_{\text{raw}}|$, `flipY = !initialFlipY`

---

## 7. Algoritma Rotasi Vektor & Snapping Sudut 45°

1. Pusat objek di World Space: $\mathbf{C}_{\text{world}} = \mathbf{M} \cdot (W/2, H/2)$.
2. Vektor penunjuk: $\mathbf{v} = \mathbf{P}_{\text{world}} - \mathbf{C}_{\text{world}}$.
3. Sudut: $\theta = \text{atan2}(v.y, v.x) \cdot \frac{180}{\pi}$.
4. Snapping ke target $\{0^\circ, 45^\circ, 90^\circ, 135^\circ, 180^\circ, 225^\circ, 270^\circ, 315^\circ\}$ jika selisih $\le 5^\circ$.

---

## 8. Hit Testing & Rotated Cursor Presisi

CSS cursor dihitung berdasarkan sudut rotasi efektif objek $\theta$:
$$\theta_{\text{kursor}} = (\theta_{\text{handle}} + \theta_{\text{objek}}) \pmod{180}$$

---

## 9. Hasil Pengujian Unit Test Otomatis

Seluruh 18 kasus uji geometri lulus 100%:

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
