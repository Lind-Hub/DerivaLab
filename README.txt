DERIVALAB — DERIVATIVE CALCULATOR

IDENTITAS KELOMPOK

Nama Kelompok : InnoLab

DAFTAR ANGGOTA

1   Lindung Amirullah_                       26312062                                                                                                                                                      
2   Marria Ulvatur Rabaniyah_                26312036                                                                                                                                                      
3   Munadhil Isman Rafie_                    26312051                                                                                                                                                      
4   ANSORI_                                  26312022                                                                                                                                                      

1. NAMA APLIKASI
--------------------------------------------------------------------------------
Nama Aplikasi : DerivaLab — Derivative Calculator
Subjudul      : Kalkulator Turunan Fungsi & Visualisasi Grafik Interaktif

2. DESKRIPSI APLIKASI
--------------------------------------------------------------------------------
DerivaLab adalah aplikasi web edukasi interaktif yang dirancang sebagai media
pembelajaran materi turunan fungsi dalam mata kuliah Kalkulus.

Aplikasi ini digunakan untuk menghitung turunan pertama f'(x) dari fungsi
polinomial satu variabel x, menampilkan langkah penyelesaian secara runtut,
menyajikan landasan teori kalkulus, serta memvisualisasikan fungsi asli dan
fungsi turunannya melalui grafik koordinat interaktif.

DerivaLab mengintegrasikan proses perhitungan matematika, penjelasan konsep,
dan visualisasi grafik agar pengguna dapat memahami hubungan antara suatu
fungsi dan turunannya dengan lebih mudah.

3. TUJUAN APLIKASI
--------------------------------------------------------------------------------
- Membantu pengguna menghitung turunan pertama fungsi polinomial secara cepat.
- Membantu pemahaman aturan dasar turunan melalui langkah penyelesaian.
- Menyediakan landasan teori kalkulus sebagai materi pendukung pembelajaran.
- Memvisualisasikan fungsi asli f(x) dan fungsi turunan f'(x) dalam satu grafik.
- Membantu pengguna memeriksa hasil perhitungan melalui nilai fungsi pada
  beberapa koordinat x.
- Mengurangi kesalahan dalam penerapan aturan turunan dasar.

4. FITUR UTAMA
--------------------------------------------------------------------------------
- Input Fungsi:
  Menerima ekspresi fungsi polinomial satu variabel x sesuai format yang
  didukung oleh parser aplikasi.

- Kalkulator Turunan:
  Menghitung turunan pertama f'(x) berdasarkan aturan turunan yang didukung.

- Langkah Penyelesaian:
  Menampilkan proses penurunan fungsi secara bertahap berdasarkan suku-suku
  pada fungsi yang dimasukkan.

- Landasan Teori:
  Menyediakan materi tentang aturan konstanta, aturan pangkat, aturan
  koefisien, aturan penjumlahan dan pengurangan, serta fungsi linear.

- Grafik Fungsi Interaktif:
  Menampilkan grafik fungsi asli f(x) dan fungsi turunan f'(x) pada bidang
  koordinat yang sama.

- Pembaruan Grafik Dinamis:
  Menggunakan Plotly.react() untuk memperbarui visualisasi saat fungsi baru
  dihitung.

- Penyesuaian Skala Grafik:
  Menggunakan pengaturan autorange pada sumbu Y agar skala grafik dapat
  menyesuaikan data fungsi yang ditampilkan.

- Render Rumus Matematika:
  Menggunakan MathJax 3 untuk merender notasi matematika pada konten dinamis.

- Validasi Input:
  Menolak input kosong, format ekspresi yang tidak valid, pangkat negatif,
  pangkat desimal, serta fungsi atau karakter yang tidak didukung.

- Tombol Contoh:
  Menyediakan tombol untuk mengisi fungsi contoh sebagai bantuan pengujian.

5. KONSEP DAN ATURAN DASAR KALKULUS
--------------------------------------------------------------------------------
- Turunan Fungsi:
  Turunan menyatakan laju perubahan sesaat suatu fungsi terhadap variabelnya.
  Notasi turunan pertama ditulis sebagai f'(x) atau dy/dx.

- Aturan Konstanta:
  Turunan suatu konstanta adalah nol.

  d/dx [c] = 0

- Aturan Pangkat:
  Pangkat variabel dikalikan ke depan, kemudian pangkatnya dikurangi satu.

  d/dx [x^n] = n * x^(n-1)

- Aturan Koefisien Konstanta:
  Koefisien tetap dikalikan dengan hasil turunan fungsi berpangkat.

  d/dx [a * x^n] = a * n * x^(n-1)

- Aturan Penjumlahan dan Pengurangan:
  Turunan dari penjumlahan atau pengurangan fungsi dihitung dengan
  menurunkan setiap suku secara terpisah.

  d/dx [f(x) +/- g(x)] = f'(x) +/- g'(x)

- Turunan Fungsi Linear:
  Untuk fungsi linear f(x) = ax + b, turunannya adalah koefisien x.

  d/dx [ax + b] = a

6. PETUNJUK PENGGUNAAN
--------------------------------------------------------------------------------
1. Buka file index.html menggunakan web browser.
2. Masukkan fungsi polinomial pada kolom input yang tersedia.
3. Gunakan tombol "Isi Contoh" jika ingin mencoba fungsi contoh.
4. Tekan tombol "Hitung Turunan" untuk memulai perhitungan.
5. Amati hasil turunan pertama f'(x) yang ditampilkan.
6. Periksa grafik fungsi asli f(x) dan grafik turunannya f'(x).
7. Pelajari langkah penyelesaian untuk memahami proses penurunan setiap suku.
8. Gunakan bagian landasan teori sebagai referensi aturan turunan.
9. Jika input tidak valid, periksa pesan kesalahan dan perbaiki ekspresi
   sebelum menjalankan perhitungan kembali.

7. FORMAT INPUT DAN BATASAN FUNGSI
--------------------------------------------------------------------------------
- Variabel:
  Menggunakan variabel x.

- Fungsi yang didukung:
  Fungsi polinomial satu variabel dengan pangkat bilangan bulat nonnegatif.

- Contoh ekspresi:
  3x^4 + 2x^2 - 5x + 7
  x^2 + 2x
  4x^3 - 6x + 2
  5x^5 - 3x^2 + 8
  7x + 9
  12

- Pangkat negatif:
  Tidak didukung, misalnya 3x^-2.

- Pangkat desimal:
  Tidak didukung, misalnya 2x^1.5.

- Fungsi trigonometri atau fungsi lain:
  Fungsi seperti sin(x) tidak termasuk dalam cakupan kalkulator ini.

- Format ekspresi tidak valid:
  Ekspresi seperti x^^2 atau x + akan ditolak melalui validasi input.

Catatan:
Format input harus mengikuti aturan parser yang diterapkan pada kode aplikasi.

8. CONTOH PENGGUNAAN DAN HASIL PERHITUNGAN
--------------------------------------------------------------------------------
TES A

Input Fungsi:
f(x) = 3x^4 + 2x^2 - 5x + 7

Hasil Turunan:
f'(x) = 12x^3 + 4x - 5

Pemeriksaan Nilai Fungsi:

- Pada x = 0:
  f(0)  = 7
  f'(0) = -5

- Pada x = 1:
  f(1)  = 7
  f'(1) = 11

- Pada x = -1:
  f(-1)  = 17
  f'(-1) = -21


TES B

Input Fungsi:
f(x) = x^2 + 2x

Hasil Turunan:
f'(x) = 2x + 2

Pemeriksaan Nilai Fungsi:

- Pada x = 0:
  f(0)  = 0
  f'(0) = 2

- Pada x = 1:
  f(1)  = 3
  f'(1) = 4

- Pada x = -1:
  f(-1)  = -1
  f'(-1) = 0

Kedua contoh tersebut dapat digunakan untuk memeriksa kebenaran perhitungan
turunan dan kesesuaian nilai numerik yang ditampilkan pada grafik.

9. VALIDASI DAN HASIL PENGUJIAN
--------------------------------------------------------------------------------
Berdasarkan laporan pengujian yang disertakan pada versi DerivaLab v3.1,
kasus uji berikut dinyatakan LULUS (PASS).

A. Kasus Uji Input Tidak Valid

+-----+------------+----------------------------------------------+--------+
| No. | Input      | Hasil yang Diharapkan                       | Status |
+-----+------------+----------------------------------------------+--------+
|  1  | Kosong     | Input ditolak karena kosong                  | PASS   |
|  2  | x^^2       | Operator berurutan tidak valid                | PASS   |
|  3  | 3x^-2      | Pangkat negatif tidak didukung                | PASS   |
|  4  | 2x^1.5     | Pangkat desimal tidak didukung                | PASS   |
|  5  | sin(x)     | Fungsi tidak didukung                         | PASS   |
|  6  | abc        | Karakter atau fungsi tidak didukung           | PASS   |
|  7  | x +        | Format ekspresi tidak lengkap                 | PASS   |
+-----+------------+----------------------------------------------+--------+

B. Pemeriksaan Perhitungan dan Grafik

- Tes A:
  Hasil turunan yang diharapkan adalah 12x^3 + 4x - 5.

- Tes B:
  Hasil turunan yang diharapkan adalah 2x + 2.

- Grafik:
  Fungsi asli dan fungsi turunan harus sesuai dengan input terbaru dan
  diperbarui ketika pengguna menjalankan perhitungan baru.

- Render rumus:
  Rumus matematika harus ditampilkan dalam format yang mudah dibaca dan
  tidak memperlihatkan sintaks LaTeX mentah.

Catatan Pengujian:
Status PASS di atas mengikuti laporan pengujian yang diberikan untuk
DerivaLab v3.1 dan bukan verifikasi independen terhadap kode saat ini.

10. CARA MENJALANKAN APLIKASI
--------------------------------------------------------------------------------
DerivaLab dapat dijalankan secara lokal melalui web browser.

Langkah-langkah:
1. Pastikan file index.html, style.css, script.js, dan README.txt berada
   dalam satu folder.
2. Buka file index.html menggunakan browser web seperti Google Chrome,
   Mozilla Firefox, Microsoft Edge, atau Safari.
3. Pastikan koneksi internet tersedia ketika halaman dimuat agar pustaka
   eksternal dapat diakses.
4. Setelah aplikasi terbuka, masukkan fungsi dan tekan tombol "Hitung Turunan".

Kebutuhan Teknis:
- MathJax 3 digunakan untuk merender rumus matematika melalui CDN.
- Plotly.js v2.35.2 digunakan untuk menampilkan dan memperbarui grafik.
- Koneksi internet diperlukan untuk memuat pustaka tersebut melalui CDN.
- Parser dan algoritma turunan dijalankan secara lokal di browser sesuai
  implementasi aplikasi.

STRUKTUR FOLDER

DerivaLab/
├── index.html
├── style.css
├── script.js
└── README.txt

11. PENUTUP
--------------------------------------------------------------------------------
DerivaLab merupakan aplikasi pembelajaran interaktif yang menggabungkan
perhitungan turunan fungsi, penjelasan langkah penyelesaian, landasan teori,
dan visualisasi grafik.

Melalui aplikasi ini, pengguna diharapkan dapat memahami aturan dasar
diferensiasi, memeriksa hasil perhitungan, serta melihat hubungan antara
fungsi asli dan fungsi turunannya secara visual.

DerivaLab dikembangkan sebagai proyek pembelajaran mata kuliah Kalkulus
dan diharapkan dapat menjadi media pendukung pembelajaran yang bermanfaat.

================================================================================
AKHIR README — DERIVALAB
================================================================================
