# Buku Online

Situs statis untuk menyimpan dan membaca terjemahan buku dalam bahasa Indonesia. Dibangun dengan [Nuxt](https://nuxt.com) dan tema [Docus](https://github.com/nuxt-content/docus), lalu dipublikasikan lewat GitHub Pages.

## Cara kerja

```
sumber/*.md  ──(scripts/build-books.mjs)──►  content/1.buku/*.md   halaman Docus
                                            ►  public/html/*.html   buku HTML hitam putih (daftar isi, siap cetak)
                                            ►  content/index.md     beranda dengan daftar buku
```

`sumber/` adalah satu-satunya tempat Anda mengedit buku. File di `content/1.buku/`, `content/index.md`, dan `public/html/` dibuat ulang setiap kali generator dijalankan, jadi jangan diedit manual.

## Menambah buku

1. Buat file `sumber/<slug>.md` dengan front matter berikut, lalu isi bukunya dengan Markdown. Baris `# Judul` pertama dipakai sebagai halaman judul buku HTML.

   ```markdown
   ---
   judul: Judul Buku
   penulis: Nama Penulis
   kategori: Nama Kategori
   urutan: 6
   deskripsi: Satu kalimat tentang buku ini.
   ---
   # Judul Buku
   ...
   ```

`kategori` wajib diisi. Buku dengan kategori yang sama dikelompokkan di sidebar dan di beranda; kategori baru muncul otomatis.

2. Jalankan `npm run buku` untuk membuat halaman dan versi HTML-nya.
3. Commit dan push ke `main`. GitHub Actions akan membangun dan memublikasikan situs.

## Pengembangan lokal

Butuh Node.js 22 atau lebih baru.

```bash
npm install
npm run dev        # server pengembangan di http://localhost:3000
```

Untuk meniru hasil di GitHub Pages:

```bash
NUXT_APP_BASE_URL=/bukuonline/ npm run generate   # hasil di .output/public
```

## Publikasi ke GitHub Pages

1. Push repo ini ke GitHub (`aryapramudika/bukuonline`).
2. Di repo, buka **Settings → Pages**, pada **Source** pilih **GitHub Actions**.
3. Setiap push ke `main` menjalankan `.github/workflows/deploy.yml`. Situs akan tersedia di `https://aryapramudika.github.io/bukuonline/`.

Jika memakai domain sendiri atau nama repo berbeda, ubah `NUXT_APP_BASE_URL` dan `NUXT_PUBLIC_SITE_URL` di workflow.

## Catatan isi

Buku-buku di sini adalah terjemahan bebas atau penjelasan dengan kata-kata sendiri, bukan terjemahan kalimat per kalimat dari teks sumbernya (Project Gutenberg). Detailnya tertulis di bagian awal tiap buku.
