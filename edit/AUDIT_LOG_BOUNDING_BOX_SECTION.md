# Audit Log: Implementation & Specification of Section Bounding Box Engine

> **Tanggal Audit**: 12 September 2026  
> **Status**: Verified & Operational  
> **Target Subsystem**: 2D Bounding Box Engine, Section Coordinate Architecture, & Layer Synchronization  

---

## 1. Ringkasan Eksekutif (Executive Summary)

Audit ini mengevaluasi dan memperbaiki fungsionalitas **Section Bounding Box** serta **Sistem Sinkronisasi Layer per Section** pada sajijanji Web Editor. Setiap halaman/section pada undangan digital berukuran standar **390px × 844px**.

Sebelum perbaikan:
1. Koordinat elemen $y_{\text{world}}$ dihitung pada tinggi absolut kanvas ($N \times 844\text{px}$), namun ketika elemen digeser melintasi batas section, properti `sectionIndex` pada objek elemen maupun objek layer tidak diperbarui secara otomatis.
2. Tampilan Bounding Box pada kanvas tidak menampilkan konteks relatif section tempat elemen berada.
3. Pada mode Preview, elemen Cover diposisikan tanpa memperhitungkan skala `previewScale` dan tanpa perataan tengah (*centering*) relatif terhadap bingkai mobile.

Setelah perbaikan:
- **Auto-Sync Section Bounding Box**: `updateElement` dan `alignElement` pada `useEditorStore` secara otomatis menghitung ulang `sectionIndex` menggunakan fungsi matematis `getElementSectionIndex` dan menyinkronkan layer terkait secara real-time.
- **Section Bounding Box Info Badge**: Bounding Box seleksi (`mode === "selection"`) kini menampilkan indikator badge section (misal `Sec 3: Mempelai (120px)`) di pojok atas bounding box.
- **Glowing Section Frame Highlight**: Section yang sedang memuat elemen terpilih mendapatkan garis highlight *dashed border* transparan di sekitar batas `390px × 844px` miliknya.
- **Preview Cover Scaling & Centering**: Mode Preview Cover kini terpusat sempurna (*flex-center*) dan diskalakan proporsional mengikuti `previewScale`.

---

## 2. Formulasi Matematis & Koordinat Section

### 2.1 Konversi Koordinat World ke Local Section Space

Untuk setiap elemen dengan koordinat World $P_{\text{world}} = (x, y)$:

1. **Indeks Section ($S_i$)**:
   $$S_i = \min\left(N_{\text{sections}} - 1, \max\left(0, \lfloor \frac{y}{844} \rfloor\right)\right)$$

2. **Jarak Vertikal Relatif dalam Section ($y_{\text{section}}$)**:
   $$y_{\text{section}} = y - (S_i \times 844)$$

3. **Perataan Vertikal Presisi ($y_{\text{aligned}}$)**:
   - **Top Section**: $y_{\text{aligned}} = S_i \times 844$
   - **Center Section**: $y_{\text{aligned}} = S_i \times 844 + \frac{844 - H_{\text{element}}}{2}$
   - **Bottom Section**: $y_{\text{aligned}} = S_i \times 844 + 844 - H_{\text{element}}$

---

## 3. Log File yang Ditambahkan & Di-edit

### 3.1 File yang Ditambahkan (NEW)

| Path File | Keterangan |
| :--- | :--- |
| `edit/AUDIT_LOG_BOUNDING_BOX_SECTION.md` | Dokumentasi spesifikasi matematis, hasil audit, dan log perubahan file. |

---

### 3.2 File yang Di-edit (MODIFIED)

#### 1. `edit/src/store/useEditorStore.ts`
- **Perubahan**:
  - Memperbarui fungsi `updateElement`: Saat properti `top`, `left`, atau properti elemen lainnya diperbarui, `getElementSectionIndex` dipanggil untuk menghitung ulang $S_i$. Properti `sectionIndex` pada objek `element` dan objek `layer` diperbarui secara serentak.
  - Memperbarui fungsi `duplicateElement`: Menyalin `mockupType` dan `sectionIndex` pada layer baru.
  - Memperbarui fungsi `alignElement`: Menyimpan `sectionIndex: secIdx` secara eksplisit pada elemen dan layer saat perataan `center-y`, `top`, atau `bottom` dilakukan.

#### 2. `edit/src/components/editor/canvas.tsx`
- **Perubahan**:
  - Mengimpor `getElementSectionIndex` dari `@/store/useEditorStore`.
  - Memperbarui pembungkus `Cover Overlay` pada mode Preview agar menggunakan `flex items-center justify-center` dan wadah `w-[390px] h-[844px]` ber-skala `transform: scale(${previewScale})`.
  - Memperbarui `renderMockupElements(..., "selection")`: Menambahkan **Section Bounding Box Info Badge** (`Sec [N]: [Nama Section] ([relY]px)`) di atas Bounding Box seleksi Canva purple.
  - Memperbarui *Section Guide Layer*: Menambahkan efek *glowing dashed border* pada batas `390px × 844px` section yang memuat elemen yang sedang dipilih (`isSelectedSection`).

#### 3. `edit/src/components/editor/secondary-sidebar.tsx`
- **Perubahan**:
  - Mengoptimalkan mode navigasi Layer ("Section Aktif" vs "Semua Section").
  - Menghubungkan setiap item layer dengan fungsi `getElementSectionIndex` sehingga pengelompokan layer per section di sidebar selalu 100% sinkron dengan posisi fisik Bounding Box di kanvas.

---

## 4. Langkah Verifikasi Hasil

1. **Hasil Build**:
   - Perintah `pnpm --dir edit build` berhasil mengompilasi seluruh aplikasi Next.js (Turbopack) dan lulus pemeriksaan tipe TypeScript (`Finished TypeScript in 3.4s`).
2. **Verifikasi Git**:
   - Seluruh perubahan telah di-commit dan di-push ke repositori GitHub `aditya-fend/sajijanji-v1` pada branch `main`.
