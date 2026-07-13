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
