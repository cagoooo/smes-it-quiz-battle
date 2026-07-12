const characters = [
  { id: 'coder', icon: '💻', image: 'assets/characters/coder.png', name: '程式勇者', skill: '演算法導航', color: '#52e6ff' },
  { id: 'guardian', icon: '🛡️', image: 'assets/characters/guardian.png', name: '網安守護者', skill: '防毒護盾', color: '#62f7bb' },
  { id: 'data', icon: '📊', image: 'assets/characters/data.png', name: '資料魔法師', skill: '圖表洞察', color: '#c5a5ff' },
  { id: 'creator', icon: '🎨', image: 'assets/characters/creator.png', name: '創意設計師', skill: '媒體創作', color: '#ffbd7a' },
];

const unitNames = { mixed: '綜合挑戰', safety: '網路安全', coding: '程式思維', digital: '數位公民' };
const music = { enabled: true, manifest: null, tracks: new Map(), currentScene: null, fallbackTimer: null, fallbackContext: null, fallbackStep: 0 };
const questions = [
  { unit:'safety', level:'light', q:'收到不認識的人傳來的奇怪連結，最好的做法是？', a:['立刻點開看看','先告訴老師或家長，不隨意點擊','轉傳給全班同學','輸入帳密確認'], correct:1, tip:'陌生連結可能藏有釣魚網站或惡意程式，先查證最安全。' },
  { unit:'safety', level:'light', q:'下列哪一組密碼比較安全？', a:['123456','myname','Ab!9qL#2','生日年月日'], correct:2, tip:'密碼應混合大小寫英文、數字與符號，並避免個人資料。' },
  { unit:'safety', level:'light', q:'使用公共電腦登入帳號後，離開前要做什麼？', a:['直接關掉螢幕','登出帳號','把密碼寫在桌上','分享給下一位'], correct:1, tip:'登出可以避免下一位使用者看到或使用你的帳號。' },
  { unit:'safety', level:'heavy', q:'朋友傳訊息說「快幫我投票」，但網址看起來怪怪的。第一步應該？', a:['馬上幫忙投票','回傳自己的帳密','透過其他方式確認是不是本人','把連結貼到班群'], correct:2, tip:'帳號可能被盜用。用面對面或電話等其他管道查證。' },
  { unit:'safety', level:'heavy', q:'下列哪一項屬於個人資料，不應隨便公開？', a:['喜歡的顏色','住家地址','今天的天氣','班級圖書角位置'], correct:1, tip:'地址、電話、身分證字號等可識別個人的資訊要妥善保護。' },
  { unit:'safety', level:'ultimate', q:'班級平板跳出「你的裝置中毒，立刻下載清理程式！」，最適當的處理是？', a:['下載所有清理程式','關閉視窗並通知老師','輸入家長信用卡資訊','把平板借別班測試'], correct:1, tip:'恐嚇式彈窗常是詐騙；不要下載或輸入資料，交由師長處理。' },
  { unit:'coding', level:'light', q:'程式中的「迴圈」最適合用來做什麼？', a:['重複執行相同任務','把電腦關機','畫一張圖','刪除所有檔案'], correct:0, tip:'迴圈讓程式能有效率地重複執行指令。' },
  { unit:'coding', level:'light', q:'Scratch 的角色要往右移動，通常要改變哪個方向的位置？', a:['x 座標增加','y 座標增加','音量增加','造型數增加'], correct:0, tip:'x 軸由左到右，往右移動會讓 x 座標變大。' },
  { unit:'coding', level:'light', q:'程式出現錯誤時，找出原因並修正的過程叫做？', a:['複製','除錯','上網','關機'], correct:1, tip:'除錯（debug）是程式設計中重要的解決問題能力。' },
  { unit:'coding', level:'heavy', q:'要讓角色「如果碰到邊緣就反彈」，需要使用哪一類概念？', a:['條件判斷','刪除變數','改變背景','播放音樂'], correct:0, tip:'「如果…就…」會依條件決定程式是否執行。' },
  { unit:'coding', level:'heavy', q:'小明要讓角色走 10 步、說「哈囉」、再走 10 步。正確概念是？', a:['依序排列指令','同時刪除所有指令','只保留第一個指令','每次只寫一個字'], correct:0, tip:'演算法是清楚、有順序的步驟，電腦才能照著完成任務。' },
  { unit:'coding', level:'ultimate', q:'設計迷宮遊戲時，要記錄玩家目前得分並隨吃到寶物增加，最適合使用？', a:['變數','背景音樂','角色大小','滑鼠游標'], correct:0, tip:'變數可以儲存會改變的數值，例如分數、生命值或時間。' },
  { unit:'digital', level:'light', q:'在網路留言時，哪一種做法最有禮貌？', a:['不同意就嘲笑對方','先想一想再友善表達','大量使用髒話','轉傳未查證消息'], correct:1, tip:'螢幕後也是真實的人，友善溝通是數位公民的重要責任。' },
  { unit:'digital', level:'light', q:'看到網路上很驚人的消息，分享前應該？', a:['立刻轉傳','查閱可信來源確認','只看標題','問陌生網友'], correct:1, tip:'先查證來源與日期，能降低假訊息傳播。' },
  { unit:'digital', level:'light', q:'使用別人創作的圖片時，應該？', a:['說是自己畫的','查看授權並標示來源','隨意修改後販售','刪掉作者名字'], correct:1, tip:'尊重著作權，依照授權使用並清楚標示來源。' },
  { unit:'digital', level:'heavy', q:'同學未經同意拍下你的照片並放到社群，合適的做法是？', a:['立刻報復上傳他的照片','請他移除並告訴老師或家長','假裝沒看到','把照片下載再散播'], correct:1, tip:'肖像與隱私需要尊重；遇到困擾可向可信任的大人求助。' },
  { unit:'digital', level:'heavy', q:'下列哪一種來源通常較值得信賴？', a:['沒有作者與日期的轉傳圖','政府、學校或可信機構的原始公告','標題全是驚嘆號的貼文','匿名聊天室訊息'], correct:1, tip:'查看作者、發布單位、日期與原始資料，是查證資訊的好方法。' },
  { unit:'digital', level:'ultimate', q:'AI 工具幫你寫完報告後，最負責任的做法是？', a:['完全不看就交出去','檢查內容、用自己的話理解並標示協助','說全部都是自己想到的','把同一份報告賣給同學'], correct:1, tip:'AI 可以協助學習，但要查核內容、保有自己的思考並誠實說明。' },
  { unit:'mixed', level:'light', q:'檔案名稱「自然觀察_2026_07」比「新檔案」好的原因是？', a:['比較長','更容易辨識內容與日期','電腦會變快','不需要資料夾'], correct:1, tip:'清楚命名能幫助自己與同學快速找到需要的檔案。' },
  { unit:'mixed', level:'heavy', q:'要把全班身高資料整理成容易比較的圖，較適合使用？', a:['試算表的長條圖','把每個數字背起來','純文字亂排','刪掉所有資料'], correct:0, tip:'圖表能讓資料的差異與趨勢更容易被看見。' },
  { unit:'mixed', level:'ultimate', q:'完成小組簡報前，最完整的檢查順序是？', a:['直接上傳，不必看','檢查內容正確、圖片授權、分工與檔案名稱','只檢查字體顏色','把檔案改成亂碼'], correct:1, tip:'好作品不只內容正確，也要尊重授權、清楚整理並完成團隊分工。' },
];

const state = { mode:'solo', unit:'mixed', character:characters[0], turn:'p1', running:false, time:75, timerId:null, current:null, used:[], sound:true, correct:0, bestStreak:0, round:1, p1:null, p2:null };
const $ = (id) => document.getElementById(id);
const random = (items) => items[Math.floor(Math.random() * items.length)];

function renderRoster() { $('roster').innerHTML = characters.map(hero => `<button class="hero-card ${hero.id===state.character.id?'selected':''}" data-hero="${hero.id}" type="button"><span class="hero-portrait"><img src="${hero.image}" alt="${hero.name}角色圖"></span><span class="hero-content"><b>${hero.name}</b><small>${hero.skill}</small></span><em>選擇</em></button>`).join(''); }
function choose(selector, value, key) { document.querySelectorAll(selector).forEach(el => el.classList.toggle('selected', el.dataset[key] === value)); }

function createFighter(name, icon, isCpu=false, image='') { return { name, icon, image, health:100, meter:0, streak:0, isCpu }; }
function renderAvatar(elementId, fighter) { const element = $(elementId); if (fighter.image) element.innerHTML = `<img src="${fighter.image}" alt="${fighter.name}">`; else element.textContent = fighter.icon; }
function renderArenaAvatar(selector, fighter) { const element = document.querySelector(selector); element.closest('.fighter')?.classList.toggle('has-art', Boolean(fighter.image)); if (fighter.image) element.innerHTML = `<img src="${fighter.image}" alt="${fighter.name}">`; else element.textContent = fighter.icon; }
function setupBattle() {
  state.p1 = createFighter(state.character.name, state.character.icon, false, state.character.image);
  state.p2 = state.mode === 'solo' ? createFighter('防火牆怪', '🧠', true, 'assets/characters/firewall.png') : createFighter('玩家 2', '👾');
  state.turn='p1'; state.running=true; state.time=75; state.current=null; state.used=[]; state.correct=0; state.bestStreak=0;
  $('p1-name').textContent=state.p1.name; $('fighter-p1-name').textContent=state.p1.name; renderAvatar('p1-avatar-mini',state.p1); renderArenaAvatar('#fighter-p1 .fighter-avatar',state.p1);
  $('p2-name').textContent=state.p2.name; $('fighter-p2-name').textContent=state.p2.name; renderAvatar('p2-avatar-mini',state.p2); renderArenaAvatar('#fighter-p2 .fighter-avatar',state.p2);
  $('p2-caption').textContent=state.mode==='solo'?'駕駛艙 AI':'玩家 2'; document.querySelector('#fighter-p2 small').textContent=state.mode==='solo'?'CPU':'PLAYER 2';
  $('unit-badge').textContent=unitNames[state.unit]; $('mission-title').textContent=state.unit==='safety'?'校園網安守護戰':state.unit==='coding'?'程式迷宮突破戰':state.unit==='digital'?'數位公民守護戰':'網路世界守護戰';
  $('lobby').classList.add('hidden'); $('battle').classList.remove('hidden'); $('result').classList.add('hidden'); $('question-card').classList.add('hidden'); $('move-deck').classList.remove('hidden'); $('feedback').textContent='先選一個技能，答對就能發動攻擊！'; $('feedback').className='feedback';
  updateUI(); startTimer(); setTurn('p1'); playMusicScene('battle', true);
}
function updateUI() { for (const id of ['p1','p2']) { const f=state[id]; $(`${id}-health`).style.width=`${f.health}%`; $(`${id}-health-text`).textContent=f.health; $(`${id}-meter`).style.width=`${f.meter}%`; $(`${id}-meter-text`).textContent=`${f.meter}%`; } const player=state[state.turn]; $('streak-label').textContent=`連擊 x${player.streak}`; $('ultimate-btn').classList.toggle('locked',player.meter<100); $('ultimate-btn').disabled=player.meter<100; }
function startTimer() { clearInterval(state.timerId); $('timer').textContent=state.time; state.timerId=setInterval(()=>{ if(!state.running)return; state.time--; $('timer').textContent=state.time; if(state.time<=10) $('timer').style.color='#ff9eaa'; if(state.time<=0) finish(state.p1.health>=state.p2.health?'p1':'p2','時間到囉！'); },1000); }
function setTurn(turn) { if(!state.running)return; state.turn=turn; state.current=null; const actor=state[turn]; $('turn-title').textContent=actor.isCpu?'駕駛艙 AI 正在分析資料…':`${actor.name} 的回合：選擇技能`; document.querySelector('.turn-strip').classList.toggle('cpu',actor.isCpu); $('move-deck').classList.toggle('hidden',actor.isCpu); $('question-card').classList.add('hidden'); $('feedback').textContent=actor.isCpu?'AI 正在挑選它的招式…':'先選一個技能，答對就能發動攻擊！'; $('feedback').className='feedback'; updateUI(); if(actor.isCpu) window.setTimeout(cpuMove,900); }
function getQuestion(level) { let pool = questions.filter(q => q.level===level && (state.unit==='mixed'||q.unit===state.unit||q.unit==='mixed')); let unused=pool.filter(q=>!state.used.includes(q)); if(!unused.length){state.used=[];unused=pool;} const q=random(unused); state.used.push(q); return q; }
function chooseMove(level) { if(!state.running || state.turn!=='p1' && state.mode==='solo')return; const actor=state[state.turn]; if(level==='ultimate'&&actor.meter<100)return; state.current={level,q:getQuestion(level)}; const labels={light:'基礎題 · 掃描衝擊',heavy:'進階題 · 除錯連發',ultimate:'挑戰題 · 終極防護'}; $('question-level').textContent=labels[level]; $('question-count').textContent=`已答對 ${state.correct} 題`; $('question-text').textContent=state.current.q.q; $('answers').innerHTML=state.current.q.a.map((answer,index)=>`<button class="answer" data-answer="${index}" type="button"><b>${'ABCD'[index]}.</b> ${answer}</button>`).join(''); $('explain').textContent=''; $('question-card').classList.remove('hidden'); $('move-deck').classList.add('hidden'); $('feedback').textContent='仔細想一想，選出最合適的答案！'; }
function answer(index) { if(!state.current||!state.running)return; const {q,level}=state.current; document.querySelectorAll('.answer').forEach(btn=>btn.disabled=true); const correct=index===q.correct; document.querySelector(`.answer[data-answer="${index}"]`).classList.add(correct?'correct':'wrong'); if(!correct)document.querySelector(`.answer[data-answer="${q.correct}"]`).classList.add('correct'); $('explain').textContent=`💡 ${q.tip}`; const actor=state[state.turn], defender=state.turn==='p1'?state.p2:state.p1; if(correct){state.correct++; actor.streak++; defender.streak=0; state.bestStreak=Math.max(state.bestStreak,actor.streak); const damage={light:8,heavy:16,ultimate:30}[level]+Math.min((actor.streak-1)*2,8); actor.meter=level==='ultimate'?0:Math.min(100,actor.meter+(level==='light'?34:48)); $('feedback').textContent=`答對！${actor.name} 發動${level==='light'?'掃描衝擊':level==='heavy'?'除錯連發':'終極防護'}！`; $('feedback').className='feedback good'; attack(actor,defender,damage,level); } else { actor.streak=0; actor.meter=Math.max(0,actor.meter-8); $('feedback').textContent='這題先記下來！攻擊沒有命中。'; $('feedback').className='feedback bad'; playTone(false); }
  updateUI(); window.setTimeout(()=>{ if(!state.running)return; if(defender.health<=0)finish(state.turn); else setTurn(state.turn==='p1'?'p2':'p1'); },1600);
}
function attack(actor,defender,damage,level) { const source=actor===state.p1?$('fighter-p1'):$('fighter-p2'), target=defender===state.p1?$('fighter-p1'):$('fighter-p2'); source.classList.remove('attack','ultimate'); void source.offsetWidth; source.classList.add(level==='ultimate'?'ultimate':'attack'); target.classList.remove('hit'); void target.offsetWidth; target.classList.add('hit'); defender.health=Math.max(0,defender.health-damage); const blast=document.createElement('i'); blast.className=`blast ${level==='heavy'?'heavy':''} ${level==='ultimate'?'ultimate':''}`; $('battle-fx').append(blast); window.setTimeout(()=>blast.remove(),700); if(actor.streak>=2){const combo=$('combo');combo.textContent=`${actor.streak} HIT COMBO!`;combo.classList.remove('hidden');window.setTimeout(()=>combo.classList.add('hidden'),800);} if(level==='ultimate') playMusicStinger('ultimate'); playTone(true,level); }
function cpuMove(){ if(!state.running||state.turn!=='p2')return; const actor=state.p2, level=actor.meter>=100&&Math.random()>.55?'ultimate':Math.random()>.52?'heavy':'light'; const q=getQuestion(level); const correct=Math.random()<(level==='light'?.78:level==='heavy'?.62:.5); state.current={level,q}; if(correct){actor.streak++;state.p1.streak=0;actor.meter=level==='ultimate'?0:Math.min(100,actor.meter+(level==='light'?34:48));$('feedback').textContent=`AI 找到正解！${actor.name} 正在反擊！`; $('feedback').className='feedback bad'; attack(actor,state.p1,{light:8,heavy:16,ultimate:30}[level],level);}else{actor.streak=0;$('feedback').textContent='AI 的資料判讀失誤，這回合沒有命中！';$('feedback').className='feedback good';playTone(false);} updateUI();window.setTimeout(()=>{if(!state.running)return;if(state.p1.health<=0)finish('p2');else setTurn('p1');},1450); }
function finish(winner, reason='') { if(!state.running)return; state.running=false;clearInterval(state.timerId);const won=winner==='p1';$('result-kicker').textContent=won?'MISSION COMPLETE':'再整理一下資訊力';$('result-icon').textContent=won?'🏆':'🧩';$('result-title').textContent=won?'任務成功！':'任務暫停，重新挑戰！';$('result-copy').textContent=won?`${reason?'時間到！':''}你用正確的資訊觀念守護了校園網路。`:'別灰心，每一題的說明都是下一次更強的技能。';$('correct-count').textContent=state.correct;$('best-streak').textContent=state.bestStreak;$('time-left').textContent=Math.max(0,state.time);$('result').classList.remove('hidden');playMusicScene(won?'victory':'retry',true);playTone(won,'ultimate'); }
function playTone(good,level='light'){if(!state.sound)return;try{const ac=new(window.AudioContext||window.webkitAudioContext)(),o=ac.createOscillator(),g=ac.createGain();o.type=good?'sine':'sawtooth';o.frequency.value=good?(level==='ultimate'?740:level==='heavy'?520:390):145;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.06,ac.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.22);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.24);}catch(e){}}

async function loadMusicManifest() {
  try { const response = await fetch('assets/audio/audio-manifest.json'); if (response.ok) { music.manifest = await response.json(); if (state.running && music.enabled) playMusicScene('battle', true); } }
  catch (error) { console.info('Music manifest is not available yet.', error); }
}
function approvedTrack(scene) { const track = music.manifest?.tracks?.[scene]; return track?.status === 'approved' ? track : null; }
function stopFallbackMusic() { if (music.fallbackTimer) window.clearInterval(music.fallbackTimer); music.fallbackTimer = null; }
function stopMusic() { stopFallbackMusic(); music.tracks.forEach(audio => audio.pause()); music.currentScene = null; }
function fallbackBeat(scene) {
  stopFallbackMusic(); if (!music.enabled) return;
  const patterns = { lobby:[262,330,392,523], battle:[220,294,330,440,330,294], victory:[523,659,784,1047], retry:[247,220,196] };
  const notes = patterns[scene] || patterns.battle; music.fallbackStep = 0;
  const pulse = () => { if (!music.enabled) return; try { const Ctx = window.AudioContext || window.webkitAudioContext; music.fallbackContext ||= new Ctx(); const ac = music.fallbackContext, osc = ac.createOscillator(), gain = ac.createGain(), note = notes[music.fallbackStep++ % notes.length]; osc.type = scene==='battle' ? 'square' : 'triangle'; osc.frequency.value = note; gain.gain.setValueAtTime(.0001, ac.currentTime); gain.gain.exponentialRampToValueAtTime(.022, ac.currentTime+.012); gain.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+.16); osc.connect(gain).connect(ac.destination); osc.start(); osc.stop(ac.currentTime+.18); } catch (error) {} };
  pulse(); music.fallbackTimer = window.setInterval(pulse, scene==='battle'?260:420);
}
function playMusicScene(scene, restart=false) {
  if (!music.enabled) return; const track = approvedTrack(scene); stopFallbackMusic();
  if (!track) { music.currentScene = scene; fallbackBeat(scene); return; }
  if (music.currentScene === scene && !restart) return; music.tracks.forEach(audio => { audio.pause(); audio.currentTime = 0; });
  let audio = music.tracks.get(scene); if (!audio) { audio = new Audio(track.path); audio.loop = Boolean(track.loop); audio.preload = 'auto'; audio.volume = track.volume ?? .34; music.tracks.set(scene, audio); }
  music.currentScene = scene; audio.currentTime = 0; audio.play().catch(() => fallbackBeat(scene));
}
function playMusicStinger(scene) { const track = approvedTrack(scene); if (!music.enabled || !track) return; const audio = new Audio(track.path); audio.volume = track.volume ?? .46; audio.play().catch(() => {}); }
function showLobby() { state.running=false; clearInterval(state.timerId); stopMusic(); $('result').classList.add('hidden'); $('battle').classList.add('hidden'); $('lobby').classList.remove('hidden'); playMusicScene('lobby', true); }

document.addEventListener('click',(event)=>{const mode=event.target.closest('[data-mode]');if(mode){state.mode=mode.dataset.mode;choose('[data-mode]',state.mode,'mode');}const unit=event.target.closest('[data-unit]');if(unit){state.unit=unit.dataset.unit;choose('[data-unit]',state.unit,'unit');}const hero=event.target.closest('[data-hero]');if(hero){state.character=characters.find(c=>c.id===hero.dataset.hero);renderRoster();}const move=event.target.closest('[data-move]');if(move)chooseMove(move.dataset.move);const answerBtn=event.target.closest('[data-answer]');if(answerBtn)answer(Number(answerBtn.dataset.answer));});
$('launch-btn').addEventListener('click',setupBattle);$('back-btn').addEventListener('click',showLobby);$('retry-btn').addEventListener('click',setupBattle);$('lobby-btn').addEventListener('click',showLobby);$('sound-btn').addEventListener('click',()=>{state.sound=!state.sound;music.enabled=state.sound;if(!state.sound)stopMusic();else playMusicScene(state.running?'battle':'lobby');$('sound-btn').textContent=state.sound?'🔊':'🔇';$('sound-btn').setAttribute('aria-pressed',String(state.sound));});loadMusicManifest();renderRoster();
