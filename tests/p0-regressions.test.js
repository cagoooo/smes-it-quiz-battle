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

test('答對音效隨連擊數微幅升高音調，且大絕能量剛滿時會播放專屬提示音', () => {
  assert.match(game, /function playTone\(good,level='light',streak=0\)/, 'playTone 需接受 streak 參數才能做連擊升 Key');
  assert.match(game, /const comboBoost=good\?Math\.min\(streak,6\)\*18:0/, '連擊音升 Key 應設有上限（streak 最多採計 6），避免音調無限飆高');
  assert.match(game, /function playUltimateReadyChime\(/);
  assert.match(game, /playTone\(true,skillId,actor\.streak\)/, '命中攻擊音需要傳入 actor.streak 才能連動連擊音效');
  assert.match(game, /meterBefore=actor\.meter; actor\.meter=skill\.id==='ultimate'\?0:Math\.min\(100,actor\.meter\+skill\.meterGain\); if\(actor\.meter>=100&&meterBefore<100\)playUltimateReadyChime\(\)/, '玩家答對後能量剛滿 100 時（而非每次都播）才觸發大絕提示音');
  assert.match(game, /const meterBefore=actor\.meter;actor\.meter=skill\.id==='ultimate'\?0:Math\.min\(100,actor\.meter\+skill\.meterGain\);if\(actor\.meter>=100&&meterBefore<100\)playUltimateReadyChime\(\)/, 'CPU 答對後能量剛滿 100 時也要觸發大絕提示音，行為需與玩家一致');
});

test('每位玩家角色至少有 4 種大絕招、每種 CPU 敵人至少有 3 種，且名稱不重複', () => {
  const cMatch = game.match(/const characters = (\[[\s\S]*?\n\]);/);
  const eMatch = game.match(/const cpuEnemies = (\[[\s\S]*?\n\]);/);
  assert.ok(cMatch && eMatch, '找不到 characters 或 cpuEnemies 陣列');
  const characters = eval(cMatch[1]);
  const cpuEnemies = eval(eMatch[1]);
  const names = new Set();
  for (const character of characters) {
    assert.ok(character.ultimates.length >= 4, `角色「${character.name}」大絕招應至少 4 種（目前 ${character.ultimates.length} 種）`);
    for (const ultimate of character.ultimates) {
      assert.ok(!names.has(ultimate.name), `大絕招名稱重複：「${ultimate.name}」`);
      names.add(ultimate.name);
      assert.match(ultimate.color, /^#[0-9a-fA-F]{6}$/, `「${ultimate.name}」的顏色格式不正確`);
    }
  }
  for (const enemy of cpuEnemies) {
    assert.ok(enemy.ultimates.length >= 3, `CPU 敵人「${enemy.name}」大絕招應至少 3 種（目前 ${enemy.ultimates.length} 種）`);
    for (const ultimate of enemy.ultimates) {
      assert.ok(!names.has(ultimate.name), `大絕招名稱重複：「${ultimate.name}」`);
      names.add(ultimate.name);
      assert.match(ultimate.color, /^#[0-9a-fA-F]{6}$/, `「${ultimate.name}」的顏色格式不正確`);
    }
  }
});

test('角色專屬戰鬥音樂：找不到核可音軌時要優雅退回共用 battle 音軌', () => {
  assert.match(game, /function battleSceneKey\(\)\{ const key=`battle-\$\{state\.character\.id\}`; return approvedTrack\(key\) \? key : 'battle'; \}/);
  assert.doesNotMatch(game, /playMusicScene\('battle', true\)/, 'setupBattle 應改用 battleSceneKey() 而非寫死的 battle');
  assert.match(game, /playMusicScene\(battleSceneKey\(\), true\)/);
  assert.doesNotMatch(game, /scene==='battle'\?260:420/, 'fallbackBeat 節奏判斷需涵蓋 battle-{角色id} 這類前綴，不能只比對完全相等');
  assert.match(game, /scene\.startsWith\('battle'\)\?260:420/);

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/audio-manifest.json'), 'utf8'));
  const cMatchForMusic = game.match(/const characters = (\[[\s\S]*?\n\]);/);
  const charactersForMusic = eval(cMatchForMusic[1]);
  for (const character of charactersForMusic) {
    const key = `battle-${character.id}`;
    assert.ok(manifest.tracks[key], `manifest 應有 ${key} 條目（角色「${character.name}」）`);
    assert.equal(manifest.tracks[key].status, 'approved', `${key} 應為 approved 狀態`);
    const audioPath = path.join(root, manifest.tracks[key].path);
    assert.ok(fs.existsSync(audioPath), `${key} 音檔應存在：${manifest.tracks[key].path}`);
  }
  for (const [key, track] of Object.entries(manifest.tracks)) {
    if (track.status === 'approved') {
      assert.match(track.sha256, /^[0-9A-Fa-f]{64}$/, `「${key}」approved 音軌需有效的 SHA-256`);
    }
  }
});

test('大廳歷史最佳紀錄提供重置入口，且需經確認才會清除', () => {
  assert.match(html, /id="reset-record-btn"/);
  assert.match(game, /function resetRecords\(\)\{ if\(!window\.confirm\(/, '重置前必須先跳出確認，避免誤觸就清空紀錄');
  assert.match(game, /localStorage\.removeItem\(RECORDS_KEY\)/);
  assert.match(game, /\$\('reset-record-btn'\)\.addEventListener\('click',resetRecords\)/);
});

test('音效與背景音樂為獨立開關，互不影響彼此狀態', () => {
  assert.match(html, /id="music-btn"/);
  assert.doesNotMatch(game, /state\.sound=!state\.sound;music\.enabled=state\.sound/, 'sound-btn 不應再同時控制 music.enabled，兩者要能分開靜音');
  assert.match(game, /function toggleMusicMute\(\)\{ music\.enabled=!music\.enabled;/);
  assert.match(game, /\$\('music-btn'\)\.addEventListener\('click',toggleMusicMute\)/);
  assert.match(game, /\$\('sound-btn'\)\.addEventListener\('click',\(\)=>\{state\.sound=!state\.sound;\$\('sound-btn'\)\.textContent/, 'sound-btn 的 click handler 應只切換 state.sound（音效），不得再連動 music.enabled');
});

test('成就徽章系統：5 種固定徽章、不重複解鎖、資料存在 records.badges', () => {
  const match = game.match(/const BADGES = \[[\s\S]*?\n\];/);
  assert.ok(match, '找不到 BADGES 陣列');
  const BADGES = eval(match[0].replace('const BADGES = ', ''));
  assert.equal(BADGES.length, 5, `徽章清單應固定 5 種，避免範圍蔓延（目前 ${BADGES.length} 種）`);
  const ids = BADGES.map(b => b.id);
  assert.equal(new Set(ids).size, ids.length, '徽章 id 不應重複');

  assert.match(game, /badges:\[\],\.\.\.saved/, 'loadRecords 預設值需包含 badges 陣列');
  assert.match(game, /if\(!records\.badges\.includes\(badge\.id\)&&badge\.check\(records,battleStats\)\)/, 'updateRecords 需檢查該徽章尚未解鎖過才會觸發，避免重複顯示解鎖提示');
  assert.match(html, /id="badge-shelf" class="badge-shelf hidden"/);
  assert.match(html, /id="badge-unlock" class="badge-unlock hidden"/);
  assert.match(game, /function renderBadgeShelf\(/);
  assert.match(game, /function renderBadgeUnlock\(newBadges\)/);
});

test('8 種 CPU 敵人各自有獨立的難度風格，不再共用 4 種模板', () => {
  const match = game.match(/const cpuProfiles = (\{[\s\S]*?\});/);
  assert.ok(match, '找不到 cpuProfiles');
  const cpuProfiles = eval('(' + match[1] + ')');
  const eMatch = game.match(/const cpuEnemies = (\[[\s\S]*?\n\]);/);
  const cpuEnemies = eval(eMatch[1]);
  const signatures = new Set();
  for (const enemy of cpuEnemies) {
    assert.ok(cpuProfiles[enemy.id], `cpuProfiles 應有「${enemy.name}」（${enemy.id}）專屬條目`);
    const sig = JSON.stringify(cpuProfiles[enemy.id]);
    assert.ok(!signatures.has(sig), `「${enemy.name}」的難度風格與其他敵人重複`);
    signatures.add(sig);
  }
  assert.doesNotMatch(game, /const cpuStyle=\{firewall:'defender'/, 'createFighter 不應再用 cpuStyle 把 8 隻敵人對應到 4 種共用模板');
});

test('回合時間可調整（60/75/90/120 秒），setupBattle 需採用 state.roundTime', () => {
  assert.match(html, /data-round-time="60"/);
  assert.match(html, /data-round-time="75"/);
  assert.match(html, /data-round-time="90"/);
  assert.match(html, /data-round-time="120"/);
  assert.match(game, /roundTime:75/, 'state 預設 roundTime 應為 75 秒，維持原本預設體驗');
  assert.match(game, /state\.time=state\.roundTime/, 'setupBattle 應使用 state.roundTime 而非寫死的 75');
  assert.match(game, /const roundTime=event\.target\.closest\('\[data-round-time\]'\)/);
});

test('CPU 敵人專屬戰鬥音樂：輪到 CPU 出招時切到牠的音軌，換回玩家回合時切回', () => {
  assert.match(game, /function cpuBattleSceneKey\(cpuId\)\{ const key=`battle-\$\{cpuId\}`; return approvedTrack\(key\) \? key : null; \}/);
  assert.match(game, /if\(actor\.isCpu\)\{ const cpuScene=cpuBattleSceneKey\(actor\.id\); if\(cpuScene\)playMusicScene\(cpuScene\); window\.setTimeout\(cpuMove,difficultyModes\[state\.difficulty\]\.delay\); \} else \{ playMusicScene\(battleSceneKey\(\)\); \}/, 'setTurn 需依 CPU 是否有專屬音軌切換，玩家回合則切回 battleSceneKey()');

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/audio-manifest.json'), 'utf8'));
  const enemyMatch = game.match(/const cpuEnemies = (\[[\s\S]*?\n\]);/);
  const enemies = eval(enemyMatch[1]);
  for (const enemy of enemies) {
    const key = `battle-${enemy.id}`;
    assert.ok(manifest.tracks[key], `manifest 應有 ${key} 條目（CPU 敵人「${enemy.name}」）`);
    assert.equal(manifest.tracks[key].status, 'approved', `${key} 應為 approved 狀態`);
    const audioPath = path.join(root, manifest.tracks[key].path);
    assert.ok(fs.existsSync(audioPath), `${key} 音檔應存在：${manifest.tracks[key].path}`);
  }
});

test('大絕招專屬音效：每位玩家角色都有 ultimate-{角色id}，找不到時退回共用 ultimate', () => {
  assert.match(game, /function ultimateSceneKey\(characterId\)\{ const key=`ultimate-\$\{characterId\}`; return approvedTrack\(key\) \? key : 'ultimate'; \}/);
  assert.match(game, /playMusicStinger\(ultimateSceneKey\(actor\.id\)\)/, 'attack() 的大絕招分支應改用 ultimateSceneKey(actor.id) 而非寫死的 ultimate');
  assert.doesNotMatch(game, /playMusicStinger\('ultimate'\)/, '不應再殘留寫死的 ultimate 場景字串');

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/audio-manifest.json'), 'utf8'));
  const cMatch = game.match(/const characters = (\[[\s\S]*?\n\]);/);
  const chars = eval(cMatch[1]);
  for (const character of chars) {
    const key = `ultimate-${character.id}`;
    assert.ok(manifest.tracks[key], `manifest 應有 ${key} 條目（角色「${character.name}」）`);
    assert.equal(manifest.tracks[key].status, 'approved', `${key} 應為 approved 狀態`);
    const audioPath = path.join(root, manifest.tracks[key].path);
    assert.ok(fs.existsSync(audioPath), `${key} 音檔應存在：${manifest.tracks[key].path}`);
  }
});

test('音檔長度正規化：所有 approved 戰鬥循環音軌不超過 45 秒，超長來源需留下裁剪紀錄', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/audio-manifest.json'), 'utf8'));
  for (const [key, track] of Object.entries(manifest.tracks)) {
    if (track.status !== 'approved' || !key.startsWith('battle-')) continue;
    assert.ok(track.durationSeconds <= 45.05, `「${key}」戰鬥循環音軌長度 ${track.durationSeconds}s 超過 45 秒上限，應以 ffmpeg 裁剪`);
    if (track.trimmedFromSeconds) {
      assert.ok(track.trimNote && track.trimNote.length > 0, `「${key}」有 trimmedFromSeconds 就必須留下 trimNote 審核紀錄`);
    }
  }
});

test('EdTech 看板與自訂題庫參數解析', () => {
  assert.match(game, /state\.gasUrl\s*=\s*atob\(decodeURIComponent\(b64Gas\)\)/);
  assert.match(game, /state\.className\s*=\s*decodeURIComponent\(cls\)/);
  assert.match(game, /state\.isConsoleConnected\s*=\s*Boolean\(state\.gasUrl\)/);
});

test('對戰結算後發送成績到 GAS 看板', () => {
  assert.match(game, /function syncRecordToConsole\(\)/);
  assert.match(game, /fetch\(state\.gasUrl,[\s\S]*?method:\s*'POST'/);
  assert.match(game, /syncRecordToConsole\(\);/);
});

test('支援自訂題庫的隨機選題', () => {
  assert.match(game, /if\s*\(state\.unit\s*===\s*'custom'\)/);
  assert.match(game, /pool\s*=\s*state\.customQuestions\.filter/);
});
