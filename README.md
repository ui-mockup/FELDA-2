# FELDA 70 Tahun — Live Mockup (Desktop 5)

Mockup laman utama FELDA dalam HTML/CSS/JS tulen, sedia untuk GitHub Pages.

## Struktur
```
index.html          ← semua HTML, CSS & JS
assets/js/a11y.js   ← panel Alat Kebolehcapaian (ikon ♿ di bar atas)
assets/img/         ← logo, banner hero, foto berita/program/media sosial, logo anak syarikat
```

## Pasang di GitHub Pages
1. Buat repo baharu, muat naik `index.html` dan folder `assets/` (kekalkan struktur).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. Laman akan siap di `https://<username>.github.io/<nama-repo>/` dalam 1–2 minit.

## Ubah suai
- Warna & fon: token `:root` di bahagian atas `<style>`.
- Foto: ganti fail dalam `assets/img/` dengan nama yang sama.
- Program & Inisiatif: tukar foto pada `<img class="foto">` dalam setiap kad.
- Warna panel kebolehcapaian: pemboleh ubah `--a11y-*` dalam `index.html` dan di bahagian atas CSS dalam `assets/js/a11y.js`.
- Logo SPS: masih wordmark teks — ganti dengan logo rasmi bila ada.

## Nota
Foto berita, program, media sosial dan logo anak syarikat dipotong daripada mockup Desktop 5 —
ganti dengan fail asal resolusi tinggi sebelum dilancarkan.
