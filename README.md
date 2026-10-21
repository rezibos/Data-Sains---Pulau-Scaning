# PULAU-SCAN: Pemetaan & Prediksi Kemiskinan Provinsi Kepulauan Riau

Aplikasi analitik data sains berbasis web untuk visualisasi spasial, pengelompokan (*clustering*), dan pemodelan proyeksi kemiskinan 7 kabupaten/kota di Provinsi Kepulauan Riau (2020–2030).

---

## 📌 Ringkasan Proyek

Provinsi Kepulauan Riau memiliki karakteristik geografis kepulauan yang unik dengan kesenjangan pembangunan antar-wilayah. **PULAU-SCAN** dirancang untuk membantu akademisi, pengambil kebijakan, dan publik dalam memahami pola kemiskinan daerah melalui pendekatan **Data Sains** interaktif.

Aplikasi ini mengintegrasikan:
1. **Google Maps Asli**: Pemetaan spasial interaktif dengan poligon wilayah riil 7 kabupaten/kota (Batam, Bintan, Karimun, Kepulauan Anambas, Lingga, Natuna, dan Tanjungpinang).
2. **K-Means Clustering**: Pengelompokan wilayah berdasarkan indikator kemiskinan dan Rata-rata Lama Sekolah (RLS) dengan evaluasi metrik *Silhouette Score*, *Davies-Bouldin Index*, dan *Elbow Method*.
3. **Regresi Linier Multivariat**: Model peramalan tingkat kemiskinan dengan fitur tren waktu, RLS, serta efek spesifik wilayah.
4. **Desain Premium Neobrutalism**: Tampilan antarmuka berkarakter kuat (*tactile hard shadows*, *midnight navy & cobalt blue*) yang responsif dan mudah dibaca.

---

## 🚀 Fitur Utama

- **Peta Interaktif Google Maps**:
  - Pilihan layer: **Jalan (Roadmap)**, **Satelit (Hybrid)**, dan **Medan (Terrain)**.
  - Visualisasi mode **Klaster K-Means** dan mode **Persentase Kemiskinan**.
  - Garis waktu animasi (*timeline playback*) dari tahun 2020 hingga proyeksi 2030.
  - Klik wilayah untuk membuka kartu analisis mendalam dan grafik tren kanvas.
- **Klasterisasi K-Means**:
  - Rekomendasi nilai $k$ optimal berbasis *Silhouette Score* tertinggi.
  - Tabel evaluasi inersia, Davies-Bouldin, dan grafik *Elbow*.
  - Tabel profil rata-rata kemiskinan dan RLS per klaster.
- **Komparasi Antar-Wilayah**:
  - Membandingkan indikator pembangunan dua wilayah secara berdampingan lengkap dengan grafik tren proyeksi.
- **Kalkulator Simulasi Prediksi ("What-If Scenario")**:
  - Pengguna dapat memproyeksikan persentase kemiskinan hingga tahun 2035 dengan memodifikasi target RLS wilayah.
  - Tabel proyeksi lengkap seluruh kabupaten/kota 2025–2030 disertai fitur **Salin sebagai CSV**.
  - Evaluasi metrik performa model (MAE: 0,853; RMSE: 1,129; R²: 0,496).
- **Eksplorasi Dataset BPS**:
  - Tabel data tabular bersih BPS 2020–2025 dengan fitur filter per wilayah.

---

## 📁 Struktur Direktori

Kode telah dipisahkan secara rapi dan modular (*Clean Code & Separation of Concerns*):

```text
├── index.html         # Halaman utama aplikasi (standard web entry)
├── pulau-scan.html    # Halaman aplikasi mandiri (kebab-case)
├── pulau-scan.css     # Stylesheet Neobrutalism (Cobalt & Midnight Navy)
├── pulau-scan.js      # Logika data sains, Google Maps Leaflet, & Canvas
└── README.md          # Dokumentasi proyek
```

---

## 📊 Metodologi Data Sains

### 1. Sumber Data
Data bersumber dari publikasi resmi **Badan Pusat Statistik (BPS) Provinsi Kepulauan Riau (2020–2025)** mencakup:
- Persentase Penduduk Miskin (%)
- Rata-rata Lama Sekolah / RLS (Tahun)
- Garis Kemiskinan (Rupiah/Kapita/Bulan)
- Jumlah Penduduk & Penduduk Miskin (Ribu Jiwa)

### 2. Klaster K-Means
- Diuji pada $k = 2$, $k = 3$, dan $k = 4$.
- Rekomendasi terbaik: **$k = 2$** (*Silhouette Score* = 0,516; *Davies-Bouldin* = 0,246).
- Klaster mengelompokkan wilayah kepulauan pedalaman vs pusat pertumbuhan ekonomi urban.

### 3. Model Regresi Linier Multivariat
Model memprediksi persentase penduduk miskin ($Y$) berdasarkan fungsi waktu ($t$), Rata-rata Lama Sekolah ($RLS$), dan *dummy variable* kabupaten/kota:

$$Y = \beta_0 + \beta_1(t - 2020) + \beta_2(RLS) + \sum_{i=1}^{6} \gamma_i(D_i)$$

Dilatih menggunakan data 2020–2024 dan divalidasi pada data aktual 2025.

---

## 💻 Cara Menjalankan Proyek

1. **Clone repositori**:
   ```bash
   git clone https://github.com/rezibos/Data-Sains---Pulau-Scaning.git
   cd Data-Sains---Pulau-Scaning
   ```

2. **Jalankan Aplikasi**:
   - Cukup buka file `index.html` atau `pulau-scan.html` langsung di browser Anda (Google Chrome, Brave, Firefox, Edge, dll).
   - Atau gunakan ekstensi **Live Server** di VS Code untuk pengalaman lokal terbaik.

---

## 👨‍💻 Kontributor
- **Mata Kuliah**: Data Sains (Semester 5)
- **Repositori**: [rezibos/Data-Sains---Pulau-Scaning](https://github.com/rezibos/Data-Sains---Pulau-Scaning)
