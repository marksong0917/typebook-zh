'use strict';
/* 打字读经典 · Type the Classics — v2
   Two modes: Chinese classics typed by pinyin (no tones; ü = v),
   English classics typed letter by letter. Voice reads each finished
   character/word aloud (Web Speech API). Our own implementation,
   inspired by Typebook (typebook.lol). MIT licensed. */

/* ---------- data ----------
   Chinese: tokens "字|pīnyīn" (empty pinyin = punctuation).
   English: plain lines of words (typed form = letters only). */
const TEXTS = [
  /* ===== 中文经典 ===== */
  { id:'jingyesi', mode:'zh', title:'静夜思', author:'李白', dynasty:'唐', level:0,
    lines:[
      '床|chuáng 前|qián 明|míng 月|yuè 光|guāng ，|',
      '疑|yí 是|shì 地|dì 上|shàng 霜|shuāng 。|',
      '举|jǔ 头|tóu 望|wàng 明|míng 月|yuè ，|',
      '低|dī 头|tóu 思|sī 故|gù 乡|xiāng 。|'
    ]},
  { id:'chunxiao', mode:'zh', title:'春晓', author:'孟浩然', dynasty:'唐', level:0,
    lines:[
      '春|chūn 眠|mián 不|bù 觉|jué 晓|xiǎo ，|',
      '处|chù 处|chù 闻|wén 啼|tí 鸟|niǎo 。|',
      '夜|yè 来|lái 风|fēng 雨|yǔ 声|shēng ，|',
      '花|huā 落|luò 知|zhī 多|duō 少|shǎo 。|'
    ]},
  { id:'guanquelou', mode:'zh', title:'登鹳雀楼', author:'王之涣', dynasty:'唐', level:0,
    lines:[
      '白|bái 日|rì 依|yī 山|shān 尽|jìn ，|',
      '黄|huáng 河|hé 入|rù 海|hǎi 流|liú 。|',
      '欲|yù 穷|qióng 千|qiān 里|lǐ 目|mù ，|',
      '更|gèng 上|shàng 一|yī 层|céng 楼|lóu 。|'
    ]},
  { id:'minnong', mode:'zh', title:'悯农 · 其二', author:'李绅', dynasty:'唐', level:0,
    lines:[
      '锄|chú 禾|hé 日|rì 当|dāng 午|wǔ ，|',
      '汗|hàn 滴|dī 禾|hé 下|xià 土|tǔ 。|',
      '谁|shuí 知|zhī 盘|pán 中|zhōng 餐|cān ，|',
      '粒|lì 粒|lì 皆|jiē 辛|xīn 苦|kǔ 。|'
    ]},
  { id:'yongge', mode:'zh', title:'咏鹅', author:'骆宾王', dynasty:'唐', level:0,
    lines:[
      '鹅|é 鹅|é 鹅|é ，| 曲|qū 项|xiàng 向|xiàng 天|tiān 歌|gē 。|',
      '白|bái 毛|máo 浮|fú 绿|lǜ 水|shuǐ ，| 红|hóng 掌|zhǎng 拨|bō 清|qīng 波|bō 。|'
    ]},
  { id:'youzhoutai', mode:'zh', title:'登幽州台歌', author:'陈子昂', dynasty:'唐', level:0,
    lines:[
      '前|qián 不|bù 见|jiàn 古|gǔ 人|rén ，| 后|hòu 不|bù 见|jiàn 来|lái 者|zhě 。|',
      '念|niàn 天|tiān 地|dì 之|zhī 悠|yōu 悠|yōu ，| 独|dú 怆|chuàng 然|rán 而|ér 涕|tì 下|xià 。|'
    ]},
  { id:'sanzijing', mode:'zh', title:'三字经', author:'节选', dynasty:'宋', level:1,
    lines:[
      '人|rén 之|zhī 初|chū ，| 性|xìng 本|běn 善|shàn 。|',
      '性|xìng 相|xiāng 近|jìn ，| 习|xí 相|xiāng 远|yuǎn 。|',
      '苟|gǒu 不|bù 教|jiào ，| 性|xìng 乃|nǎi 迁|qiān 。|',
      '教|jiào 之|zhī 道|dào ，| 贵|guì 以|yǐ 专|zhuān 。|'
    ]},
  { id:'lunyu', mode:'zh', title:'论语 · 学而', author:'孔子及弟子', dynasty:'春秋', level:1,
    note:{ zh:'注：说（yuè）通“悦”，喜悦；乐（lè），快乐。', en:'Note: 说 is read yuè here (= 悦, delight); 乐 is read lè.' },
    lines:[
      '子|zǐ 曰|yuē ：| “| 学|xué 而|ér 时|shí 习|xí 之|zhī ，| 不|bù 亦|yì 说|yuè 乎|hū ？|',
      '有|yǒu 朋|péng 自|zì 远|yuǎn 方|fāng 来|lái ，| 不|bù 亦|yì 乐|lè 乎|hū ？|',
      '人|rén 不|bù 知|zhī 而|ér 不|bù 愠|yùn ，| 不|bù 亦|yì 君|jūn 子|zǐ 乎|hū ？| ”|'
    ]},
  { id:'daodejing', mode:'zh', title:'道德经 · 第一章', author:'老子', dynasty:'春秋', level:1,
    lines:[
      '道|dào 可|kě 道|dào ，| 非|fēi 常|cháng 道|dào 。|',
      '名|míng 可|kě 名|míng ，| 非|fēi 常|cháng 名|míng 。|',
      '无|wú 名|míng 天|tiān 地|dì 之|zhī 始|shǐ ，|',
      '有|yǒu 名|míng 万|wàn 物|wù 之|zhī 母|mǔ 。|'
    ]},
  { id:'daxue', mode:'zh', title:'大学 · 节选', author:'大学', dynasty:'先秦', level:1,
    lines:[
      '大|dà 学|xué 之|zhī 道|dào ，| 在|zài 明|míng 明|míng 德|dé ，| 在|zài 亲|qīn 民|mín ，| 在|zài 止|zhǐ 于|yú 至|zhì 善|shàn 。|'
    ]},
  { id:'mengzi', mode:'zh', title:'孟子 · 节选', author:'孟子', dynasty:'战国', level:1,
    note:{ zh:'注：得（dé），得到；舍（shě），舍弃。', en:'Note: 得 is read dé (to obtain); 舍 is read shě (to give up).' },
    lines:[
      '鱼|yú ，| 我|wǒ 所|suǒ 欲|yù 也|yě ；| 熊|xióng 掌|zhǎng ，| 亦|yì 我|wǒ 所|suǒ 欲|yù 也|yě 。|',
      '二|èr 者|zhě 不|bù 可|kě 得|dé 兼|jiān ，| 舍|shě 鱼|yú 而|ér 取|qǔ 熊|xióng 掌|zhǎng 者|zhě 也|yě 。|'
    ]},
  { id:'xiangsi', mode:'zh', title:'相思', author:'王维', dynasty:'唐', level:0,
    lines:[
      '红|hóng 豆|dòu 生|shēng 南|nán 国|guó ，|',
      '春|chūn 来|lái 发|fā 几|jǐ 枝|zhī 。|',
      '愿|yuàn 君|jūn 多|duō 采|cǎi 撷|xié ，|',
      '此|cǐ 物|wù 最|zuì 相|xiāng 思|sī 。|'
    ]},

  /* ===== English Classics ===== */
  { id:'en-sonnet18', mode:'en', title:'Sonnet 18', author:'William Shakespeare', dynasty:'1609', level:0,
    lines:[
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate:",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date"
    ]},
  { id:'en-road', mode:'en', title:'The Road Not Taken', author:'Robert Frost', dynasty:'1916', level:0,
    lines:[
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;"
    ]},
  { id:'en-hope', mode:'en', title:'Hope Is the Thing with Feathers', author:'Emily Dickinson', dynasty:'1891', level:0,
    lines:[
      "Hope is the thing with feathers —",
      "That perches in the soul —",
      "And sings the tune without the words —",
      "And never stops — at all —"
    ]},
  { id:'en-gettysburg', mode:'en', title:'The Gettysburg Address', author:'Abraham Lincoln', dynasty:'1863', level:1,
    lines:[
      "Four score and seven years ago our fathers",
      "brought forth on this continent, a new nation,",
      "conceived in Liberty, and dedicated to the",
      "proposition that all men are created equal."
    ]},
  { id:'en-tyger', mode:'en', title:'The Tyger', author:'William Blake', dynasty:'1794', level:1,
    lines:[
      "Tyger Tyger, burning bright,",
      "In the forests of the night;",
      "What immortal hand or eye,",
      "Could frame thy fearful symmetry?"
    ]}
];

/* ---------- i18n ---------- */
const STR = {
  zh:{ title:'打字读经典', tagline:'一边打字，一边读完一篇经典',
    intro:'两种读法：中文经典敲拼音，英文经典敲字母。每个字（词）敲对了就会亮起来。中文不用声调，ü 打 v —— 和你平时打字一样。',
    hint:'提示', hintCurrent:'当前', hintAll:'全部', hintNone:'无（挑战）', weekly:'书架每周上新一篇',
    back:'书架', restart:'重读', listen:'朗读', stop:'停止', progress:'进度', accuracy:'正确率', speed:'字/分钟', speedW:'词/分钟', time:'用时',
    kbdTip:'中文请用英文输入法敲拼音 · 点击此处后开始打字',
    doneTitle:'读完了', again:'再读一遍', backToShelf:'回到书架',
    credit:'灵感来自', credit2:'我们自己的实现，开源（MIT）', more:'更多作品',
    chars:'字', words:'词', level0:'入门', level1:'进阶', start:'开始', resume:'继续', finished:'已读完' },
  en:{ title:'Type the Classics', tagline:'Read a classic by typing it',
    intro:'Two ways to read: Chinese classics by pinyin, English classics letter by letter. Type each character or word correctly and it lights up. For Chinese: no tones needed, type v for ü.',
    hint:'Hints', hintCurrent:'Current', hintAll:'All', hintNone:'None (challenge)', weekly:'A new book joins the shelf every week',
    back:'Shelf', restart:'Restart', listen:'Listen', stop:'Stop', progress:'Progress', accuracy:'Accuracy', speed:'Chars/min', speedW:'Words/min', time:'Time',
    kbdTip:'Click here, then type \u00b7 Chinese texts: type pinyin on an English keyboard layout',
    doneTitle:'Finished', again:'Read it again', backToShelf:'Back to shelf',
    credit:'Inspired by', credit2:'our own implementation, open source (MIT)', more:'More projects',
    chars:'chars', words:'words', level0:'Easy', level1:'Harder', start:'Start', resume:'Continue', finished:'Finished' }
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
    if (tx.mode === 'zh') {
      line.split(' ').forEach(tok => {
        const [c, p] = tok.split('|');
        units.push({ disp: c, p: p || '', i: p ? toInput(p) : '', punct: !p, line: li });
      });
    } else {
      line.split(' ').forEach(w => {
        const i = w.toLowerCase().replace(/[^a-z]/g,'');
        units.push({ disp: w, p: '', i, punct: i === '', line: li });
      });
    }
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

/* ---------- voice ---------- */
let voiceOn = store.get('tbzh-voice', true);
let reading = false;
function speakUnit(u){
  if (!voiceOn || !window.speechSynthesis) return;
  const ut = new SpeechSynthesisUtterance(u.disp);
  ut.lang = cur.mode === 'zh' ? 'zh-CN' : 'en-US';
  ut.rate = cur.mode === 'zh' ? 0.8 : 0.95;
  speechSynthesis.speak(ut);
}
function stopReading(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  reading = false; updateListenBtn();
}
function updateListenBtn(){
  $('listenBtn').innerHTML = reading ? `⏹ <span>${t('stop')}</span>` : `🔊 <span>${t('listen')}</span>`;
}
function readAloud(){
  if (!window.speechSynthesis || !cur) return;
  if (reading) { stopReading(); return; }
  speechSynthesis.cancel();
  const byLine = {};
  cur.units.forEach(u => { (byLine[u.line] = byLine[u.line] || []).push(u.disp); });
  const text = Object.values(byLine).map(a => a.join(cur.mode === 'zh' ? '' : ' ')).join(cur.mode === 'zh' ? '' : ' ');
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = cur.mode === 'zh' ? 'zh-CN' : 'en-US';
  ut.rate = cur.mode === 'zh' ? 0.85 : 1.0;
  ut.onend = ut.onerror = () => { reading = false; updateListenBtn(); };
  reading = true; updateListenBtn();
  speechSynthesis.speak(ut);
}
function updateVoiceBtn(){ $('voiceBtn').textContent = voiceOn ? '🔊' : '🔇'; }
$('voiceBtn').addEventListener('click', () => {
  voiceOn = !voiceOn; store.set('tbzh-voice', voiceOn);
  if (!voiceOn) stopReading();
  updateVoiceBtn();
});

/* ---------- state ---------- */
let cur = null, idx = 0, li2 = 0;
let okLetters = 0, allLetters = 0, startT = 0, timer = null, finished = false;
let shelfMode = store.get('tbzh-shelfmode', 'zh');

/* ---------- shelf ---------- */
function renderShelf(){
  $('tabZh').classList.toggle('active', shelfMode === 'zh');
  $('tabEn').classList.toggle('active', shelfMode === 'en');
  const prog = store.get('tbzh-progress', {});
  const dones = store.get('tbzh-done', {});
  $('shelfGrid').innerHTML = TEXTS.filter(tx => tx.mode === shelfMode).map(tx => {
    const p = Math.min(prog[tx.id] || 0, tx.total);
    const pct = tx.total ? Math.round(p / tx.total * 100) : 0;
    const firstLine = tx.mode === 'zh'
      ? tx.units.filter(u => u.line === 0).map(u => u.disp).join('')
      : tx.units.filter(u => u.line === 0).map(u => u.disp).join(' ');
    const state = dones[tx.id] ? `<span class="done-tag">${t('finished')}</span>`
      : p > 0 ? `${pct}% · ${t('resume')}` : t('start');
    const unitLabel = tx.mode === 'zh' ? t('chars') : t('words');
    return `<button class="book" type="button" data-open="${tx.id}">
      <h3>${tx.title}</h3>
      <p class="author">${tx.dynasty} · ${tx.author}</p>
      <p class="first-line ${tx.mode === 'en' ? 'en' : ''}">${firstLine}</p>
      <div class="meta-row"><span class="level">${t('level' + tx.level)}</span><span>${tx.total} ${unitLabel}</span><span>${state}</span></div>
      <div class="bar"><i style="width:${dones[tx.id] ? 100 : pct}%"></i></div>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-open]').forEach(b =>
    b.addEventListener('click', () => openText(b.dataset.open)));
}
$('tabZh').addEventListener('click', () => { shelfMode = 'zh'; store.set('tbzh-shelfmode','zh'); renderShelf(); });
$('tabEn').addEventListener('click', () => { shelfMode = 'en'; store.set('tbzh-shelfmode','en'); renderShelf(); });

/* ---------- reader ---------- */
function openText(id){
  stopReading();
  cur = TEXTS.find(x => x.id === id);
  const prog = store.get('tbzh-progress', {});
  idx = 0; li2 = 0; okLetters = 0; allLetters = 0; startT = 0; finished = false;
  let saved = Math.min(prog[id] || 0, cur.total);
  if (saved >= cur.total) saved = 0;
  let seen = 0;
  while (idx < cur.units.length && seen < saved) { if (!cur.units[idx].punct) seen++; idx++; }
  skipPunct();
  $('rTitle').textContent = cur.title;
  $('rMeta').textContent = `${cur.dynasty} · ${cur.author} · ${cur.total} ${cur.mode === 'zh' ? t('chars') : t('words')}`;
  $('textNote').textContent = cur.note ? cur.note[lang] : '';
  $('textBody').className = 'text-body' + (cur.mode === 'en' ? ' en' : '');
  $('speedLabel').textContent = cur.mode === 'zh' ? t('speed') : t('speedW');
  $('shelf').hidden = true; $('reader').hidden = false; $('doneOverlay').hidden = true;
  renderText(); renderStats(); $('stage').focus();
}
function skipPunct(){ while (idx < cur.units.length && cur.units[idx].punct) idx++; }
function renderText(){
  const hintMode = $('hintMode').value;
  const byLine = [];
  cur.units.forEach((u, ui) => { (byLine[u.line] = byLine[u.line] || []).push({ u, ui }); });
  $('textBody').innerHTML = byLine.map(line => '<span class="line">' + line.map(({ u, ui }) => {
    const cls = ['unit']; if (u.punct) cls.push('punct');
    if (ui < idx) cls.push('done');
    if (ui === idx) cls.push('current');
    const inner = (hintMode === 'all' && !u.punct && cur.mode === 'zh')
      ? `<ruby>${u.disp}<rt>${u.i}</rt></ruby>` : u.disp;
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
  const suffix = cur.mode === 'zh' ? ` <span style="font-size:16px;color:var(--muted)">${u.p}</span>`
                                   : ` <span style="font-size:16px;color:var(--muted)">${u.disp}</span>`;
  if (mode === 'none') el.innerHTML = `<span class="typed">${typed}</span><span class="rest">${'_'.repeat(rest.length)}</span>`;
  else el.innerHTML = `<span class="typed">${typed}</span><span class="rest">${rest}</span>${suffix}`;
}
function renderStats(){
  const doneUnits = cur.units.slice(0, idx).filter(u => !u.punct).length;
  const pct = cur.total ? Math.round(doneUnits / cur.total * 100) : 0;
  $('stProgress').textContent = pct + '%';
  $('progressBar').style.width = pct + '%';
  $('stAcc').textContent = allLetters ? Math.round(okLetters / allLetters * 100) + '%' : '100%';
  const elapsed = startT ? Math.floor((Date.now() - startT) / 1000) : 0;
  $('stTime').textContent = fmtTime(elapsed);
  $('stSpeed').textContent = elapsed > 2 ? Math.round(doneUnits / (elapsed / 60)) : 0;
}
function saveProgress(){
  const doneUnits = cur.units.slice(0, idx).filter(u => !u.punct).length;
  const prog = store.get('tbzh-progress', {}); prog[cur.id] = doneUnits;
  store.set('tbzh-progress', prog);
}
function finish(){
  finished = true; clearInterval(timer);
  const elapsed = Math.max(1, Math.floor((Date.now() - startT) / 1000));
  const acc = allLetters ? Math.round(okLetters / allLetters * 100) : 100;
  const rate = Math.round(cur.total / (elapsed / 60));
  const dones = store.get('tbzh-done', {}); dones[cur.id] = { acc, cpm: rate, time: elapsed };
  store.set('tbzh-done', dones);
  const prog = store.get('tbzh-progress', {}); prog[cur.id] = cur.total; store.set('tbzh-progress', prog);
  $('dTime').textContent = fmtTime(elapsed);
  $('dAcc').textContent = acc + '%'; $('dSpeed').textContent = rate;
  document.querySelector('.done-stats div:nth-child(3) span').textContent = cur.mode === 'zh' ? t('speed') : t('speedW');
  $('doneTextName').textContent = cur.mode === 'zh' ? `《${cur.title}》 · ${cur.dynasty} · ${cur.author}` : `${cur.title} · ${cur.author}`;
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
    if (li2 >= u.i.length) { speakUnit(u); idx++; li2 = 0; skipPunct(); saveProgress(); renderText(); }
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
$('listenBtn').addEventListener('click', readAloud);
$('backBtn').addEventListener('click', () => {
  clearInterval(timer); stopReading(); saveProgress();
  $('reader').hidden = true; $('shelf').hidden = false; renderShelf();
});
function restartCurrent(){
  const prog = store.get('tbzh-progress', {}); delete prog[cur.id]; store.set('tbzh-progress', prog);
  openText(cur.id);
}
$('restartBtn').addEventListener('click', restartCurrent);
$('againBtn').addEventListener('click', restartCurrent);
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
  updateListenBtn(); updateVoiceBtn();
  if (cur && !$('reader').hidden) { const id = cur.id; openText(id); }
  renderShelf();
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh'; localStorage.setItem('tbzh-lang', lang); applyLang();
});
applyLang();
