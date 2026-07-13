const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('CPU 答對與失誤分別使用成功與失敗提示色', () => {
  assert.match(game, /AI 找到正解！[\s\S]{0,180}className='feedback good'/);
  assert.match(game, /AI 的資料判讀失誤[\s\S]{0,180}className='feedback bad'/);
});

test('結算畫面提供錯題回顧與錯題再練入口', () => {
  assert.match(html, /id="wrong-answer-list"/);
  assert.match(html, /id="retry-wrong-btn"/);
  assert.match(game, /function startWrongAnswerRetry\(/);
});

test('錯題再練在最後一題作答後會結束，不混入一般題目', () => {
  assert.match(game, /state\.retryMode&&state\.retryQueue\.length===0/);
  assert.match(game, /finish\('p1','錯題再練完成！'\)/);
});

test('同桌對戰結算會呈現兩位玩家的個別成績', () => {
  assert.match(html, /id="duel-summary"/);
  assert.match(html, /id="duel-highlight"/);
  assert.match(html, /id="p1-result-correct"/);
  assert.match(html, /id="p2-result-correct"/);
  assert.match(game, /playerStats/);
});

test('課前檢查腳本涵蓋語法、回歸測試與版本一致性', () => {
  const script = path.join(root, 'scripts', 'preflight-check.ps1');
  assert.ok(fs.existsSync(script), '預期存在 scripts/preflight-check.ps1');
  const preflight = fs.readFileSync(script, 'utf8');
  assert.match(preflight, /node --check game\.js/);
  assert.match(preflight, /node --test tests\/p0-regressions\.test\.js/);
});

test('啟動任務／再戰一次按鈕不可直接把函式傳給 addEventListener（會誤把 Event 當參數）', () => {
  assert.doesNotMatch(game, /addEventListener\('click',setupBattle\)/, 'setupBattle 有預設參數展開陣列，直接當 click handler 會把 Event 物件當成 retryQuestions 傳入而拋錯');
  assert.match(game, /\$\('launch-btn'\)\.addEventListener\('click',\(\)=>setupBattle\(\)\)/);
  assert.match(game, /\$\('retry-btn'\)\.addEventListener\('click',\(\)=>setupBattle\(\)\)/);
});

test('sw.js / index.html / version.json 三處版本號彼此一致', () => {
  const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
  const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.match(html, new RegExp(`window\\.APP_VERSION='${version}'`));
  assert.match(serviceWorker, new RegExp(`const BUILD_VERSION = '${version}'`));
});

test('技能命中後的自動捲動改用可視範圍判斷，不限定手機寬度', () => {
  assert.doesNotMatch(game, /focusBattleScene\(delay=0\) \{ if\(!window\.matchMedia\('\(max-width:700px\)'\)/, '不應再用裝置寬度媒體查詢決定是否捲動');
  assert.match(game, /rect\.top>=0 && rect\.bottom<=viewportHeight/);
});

test('題庫每個「主題 × 難度」組合至少有 4 題，且格式正確、內容不重複', () => {
  const match = game.match(/const questions = (\[[\s\S]*?\n\]);/);
  assert.ok(match, '找不到 questions 陣列');
  const questions = eval(match[1]);
  assert.ok(questions.length >= 100, `題庫應維持在 100 題以上（目前 ${questions.length} 題）`);

  const counts = {};
  const seen = new Set();
  for (const question of questions) {
    const key = `${question.unit}-${question.level}`;
    counts[key] = (counts[key] || 0) + 1;
    assert.equal(question.a.length, 4, `題目「${question.q}」應有 4 個選項`);
    assert.ok(question.correct >= 0 && question.correct <= 3, `題目「${question.q}」的 correct 索引需介於 0-3`);
    assert.ok(question.tip && question.tip.length > 0, `題目「${question.q}」缺少提示說明`);
    assert.ok(!seen.has(question.q), `題目重複：「${question.q}」`);
    seen.add(question.q);
  }
  for (const [key, count] of Object.entries(counts)) {
    assert.ok(count >= 4, `「${key}」只有 ${count} 題，至少要有 4 題才能降低短時間內重複出題`);
  }
});
