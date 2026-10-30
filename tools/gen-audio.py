#!/usr/bin/env python3
"""Generate per-character / per-word voice clips for 打字读经典.

LOCAL neural TTS (Piper) — no network, no API keys, identical voice on every
device because the clips ship with the site:
  Chinese -> zh_CN-huayan-medium   (audio/zh/<char>.mp3)
  English -> en_US-lessac-medium   (audio/en/<letters-only-lowercase>.mp3)

Reads TEXTS out of ../script.js (via node, since the data is a JS literal) and
synthesizes only the clips that are missing, so the weekly-book job can run
this after adding a book and only the new units get generated.

Voice models live in tools/voices/ (gitignored, ~61 MB each) — download from
https://huggingface.co/rhasspy/piper-voices if missing:
  zh/zh_CN/huayan/medium/zh_CN-huayan-medium.onnx (+ .onnx.json)
  en/en_US/lessac/medium/en_US-lessac-medium.onnx (+ .onnx.json)

Requires: node, ffmpeg, piper-tts (pip install piper-tts).
"""
import json, re, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
VOICES = Path(__file__).resolve().parent / "voices"
MODELS = {"zh": VOICES / "zh_CN-huayan-medium.onnx",
          "en": VOICES / "en_US-lessac-medium.onnx"}

def extract_texts():
    js = subprocess.run(
        ["node", "-e",
         "const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');"
         "const a=s.indexOf('const TEXTS =');const b=s.indexOf('];',a);"
         "const TEXTS=eval(s.slice(a+'const TEXTS ='.length,b+1));"
         "console.log(JSON.stringify(TEXTS))",
         str(ROOT / "script.js")],
        capture_output=True, text=True, check=True)
    return json.loads(js.stdout)

def collect(texts):
    zh, en = {}, {}
    for tx in texts:
        for line in tx["lines"]:
            if tx["mode"] == "zh":
                for tok in line.split(" "):
                    ch, _, p = tok.partition("|")
                    if p:
                        zh[ch] = ch
            else:
                for w in line.split(" "):
                    key = re.sub(r"[^a-z]", "", w.lower())
                    if key:
                        en[key] = w.strip(",;:?.!—-")
    return zh, en

def synth_mp3(voice, text, out):
    chunks = list(voice.synthesize(text))
    if not chunks:
        raise RuntimeError(f"no audio for {text!r}")
    tmp = out.with_suffix(".wav")
    with wave.open(str(tmp), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(chunks[0].sample_rate)
        for c in chunks:
            wf.writeframes(c.audio_int16_bytes)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp),
                    "-codec:a", "libmp3lame", "-b:a", "32k", "-ac", "1", str(out)],
                   check=True)
    tmp.unlink(missing_ok=True)

def main():
    from piper.voice import PiperVoice
    zh, en = collect(extract_texts())
    made = 0
    for folder, items in (("zh", zh), ("en", en)):
        model = MODELS[folder]
        if not model.exists():
            print(f"missing voice model: {model}", file=sys.stderr)
            return 1
        d = AUDIO / folder
        d.mkdir(parents=True, exist_ok=True)
        todo = [(k, s) for k, s in items.items()
                if not ((d / f"{k}.mp3").exists() and (d / f"{k}.mp3").stat().st_size >= 1000)]
        if not todo:
            print(f"{folder}: {len(items)} units, all clips present")
            continue
        voice = PiperVoice.load(str(model))
        for key, speak in todo:
            synth_mp3(voice, speak, d / f"{key}.mp3")
            made += 1
        print(f"{folder}: generated {len(todo)} clips ({len(items)} units total)", flush=True)
    clips = list(AUDIO.rglob("*.mp3"))
    total = sum(f.stat().st_size for f in clips)
    print(f"audio total: {total/1024:.0f} KB across {len(clips)} clips ({made} new)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
