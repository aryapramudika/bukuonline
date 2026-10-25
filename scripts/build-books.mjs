// Generator: sumber/*.md  ->  content/1.buku/*.md (halaman Docus)
//                          ->  public/html/*.html (buku HTML hitam putih)
//                          ->  content/index.md (beranda)
// Tanpa dependensi, cukup Node 18+.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dirSumber = join(root, 'sumber')
const dirKonten = join(root, 'content', '1.buku')
const dirHtml = join(root, 'public', 'html')

// Base URL situs (mis. /bukuonline/ di GitHub Pages); samakan dengan NUXT_APP_BASE_URL saat build.
const base = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/?$/, '/')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = t => esc(t)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')

function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) throw new Error('Front matter tidak ditemukan')
  const meta = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m[2] }
}

// ---------- Markdown sederhana -> HTML buku ----------
function bukuHtml(md, judulHalaman) {
  const lines = md.split('\n')
  const out = []
  const toc = []
  const meta = []
  let judul = ''
  let sawTitle = false
  let list = null
  let inTable = false
  let inQuote = false
  let para = []
  let n = 0

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = [] }
  }
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null } }
  const closeQuote = () => { if (inQuote) { flushPara(); out.push('</blockquote>'); inQuote = false } }

  for (const raw of lines) {
    const s = raw.trim()
    if (s.startsWith('|')) {
      flushPara(); closeList()
      const cells = s.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
      if (cells.every(c => /^-+$/.test(c))) continue
      if (!inTable) {
        out.push(`<table><thead><tr>${cells.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`)
        inTable = true
      } else {
        out.push(`<tr>${cells.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`)
      }
      continue
    } else if (inTable) { out.push('</tbody></table>'); inTable = false }

    if (s.startsWith('>')) {
      flushPara(); closeList()
      if (!inQuote) { out.push('<blockquote>'); inQuote = true }
      para.push(s.slice(1).trim())
      continue
    } else closeQuote()

    if (!s) { flushPara(); closeList(); continue }
    if (s === '---') { flushPara(); closeList(); continue }

    let m = s.match(/^(#{1,4})\s+(.*)/)
    if (m) {
      flushPara(); closeList()
      const level = m[1].length
      if (level === 1 && !sawTitle) { judul = m[2]; sawTitle = true; continue }
      n += 1
      const id = `h${n}`
      if (level === 2) { out.push(`<h2 id="${id}" class="chapter">${inline(m[2])}</h2>`); toc.push([2, id, m[2]]) }
      else if (level === 3) { out.push(`<h3 id="${id}">${inline(m[2])}</h3>`); toc.push([3, id, m[2]]) }
      else out.push(`<h4>${inline(m[2])}</h4>`)
      continue
    }
    m = s.match(/^- (.*)/)
    if (m) {
      flushPara()
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul' }
      out.push(`<li>${inline(m[1])}</li>`)
      continue
    }
    m = s.match(/^\d+\. (.*)/)
    if (m) {
      flushPara()
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol' }
      out.push(`<li>${inline(m[1])}</li>`)
      continue
    }
    closeList()
    if (!out.length && sawTitle) meta.push(s)
    else para.push(s)
  }
  flushPara(); closeList(); closeQuote()
  if (inTable) out.push('</tbody></table>')

  const tocHtml = toc
    .map(([l, id, t]) => `<li class="l${l}"><a href="#${id}">${inline(t)}</a></li>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(judulHalaman || judul)}</title>
<style>
  @page { size: A5; margin: 20mm 18mm 22mm; @bottom-center { content: counter(page); font-family: Georgia, serif; font-size: 10pt; } }
  @page :first { @bottom-center { content: none; } }
  html { background: #fff; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 12pt; line-height: 1.55; color: #000; background: #fff; margin: 0; }
  main { max-width: 34em; margin: 0 auto; padding: 2em 1.2em 4em; }
  .titlepage { text-align: center; padding-top: 28vh; page-break-after: always; break-after: page; }
  .titlepage h1 { font-size: 2em; margin: 0 0 1.2em; }
  .titlepage p { margin: .3em 0; }
  .contents { page-break-after: always; break-after: page; }
  .contents h2 { text-align: center; font-size: 1.4em; margin: 0 0 1em; }
  ul.toc { list-style: none; padding: 0; margin: 0; }
  ul.toc li { margin: .25em 0; }
  ul.toc li.l3 { margin-left: 1.5em; font-size: .95em; }
  ul.toc li.l2 { margin-top: .7em; font-weight: bold; }
  ul.toc a { color: #000; text-decoration: none; }
  ul.toc a:hover { text-decoration: underline; }
  h2.chapter { font-size: 1.5em; text-align: center; margin: 0 0 1em; page-break-before: always; break-before: page; }
  h3 { font-size: 1.15em; margin: 1.6em 0 .4em; page-break-after: avoid; break-after: avoid; }
  h4 { font-size: 1em; font-style: italic; margin: 1.2em 0 .3em; }
  p { margin: 0 0 .8em; text-align: justify; hyphens: auto; }
  blockquote { margin: 1em 1.5em; font-style: italic; }
  blockquote p { text-align: left; }
  ul, ol { padding-left: 1.5em; }
  li { margin: .3em 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .95em; }
  th, td { border: 1px solid #000; padding: .35em .5em; text-align: left; vertical-align: top; }
  a { color: #000; }
  @media print { main { max-width: none; padding: 0; } .titlepage { padding-top: 35mm; } }
</style>
</head>
<body>
<main>
<section class="titlepage">
<h1>${inline(judul)}</h1>
${meta.map(x => `<p>${inline(x)}</p>`).join('')}
</section>
<section class="contents">
<h2>Daftar Isi</h2>
<ul class="toc">
${tocHtml}
</ul>
</section>
${out.join('\n')}
</main>
</body>
</html>
`
}

// ---------- Halaman Docus ----------
const coverPath = meta => (meta.gutenberg ? `/covers/${meta.gutenberg}.jpg` : '/covers/default.jpg')
const attr = s => JSON.stringify(String(s ?? '').replace(/"/g, '\u201d'))
const jsonProp = v => JSON.stringify(v).replace(/'/g, '\u2019')

function halamanDocus(meta, slug, body) {
  const isi = body.replace(/^\s*# .*\n/, '').trimStart() // judul dipakai dari front matter
  const q = s => JSON.stringify(s)
  return `---
title: ${q(meta.judul)}
description: ${q(meta.deskripsi || '')}
navigation:
  title: ${q(meta.judul)}
---

:book-header{cover="${coverPath(meta)}" author=${q(meta.penulis || '')} category=${q(meta.kategori)} html="/html/${slug}.html" gutenberg="${meta.gutenberg || ''}"}

${isi}`
}

// ---------- Jalankan ----------
mkdirSync(dirKonten, { recursive: true })
mkdirSync(dirHtml, { recursive: true })

// bersihkan hasil lama (kecuali .navigation.yml)
for (const f of readdirSync(dirKonten)) {
  if (f === '.navigation.yml') continue
  rmSync(join(dirKonten, f), { recursive: true, force: true })
}
for (const f of readdirSync(dirHtml)) if (f.endsWith('.html')) rmSync(join(dirHtml, f))

const buku = readdirSync(dirSumber)
  .filter(f => f.endsWith('.md'))
  .map((f) => {
    const slug = basename(f, '.md')
    const { meta, body } = parseFrontMatter(readFileSync(join(dirSumber, f), 'utf8'))
    for (const k of ['judul', 'urutan', 'kategori']) if (!meta[k]) throw new Error(`${f}: front matter "${k}" wajib`)
    return { slug, meta, body, urutan: Number(meta.urutan) }
  })
  .sort((a, b) => a.urutan - b.urutan)

const slugify = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Kelompokkan per kategori; urutan kategori mengikuti buku pertamanya.
const kategori = []
for (const b of buku) {
  const nama = b.meta.kategori
  let k = kategori.find(x => x.nama === nama)
  if (!k) { k = { nama, slug: slugify(nama), buku: [] }; kategori.push(k) }
  k.buku.push(b)
  b.kategoriSlug = k.slug
}

kategori.forEach((k, i) => {
  const dir = join(dirKonten, `${i + 1}.${k.slug}`)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, '.navigation.yml'), `title: ${JSON.stringify(k.nama)}\nicon: i-lucide-folder\n`)
  for (const b of k.buku) writeFileSync(join(dir, `${b.urutan}.${b.slug}.md`), halamanDocus(b.meta, b.slug, b.body))
})
for (const b of buku) writeFileSync(join(dirHtml, `${b.slug}.html`), bukuHtml(b.body, b.meta.judul))

const rutePath = (k, b) => `/buku/${k.slug}/${b.slug}`
const kartu = k => k.buku.map(b => `    :::book-card{title=${attr(b.meta.judul)} author=${attr(b.meta.penulis)} cover=${attr(coverPath(b.meta))} to=${attr(rutePath(k, b))} desc=${attr(b.meta.deskripsi)}}
    :::`).join('\n\n')

const bagianKategori = kategori.map(k => `::u-page-section{id="${k.slug}"}
#title
${k.nama}

#description
${k.buku.length} buku

#default
  ::book-grid
${kartu(k)}
  ::
::
`).join('\n')

const semuaBuku = kategori.flatMap(k => k.buku.map(b => ({ b, k })))
const hero = {
  books: semuaBuku.map(({ b, k }) => ({ cover: coverPath(b.meta), to: rutePath(k, b), title: b.meta.judul })),
  stats: [
    { label: 'Buku', value: buku.length },
    { label: 'Kategori', value: kategori.length },
  ],
}

writeFileSync(join(root, 'content', 'index.md'), `---
seo:
  title: Terjemahan Buku
  description: Kumpulan terjemahan dan penjelasan buku dalam bahasa Indonesia.
---

:book-hero{title="Buku Online" description="Kumpulan terjemahan dan penjelasan buku dalam bahasa Indonesia yang mudah dipahami." start-to="${rutePath(kategori[0], buku[0])}" :books='${jsonProp(hero.books)}' :stats='${jsonProp(hero.stats)}'}

::div{id="daftar-buku"}
::

${bagianKategori}`)

console.log(`Selesai: ${buku.length} buku, ${kategori.length} kategori -> content/1.buku, public/html`)
