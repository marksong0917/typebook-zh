# 打字读经典 · Type the Classics

Read a classic by typing it — Chinese classics by pinyin, English classics
letter by letter.

**Live demo:** https://marksong0917.github.io/typebook-zh/

Two shelves:
- **中文经典** — type each character's pinyin (no tones; type `v` for ü —
  exactly like a real Chinese keyboard) and the character lights up.
- **English Classics** — type the text letter by letter, word by word.

A **neural AI voice reads each finished character or word aloud** — the clips
are pre-generated locally with Piper (`tools/gen-audio.py`; Huayan for
Chinese, Lessac for English) and ship with the site, so playback is instant,
keeps pace with your typing, and sounds the same on every device. A Listen
button reads the whole text. A new book joins the shelf every week.

## Included texts (18)

Chinese: 静夜思 · 春晓 · 登鹳雀楼 · 悯农 · 咏鹅 · 登幽州台歌 ·
三字经（节选） · 论语 · 学而（节选） · 道德经 · 第一章 · 大学（节选） · 孟子（节选） · 相思

English: Shakespeare — Sonnet 18 · Frost — The Road Not Taken ·
Dickinson — Hope Is the Thing with Feathers · Lincoln — The Gettysburg
Address (opening) · Blake — The Tyger · Longfellow — A Psalm of Life

All texts are public-domain classics.

## Features

- Two modes (Chinese pinyin / English letters) on one shelf, with tabs
- Voice: pre-generated neural AI clips per character/word + full-text read-aloud, toggleable (browser TTS only as fallback)
- Three hint modes: current, all (ruby pinyin for Chinese), or none (challenge)
- Live progress, accuracy, speed (chars/min or words/min), and timer
- Progress is saved in your browser — leave and pick up where you stopped
- Bilingual UI （中文 / English), works on mobile (use an English keyboard layout)
- No backend, no accounts, no tracking. One static page.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

## Add your own text

Texts live at the top of `script.js`. Each token is `字|pīnyīn`; punctuation is
a token with an empty pinyin. The typed form (tone marks stripped, ü → v) is
derived automatically.

## Credit

Inspired by [Typebook](https://typebook.lol) — read-by-typing for alphabetic
languages. This is an independent Chinese implementation, written from scratch:
the idea travels, the code is ours.

## License

MIT © Ze (Mark) Song
