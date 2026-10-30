'use strict';
/* 打字读经典 — type Chinese classics character by character.
   Type each character's pinyin (no tones; ü = v). Our own implementation,
   inspired by Typebook (typebook.lol). MIT licensed. */

/* ---------- data: "字|pīn yīn" per token, "|" with empty pinyin = punctuation ---------- */
const TEXTS = [
  { id:'jingyesi', title:'静夜思', author:'李白', dynasty:'唐', level:0,
    lines:[
      '床|chuáng 前|qián 明|míng 月|yuè 光|guāng ，|',
      '疑|yí 是|shì 地|dì 上|shàng 霜|shuāng 。|',
      '举|jǔ 头|tóu 望|wàng 明|míng 月|yuè ，|',
      '低|dī 头|tóu 思|sī 故|gù 乡|xiāng 。|'
    ]},
  { id:'chunxiao', title:'春晓', author:'孟浩然', dynasty:'唐', level:0,
    lines:[
      '春|chūn 眠|mián 不|bù 觉|jué 晓|xiǎo ，|',
      '处|chù 处|chù 闻|wén 啼|tí 鸟|niǎo 。|',
      '夜|yè 来|lái 风|fēng 雨|yǔ 声|shēng ，|',
      '花|huā 落|luò 知|zhī 多|duō 少|shǎo 。|'
    ]},
  { id:'guanquelou', title:'登鹳雀楼', author:'王之涣', dynasty:'唐', level:0,
    lines:[
      '白|bái 日|rì 依|yī 山|shān 尽|jìn ，|',
      '黄|huáng 河|hé 入|rù 海|hǎi 流|liú 。|',
      '欲|yù 穷|qióng 千|qiān 里|lǐ 目|mù ，|',
      '更|gèng 上|shàng 一|yī 层|céng 楼|lóu 。|'
    ]},
  { id:'minnong', title:'悯农 · 其二', author:'李绅', dynasty:'唐', level:0,
    lines:[
      '锄|chú 禾|hé 日|rì 当|dāng 午|wǔ ，|',
      '汗|hàn 滴|dī 禾|hé 下|xià 土|tǔ 。|',
      '谁|shuí 知|zhī 盘|pán 中|zhōng 餐|cān ，|',
      '粒|lì 粒|lì 皆|jiē 辛|xīn 苦|kǔ 。|'
    ]},
  { id:'sanzijing', title:'三字经', author:'节选', dynasty:'宋', level:1,
    lines:[
      '人|rén 之|zhī 初|chū ，| 性|xìng 本|běn 善|shàn 。|',
      '性|xìng 相|xiāng 近|jìn ，| 习|xí 相|xiāng 远|yuǎn 。|',
      '苟|gǒu 不|bù 教|jiào ，| 性|xìng 乃|nǎi 迁|qiān 。|',
      '教|jiào 之|zhī 道|dào ，| 贵|guì 以|yǐ 专|zhuān 。|'
    ]},
  { id:'lunyu', title:'论语 · 学而', author:'孔子及弟子', dynasty:'春秋', level:1,
    note:{ zh:'注：说（yuè）通“悦”，喜悦；乐（lè），快乐。', en:'Note: 说 is read yuè here (= 悦, delight); 乐 is read lè.' },
    lines:[
      '子|zǐ 曰|yuē ：| “| 学|xué 而|ér 时|shí 习|xí 之|zhī ，| 不|bù 亦|yì 说|yuè 乎|hū ？|',
      '有|yǒu 朋|péng 自|zì 远|yuǎn 方|fāng 来|lái ，| 不|bù 亦|yì 乐|lè 乎|hū ？|',
      '人|rén 不|bù 知|zhī 而|ér 不|bù 愠|yùn ，| 不|bù 亦|yì 君|jūn 子|zǐ 乎|hū ？| ”|'
    ]},
  { id:'daodejing', title:'道德经 · 第一章', author:'老子', dynasty:'春秋', level:1,
    lines:[
      '道|dào 可|kě 道|dào ，| 非|fēi 常|cháng 道|dào 。|',
      '名|míng 可|kě 名|míng ，| 非|fēi 常|cháng 名|míng 。|',
      '无|wú 名|míng 天|tiān 地|dì 之|zhī 始|shǐ ，|',
      '有|yǒu 名|míng 万|wàn 物|wù 之|zhī 母|mǔ 。|'
    ]}
];

/* ---------- i18n ---------- */
const STR = {
  zh:{ title:'打字读经典', tagline:'一边打字，一边读完一篇经典',
    intro:'选一篇，用键盘把它读完。每个字敲出它的拼音，字就会亮起来。不用声调，ü 打 v —— 和你平时打字一样。',
    hint:'拼音提示', hintCurrent:'当前字', hintAll:'全部', hintNone:'无（挑战）',
    back:'书架', restart:'重读', progress:'进度', accuracy:'正确率', speed:'字/分钟', time:'用时',
    kbdTip:'请使用英文输入法 · 点击此处后开始打字',
    doneTitle:'读完了', again:'再读一遍', backToShelf:'回到书架',
    credit:'灵感来自', credit2:'我们自己的中文实现，开源（MIT）',
    chars:'字', level0:'入门', level1:'进阶', start:'开始', resume:'继续', finished:'已读完' },
  en:{ title:'Type the Classics', tagline:'Read a Chinese classic by typing it',
    intro:'Pick a text and type it back to life. Type each character\u2019s pinyin and the character lights up. No tones needed; type v for ü \u2014 just like a real Chinese keyboard.',
    hint:'Pinyin hints', hintCurrent:'Current char', hintAll:'All', hintNone:'None (challenge)',
    back:'Shelf', restart:'Restart', progress:'Progress', accuracy:'Accuracy', speed:'Chars/min', time:'Time',
    kbdTip:'Use an English keyboard layout \u00b7 click here, then type',
    doneTitle:'Finished', again:'Read it again', backToShelf:'Back to shelf',
    credit:'Inspired by', credit2:'our own Chinese implementation, open source (MIT)',
    chars:'chars', level0:'Easy', level1:'Harder', start:'Start', resume:'Continue', finished:'Finished' }
};
let lang = localStorage.getItem('tbzh-lang') || 'zh';
const t = k => STR[lang][k];

/* ---------- helpers ---------- */
function toInput(p){
  return p.replace(/ü/g,'v').replace(/[ǖǘǚǜ]/g,'v')
          .normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
}
function parseText(tx){
  const units = [];
  tx.lines.forEach((line, li) => {
    line.split(' ').forEach(tok => {
      const [c, p] = tok.split('|');
      units.push({ c, p: p || '', i: p ? toInput(p) : '', punct: !p, line: li });
    });
  });
  return units;
}
TEXTS.forEach(tx => { tx.units = parseText(tx); tx.total = tx.units.filter(u => !u.punct).length; });
const $ = id => document.getElementById(id);
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};
const fmtTime = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');

/* ---------- state ---------- */
let cur = null;         // current text object
let idx = 0, li2 = 0;   // unit index, letter index in current unit
let okLetters = 0, allLetters = 0, startT = 0, timer = null, finished = false;

/* ---------- shelf ---------- */
function renderShelf(){
  const prog = store.get('tbzh-progress', {});
  const dones = store.get('tbzh-done', {});
  $('shelfGrid').innerHTML = TEXTS.map(tx => {
    const p = Math.min(prog[tx.id] || 0, tx.total);
    const pct = tx.total ? Math.round(p / tx.total * 100) : 0;
    const firstLine = tx.units.filter(u => u.line === 0).map(u => u.c).join('');
    const state = dones[tx.id] ? `<span class="done-tag">${t('finished')}</span>`
      : p > 0 ? `${pct}% · ${t('resume')}` : t('start');
    return `<button class="book" type="button" data-open="${tx.id}">
      <h3>${tx.title}</h3>
      <p class="author">${tx.dynasty} · ${tx.author}</p>
      <p class="first-line">${firstLine}</p>
      <div class="meta-row"><span class="level">${t('level' + tx.level)}</span><span>${tx.total} ${t('chars')}</span><span>${state}</span></div>
      <div class="bar"><i style="width:${dones[tx.id] ? 100 : pct}%"></i></div>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-open]').forEach(b =>
    b.addEventListener('click', () => openText(b.dataset.open)));
}

/* ---------- reader ---------- */
function openText(id){
  cur = TEXTS.find(x => x.id === id);
  const prog = store.get('tbzh-progress', {});
  idx = 0; li2 = 0; okLetters = 0; allLetters = 0; startT = 0; finished = false;
  // resume: count saved *characters* -> map back to unit index
  let saved = Math.min(prog[id] || 0, cur.total);
  if (saved >= cur.total) saved = 0; // already completed before -> start fresh
  let seen = 0;
  while (idx < cur.units.length && seen < saved) { if (!cur.units[idx].punct) seen++; idx++; }
  skipPunct();
  $('rTitle').textContent = cur.title;
  $('rMeta').textContent = `${cur.dynasty} · ${cur.author} · ${cur.total} ${t('chars')}`;
  $('textNote').textContent = cur.note ? cur.note[lang] : '';
  $('shelf').hidden = true; $('reader').hidden = false; $('doneOverlay').hidden = true;
  renderText(); renderStats(); $('stage').focus();
}
function skipPunct(){ while (idx < cur.units.length && cur.units[idx].punct) idx++; }
function renderText(){
  const hintMode = $('hintMode').value;
  const byLine = [];
  cur.units.forEach((u, ui) => {
    (byLine[u.line] = byLine[u.line] || []).push({ u, ui });
  });
  $('textBody').innerHTML = byLine.map(line => '<span class="line">' + line.map(({ u, ui }) => {
    const cls = ['unit']; if (u.punct) cls.push('punct');
    if (ui < idx) cls.push('done');
    if (ui === idx) cls.push('current');
    const inner = (hintMode === 'all' && !u.punct) ? `<ruby>${u.c}<rt>${u.i}</rt></ruby>` : u.c;
    return `<span class="${cls.join(' ')}">${inner}</span>`;
  }).join('') + '</span>').join('');
  renderHint();
}
function renderHint(){
  const el = $('currentHint');
  const mode = $('hintMode').value;
  if (finished || idx >= cur.units.length) { el.textContent = ''; return; }
  const u = cur.units[idx];
  const typed = u.i.slice(0, li2), rest = u.i.slice(li2);
  if (mode === 'none') el.innerHTML = `<span class="typed">${typed}</span><span class="rest">${'_'.repeat(rest.length)}</span>`;
  else el.innerHTML = `<span class="typed">${typed}</span><span class="rest">${rest}</span> <span style="font-size:16px;color:var(--muted)">${u.p}</span>`;
}
function renderStats(){
  const doneChars = cur.units.slice(0, idx).filter(u => !u.punct).length;
  const pct = cur.total ? Math.round(doneChars / cur.total * 100) : 0;
  $('stProgress').textContent = pct + '%';
  $('progressBar').style.width = pct + '%';
  $('stAcc').textContent = allLetters ? Math.round(okLetters / allLetters * 100) + '%' : '100%';
  const elapsed = startT ? Math.floor((Date.now() - startT) / 1000) : 0;
  $('stTime').textContent = fmtTime(elapsed);
  $('stSpeed').textContent = elapsed > 2 ? Math.round(doneChars / (elapsed / 60)) : 0;
}
function saveProgress(){
  const doneChars = cur.units.slice(0, idx).filter(u => !u.punct).length;
  const prog = store.get('tbzh-progress', {}); prog[cur.id] = doneChars;
  store.set('tbzh-progress', prog);
}
function finish(){
  finished = true; clearInterval(timer);
  const elapsed = Math.max(1, Math.floor((Date.now() - startT) / 1000));
  const acc = allLetters ? Math.round(okLetters / allLetters * 100) : 100;
  const cpm = Math.round(cur.total / (elapsed / 60));
  const dones = store.get('tbzh-done', {}); dones[cur.id] = { acc, cpm, time: elapsed };
  store.set('tbzh-done', dones);
  const prog = store.get('tbzh-progress', {}); prog[cur.id] = cur.total; store.set('tbzh-progress', prog);
  $('dTime').textContent = fmtTime(elapsed);
  $('dAcc').textContent = acc + '%'; $('dSpeed').textContent = cpm;
  $('doneTextName').textContent = `《${cur.title}》 · ${cur.dynasty} · ${cur.author}`;
  renderText(); renderStats();
  $('doneOverlay').hidden = false;
}
let lastKeyAt = 0;
function handleLetter(ch){
  if (!cur || finished || $('reader').hidden) return;
  if (idx >= cur.units.length) return;
  const u = cur.units[idx];
  if (!startT) { startT = Date.now(); timer = setInterval(renderStats, 500); }
  allLetters++;
  if (ch === u.i[li2]) {
    okLetters++; li2++;
    if (li2 >= u.i.length) { idx++; li2 = 0; skipPunct(); saveProgress(); renderText(); }
    else renderHint();
    if (idx >= cur.units.length) { renderStats(); finish(); return; }
  } else {
    const el = $('currentHint');
    el.classList.remove('error'); void el.offsetWidth; el.classList.add('error');
  }
  renderStats();
}
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return;
  if (/^[a-zA-Z]$/.test(e.key)) { lastKeyAt = Date.now(); handleLetter(e.key.toLowerCase()); }
});
$('mobileInput').addEventListener('input', e => {
  if (Date.now() - lastKeyAt < 80) { e.target.value = ''; return; }
  const v = e.target.value; e.target.value = '';
  if (v) handleLetter(v.slice(-1).toLowerCase());
});
$('stage').addEventListener('click', () => { $('stage').focus(); $('mobileInput').focus({ preventScroll: true }); });

/* ---------- reader controls ---------- */
$('backBtn').addEventListener('click', () => {
  clearInterval(timer); saveProgress();
  $('reader').hidden = true; $('shelf').hidden = false; renderShelf();
});
$('restartBtn').addEventListener('click', () => {
  const prog = store.get('tbzh-progress', {}); delete prog[cur.id]; store.set('tbzh-progress', prog);
  openText(cur.id);
});
$('againBtn').addEventListener('click', () => {
  const prog = store.get('tbzh-progress', {}); delete prog[cur.id]; store.set('tbzh-progress', prog);
  openText(cur.id);
});
$('shelfBtn').addEventListener('click', () => {
  $('doneOverlay').hidden = true; $('reader').hidden = true; $('shelf').hidden = false; renderShelf();
});
$('hintMode').addEventListener('change', () => { if (cur && !$('reader').hidden) renderText(); });

/* ---------- language ---------- */
function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('#hintMode option').forEach(o => { o.textContent = t(o.dataset.i18n); });
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  if (cur && !$('reader').hidden) openText(cur.id);
  renderShelf();
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh'; localStorage.setItem('tbzh-lang', lang); applyLang();
});
applyLang();
