# 打字读经典 · Type the Classics

Read a Chinese classic by typing it — one character, one pinyin at a time.

**Live demo:** https://marksong0917.github.io/typebook-zh/

Type each character's pinyin (no tones; type `v` for ü — exactly like a real
Chinese keyboard) and the character lights up. Finish the text and you have,
quite literally, typed your way through it.

## Included texts

- 静夜思 · 春晓 · 登鹳雀楼 · 悯农 — 李白、孟浩然、王之涣、李绅 (Tang poems, easy)
- 三字经（节选） · 论语 · 学而（节选） · 道德经 · 第一章（节选） — harder

All texts are public-domain classics, two thousand years past copyright.

## Features

- Three hint modes: current character, all characters (ruby pinyin), or none (challenge)
- Live progress, accuracy, characters-per-minute, and timer
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
