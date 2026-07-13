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

test('每一題都掛有課綱能力指標 tags，可供錯題複習依能力指標篩選', () => {
  const start = game.indexOf('const questions = [');
  const end = game.indexOf('questions.forEach(question=>question.tags=');
  assert.ok(start !== -1 && end !== -1, '找不到 questions 陣列或 tags 指派邏輯');
  const endOfLine = game.indexOf('\n', end);
  const snippet = game.slice(start, endOfLine);
  const questions = eval(`(() => { ${snippet} return questions; })()`);
  for (const question of questions) {
    assert.ok(question.tags?.competency, `題目「${question.q}」缺少 tags.competency`);
  }
});

test('結算畫面依能力指標分組錯題，可只複習單一能力指標', () => {
  assert.match(html, /id="competency-chips"/);
  assert.match(game, /function renderCompetencySummary\(/);
  assert.match(game, /function startCompetencyRetry\(competency\)/);
  assert.match(game, /data-competency-retry="\$\{competency\}"/);
  assert.match(game, /closest\('\[data-competency-retry\]'\)/, '點擊能力指標晶片需透過事件委派觸發 startCompetencyRetry');
});

test('結算畫面提供可列印的本局報告，且錯題清單在列印時不受捲軸高度裁切', () => {
  assert.match(html, /id="print-report-btn"/);
  assert.match(html, /id="print-meta" class="print-only"/);
  assert.match(game, /\$\('print-report-btn'\)\.addEventListener\('click',\(\)=>window\.print\(\)\)/);
  assert.match(game, /function renderPrintMeta\(/);
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  assert.match(css, /@media print \{/);
  assert.match(css, /\.wrong-answer-list \{ max-height:none!important; overflow:visible!important; \}/, '列印時必須解除 .wrong-answer-list 的 max-height/overflow，否則只會印出捲動視窗內看得到的那幾題');
  assert.match(css, /\.result-card \{[^}]*max-height:none!important/, '列印時必須解除 .result-card 的 max-height，否則長報告會被截斷');
});

test('本機最佳紀錄使用 localStorage，讀寫皆需容錯（壞資料/無痕模式不可讓遊戲當機）', () => {
  assert.match(game, /const RECORDS_KEY = 'smes-it-quiz-battle-records'/);
  assert.match(game, /function loadRecords\(\)\{ try\{/, 'loadRecords 讀取 localStorage 必須包在 try/catch 內，避免壞資料或無痕模式丟出例外');
  assert.match(game, /function saveRecords\(records\)\{ try\{/, 'saveRecords 寫入 localStorage 必須包在 try/catch 內');
  assert.match(game, /function renderBestRecord\(/);
  assert.match(game, /function updateRecords\(/);
  assert.match(game, /updateRecords\(\);\$\('result'\)\.classList\.remove\('hidden'\)/, '每次結算都要更新本機最佳紀錄');
  assert.match(html, /id="best-record" class="best-record hidden"/);
});

test('CPU 難度會依玩家近期表現自適應調整（連續答對加壓、連續答錯放寬、表現持平不變）', () => {
  const match = game.match(/function adaptiveAccuracyDelta\(\)\{[^}]*\}/);
  assert.ok(match, '找不到 adaptiveAccuracyDelta 函式');
  function makeDelta(recentResults) {
    const state = { recentResults };
    const fn = eval('(' + match[0] + ')');
    return fn();
  }
  assert.equal(makeDelta([]), 0, '資料不足時不應調整');
  assert.equal(makeDelta([true, true]), 0, '資料不足 3 筆時不應調整');
  assert.equal(makeDelta([true, true, true, true]), 0.08, '連續答對應調高 CPU 命中率，增加挑戰感');
  assert.equal(makeDelta([false, false, false, false]), -0.08, '連續答錯應調低 CPU 命中率，放寬難度不讓學生被電爆');
  assert.equal(makeDelta([true, false, true, false]), 0, '表現持平時不應調整');
  assert.match(game, /correct=Math\.random\(\)<Math\.min\(\.9,Math\.max\(\.2,base\+profile\.accuracy-\.65\+mode\.accuracy\+adaptiveAccuracyDelta\(\)\)\)/, 'cpuMove 需要把自適應調整套用到 CPU 命中率計算，且仍維持 .2-.9 的既有上下限');
});
