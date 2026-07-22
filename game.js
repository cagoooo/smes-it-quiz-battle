const supabaseUrl = 'https://lwohskolhlcxhbcamhnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b2hza29saGxjeGhiY2FtaG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzI3NjQsImV4cCI6MjA4ODY0ODc2NH0.kuPhDn4wyT3Re16FxXU7lBtH-K4Q0aG_f7kUAmpq6N0';
let supabaseClient = null;
try {
  if (supabaseUrl && !supabaseUrl.startsWith('__') && typeof window.supabase !== 'undefined') {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn('Supabase 初始化失敗，將安全退回訪客模式', e);
}

const characters = [
  { id: 'coder', icon: '💻', image: 'assets/characters/coder.png', name: '程式勇者', skill: '演算法導航', color: '#52e6ff', moves:{light:'位元突擊',heavy:'除錯連發'}, ultimates:[{ name:'迴圈風暴', damage:34, color:'#52e6ff' }, { name:'演算法連鎖', damage:38, color:'#7af4ff' }, { name:'零錯誤雷擊', damage:42, color:'#b6fbff' }, { name:'核心編譯爆', damage:46, color:'#e0feff' }] },
  { id: 'guardian', icon: '🛡️', image: 'assets/characters/guardian.png', name: '網安守護者', skill: '防毒護盾', color: '#62f7bb', moves:{light:'護盾衝刺',heavy:'掃毒彈幕'}, ultimates:[{ name:'防毒結界', damage:34, color:'#62f7bb' }, { name:'零信任護盾', damage:38, color:'#9affd8' }, { name:'資安天網', damage:42, color:'#d0ffeb' }, { name:'資安鐵壁裁決', damage:46, color:'#e8fff5' }] },
  { id: 'data', icon: '📊', image: 'assets/characters/data.png', name: '資料魔法師', skill: '圖表洞察', color: '#c5a5ff', moves:{light:'資料切片',heavy:'圖表彈幕'}, ultimates:[{ name:'資料流星雨', damage:34, color:'#c5a5ff' }, { name:'圖表預言', damage:38, color:'#dfcaff' }, { name:'洞察超新星', damage:42, color:'#f0e7ff' }, { name:'數據奇點爆發', damage:46, color:'#f8f2ff' }] },
  { id: 'creator', icon: '🎨', image: 'assets/characters/creator.png', name: '創意設計師', skill: '媒體創作', color: '#ffbd7a', moves:{light:'色票飛刃',heavy:'靈感連描'}, ultimates:[{ name:'像素彩虹炮', damage:34, color:'#ffbd7a' }, { name:'靈感大爆發', damage:38, color:'#ffd6a9' }, { name:'創意銀河', damage:42, color:'#fff0dc' }, { name:'靈感萬花筒', damage:46, color:'#fff8ec' }] },
  { id: 'ai-explorer', icon: '🤖', image: 'assets/characters/ai-explorer.png', name: 'AI 探險家', skill: '模型導航', color: '#7fbaff', moves:{light:'推論脈衝',heavy:'特徵鎖定'}, ultimates:[{ name:'神經網路脈衝', damage:34, color:'#7fbaff' }, { name:'智慧星圖', damage:38, color:'#a8d1ff' }, { name:'未來預測光束', damage:42, color:'#e0efff' }, { name:'深度學習超載', damage:46, color:'#eef7ff' }] },
  { id: 'green-engineer', icon: '🌱', image: 'assets/characters/green-engineer.png', name: '綠能工程師', skill: '永續雲端', color: '#91df70', moves:{light:'葉片迴旋',heavy:'風能推進'}, ultimates:[{ name:'太陽能聚焦', damage:34, color:'#91df70' }, { name:'綠電旋風', damage:38, color:'#b5f79b' }, { name:'永續地球脈動', damage:42, color:'#e0ffd1' }, { name:'生態圈共鳴', damage:46, color:'#eafff0' }] },
  { id: 'robotics-ace', icon: '🦾', image: 'assets/characters/robotics-ace.png', name: '機器人操控師', skill: '機甲調校', color: '#ff7fc8', moves:{light:'伺服突進',heavy:'機械臂連擊'}, ultimates:[{ name:'鋼鐵流星拳', damage:35, color:'#ff7fc8' }, { name:'機甲零距離砲', damage:39, color:'#ffa8dd' }, { name:'自動導航終結', damage:43, color:'#ffe0f3' }, { name:'終極機甲核爆', damage:47, color:'#fff0f8' }] },
  { id: 'cloud-ranger', icon: '☁️', image: 'assets/characters/cloud-ranger.png', name: '雲端航海家', skill: '資料同步', color: '#6ee6e8', moves:{light:'雲端滑翔',heavy:'同步雷達'}, ultimates:[{ name:'備份星雲', damage:35, color:'#6ee6e8' }, { name:'伺服器流星雨', damage:39, color:'#9df9fb' }, { name:'全域同步風暴', damage:43, color:'#ddffff' }, { name:'雲端奇點連結', damage:47, color:'#eafffe' }] },
];

const cpuEnemies = [
  { id:'firewall', name:'防火牆怪', icon:'🧠', image:'assets/characters/firewall.png', moves:{light:'封包衝撞',heavy:'熱牆彈幕'}, ultimates:[{ name:'封包封鎖', damage:32, color:'#ff826f' }, { name:'熔岩防線', damage:36, color:'#ffb06c' }, { name:'終極防禦矩陣', damage:40, color:'#ffcf9e' }] },
  { id:'noise-beast', name:'雜訊干擾獸', icon:'📡', image:'assets/characters/noise-beast.png', moves:{light:'頻率刺擊',heavy:'雜波連射'}, ultimates:[{ name:'雜訊震盪', damage:32, color:'#e387ff' }, { name:'頻率風暴', damage:36, color:'#ffb0ee' }, { name:'全頻干擾風暴', damage:40, color:'#ffcdf7' }] },
  { id:'bug-phantom', name:'漏洞幻影', icon:'🧩', image:'assets/characters/bug-phantom.png', moves:{light:'錯誤咬擊',heavy:'裂縫穿梭'}, ultimates:[{ name:'錯誤裂縫', damage:32, color:'#7b9cff' }, { name:'藍屏幻象', damage:36, color:'#b4c7ff' }, { name:'無限迴圈陷阱', damage:40, color:'#d4e0ff' }] },
  { id:'phishing-siren', name:'釣魚海妖', icon:'🎣', image:'assets/characters/phishing-siren.png', moves:{light:'誘餌波紋',heavy:'假連結連射'}, ultimates:[{ name:'深海釣信', damage:33, color:'#38c9ff' }, { name:'帳密漩渦', damage:38, color:'#8ceaff' }, { name:'深層詐騙巨浪', damage:42, color:'#a8f2ff' }] },
  { id:'cache-golem', name:'快取石巨人', icon:'🗄️', image:'assets/characters/cache-golem.png', moves:{light:'資料落石',heavy:'延遲重壓'}, ultimates:[{ name:'記憶體崩落', damage:33, color:'#d39b5c' }, { name:'快取迷宮', damage:38, color:'#ffe09a' }, { name:'記憶體大崩壞', damage:42, color:'#ffe9b0' }] },
  { id:'glitch-dragon', name:'像素故障龍', icon:'🐉', image:'assets/characters/glitch-dragon.png', moves:{light:'像素吐息',heavy:'斷訊俯衝'}, ultimates:[{ name:'故障龍捲', damage:33, color:'#a77bff' }, { name:'畫面撕裂炮', damage:38, color:'#d8c3ff' }, { name:'全螢幕故障爆', damage:42, color:'#e5d3ff' }] },
  { id:'malware-mimic', name:'惡意偽裝怪', icon:'🎭', image:'assets/characters/malware-mimic.png', moves:{light:'偽裝衝擊',heavy:'假檔案連招'}, ultimates:[{ name:'偽裝百變', damage:33, color:'#ff6f9d' }, { name:'病毒鏡像陣', damage:38, color:'#ffb2ca' }, { name:'病毒核心覺醒', damage:42, color:'#ffc3d7' }] },
  { id:'bot-swarm', name:'機器人蜂群', icon:'🐝', image:'assets/characters/bot-swarm.png', moves:{light:'蜂群掃描',heavy:'自動回覆砲'}, ultimates:[{ name:'帳號轟炸', damage:33, color:'#ffe15c' }, { name:'蜂巢同步攻勢', damage:38, color:'#fff1a8' }, { name:'殭屍網路過載', damage:42, color:'#fff6c2' }] },
];

const skillSet = (quick, quickDamage, heavy, heavyDamage, tactical, tacticalDamage) => [
  { id:'light', name:quick, damage:quickDamage, meterGain:36, questionLevel:'light', label:'基礎題', icon:'⌁' },
  { id:'heavy', name:heavy, damage:heavyDamage, meterGain:42, questionLevel:'heavy', label:'進階題', icon:'⚙' },
  { id:'tactical', name:tactical, damage:tacticalDamage, meterGain:34, questionLevel:'tactical', label:'戰術題', icon:'✹' },
];
const difficultyModes = { practice:{label:'練習',accuracy:-.14,delay:1450,ultimateChance:.28,hint:'提示：先看清楚題目中的關鍵詞。'}, standard:{label:'標準',accuracy:0,delay:900,ultimateChance:.55,hint:''}, challenge:{label:'挑戰',accuracy:.09,delay:620,ultimateChance:.78,hint:''} };
const cpuProfiles = { firewall:{accuracy:.68,light:.55,heavy:.3,tactical:.15}, 'cache-golem':{accuracy:.64,light:.35,heavy:.5,tactical:.15}, 'noise-beast':{accuracy:.58,light:.45,heavy:.22,tactical:.33}, 'phishing-siren':{accuracy:.6,light:.3,heavy:.25,tactical:.45}, 'bug-phantom':{accuracy:.65,light:.36,heavy:.35,tactical:.29}, 'malware-mimic':{accuracy:.63,light:.3,heavy:.4,tactical:.3}, 'glitch-dragon':{accuracy:.61,light:.22,heavy:.42,tactical:.36}, 'bot-swarm':{accuracy:.59,light:.48,heavy:.2,tactical:.32} };
const skillSets = {
  coder: skillSet('位元突擊',7,'除錯連發',14,'函式分身斬',21), guardian: skillSet('護盾衝刺',8,'掃毒彈幕',15,'權限封鎖陣',22),
  data: skillSet('資料切片',7,'圖表彈幕',15,'趨勢預言矢',22), creator: skillSet('色票飛刃',8,'靈感連描',14,'版面幻彩陣',21),
  'ai-explorer': skillSet('推論脈衝',7,'特徵鎖定',16,'提示詞流星',23), 'green-engineer': skillSet('葉片迴旋',8,'風能推進',15,'循環電網',22),
  'robotics-ace': skillSet('伺服突進',9,'機械臂連擊',16,'感測器鎖定',24), 'cloud-ranger': skillSet('雲端滑翔',8,'同步雷達',15,'資料航道炮',23),
  firewall: skillSet('封包衝撞',7,'熱牆彈幕',14,'規則熔解波',21), 'noise-beast': skillSet('頻率刺擊',8,'雜波連射',15,'干擾共振場',22),
  'bug-phantom': skillSet('錯誤咬擊',7,'裂縫穿梭',16,'例外追蹤雨',23), 'phishing-siren': skillSet('誘餌波紋',8,'假連結連射',15,'帳密迷航歌',22),
  'cache-golem': skillSet('資料落石',9,'延遲重壓',16,'記憶體震盪',24), 'glitch-dragon': skillSet('像素吐息',8,'斷訊俯衝',15,'畫面撕裂爪',23),
  'malware-mimic': skillSet('偽裝衝擊',7,'假檔案連招',16,'病毒鏡像陣',23), 'bot-swarm': skillSet('蜂群掃描',8,'自動回覆砲',15,'帳號轟炸網',22),
};

const unitNames = { mixed: '綜合挑戰', safety: '網路安全', coding: '程式思維', digital: '數位公民' };
const music = { enabled: true, unlocked: false, manifest: null, tracks: new Map(), currentScene: null, fallbackTimer: null, fallbackContext: null, fallbackStep: 0 };
const RECORDS_KEY = 'smes-it-quiz-battle-records';
const BADGES = [
  { id:'streak5', name:'首次五連擊', icon:'🔥', check:(records,battle)=>battle.bestStreak>=5 },
  { id:'streak8', name:'連擊大師', icon:'⚡', check:(records,battle)=>battle.bestStreak>=8 },
  { id:'perfect', name:'單局全對', icon:'🎯', check:(records,battle)=>battle.wrongCount===0&&battle.correct>=5 },
  { id:'battles10', name:'挑戰 10 場', icon:'🥉', check:(records)=>records.battles>=10 },
  { id:'battles50', name:'資深玩家', icon:'🏅', check:(records)=>records.battles>=50 },
  { id:'boss-slayer', name:'魔王終結者', icon:'👹', check:(records,battle)=>battle.wonBoss===true },
];
function loadRecords(){ try{ const saved=JSON.parse(localStorage.getItem(RECORDS_KEY)); if(saved&&typeof saved==='object')return {battles:0,bestStreak:0,bestDamage:0,bestCorrect:0,badges:[],...saved}; }catch(e){} return {battles:0,bestStreak:0,bestDamage:0,bestCorrect:0,badges:[]}; }

async function saveToCloud(records) {
  if (!supabaseClient || !state.user) return;
  try {
    const { error } = await supabaseClient
      .from('user_records')
      .upsert({
        user_id: state.user.id,
        email: state.user.email,
        display_name: state.user.user_metadata.full_name || state.user.email,
        best_streak: records.bestStreak || 0,
        best_correct: records.bestCorrect || 0,
        badges: records.badges || [],
        updated_at: new Date().toISOString()
      });
    if (error) console.error('雲端存檔上傳失敗', error);
  } catch (e) {
    console.error('上傳雲端出錯', e);
  }
}

async function syncFromCloud() {
  if (!supabaseClient || !state.user) return;
  try {
    const { data, error } = await supabaseClient
      .from('user_records')
      .select('*')
      .eq('user_id', state.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('讀取雲端存檔失敗', error);
      return;
    }
    
    if (data) {
      const cloudRecords = {
        battles: Math.max(loadRecords().battles, 1),
        bestStreak: data.best_streak || 0,
        bestCorrect: data.best_correct || 0,
        bestDamage: Math.max(loadRecords().bestDamage, 0),
        badges: data.badges || []
      };
      localStorage.setItem(RECORDS_KEY, JSON.stringify(cloudRecords));
      renderBestRecord();
      renderBadgeShelf();
    } else {
      const local = loadRecords();
      if (local.battles > 0) {
        await saveToCloud(local);
      }
    }
  } catch (e) {
    console.error('雲端存檔同步出錯', e);
  }
}

function saveRecords(records){ 
  try{ 
    localStorage.setItem(RECORDS_KEY,JSON.stringify(records)); 
    if (supabaseClient && state.user) {
      saveToCloud(records);
    }
  }catch(e){} 
}
function renderBestRecord(){ const el=$('best-record'); let records; try{ records=loadRecords(); }catch(e){ el.classList.add('hidden'); return; } if(!records.battles){ el.classList.add('hidden'); return; } el.classList.remove('hidden'); $('best-record-text').textContent=`🏆 歷史最佳：連擊 x${records.bestStreak} · 單局答對 ${records.bestCorrect} 題 · 已挑戰 ${records.battles} 場`; }
function renderBadgeShelf(){ const el=$('badge-shelf'); let records; try{ records=loadRecords(); }catch(e){ el.classList.add('hidden'); return; } if(!records.badges.length){ el.classList.add('hidden'); return; } el.classList.remove('hidden'); el.innerHTML=records.badges.map(id=>{ const badge=BADGES.find(b=>b.id===id); return badge?`<span class="badge-icon" title="${badge.name}">${badge.icon}</span>`:''; }).join(''); }
function renderBadgeUnlock(newBadges){ const el=$('badge-unlock'); if(!newBadges.length){ el.classList.add('hidden'); el.textContent=''; return; } el.classList.remove('hidden'); el.textContent=`🎉 新徽章解鎖：${newBadges.map(b=>`${b.icon} ${b.name}`).join('、')}`; }
function resetRecords(){ 
  if(!window.confirm('確定要重置本機與雲端的歷史最佳紀錄嗎？這個動作無法復原。'))return; 
  try{ 
    localStorage.removeItem(RECORDS_KEY); 
    if (supabaseClient && state.user) {
      saveToCloud({ battles: 0, bestStreak: 0, bestCorrect: 0, badges: [] });
    }
  }catch(e){} 
  renderBestRecord(); 
  renderBadgeShelf(); 
}
function updateRecords(){ const records=loadRecords(); records.battles+=1; records.bestStreak=Math.max(records.bestStreak,state.playerStats.p1.bestStreak); records.bestCorrect=Math.max(records.bestCorrect,state.playerStats.p1.correct); records.bestDamage=Math.max(records.bestDamage,state.playerStats.p1.damage); const battleStats={bestStreak:state.playerStats.p1.bestStreak,correct:state.playerStats.p1.correct,wrongCount:state.wrongAnswers.length,wonBoss:state.bossMode&&(state.p1.health>state.p2.health)}; const newBadges=[]; for(const badge of BADGES){ if(!records.badges.includes(badge.id)&&badge.check(records,battleStats)){ records.badges.push(badge.id); newBadges.push(badge); } } saveRecords(records); renderBestRecord(); renderBadgeShelf(); renderBadgeUnlock(newBadges); }
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
  { unit:'safety', level:'light', q:'帳號開啟「兩步驟驗證」主要能幫助什麼？', a:['讓螢幕變亮','多一道確認，降低帳號被盜用的風險','自動把密碼公開','讓網路加速'], correct:1, tip:'兩步驟驗證會在密碼之外再確認一次身分。' },
  { unit:'safety', level:'light', q:'App 第一次要求讀取位置時，合適的做法是？', a:['每次都直接允許','先想想是否真的需要，再決定是否允許','把同學的位置也填進去','立刻把帳密傳給 App'], correct:1, tip:'只授權必要的資料，是保護個人隱私的好習慣。' },
  { unit:'safety', level:'heavy', q:'收到「帳號即將停用，請立刻登入」的簡訊，網址不是官方網域，該怎麼做？', a:['用簡訊連結登入','自行開啟官方 App 或網站查詢','把驗證碼回傳給對方','轉傳給朋友一起點'], correct:1, tip:'釣魚訊息常製造急迫感；應從官方管道自行查證。' },
  { unit:'safety', level:'heavy', q:'撿到一支來路不明的 USB 隨身碟，最安全的做法是？', a:['插到學校電腦看看','請老師協助處理，不任意插入設備','借給同學輪流使用','帶回家插在家人電腦'], correct:1, tip:'未知 USB 可能帶有惡意程式，別直接插入電腦。' },
  { unit:'safety', level:'ultimate', q:'有人在班群持續用難聽的話攻擊同學，最合適的處理是？', a:['跟著留言嘲笑','保留紀錄、不要回嗆，並向師長求助','把內容轉傳到更多群組','建立假帳號反擊'], correct:1, tip:'面對網路霸凌，要保留證據並找可信任的大人協助。' },
  { unit:'safety', level:'ultimate', q:'要讓密碼更好管理又不重複使用，建議採取哪種方式？', a:['所有帳號用同一組密碼','使用可信任的密碼管理工具並設定強主密碼','把密碼貼在螢幕旁','在班群公布密碼'], correct:1, tip:'不同服務使用不同強密碼，可降低一個帳號外洩造成的影響。' },
  { unit:'coding', level:'light', q:'程式要接收玩家按下鍵盤的動作，這類觸發叫做？', a:['事件','背景','註解','資料夾'], correct:0, tip:'按鍵、點擊和碰撞都可以是觸發程式的事件。' },
  { unit:'coding', level:'light', q:'把計算結果顯示給使用者看，屬於程式的哪個部分？', a:['輸出','輸入','刪除','休眠'], correct:0, tip:'程式把結果呈現出來的步驟叫做輸出。' },
  { unit:'coding', level:'heavy', q:'測試猜數字程式時，同時試最小值、最大值與中間值，主要是在做什麼？', a:['設計測試案例','刪除程式','增加圖片','修改鍵盤'], correct:0, tip:'有代表性的測試案例能幫助發現程式在邊界條件的問題。' },
  { unit:'coding', level:'heavy', q:'把「規劃校慶活動 App」分成報名、公告、地圖等小任務，使用了什麼思維？', a:['問題分解','隨機猜測','複製貼上','關機'], correct:0, tip:'把大問題拆成小任務，會更容易規劃與完成。' },
  { unit:'coding', level:'ultimate', q:'角色每走一步都要檢查是否抵達終點，最適合的程式結構是？', a:['重複執行並進行條件判斷','只執行一次就停止','刪除角色','永遠播放音樂'], correct:0, tip:'迴圈負責反覆檢查，條件判斷決定何時完成任務。' },
  { unit:'coding', level:'ultimate', q:'在程式旁寫下「這段負責計算總分」最主要的用途是？', a:['讓程式跑得更慢','幫自己和隊友理解程式用途','取代所有程式碼','讓答案永遠正確'], correct:1, tip:'清楚註解能讓人更容易閱讀、維護與合作撰寫程式。' },
  { unit:'digital', level:'light', q:'看到標示 CC 授權的圖片時，第一步該做什麼？', a:['直接說是自己創作','閱讀授權條件，確認能否使用及是否要標示作者','刪除作者姓名','把圖片賣掉'], correct:1, tip:'不同 Creative Commons 授權的使用條件不同，要先確認。' },
  { unit:'digital', level:'light', q:'班群要轉傳活動照片前，應先注意什麼？', a:['照片檔案是否最大','照片中的人是否同意公開','誰的手機最快','是否有最多貼圖'], correct:1, tip:'分享他人影像前應尊重肖像、隱私與意願。' },
  { unit:'digital', level:'heavy', q:'影片平台一直推薦相似內容，最合理的原因是？', a:['電腦讀心術','演算法依觀看紀錄推測喜好','所有影片都一樣','老師控制了平台'], correct:1, tip:'推薦系統會依互動與觀看紀錄排序內容，仍要主動接觸多元資訊。' },
  { unit:'digital', level:'heavy', q:'一則新聞沒有作者、日期與原始來源，最好的判斷是？', a:['一定是真實的','可信度需要再查證，不急著分享','越短越可靠','只要朋友說就相信'], correct:1, tip:'作者、日期與可追溯來源，是判斷資訊可信度的重要線索。' },
  { unit:'digital', level:'ultimate', q:'AI 聊天工具請你輸入同學的住址來做報告，最負責任的選擇是？', a:['完整輸入所有資料','不輸入可識別個資，改用去識別化的假資料或詢問老師','貼到全班群組討論','請同學再提供更多資料'], correct:1, tip:'使用 AI 工具時也要保護自己與他人的個人資料。' },
  { unit:'digital', level:'ultimate', q:'想引用網路資料完成報告，最完整的做法是？', a:['複製貼上不標示','核對可信來源、用自己的話整理並列出出處','只截圖標題','刪除原作者名字'], correct:1, tip:'查證、理解與標示來源，能讓作品更可靠也尊重創作者。' },
  { unit:'mixed', level:'light', q:'把重要作業同步到雲端硬碟，主要的好處是？', a:['一定不需要密碼','可在合適權限下備份並從不同裝置存取','檔案會自動變成動畫','所有人都能任意修改'], correct:1, tip:'雲端備份很方便，但也要設定正確的分享權限。' },
  { unit:'mixed', level:'light', q:'檔名加上「v2」或日期，主要是為了？', a:['讓檔案變大','方便辨識版本，避免覆蓋重要內容','讓電腦變慢','不必再存檔'], correct:1, tip:'良好的版本命名能讓小組合作更順利。' },
  { unit:'mixed', level:'heavy', q:'試算表要找出分數最高的五位同學，最適合先用哪個功能？', a:['排序','把所有欄位刪除','更換背景顏色','截圖列印'], correct:0, tip:'依分數排序後，就能快速找到最高的資料。' },
  { unit:'mixed', level:'heavy', q:'簡報中的圖片如果只靠顏色區分重點，應再加上什麼？', a:['更多閃爍效果','文字標籤或說明，讓不同需求的觀眾也能理解','更小的字','完全不說明'], correct:1, tip:'文字說明能提升資訊清楚度與無障礙可讀性。' },
  { unit:'mixed', level:'ultimate', q:'平板提示有安全更新可安裝，較好的做法是？', a:['一直略過','在老師或家長同意下，使用可信網路完成更新','從陌生網站下載更新檔','關閉所有安全功能'], correct:1, tip:'系統更新常包含安全修補，應從官方管道進行。' },
  { unit:'mixed', level:'ultimate', q:'小組完成互動遊戲後，哪個步驟最能讓作品更進步？', a:['不讓任何人試玩','請同學試玩、收集回饋並修改問題','立刻刪除原始檔','只看自己覺得好不好'], correct:1, tip:'讓真實使用者試用並依回饋改進，是很重要的設計流程。' },
  { unit:'safety', level:'tactical', q:'要判斷登入頁是否可能是釣魚網站，最值得優先核對哪兩項？', a:['背景顏色與貼圖','網址網域與官方管道','留言數量與字體','朋友是否轉傳'], correct:1, tip:'先核對網址是否為官方網域，再從官方 App 或網站交叉確認。' },
  { unit:'safety', level:'tactical', q:'班級共用平板要保護帳號，哪種安排最完整？', a:['所有人共用同一密碼','每人用自己的帳號、離開時登出並請老師管理裝置','把密碼寫在桌面','永遠不更新系統'], correct:1, tip:'個人帳號與登出習慣能降低他人誤用帳號的風險。' },
  { unit:'coding', level:'tactical', q:'除錯時程式偶爾算錯分數，最有效的第一步是？', a:['隨機改很多程式碼','用不同測試資料重現問題並檢查分數計算變數','直接刪除計分功能','只問同學答案'], correct:1, tip:'先重現問題並觀察關鍵變數，才能有方向地修正。' },
  { unit:'coding', level:'tactical', q:'想讓迷宮遊戲日後容易增加關卡，較好的設計是？', a:['把所有指令塞在同一段','把移動、碰撞、過關等功能拆成清楚的區塊','每關複製整份程式','只靠手動操作'], correct:1, tip:'模組化能讓程式更容易閱讀、測試與擴充。' },
  { unit:'digital', level:'tactical', q:'小組要使用 AI 協助做海報，兼顧學習與責任的流程是？', a:['直接使用並說是完全自己完成','先規劃內容、檢查輸出、改成自己的表達並標示 AI 協助','上傳同學照片讓 AI 任意使用','只追求最快完成'], correct:1, tip:'AI 是協助工具；保有查證、創作判斷與誠實標示很重要。' },
  { unit:'digital', level:'tactical', q:'發現同學分享的新聞標題很吸睛但來源不明，合適做法是？', a:['立刻轉傳提醒大家','找原始報導、發布日期與可信機構資料後再判斷','只看留言數','用更誇張的標題回覆'], correct:1, tip:'先找原始來源與日期，是降低錯誤資訊擴散的方法。' },
  { unit:'mixed', level:'tactical', q:'班級調查資料要公開成圖表，哪個做法最能兼顧清楚與隱私？', a:['列出每位同學全名與資料','使用統計總數、移除可識別資料並加上圖表標題','只放漂亮背景','把原始名單公開'], correct:1, tip:'統計呈現可看出趨勢，也應避免公開可識別個資。' },
  { unit:'mixed', level:'tactical', q:'完成作品後要讓下一組同學也能接手修改，最好的交付方式是？', a:['只傳一張截圖','整理資料夾、清楚命名版本、附上操作說明與來源','把檔案改成隨機名稱','刪除原始檔'], correct:1, tip:'清楚的檔案結構、版本與說明，是合作與傳承的重要能力。' },
  { unit:'safety', level:'light', q:'使用公共 Wi-Fi 時，比較安全的做法是？', a:['直接登入銀行帳戶','避免輸入密碼或改用行動網路處理重要帳戶','把手機借給陌生人連線','關閉手機所有安全設定'], correct:1, tip:'公共 Wi-Fi 可能被側錄，重要帳戶資料建議改用行動網路或先確認連線安全。' },
  { unit:'safety', level:'light', q:'手機或平板閒置一段時間後自動鎖定螢幕，主要用意是？', a:['讓電池更耐用','避免被別人隨意使用你的裝置與資料','讓畫面比較好看','節省網路流量'], correct:1, tip:'自動鎖定能降低裝置離開視線時被他人誤用的風險。' },
  { unit:'safety', level:'light', q:'下載 App 時，比較安全的做法是？', a:['從官方應用程式商店下載並查看評價','從不明網站的連結下載','只要圖示可愛就下載','幫朋友的陌生連結按讚後下載'], correct:0, tip:'從官方商店下載並留意開發者與評價，能降低安裝到惡意程式的風險。' },
  { unit:'safety', level:'light', q:'電腦中毒最常見的原因之一是？', a:['開啟來路不明的附件或連結','定期更新防毒軟體','使用強密碼','定期備份資料'], correct:0, tip:'不明附件與連結是病毒與惡意程式常見的入侵管道。' },
  { unit:'safety', level:'heavy', q:'收到看似銀行寄來、要求你點連結「更新資料」的信件，正確做法是？', a:['立刻點擊並填寫資料','不點信件連結，改用官方 App 或電話查證','回信詢問對方是誰','轉寄給同學一起確認'], correct:1, tip:'釣魚信件常假冒官方名義；應透過官方管道另行查證。' },
  { unit:'safety', level:'heavy', q:'「防火牆」在網路安全中主要的功能是？', a:['讓電腦跑得更快','監控並過濾進出裝置的可疑網路流量','幫忙下載更多遊戲','自動翻譯網頁'], correct:1, tip:'防火牆像一道關卡，能阻擋可疑或未授權的網路連線。' },
  { unit:'safety', level:'heavy', q:'掃描來路不明的 QR Code 前，應該？', a:['直接掃描並打開任何網址','留意來源是否可信，必要時先詢問師長','把 QR Code 分享給更多人掃','用它登入重要帳號'], correct:1, tip:'QR Code 可能藏有惡意網址，來源不明時應提高警覺。' },
  { unit:'safety', level:'heavy', q:'系統跳出「有安全更新可安裝」的提醒，合適的處理方式是？', a:['永遠忽略不更新','確認來源可信後盡快完成更新','把更新檔轉傳給同學安裝','關閉所有更新通知'], correct:1, tip:'安全更新常修補漏洞，確認來源後應盡快安裝。' },
  { unit:'safety', level:'ultimate', q:'若懷疑自己的帳號已經被盜用，最完整的處理順序是？', a:['假裝沒事繼續使用','立刻更改密碼、開啟兩步驟驗證並通知相關單位','把帳密分享給朋友幫忙看','刪除所有資料就不管了'], correct:1, tip:'發現帳號異常時，先改密碼、加強驗證並通報，才能有效止損。' },
  { unit:'safety', level:'ultimate', q:'陌生網友在遊戲中要求你提供學校名稱、電話等資料才願意組隊，最合適的回應是？', a:['完整提供以求順利組隊','婉拒提供個人資料，必要時告知家長或師長','用同學的資料代替提供','私下約出去見面確認對方身分'], correct:1, tip:'不隨意對陌生網友透露可識別個資，是保護自己安全的重要原則。' },
  { unit:'safety', level:'ultimate', q:'想在網路平台安全地進行小額付款，下列何者較恰當？', a:['把卡號密碼傳給幫忙代付的網友','使用家長同意、有信譽的平台並確認網址安全','在任何彈出視窗輸入卡號','分享一次性驗證碼給對方核對'], correct:1, tip:'網路付款前應確認平台可信、網址正確，且驗證碼不應提供給他人。' },
  { unit:'safety', level:'ultimate', q:'班級群組討論「要不要幫忙轉發緊急協尋訊息」，最負責任的做法是？', a:['看到就立刻轉發不查證','先確認消息來源與時效再決定是否轉發','自己編造細節讓內容更聳動','刪除訊息假裝沒看到'], correct:1, tip:'轉發前先查證來源與時效，能避免擴散錯誤或過時的資訊。' },
  { unit:'safety', level:'tactical', q:'分析一封可疑信件時，下列哪一組線索最值得優先核對？', a:['信件顏色與字型','寄件網域、連結網址與是否有急迫話術','附件檔案大小','收件時間是白天或晚上'], correct:1, tip:'寄件網域是否官方、連結是否可疑、是否製造急迫感，是判斷釣魚信件的關鍵線索。' },
  { unit:'safety', level:'tactical', q:'設定「安全問題」作為救援機制時，比較安全的做法是？', a:['答案是同學都知道的資訊，如班級','答案不容易被他人查到或猜到，且妥善保存','把答案公開在社群自我介紹','每個帳號用同一組安全問題'], correct:1, tip:'安全問題若容易被他人查到，反而會成為帳號被入侵的破口。' },
  { unit:'safety', level:'tactical', q:'比較「簡訊驗證碼」與「App 驗證」兩種兩步驟驗證方式，下列敘述何者正確？', a:['兩者風險完全相同','App 驗證通常較不易被攔截，但兩者都比單純密碼更安全','簡訊驗證一定比較安全','兩步驟驗證會讓帳號更容易被盜'], correct:1, tip:'不同兩步驟驗證方式風險略有差異，但都比只用密碼更能保護帳號。' },
  { unit:'safety', level:'tactical', q:'班上要規劃「公用電腦帳號管理原則」，最周全的方案是？', a:['大家共用同一組帳密','各自帳號、限制安裝軟體權限並定期由老師檢查','不設任何密碼比較方便','把密碼寫在螢幕貼紙上'], correct:1, tip:'個別帳號、權限限制與定期檢查，能讓公用設備更安全好管理。' },
  { unit:'coding', level:'light', q:'程式中用來「暫時存放會改變的數值」的容器稱為？', a:['變數','註解','背景','音效'], correct:0, tip:'變數可以儲存並更新像分數、生命值這類會變化的資料。' },
  { unit:'coding', level:'light', q:'「先走 5 步，再說哈囉，最後跳一下」這樣按照順序執行指令，屬於程式的哪個概念？', a:['循序（順序）執行','隨機執行','同時全部刪除','只執行一次就當機'], correct:0, tip:'循序是最基本的程式概念，指令會依照排列順序一步步執行。' },
  { unit:'coding', level:'light', q:'想讓角色「按下空白鍵時跳起來」，需要使用哪一種概念來偵測按鍵？', a:['事件','變數','造型','音量'], correct:0, tip:'事件負責偵測像按鍵、點擊等動作，並觸發對應的程式。' },
  { unit:'coding', level:'light', q:'下列何者最能代表「演算法」的意思？', a:['解決問題的一連串清楚步驟','電腦的外殼顏色','網路連線的速度','螢幕的解析度'], correct:0, tip:'演算法是為了完成任務而設計的清楚、有順序的步驟。' },
  { unit:'coding', level:'heavy', q:'要讓角色「同時判斷是否碰到邊界」且「同時偵測是否被點擊」，比較適合用哪種程式結構？', a:['多個事件各自獨立監控','只能挑一個功能保留','把所有偵測寫在同一行文字','完全不使用事件'], correct:0, tip:'不同事件可以各自獨立運作，讓角色同時回應多種情況。' },
  { unit:'coding', level:'heavy', q:'設計「猜數字」遊戲時，要讓程式記住「玩家已經猜了幾次」，需要使用？', a:['能累加數值的變數','固定不變的圖片','只能顯示一次的訊息','隨機的背景音樂'], correct:0, tip:'每猜一次就把變數加一，就能記錄累計的次數。' },
  { unit:'coding', level:'heavy', q:'下列哪一種情況最適合使用「條件判斷（如果…就…）」？', a:['依分數高低顯示不同等第','讓角色一直往前走不停','播放固定不變的音樂','顯示固定的標題文字'], correct:0, tip:'條件判斷能依照不同情況，讓程式做出不同反應。' },
  { unit:'coding', level:'heavy', q:'小組合作寫程式時，把「移動」「計分」「畫面切換」拆給不同人負責，主要好處是？', a:['讓程式變得更難修改','可以分工合作、各自測試再整合','讓程式無法執行','增加程式出錯機率'], correct:1, tip:'把功能拆成模組再分工，能讓合作與除錯更有效率。' },
  { unit:'coding', level:'ultimate', q:'設計「連續答對加分、答錯歸零」的計分規則，最關鍵需要搭配使用的兩個概念是？', a:['變數與條件判斷','背景與音效','造型與畫筆','滑鼠游標與視窗大小'], correct:0, tip:'用變數記錄連續次數，再用條件判斷決定是否加分或歸零。' },
  { unit:'coding', level:'ultimate', q:'遊戲要「隨機出現寶物」但「每次玩起來感覺都不太一樣」，最適合運用？', a:['隨機數的產生與運用','固定寫死的座標','完全相同的重複播放','刪除所有變數'], correct:0, tip:'適當運用隨機數，能讓遊戲每次體驗都有變化。' },
  { unit:'coding', level:'ultimate', q:'專案愈做愈大時，把重複使用的一段程式包成「可以重複呼叫」的區塊，這種做法稱為？', a:['建立函式（積木化）重複利用','把程式全部複製貼上','刪除所有註解','只用一種顏色的積木'], correct:0, tip:'把常用邏輯包成函式，可以重複呼叫、減少重複撰寫並降低出錯機率。' },
  { unit:'coding', level:'ultimate', q:'設計「多關卡」遊戲時，要讓每一關的過關條件清楚且容易調整，最適合的做法是？', a:['用變數記錄關卡與過關條件，並集中管理','把每一關的程式全部寫在同一段且互相糾纏','每次都用猜的判斷是否過關','不設定任何過關條件'], correct:0, tip:'用變數清楚記錄關卡與條件，日後修改與除錯都會更容易。' },
  { unit:'coding', level:'tactical', q:'程式執行結果「有時候正確、有時候不正確」，最有效的除錯策略是？', a:['隨便修改看看運氣','用同一組資料重複測試，找出不穩定的原因（例如隨機數或時間點）','直接刪除整段程式','只問別人有沒有同樣問題'], correct:1, tip:'找出「不穩定」背後的變因（如隨機性、時間點），才能精準定位問題。' },
  { unit:'coding', level:'tactical', q:'想讓程式「更容易被別人接手維護」，下列做法最適合的組合是？', a:['清楚命名變數、適度加註解、拆成模組','變數都取名 a、b、c 節省時間','把所有邏輯擠在同一行','完全不寫任何說明'], correct:0, tip:'好命名、適度註解與模組化，能大幅降低別人理解與維護的成本。' },
  { unit:'coding', level:'tactical', q:'設計一個「猜拳」小遊戲，要涵蓋所有可能的勝負情況，最好的做法是？', a:['列出所有組合，逐一測試每種輸贏與平手情況','只測試一種情況就好','憑感覺覺得應該沒問題','只給別人看畫面不用測試'], correct:0, tip:'列出並測試所有可能組合，才能確保程式在各種情況下都正確。' },
  { unit:'coding', level:'tactical', q:'程式偶爾「當機或跑不出結果」，比較有系統的排查順序是？', a:['先確認最近改了哪裡、重現問題、再檢查關鍵變數與迴圈條件','直接砍掉整個專案重寫','隨機刪除幾行程式碼','只重新啟動電腦不查原因'], correct:0, tip:'有系統地回推修改紀錄、重現問題並檢查關鍵邏輯，能更快找到問題根源。' },
  { unit:'digital', level:'light', q:'你在網路上留下的貼文、留言與紀錄，統稱為？', a:['數位足跡','隨身碟','電池容量','螢幕解析度'], correct:0, tip:'數位足跡會長時間留存，發文前值得多想一下是否合適。' },
  { unit:'digital', level:'light', q:'使用平板學習與休閒時間，比較健康的安排是？', a:['毫無限制想用多久就多久','依照約定安排使用時間，適時休息與活動','用眼睛貼著螢幕才看得清楚','睡前持續滑手機到很晚'], correct:1, tip:'適度安排螢幕使用時間，有助於視力與作息健康。' },
  { unit:'digital', level:'light', q:'社群平台上標示「贊助」或「廣告」的貼文，代表？', a:['內容一定完全客觀','廠商付費推廣，觀看時可多一分判斷','完全不能相信','與其他貼文完全相同'], correct:1, tip:'認出廣告或業配標示，能幫助我們用更客觀的角度看待內容。' },
  { unit:'digital', level:'light', q:'拍攝同學合照要公開分享前，應該？', a:['直接分享不用確認','詢問同學是否同意再公開分享','加上很多特效讓人認不出來就好','只要自己喜歡就好'], correct:1, tip:'分享含有他人影像的照片前，應尊重當事人的意願。' },
  { unit:'digital', level:'heavy', q:'影片平台不斷推薦「類似你之前看過」的內容，可能造成的影響是？', a:['讓你看到的世界更多元','形成「同溫層」，較難接觸不同觀點','完全不影響思考','讓網路變得更慢'], correct:1, tip:'推薦演算法可能讓我們反覆看到相似內容，需要主動接觸多元觀點。' },
  { unit:'digital', level:'heavy', q:'看到一張畫面很逼真、但內容誇張到不太合理的「新聞照片」，較好的態度是？', a:['畫面很清楚一定是真的','留意是否可能經過合成或 AI 生成，並查證來源','越誇張越可信','立即當作事實轉發'], correct:1, tip:'現在的影像與 AI 生成技術愈來愈逼真，需要多一分查證再判斷真假。' },
  { unit:'digital', level:'heavy', q:'使用他人拍攝、標示「保留所有權利」的照片，正確做法是？', a:['直接使用不用理會','先取得授權或使用有明確開放授權的素材','只要有標作者名字就可以隨意用','改個顏色就算自己的作品'], correct:1, tip:'「保留所有權利」代表未經授權不可任意使用，應先取得同意或改用開放授權素材。' },
  { unit:'digital', level:'heavy', q:'家長要求你把手機交出檢查前，比較恰當的心態是？', a:['完全抗拒不願討論','理解安全考量，並可討論彼此都能接受的方式','立刻刪除所有內容','假裝手機不見了'], correct:1, tip:'親子間可以理性溝通，找到兼顧信任與安全的相處方式。' },
  { unit:'digital', level:'ultimate', q:'使用 AI 工具生成的圖片要用在班級刊物上，最負責任的做法是？', a:['直接使用並宣稱是自己手繪','標示由 AI 協助生成，並確認使用規範與授權','拿別人的照片讓 AI 修改後宣稱原創','完全不說明素材來源'], correct:1, tip:'使用 AI 生成內容也要誠實標示來源，並留意使用規範。' },
  { unit:'digital', level:'ultimate', q:'網友傳訊息想約你單獨在校外見面，最安全的處理方式是？', a:['自己一個人赴約','婉拒單獨見面，並告知家長或老師這件事','假裝答應但不出現','把地址告訴對方比較有禮貌'], correct:1, tip:'避免與網路上認識的人單獨見面，遇到邀約應告知信任的大人。' },
  { unit:'digital', level:'ultimate', q:'製作全班都能瀏覽的班級網頁時，考慮到視障同學也能使用，應該加上？', a:['更多動畫特效','圖片的替代文字說明（alt text）等無障礙設計','更複雜的排版','縮小所有文字'], correct:1, tip:'替代文字等無障礙設計，能讓不同需求的使用者也能順利獲取資訊。' },
  { unit:'digital', level:'ultimate', q:'決定是否分享一則「未經證實的緊急消息」時，最完整的判斷流程是？', a:['看到就馬上分享比較有正義感','查證來源與時間、評估影響後再決定是否分享或如何說明','加油添醋讓大家更有警覺','完全不理會任何消息'], correct:1, tip:'查證來源與時效，並考慮分享後的影響，是負責任的數位公民表現。' },
  { unit:'digital', level:'tactical', q:'老師要求「用自己的話」完成閱讀心得，但你想用 AI 協助，兼顧誠信與學習的做法是？', a:['請 AI 全部寫完直接繳交','先自己閱讀理解，再用 AI 協助整理想法，最後用自己的話改寫','找同學的作業複製修改','完全不參考任何資料'], correct:1, tip:'AI 可以是學習的輔助工具，但理解與表達仍應由自己完成並誠實說明使用情形。' },
  { unit:'digital', level:'tactical', q:'比較兩則報導同一事件但立場不同的新聞，最有幫助的做法是？', a:['只看標題就下判斷','對照多方來源、留意用詞與證據，形成自己的判斷','只相信第一則看到的','覺得都一樣不用比較'], correct:1, tip:'多方查證與比較，能幫助我們建立更完整、客觀的理解。' },
  { unit:'digital', level:'tactical', q:'規劃班級社群帳號的「發文守則」，最周全的內容應包含？', a:['想貼什麼就貼什麼不用規範','明訂內容審核、隱私保護與尊重他人的原則','只限制字數不管內容','完全交給單一同學決定'], correct:1, tip:'清楚的守則能兼顧創作自由、隱私保護與對他人的尊重。' },
  { unit:'digital', level:'tactical', q:'使用翻譯或 AI 工具協助完成英文作業時，較恰當的界線是？', a:['全部交給工具處理再直接繳交','用工具輔助理解，自己練習表達並適度標示使用情形','抄工具產生的內容作為自己的原創','完全不使用任何輔助工具'], correct:1, tip:'適度運用工具輔助學習，同時保有自己的練習與誠實標示，才是兼顧學習與誠信的做法。' },
  { unit:'mixed', level:'light', q:'把作業存進「06/07自然報告」這樣的資料夾與檔名，主要目的是？', a:['讓電腦看起來更亂','方便日後快速找到並辨識內容','佔用更多空間','避免同學抄襲'], correct:1, tip:'有系統的資料夾與命名習慣，能讓資料更容易管理與尋找。' },
  { unit:'mixed', level:'light', q:'想把「文字很多的報告」轉成容易列印分享的格式，較適合輸出成？', a:['PDF 文件','只截圖存成很多張照片','用錄音方式儲存','存成無法開啟的格式'], correct:0, tip:'PDF 格式排版穩定，適合分享與列印。' },
  { unit:'mixed', level:'light', q:'練習「不看鍵盤打字」的主要好處是？', a:['打字速度與正確率可以提升','讓螢幕變得更亮','讓電腦跑得更快','節省網路流量'], correct:0, tip:'熟悉鍵盤位置能提升輸入效率，把時間留給思考內容。' },
  { unit:'mixed', level:'light', q:'用 QR Code 分享班級活動網址，主要的方便之處是？', a:['讓別人用手機掃描就能快速開啟網址','讓網址變得更長更複雜','只能在電腦上使用','會自動修改網址內容'], correct:0, tip:'QR Code 能把網址轉成方便掃描開啟的圖案，省去手動輸入。' },
  { unit:'mixed', level:'heavy', q:'試算表要「快速算出全班平均分數」，最適合使用？', a:['加總與平均的公式功能','手動一筆一筆用計算機算完再輸入','把資料全部刪除重輸入','只看最高分就好'], correct:0, tip:'善用公式能讓大量資料的計算更快速、更準確。' },
  { unit:'mixed', level:'heavy', q:'小組共同編輯同一份雲端文件時，避免互相覆蓋修改的好方法是？', a:['各自複製一份離線編輯再各自貼回','善用雲端共同編輯與留言，留意彼此修改紀錄','一次只讓一個人知道密碼','完全不溝通各自修改'], correct:1, tip:'雲端共同編輯搭配留言與版本紀錄，能讓小組合作更順暢。' },
  { unit:'mixed', level:'heavy', q:'製作簡報時同時使用「文字、圖片與圖表」，主要用意是？', a:['讓畫面看起來比較亂','用不同方式呈現重點，幫助觀眾理解與記憶','只是為了填滿版面','讓檔案變得更難開啟'], correct:1, tip:'適當搭配文字、圖片與圖表，能讓資訊更清楚易懂。' },
  { unit:'mixed', level:'heavy', q:'電腦突然「無法連上網路」，比較有效率的第一步排查是？', a:['直接送修不用檢查','先確認 Wi-Fi/網路線與飛航模式等基本設定','立刻重灌整台電腦','換一台完全不同的電腦繼續用'], correct:1, tip:'從最基本、最常見的原因開始排查，通常能更快解決問題。' },
  { unit:'mixed', level:'ultimate', q:'規劃「班級資料保護」機制時，最周全的做法組合是？', a:['定期備份、設定存取權限並移除不需要的個資','把所有資料公開讓大家方便查詢','只備份一次就永久不管','把密碼寫在公佈欄'], correct:0, tip:'定期備份、限制權限並減少不必要的個資留存，能讓班級資料更安全。' },
  { unit:'mixed', level:'ultimate', q:'小組要決定用哪個工具製作互動作品，最完整的評估方式是？', a:['選同學最愛用的顏色','依作品需求、易用性與分享方式評估後再決定','抽籤決定就好','選最貴的工具一定最好'], correct:1, tip:'依實際需求評估工具的功能與適用性，比單純看喜好更能做出好選擇。' },
  { unit:'mixed', level:'ultimate', q:'完成一份跨校分享的教學檔案，要兼顧「好維護、好分享」，下列作法最完整？', a:['統一命名規則、附上版本與使用說明、確認授權方式','檔名隨意、不留任何說明','只給熟悉的人看，其他人都不給看','把所有內容都鎖起來不公開'], correct:0, tip:'清楚的命名、版本說明與授權標示，能讓資源更容易被正確使用與延續。' },
  { unit:'mixed', level:'ultimate', q:'學校要導入新的學習平台，規劃導入計畫時最周全的考量順序是？', a:['先試辦、蒐集師生回饋，再視情況調整後全面實施','直接全校同時使用不用測試','只問一位同學的意見就決定','完全不考慮資安與隱私設定'], correct:0, tip:'先試辦並蒐集回饋、留意資安設定，能讓新工具導入更順利、更安全。' },
  { unit:'mixed', level:'tactical', q:'分析「班級活動報名系統」哪裡需要優先改善時，最有效的做法是？', a:['隨意猜測問題在哪裡','蒐集使用者實際操作紀錄與回饋，找出真正卡關的步驟','只看畫面好不好看','直接砍掉重練不分析原因'], correct:1, tip:'依實際使用資料與回饋找出問題點，才能對症下藥地改善。' },
  { unit:'mixed', level:'tactical', q:'要把「調查結果」清楚呈現給不同年級的觀眾，最周全的做法是？', a:['統一用同一種艱深的圖表呈現給所有人','依觀眾程度調整呈現方式，並確保圖表標示清楚','只用文字不用圖表','刻意讓圖表難以理解顯得專業'], correct:1, tip:'依觀眾調整呈現方式並標示清楚，才能讓資訊真正被理解。' },
  { unit:'mixed', level:'tactical', q:'建置班級共用的雲端資料夾時，權限設定最周全的方式是？', a:['所有人都是編輯者，想刪就刪','依角色設定「檢視／留言／編輯」等不同權限','完全不設密碼最方便','只讓一個人擁有帳號其餘用同一組登入'], correct:1, tip:'依角色設定合適的權限，能兼顧合作便利與資料安全。' },
  { unit:'mixed', level:'tactical', q:'檢查一份即將公開的班級刊物電子檔，最完整的檢查清單應包含？', a:['只檢查封面顏色好不好看','內容正確性、圖片授權、個資是否外洩與檔案是否可正常開啟','只要頁數夠多就好','完全不用檢查直接送印'], correct:1, tip:'公開前完整檢查內容、授權與隱私，能避免上線後才發現問題。' },
];
const questionTags = { safety:{grade:'三至六年級',competency:'網路安全與隱私',misconception:'陌生連結與帳密可隨意分享'}, coding:{grade:'三至六年級',competency:'運算思維',misconception:'除錯只靠猜測'}, digital:{grade:'四至六年級',competency:'數位公民與 AI 素養',misconception:'網路資訊與 AI 輸出一定正確'}, mixed:{grade:'三至六年級',competency:'資訊應用與合作',misconception:'整理資料不影響作品品質'} };
questions.forEach(question=>question.tags={...questionTags[question.unit],difficulty:question.level});

const state = { mode:'solo', unit:'mixed', difficulty:'standard', roundTime:75, character:characters[0], character2:characters[1], turn:'p1', running:false, resolving:false, time:75, timerId:null, questionTimerId:null, current:null, used:[], sound:true, correct:0, bestStreak:0, round:1, p1:null, p2:null, playerStats:null, wrongAnswers:[], retryQueue:[], retryMode:false, recentResults:[], gasUrl:'', className:'501', isConsoleConnected:false, customQuestions:[], teamMode:'none', ttsEnabled:false, bossMode:false, bossGlitchActive:false };
const $ = (id) => document.getElementById(id);
const random = (items) => items[Math.floor(Math.random() * items.length)];

function rosterCards(selected, dataAttribute) { return characters.map(hero => `<button class="hero-card ${hero.id===selected.id?'selected':''}" ${dataAttribute}="${hero.id}" type="button"><span class="hero-portrait" style="--hero-color:${hero.color}">${hero.image ? `<img src="${hero.image}" alt="${hero.name}角色圖">` : `<i aria-hidden="true">${hero.icon}</i>`}</span><span class="hero-content"><b>${hero.name}</b><small>${hero.skill}</small></span><em>選擇</em></button>`).join(''); }
function renderRoster() { $('roster').innerHTML=rosterCards(state.character,'data-hero'); $('roster-p2').innerHTML=rosterCards(state.character2,'data-hero-p2'); $('p2-roster-card').classList.toggle('hidden',state.mode!=='duel'); $('p2-name-input-wrap').classList.toggle('hidden',state.mode!=='duel'); const showTeams = state.teamMode !== 'none'; $('p1-team-wrap').classList.toggle('hidden', !showTeams); $('p2-team-wrap').classList.toggle('hidden', !showTeams || state.mode !== 'duel'); const bossChallengeOpt = $('boss-challenge-option'); if (bossChallengeOpt) { bossChallengeOpt.classList.toggle('hidden', state.mode !== 'solo'); } }
function choose(selector, value, key) { document.querySelectorAll(selector).forEach(el => el.classList.toggle('selected', el.dataset[key] === value)); }

function createFighter(profile, isCpu=false) { return { id:profile.id, name:profile.name, icon:profile.icon, image:profile.image, health:100, meter:0, streak:0, isCpu, cpuProfile:cpuProfiles[profile.id] || cpuProfiles.firewall, skills:skillSets[profile.id] || skillSet('掃描衝擊',8,'除錯連發',16,'同步戰術',22), ultimate:random(profile.ultimates?.length ? profile.ultimates : [{ name:'同步衝擊', damage:30, color:'#ffe479' }]) }; }
function renderAvatar(elementId, fighter) { const element = $(elementId); if (fighter.image) element.innerHTML = `<img src="${fighter.image}" alt="${fighter.name}">`; else element.textContent = fighter.icon; }
function renderArenaAvatar(selector, fighter) { const element = document.querySelector(selector); element.closest('.fighter')?.classList.toggle('has-art', Boolean(fighter.image)); if (fighter.image) element.innerHTML = `<img src="${fighter.image}" alt="${fighter.name}">`; else element.textContent = fighter.icon; }
function fighterKey(actor) { return actor===state.p1?'p1':'p2'; }
function setupBattle(retryQuestions=[]) {
  const p1NameVal = $('p1-name-input').value.trim();
  const p2NameVal = $('p2-name-input').value.trim();
  localStorage.setItem('smes-battle-p1-name', p1NameVal);
  localStorage.setItem('smes-battle-p2-name', p2NameVal);

  const p1TeamVal = state.teamMode !== 'none' ? $('p1-team-select').value : '';
  const p2TeamVal = state.teamMode !== 'none' ? $('p2-team-select').value : '';
  localStorage.setItem('smes-battle-p1-team', p1TeamVal);
  localStorage.setItem('smes-battle-p2-team', p2TeamVal);

  state.p1 = createFighter(state.character);
  if (p1NameVal) state.p1.name = p1NameVal;
  state.p1.team = p1TeamVal;

  const enemy = random(cpuEnemies);
  state.p2 = state.mode === 'solo' ? createFighter(enemy, true) : createFighter(state.character2);
  if (state.mode === 'duel' && p2NameVal) state.p2.name = p2NameVal;
  state.p2.team = p2TeamVal;
  
  if (state.mode === 'solo' && state.bossMode) {
    state.p2.health = 300;
    state.p2.name = `👹 終極魔王：${state.p2.name}`;
  }
  const p2FighterEl = $('fighter-p2');
  if (p2FighterEl) {
    p2FighterEl.classList.toggle('boss-mode', state.mode === 'solo' && state.bossMode);
  }

  state.turn='p1'; state.running=true; state.time=state.roundTime; state.current=null; state.used=[]; state.correct=0; state.bestStreak=0; state.playerStats={p1:{correct:0,bestStreak:0,damage:0},p2:{correct:0,bestStreak:0,damage:0}}; state.wrongAnswers=[]; state.retryQueue=[...retryQuestions]; state.retryMode=retryQuestions.length>0; state.recentResults=[];
  $('p1-name').textContent=state.p1.name; $('fighter-p1-name').textContent=state.p1.name; renderAvatar('p1-avatar-mini',state.p1); renderArenaAvatar('#fighter-p1 .fighter-avatar',state.p1);
  $('p2-name').textContent=state.p2.name; $('fighter-p2-name').textContent=state.p2.name; renderAvatar('p2-avatar-mini',state.p2); renderArenaAvatar('#fighter-p2 .fighter-avatar',state.p2);
  renderMoveDeck(state.p1);
  $('p2-caption').textContent=state.mode==='solo'?'駕駛艙 AI':'玩家 2'; document.querySelector('#fighter-p2 small').textContent=state.mode==='solo'?'CPU':'PLAYER 2';
  $('unit-badge').textContent=unitNames[state.unit]; $('mission-title').textContent=state.unit==='safety'?'校園網安守護戰':state.unit==='coding'?'程式迷宮突破戰':state.unit==='digital'?'數位公民守護戰':(state.unit==='custom'?'自訂主題挑戰':'網路世界守護戰');
  $('lobby').classList.add('hidden'); $('battle').classList.remove('hidden'); $('result').classList.add('hidden'); $('question-card').classList.add('hidden'); $('move-deck').classList.remove('hidden'); $('feedback').textContent=state.retryMode?`錯題再練啟動：還有 ${state.retryQueue.length} 題待複習。`:'先選一個技能，答對就能發動攻擊！'; $('feedback').className='feedback';
  updateUI(); startTimer(); setTurn('p1'); playMusicScene(battleSceneKey(), true);
}
function renderMoveDeck(actor) { actor.skills.forEach(skill => { const button=document.querySelector(`[data-move="${skill.id}"]`); button.querySelector('.move-icon').textContent=skill.icon; button.querySelector('b').textContent=skill.name; button.querySelector('small').textContent=`${skill.label} · 傷害 ${skill.damage} · 能量 +${skill.meterGain}`; }); const ultimateButton=$('ultimate-btn'); ultimateButton.querySelector('b').textContent=actor.ultimate.name; ultimateButton.querySelector('small').textContent=`專屬大絕 · 傷害 ${actor.ultimate.damage} · 能量 100%`; ultimateButton.style.setProperty('--ultimate-color',actor.ultimate.color); }
function renderCpuMoveDeck(actor, selectedId=null) { const skills=[...actor.skills, ...(actor.meter>=100?[getSkill(actor,'ultimate')]:[])]; $('cpu-move-list').innerHTML=skills.map(skill=>`<div class="cpu-move ${skill.id===selectedId?'selected':''} ${skill.id==='ultimate'?'ultimate':''}"><span>${skill.icon || '✦'}</span><div><b>${skill.name}</b><small>${skill.label} · 傷害 ${moveDamage(actor,skill.id)}</small></div><em>${skill.id===selectedId?'已鎖定':'分析中'}</em></div>`).join(''); $('cpu-move-status').textContent=selectedId?`已鎖定：${getSkill(actor,selectedId).name}`:'正在分析最佳招式…'; }
function updateUI() { for (const id of ['p1','p2']) { const f=state[id]; const maxHp=(id==='p2'&&state.mode==='solo'&&state.bossMode)?300:100; $(`${id}-health`).style.width=`${Math.min(100,Math.max(0,(f.health/maxHp)*100))}%`; $(`${id}-health-text`).textContent=f.health; $(`${id}-meter`).style.width=`${f.meter}%`; $(`${id}-meter-text`).textContent=`${f.meter}%`; } const player=state[state.turn]; $('streak-label').textContent=`連擊 x${player.streak}`; $('ultimate-btn').classList.toggle('locked',player.meter<100); $('ultimate-btn').disabled=player.meter<100; }
function startTimer() { clearInterval(state.timerId); $('timer').textContent=state.time; state.timerId=setInterval(()=>{ if(!state.running)return; state.time--; $('timer').textContent=state.time; if(state.time<=10) $('timer').style.color='#ff9eaa'; if(state.time<=0) finish(state.p1.health>=state.p2.health?'p1':'p2','時間到囉！'); },1000); }
function setTurn(turn) {
  if(!state.running)return; 
  state.resolving=false; 
  state.turn=turn; 
  state.current=null; 
  const actor=state[turn]; 
  $('turn-title').textContent=actor.isCpu?`⚠️ 敵方 [${actor.name}] 算力攻擊中！`: `${actor.name} 的回合：選擇技能`; 
  document.querySelector('.turn-strip').classList.toggle('cpu',actor.isCpu); 
  
  const cmdDeck = document.querySelector('.command-deck');
  const qCard = $('question-card');
  if (cmdDeck) cmdDeck.classList.toggle('cpu-turn-mode', actor.isCpu);
  if (qCard) qCard.classList.toggle('cpu-turn-mode', actor.isCpu);

  $('move-deck').classList.toggle('hidden',actor.isCpu); 
  $('cpu-move-deck').classList.toggle('hidden',!actor.isCpu); 
  if(actor.isCpu)renderCpuMoveDeck(actor); 
  else renderMoveDeck(actor); 
  $('question-card').classList.add('hidden'); 
  $('feedback').textContent=actor.isCpu?'👁️ 敵方 AI 正在評估招式中，請全班全神貫注觀察！':'選擇四種專屬技能之一，答對就能發動攻擊！'; 
  $('feedback').className='feedback'; 
  updateUI(); 
  if(actor.isCpu){ 
    const cpuScene=cpuBattleSceneKey(actor.id); 
    if(cpuScene)playMusicScene(cpuScene); 
    window.setTimeout(cpuMove,difficultyModes[state.difficulty].delay); 
  } else { 
    playMusicScene(battleSceneKey()); 
  } 
}
function balanceOptionLengths(q) {
  if (!q || !q.a || typeof q.correct !== 'number') return q;
  const correctText = q.a[q.correct];
  const correctLen = correctText.length;
  
  const paddingDb = {
    safety: [
      '以防帳密遭到外洩',
      '以確保個人資訊安全',
      '並立即回報師長處理',
      '避免造成系統損害',
      '這是較為妥善的作法',
      '以防造成更大損失',
      '並做好防護措施',
      '以防設備遭到侵害'
    ],
    coding: [
      '以確保程式能順利執行',
      '這在寫程式時很常使用',
      '以方便後續的除錯處理',
      '讓電腦能正確判讀資料',
      '這是常見的程式寫法',
      '以加速程式運行效能',
      '並建立良好的編碼習慣'
    ],
    digital: [
      '並尊重他人的使用權益',
      '以避免造成不必要的誤會',
      '這是合格數位公民的責任',
      '並主動查證消息真實性',
      '以利後續的追蹤查核',
      '這也是很重要的網路禮儀',
      '以保護大家的隱私安全'
    ],
    mixed: [
      '以利日後的檔案管理',
      '這是小組合作的良好習慣',
      '以提升資訊整理的效率',
      '並做好版本控制與標記',
      '這對學習非常有幫助'
    ]
  };

  const unit = q.unit || 'mixed';
  const pool = paddingDb[unit] || paddingDb.mixed;

  q.a = q.a.map((text, idx) => {
    if (idx === q.correct) return text;
    if (correctLen - text.length >= 4) {
      const connector = !/[,，、。！!]$/.test(text) ? '，' : '';
      let bestPadding = pool[0];
      let bestDiff = Infinity;
      
      pool.forEach(pad => {
        const fullLen = text.length + connector.length + pad.length;
        const diff = Math.abs(correctLen - fullLen);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestPadding = pad;
        }
      });
      return text + connector + bestPadding;
    }
    return text;
  });
  return q;
}

function shuffleQuestion(originalQ) {
  if (!originalQ) return originalQ;
  const q = JSON.parse(JSON.stringify(originalQ));
  const originalAnswers = [...q.a];
  const correctText = originalAnswers[q.correct];
  
  for (let i = q.a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q.a[i], q.a[j]] = [q.a[j], q.a[i]];
  }
  
  q.correct = q.a.indexOf(correctText);
  return balanceOptionLengths(q);
}

function getQuestion(level, useRetry=false) {
  if(useRetry&&state.retryQueue.length)return state.retryQueue.shift();
  let pool;
  if (state.unit === 'custom') {
    pool = state.customQuestions.filter(q => q.level === level);
    if (!pool.length) pool = state.customQuestions;
  } else {
    pool = questions.filter(q => q.level===level && (state.unit==='mixed'||q.unit===state.unit||q.unit==='mixed'));
  }
  let unused=pool.filter(q=>!state.used.includes(q));
  if(!unused.length){state.used=[];unused=pool;}
  const q=random(unused);
  state.used.push(q);
  return shuffleQuestion(q);
}
function clearQuestionTimer(){window.clearInterval(state.questionTimerId);state.questionTimerId=null;}
function startQuestionTimer(skill){clearQuestionTimer();let seconds=skill.id==='light'?14:skill.id==='heavy'?17:skill.id==='tactical'?20:24;if(state.bossGlitchActive)seconds=15;const output=$('question-timer');const tick=()=>output.textContent=`⏱ ${seconds}s`;tick();state.questionTimerId=window.setInterval(()=>{seconds--;tick();if(seconds<=0){clearQuestionTimer();answer(-1,true);}},1000);}
function getSkill(actor, skillId) { return skillId==='ultimate' ? { id:'ultimate', name:actor.ultimate.name, damage:actor.ultimate.damage, meterGain:0, questionLevel:'ultimate', label:'專屬大絕' } : actor.skills.find(skill=>skill.id===skillId); }
function moveName(actor, skillId) { return getSkill(actor,skillId).name; }
function moveDamage(actor, skillId) { return getSkill(actor,skillId).damage + Math.min((actor.streak-1)*2,8); }
function focusBattleScene(delay=0) { window.setTimeout(()=>{ const arena=document.querySelector('.arena'); const rect=arena.getBoundingClientRect(); const viewportHeight=window.innerHeight||document.documentElement.clientHeight; if(rect.top>=0 && rect.bottom<=viewportHeight)return; const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches; arena.scrollIntoView({ behavior:reduce?'auto':'smooth', block:'start' }); arena.classList.remove('battle-focus'); void arena.offsetWidth; arena.classList.add('battle-focus'); window.setTimeout(()=>arena.classList.remove('battle-focus'),750); },delay); }
function playUltimateCombo(actor, defender, damage) {
  const stage=document.querySelector('.arena-stage'), callout=$('ultimate-callout'), effects=$('battle-fx');
  const hits=Math.min(9,6+Math.floor(Math.random()*2)+Math.min(actor.streak,2)), color=actor.ultimate.color, intro=560, cadence=390, duration=intro+hits*cadence+760;
  const chunks=Array.from({length:hits},(_,index)=>Math.floor(damage/hits)+(index<damage%hits?1:0));
  const style={coder:'code',guardian:'shield',data:'matrix',creator:'paint','ai-explorer':'neural','green-engineer':'eco','robotics-ace':'mech','cloud-ranger':'cloud',firewall:'shield','noise-beast':'noise','bug-phantom':'glitch','phishing-siren':'wave','cache-golem':'stone','glitch-dragon':'glitch','malware-mimic':'mirror','bot-swarm':'swarm'}[actor.id] || 'code'; stage.dataset.ultimateStyle=style; stage.style.setProperty('--ultimate-color',color); stage.classList.remove('ultimate-showcase'); void stage.offsetWidth; stage.classList.add('ultimate-showcase');
  
  // 啟動電影暗幕與 3D 震撼大字招式
  const overlay = $('cinematic-overlay');
  if (overlay) overlay.classList.add('active');
  const created=[];
  try {
    const ultTitle = document.createElement('div');
    ultTitle.className = 'ultimate-title-3d';
    ultTitle.style.setProperty('--ultimate-color', color);
    ultTitle.textContent = actor.ultimate.name;
    effects.appendChild(ultTitle);
    created.push(ultTitle);
  } catch(e) {}

  // 初始化舞台 3D 變焦變數
  stage.style.setProperty('--stage-fov', '1000px');
  stage.style.setProperty('--stage-rx', '15deg');
  stage.style.setProperty('--stage-ry', '-4deg');
  stage.style.setProperty('--stage-tz', '0px');

  callout.style.setProperty('--ultimate-color',color); callout.querySelector('b').textContent=actor.ultimate.name; callout.querySelector('small').textContent=`準備連招 · 0 / ${hits} HIT`; callout.classList.remove('active'); void callout.offsetWidth; callout.classList.add('active');
  
  const source=actor===state.p1?$('fighter-p1'):$('fighter-p2');
  const target=defender===state.p1?$('fighter-p1'):$('fighter-p2');

  for(let index=0;index<hits;index++){
    const delay=intro+index*cadence, slash=document.createElement('i'); slash.className='ultimate-slash'; slash.style.setProperty('--ultimate-color',color); slash.style.setProperty('--delay',`${delay}ms`); slash.style.setProperty('--rotate',`${index%2?38:-38}deg`); effects.append(slash); created.push(slash);
    
    const isFinish = index === hits - 1;
    const ratio = index / hits;
    const fovVal = Math.round(1000 - ratio * 400); // 1000px -> 600px
    const rxVal = Math.round(15 + ratio * 15); // 15deg -> 30deg
    const ryVal = Math.round(-4 + ratio * 12); // -4deg -> 8deg
    const tzVal = Math.round(ratio * 30); // 0px -> 30px

    // 1. 卡牌 3D 躍起與 3D 運鏡平滑變焦
    window.setTimeout(()=>{
      if(!state.running)return;
      stage.style.setProperty('--stage-fov', `${fovVal}px`);
      stage.style.setProperty('--stage-rx', `${rxVal}deg`);
      stage.style.setProperty('--stage-ry', `${ryVal}deg`);
      stage.style.setProperty('--stage-tz', `${tzVal}px`);

      // 卡牌躍出打擊
      if (isFinish) {
        source.style.transform = `translateZ(160px) rotateY(${actor===state.p1?12:-12}deg) rotateX(-25deg) scale(1.18)`;
      } else {
        const side = index % 2 === 0 ? -1 : 1;
        source.style.transform = `translateX(${actor===state.p1?60:-60}px) translateZ(80px) rotateY(${side*18}deg) rotateX(${side*8}deg)`;
      }
    }, Math.max(0, delay - 140));

    // 2. 命中時間點
    window.setTimeout(()=>{
      if(!state.running)return;
      defender.health=Math.max(0,defender.health-chunks[index]); state.playerStats[fighterKey(actor)].damage+=chunks[index]; updateUI();
      const target=defender===state.p1?$('fighter-p1'):$('fighter-p2'); target.classList.remove('hit'); void target.offsetWidth; target.classList.add('hit');
      
      // 3D 粒子與光刃噴濺
      try {
        const containerRect = $('battle-fx').getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const sparkX = targetRect.left - containerRect.left + targetRect.width / 2;
        const sparkY = targetRect.top - containerRect.top + targetRect.height * 0.45;
        
        if (isFinish) {
          // 最後一擊：觸發 3D 立體光刃與大火花，舞台強烈晃動
          spawn3DSparks(sparkX, sparkY, color, 12, 'slash');
          spawn3DSparks(sparkX, sparkY, color, 65, 'spark');
          stage.classList.add('stage-shake-3d');
          window.setTimeout(() => stage.classList.remove('stage-shake-3d'), 500);
        } else {
          // 一般擊：觸發普通火花
          spawn3DSparks(sparkX, sparkY, color, 12, 'spark');
        }
      } catch(e) {}

      // 卡牌恢復原位
      window.setTimeout(()=>{
        source.style.transform = '';
      }, 200);

      callout.querySelector('small').textContent=`${index+1} / ${hits} HIT · -${chunks[index]} HP`;
      $('combo').textContent=`${index+1} HIT COMBO!`; $('combo').classList.remove('hidden');
      for(let sparkIndex=0;sparkIndex<4;sparkIndex++){const spark=document.createElement('i');spark.className='ultimate-spark';spark.style.setProperty('--ultimate-color',color);spark.style.setProperty('--delay',`${delay+sparkIndex*34}ms`);spark.style.setProperty('--x',`${Math.round((Math.random()-.5)*300)}px`);spark.style.setProperty('--y',`${Math.round((Math.random()-.5)*220)}px`);effects.append(spark);created.push(spark);}
    },delay);
  }
  for(let index=0;index<6;index++){const signature=document.createElement('i');signature.className=`ultimate-signature ${style}`;signature.style.setProperty('--ultimate-color',color);signature.style.setProperty('--delay',`${300+index*360}ms`);signature.style.setProperty('--x',`${(index-2.5)*52}px`);effects.append(signature);created.push(signature);}
  const ring=document.createElement('i'); ring.className='ultimate-ring'; ring.style.setProperty('--ultimate-color',color); effects.append(ring); created.push(ring);
  window.setTimeout(()=>{ $('combo').classList.add('hidden'); callout.querySelector('small').textContent=`${hits} HIT FINISH · ${damage} DAMAGE`; },intro+hits*cadence);
  window.setTimeout(()=>created.forEach(effect=>effect.remove()),duration); window.setTimeout(()=>stage.classList.remove('ultimate-showcase'),duration-220); window.setTimeout(()=>{
    callout.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  },duration);
  return duration;
}
function focusQuestionCard(delay=0) { window.setTimeout(()=>{ const card=$('question-card'), reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches; card.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}); card.classList.remove('question-focus'); void card.offsetWidth; card.classList.add('question-focus'); card.focus({preventScroll:true}); window.setTimeout(()=>card.classList.remove('question-focus'),900); },delay); }
function chooseMove(skillId) { 
  if(!state.running||state.resolving||state.turn!=='p1' && state.mode==='solo')return; 
  const actor=state[state.turn], skill=getSkill(actor,skillId); 
  if(skillId==='ultimate'&&actor.meter<100)return; 
  
  const actorKey = fighterKey(actor);
  const correctCount = state.playerStats[actorKey] ? state.playerStats[actorKey].correct : 0;
  state.bossGlitchActive = state.bossMode && (correctCount === 4 || correctCount === 8);
  
  state.current={skill,q:getQuestion(skill.questionLevel,true)}; 
  const q=state.current.q;
  
  let labelText = `${skill.label} · ${skill.name} · 傷害 ${skill.damage}`;
  if (state.bossGlitchActive) {
    labelText = `🚨 警告：防火牆遭系統入侵！【${skill.name}】`;
  }
  $('question-level').textContent=labelText;
  $('question-count').textContent=state.bossGlitchActive ? `⚠️ 勒索病毒干擾中！` : `已答對 ${correctCount} 題`;
  $('question-text').textContent=q.q; 
  $('answers').innerHTML=q.a.map((answer,index)=>`<button class="answer" data-answer="${index}" type="button"><b>${'ABCD'[index]}.</b> ${answer}</button>`).join(''); 
  $('explain').textContent=state.difficulty==='practice'?difficultyModes.practice.hint:''; 
  
  const card = $('question-card');
  if (state.bossGlitchActive) {
    card.classList.add('boss-glitched');
    $('feedback').textContent = '⚠️ 系統遭受入侵！文字已反轉偏向，必須在 15 秒內完成防禦！';
    $('feedback').className = 'feedback bad';
  } else {
    card.classList.remove('boss-glitched');
    $('feedback').textContent = '題目已就位，選出最合適的答案！';
    $('feedback').className = 'feedback';
  }
  
  card.classList.remove('hidden'); 
  $('move-deck').classList.add('hidden'); 
  startQuestionTimer(skill); 
  focusQuestionCard(100); 
  
  if (state.ttsEnabled && !actor.isCpu && typeof SpeechSynthesisUtterance !== 'undefined') { 
    try { 
      window.speechSynthesis.cancel(); 
      const speakText = `${q.q}。選項A：${q.a[0]}。選項B：${q.a[1]}。選項C：${q.a[2]}。選項D：${q.a[3]}`; 
      const utterance = new SpeechSynthesisUtterance(speakText); 
      utterance.lang = 'zh-TW'; 
      utterance.rate = state.bossGlitchActive ? 1.25 : 1.0;
      window.speechSynthesis.speak(utterance); 
    } catch(e) {} 
  } 
}
function answer(index,timedOut=false) { 
  if(!state.current||!state.running)return; 
  clearQuestionTimer(); 
  try{window.speechSynthesis.cancel();}catch(e){} 
  const {q,skill}=state.current; 
  document.querySelectorAll('.answer').forEach(btn=>btn.disabled=true); 
  const correct=!timedOut&&index===q.correct, selected=document.querySelector(`.answer[data-answer="${index}"]`); 
  if(selected)selected.classList.add(correct?'correct':'wrong'); 
  if(state.turn==='p1'){state.recentResults.push(correct); if(state.recentResults.length>4)state.recentResults.shift();} 
  if(!correct)document.querySelector(`.answer[data-answer="${q.correct}"]`).classList.add('correct'); 
  $('explain').textContent=`💡 ${q.tip}`; 
  const actor=state[state.turn], defender=state.turn==='p1'?state.p2:state.p1, actorKey=fighterKey(actor); 
  let attackRecovery=1600; 
  
  if(correct){
    state.correct++; 
    actor.streak++; 
    defender.streak=0; 
    state.bestStreak=Math.max(state.bestStreak,actor.streak); 
    state.playerStats[actorKey].correct++; 
    state.playerStats[actorKey].bestStreak=Math.max(state.playerStats[actorKey].bestStreak,actor.streak); 
    
    if (state.correct === 1) announceEsportsMatch('first_blood');
    else if (actor.streak === 3) announceEsportsMatch('streak_3');
    else if (actor.streak === 5) announceEsportsMatch('streak_5'); 
    
    let damage=moveDamage(actor,skill.id);
    if(state.bossGlitchActive) {
      damage = damage * 2;
    }
    
    const meterBefore=actor.meter; 
    actor.meter=skill.id==='ultimate'?0:Math.min(100,actor.meter+skill.meterGain); 
    if(actor.meter>=100&&meterBefore<100)playUltimateReadyChime(); 
    
    if(state.bossGlitchActive) {
      $('feedback').textContent = `🛡️ 解毒成功！防火牆恢復正常，對 ${defender.name} 造成雙倍爆擊 ${damage} 點傷害！`;
      $('feedback').className = 'feedback good';
    } else {
      $('feedback').textContent=actor.isCpu?`答對！${actor.name} 發動 ${moveName(actor,skill.id)}！`:`答對！${actor.name} 發動 ${moveName(actor,skill.id)}！`; 
      $('feedback').className='feedback good'; 
    }
    attackRecovery=attack(actor,defender,damage,skill.id); 
  } else {
    actor.streak=0; 
    actor.meter=Math.max(0,actor.meter-8); 
    state.wrongAnswers.push({question:q,selectedIndex:index,timedOut}); 
    
    // 答錯卡牌毀滅性 3D 故障反噬受傷、地震級搖晃、全螢幕紅色故障警報閃爍與 3D 碎裂字元粒子
    const targetCard = actor===state.p1 ? $('fighter-p1') : $('fighter-p2');
    if (targetCard) {
      targetCard.classList.remove('glitch-damage-epic');
      void targetCard.offsetWidth;
      targetCard.classList.add('glitch-damage-epic');
      window.setTimeout(() => targetCard.classList.remove('glitch-damage-epic'), 1200);
    }
    const stage = document.querySelector('.arena-stage');
    if (stage) {
      stage.classList.add('stage-3d', 'stage-earthquake');
      window.setTimeout(() => {
        if (!state.resolving) stage.classList.remove('stage-3d');
        stage.classList.remove('stage-earthquake');
      }, 1200);
    }
    const alarm = $('wrong-alarm-overlay');
    if (alarm) {
      alarm.classList.remove('active');
      void alarm.offsetWidth;
      alarm.classList.add('active');
      window.setTimeout(() => alarm.classList.remove('active'), 1200);
    }
    try {
      const containerRect = $('battle-fx').getBoundingClientRect();
      const targetRect = targetCard.getBoundingClientRect();
      const sparkX = targetRect.left - containerRect.left + targetRect.width / 2;
      const sparkY = targetRect.top - containerRect.top + targetRect.height * 0.45;
      spawn3DSparks(sparkX, sparkY, '#ff3b30', 85, 'shatter');
    } catch(e) {}

    if(state.bossGlitchActive) {
      const selfDmg = 30;
      actor.health = Math.max(0, actor.health - selfDmg);
      $('feedback').textContent = `💀 解毒失敗！系統遭受病毒入侵，您受到了 ${selfDmg} 點資安反噬傷害！`;
      $('feedback').className = 'feedback bad';
      playTone(false);
    } else {
      $('feedback').textContent=timedOut?'時間到！這題先記下來。':'這題先記下來！攻擊沒有命中。'; 
      $('feedback').className='feedback bad'; 
      playTone(false); 
    }
  }
  
  state.bossGlitchActive = false;
  $('question-card').classList.remove('boss-glitched');
  updateUI(); const recovery=correct ? attackRecovery : 1600; window.setTimeout(()=>{ if(!state.running)return; if(state.retryMode&&state.retryQueue.length===0)finish('p1','錯題再練完成！'); else if(defender.health<=0)finish(state.turn); else setTurn(state.turn==='p1'?'p2':'p1'); },recovery);
}
function attack(actor,defender,damage,skillId) { 
  const source=actor===state.p1?$('fighter-p1'):$('fighter-p2'), target=defender===state.p1?$('fighter-p1'):$('fighter-p2'); 
  focusBattleScene(40); 
  source.classList.remove('attack','ultimate'); 
  void source.offsetWidth; 
  source.classList.add(skillId==='ultimate'?'ultimate':'attack'); 
  
  // 3D 舞台透視切換啟用
  const stage = document.querySelector('.arena-stage');
  if(stage) stage.classList.add('stage-3d');

  const blast=document.createElement('i'); 
  blast.className=`blast ${skillId==='heavy'||skillId==='tactical'?'heavy':''} ${skillId==='ultimate'?'ultimate':''}`; 
  
  if(skillId==='ultimate'){
    state.resolving=true;
    $('feedback').textContent='連招施放中，請觀察每一段命中！';
    blast.style.setProperty('--blast-color',actor.ultimate.color); 
    const duration=playUltimateCombo(actor,defender,damage); 
    $('battle-fx').append(blast); 
    window.setTimeout(()=>blast.remove(),duration); 
    
    // 大絕招結束後恢復 3D 舞台
    window.setTimeout(()=>{
      if(stage) stage.classList.remove('stage-3d');
    }, duration);

    playMusicStinger(ultimateSceneKey(actor.id)); 
    playTone(true,skillId,actor.streak); 
    return duration; 
  } 
  
  target.classList.remove('hit'); 
  void target.offsetWidth; 
  target.classList.add('hit'); 
  defender.health=Math.max(0,defender.health-damage); 
  state.playerStats[fighterKey(actor)].damage+=damage; 
  $('battle-fx').append(blast); 
  window.setTimeout(()=>blast.remove(),700); 

  // 普通攻擊的 3D 招式名稱字卡躍出
  try {
    const moveCallout = document.createElement('div');
    moveCallout.className = 'move-name-callout';
    const skillColor = actor.skills.find(s => s.id === skillId)?.color || '#38bdf8';
    moveCallout.style.setProperty('--move-color', skillColor);
    moveCallout.textContent = moveName(actor, skillId);
    
    const containerRect = $('battle-fx').getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const calloutX = sourceRect.left - containerRect.left + sourceRect.width / 2;
    const calloutY = sourceRect.top - containerRect.top + sourceRect.height * 0.15;
    
    moveCallout.style.left = `${calloutX}px`;
    moveCallout.style.top = `${calloutY}px`;
    
    $('battle-fx').appendChild(moveCallout);
    window.setTimeout(() => moveCallout.remove(), 1200);
  } catch(e) {} 
  
  // 一般攻擊的 3D 粒子火花噴濺
  try {
    const containerRect = $('battle-fx').getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const sparkX = targetRect.left - containerRect.left + targetRect.width / 2;
    const sparkY = targetRect.top - containerRect.top + targetRect.height * 0.45;
    const skillColor = actor.skills.find(s => s.id === skillId)?.color || '#ff5a79';
    spawn3DSparks(sparkX, sparkY, skillColor);
  } catch(e) {}

  // 一般攻擊 1600ms 後恢復 3D 舞台
  window.setTimeout(()=>{
    if(stage) stage.classList.remove('stage-3d');
  }, 1600);

  if(actor.streak>=2){
    const combo=$('combo');
    combo.textContent=`${actor.streak} HIT COMBO!`;
    combo.classList.remove('hidden');
    window.setTimeout(()=>combo.classList.add('hidden'),800);
  } 
  playTone(true,skillId,actor.streak); 
  return 1600; 
}
function adaptiveAccuracyDelta(){ const recent=state.recentResults; if(recent.length<3)return 0; const correctCount=recent.filter(Boolean).length; if(correctCount===recent.length)return .08; if(correctCount<=Math.ceil(recent.length*.25))return -.08; return 0; }
function cpuMove(){
  if(!state.running||state.turn!=='p2')return;
  const actor=state.p2;
  $('turn-title').textContent=`${actor.name} 正在讀題思考中…`;
  $('feedback').textContent=`⚡ ${actor.name} 正在分析防火牆題目…`;
  $('feedback').className='feedback cpu-select';
  
  let dots = 1;
  const dotsInterval = setInterval(() => {
    if (state.turn !== 'p2' || !state.running) {
      clearInterval(dotsInterval);
      return;
    }
    dots = (dots % 3) + 1;
    $('feedback').textContent = `⚡ ${actor.name} 正在分析防火牆題目${'.'.repeat(dots)}`;
  }, 500);

  const thinkTime = 1800 + Math.random() * 1200;
  
  window.setTimeout(() => {
    clearInterval(dotsInterval);
    if(!state.running||state.turn!=='p2')return;
    
    const mode=difficultyModes[state.difficulty], profile=actor.cpuProfile,
          weighted=actor.skills.flatMap(skill=>Array(Math.max(1,Math.round(profile[skill.id]*10))).fill(skill)),
          skill=actor.meter>=100&&Math.random()<mode.ultimateChance?getSkill(actor,'ultimate'):random(weighted),
          q=getQuestion(skill.questionLevel),
          base=skill.id==='light'?.78:skill.id==='heavy'?.62:.52,
          correct=Math.random()<Math.min(.9,Math.max(.2,base+profile.accuracy-.65+mode.accuracy+adaptiveAccuracyDelta()));
    
    state.current={skill,q};
    
    // 渲染並顯示 CPU 題目卡，選項設為 disabled 以免玩家誤點
    $('question-level').textContent=`👾 敵方技能：${skill.name} (${skill.label}) · 傷害 ${skill.damage}`;
    $('question-count').textContent=`👁️ 觀察敵方算力中`;
    $('question-text').textContent=q.q;
    $('answers').innerHTML=q.a.map((answer,index)=>`<button class="answer" data-answer="${index}" type="button" disabled><b>${'ABCD'[index]}.</b> ${answer}</button>`).join('');
    $('explain').textContent='🤖 敵方 AI 正在進行核心數據算力分析...（觀察模式：無須作答）';
    $('question-card').classList.remove('hidden');
    $('cpu-move-deck').classList.add('hidden');
    
    $('turn-title').textContent=`⚠️ 警報：${actor.name} 鎖定了 ${skill.name}！`;
    $('feedback').textContent=`👁️ [觀察視角] ${actor.name} 正在編譯答案數據...`;
    
    window.setTimeout(()=>resolveCpuMove(actor,mode,skill,correct), 2000);
  }, thinkTime);
}
function resolveCpuMove(actor,mode,skill,correct){
  if(!state.running||state.turn!=='p2')return;
  const q=state.current.q;
  let recovery=1600;
  
  if(correct){
    actor.streak++;
    state.p1.streak=0;
    state.playerStats.p2.correct++;
    state.playerStats.p2.bestStreak=Math.max(state.playerStats.p2.bestStreak,actor.streak);
    const meterBefore=actor.meter;
    actor.meter=skill.id==='ultimate'?0:Math.min(100,actor.meter+skill.meterGain);
    if(actor.meter>=100&&meterBefore<100)playUltimateReadyChime();
    
    // 亮起正解按鈕並顯示詳解
    const correctBtn = document.querySelector(`.answer[data-answer="${q.correct}"]`);
    if(correctBtn) correctBtn.classList.add('correct');
    $('explain').textContent=`💡 ${q.tip}`;
    
    $('feedback').textContent=`${mode.label} AI 找到正解！${actor.name} 施放 ${skill.name}！`;
    $('feedback').className='feedback good';
    let finalDamage=moveDamage(actor,skill.id);
    if(state.mode==='solo'&&state.bossMode){
      finalDamage=Math.ceil(finalDamage*1.3);
    }
    recovery=attack(actor,state.p1,finalDamage,skill.id);
  } else {
    actor.streak=0;
    
    // 隨機亮出錯誤答案並揭曉正確答案
    const wrongCandidates = [0, 1, 2, 3].filter(i => i !== q.correct);
    const wrongChoice = wrongCandidates[Math.floor(Math.random() * wrongCandidates.length)];
    const wrongBtn = document.querySelector(`.answer[data-answer="${wrongChoice}"]`);
    if(wrongBtn) wrongBtn.classList.add('wrong');
    
    const correctBtn = document.querySelector(`.answer[data-answer="${q.correct}"]`);
    if(correctBtn) correctBtn.classList.add('correct');
    $('explain').textContent=`💡 ${q.tip}`;
    
    // CPU 答錯卡牌 3D 故障反噬受傷、地震級搖晃、警報閃爍與 3D shatter 粒子
    const targetCard = $('fighter-p2');
    if (targetCard) {
      targetCard.classList.remove('glitch-damage-epic');
      void targetCard.offsetWidth;
      targetCard.classList.add('glitch-damage-epic');
      window.setTimeout(() => targetCard.classList.remove('glitch-damage-epic'), 1200);
    }
    const stage = document.querySelector('.arena-stage');
    if (stage) {
      stage.classList.add('stage-3d', 'stage-earthquake');
      window.setTimeout(() => {
        stage.classList.remove('stage-3d');
        stage.classList.remove('stage-earthquake');
      }, 1200);
    }
    const alarm = $('wrong-alarm-overlay');
    if (alarm) {
      alarm.classList.remove('active');
      void alarm.offsetWidth;
      alarm.classList.add('active');
      window.setTimeout(() => alarm.classList.remove('active'), 1200);
    }
    try {
      const containerRect = $('battle-fx').getBoundingClientRect();
      const targetRect = targetCard.getBoundingClientRect();
      const sparkX = targetRect.left - containerRect.left + targetRect.width / 2;
      const sparkY = targetRect.top - containerRect.top + targetRect.height * 0.45;
      spawn3DSparks(sparkX, sparkY, '#ff3b30', 85, 'shatter');
    } catch(e) {}

    $('feedback').textContent=`AI 的資料判讀失誤：${actor.name} 選擇 ${skill.name}，這回合沒有命中！`;
    $('feedback').className='feedback bad';
    playTone(false);
  }
  
  updateUI();
  
  // 給予充足的 3.5 秒時間讓玩家看題與檢討詳解
  window.setTimeout(()=>{
    if(!state.running)return;
    if(state.p1.health<=0)finish('p2');
    else setTurn('p1');
  }, Math.max(recovery, mode.delay, 3500));
}
function renderWrongAnswerReview(){const panel=$('review-panel'), list=$('wrong-answer-list'), retry=$('retry-wrong-btn'), count=$('wrong-answer-count');panel.classList.toggle('hidden',!state.wrongAnswers.length);count.textContent=`${state.wrongAnswers.length} 題`;retry.disabled=!state.wrongAnswers.length;list.innerHTML=state.wrongAnswers.map((entry,index)=>`<article class="wrong-answer"><b>第 ${index+1} 題 · ${entry.question.q}</b><small>${entry.timedOut?'時間到，未作答。':`你的答案：${entry.question.a[entry.selectedIndex]}`}</small><p>正解：${entry.question.a[entry.question.correct]}<br>💡 ${entry.question.tip}</p><em class="competency-tag">📌 ${entry.question.tags.competency}</em></article>`).join('');renderCompetencySummary();}
function renderCompetencySummary(){const chips=$('competency-chips'); const counts=new Map(); state.wrongAnswers.forEach(entry=>{const competency=entry.question.tags.competency; counts.set(competency,(counts.get(competency)||0)+1);}); const entries=[...counts.entries()].sort((a,b)=>b[1]-a[1]); chips.classList.toggle('hidden',entries.length<2); chips.innerHTML=entries.length<2?'':`<small>依能力指標複習：</small>${entries.map(([competency,questionCount])=>`<button class="competency-chip" data-competency-retry="${competency}" type="button">${competency}<b>${questionCount}</b></button>`).join('')}`;}
function startCompetencyRetry(competency){const retryQuestions=state.wrongAnswers.filter(entry=>entry.question.tags.competency===competency).map(entry=>entry.question); if(retryQuestions.length)setupBattle(retryQuestions);}
function renderDuelSummary(winner){const duel=state.mode==='duel', panel=$('duel-summary');panel.classList.toggle('hidden',!duel);if(!duel)return;for(const key of ['p1','p2']){const fighter=state[key],stats=state.playerStats[key];$(`${key}-result-name`).textContent=fighter.name;$(`${key}-result-correct`).textContent=`答對 ${stats.correct} · 連擊 ${stats.bestStreak} · 傷害 ${stats.damage}`;}const highlightKey=state.playerStats.p1.bestStreak===state.playerStats.p2.bestStreak?winner:(state.playerStats.p1.bestStreak>state.playerStats.p2.bestStreak?'p1':'p2'),damageKey=state.playerStats.p1.damage===state.playerStats.p2.damage?winner:(state.playerStats.p1.damage>state.playerStats.p2.damage?'p1':'p2');$('duel-highlight').textContent=`本次表現亮點：${state[highlightKey].name} 最高連擊 x${state.playerStats[highlightKey].bestStreak}；${state[damageKey].name} 造成 ${state.playerStats[damageKey].damage} 點傷害。`;}
function startWrongAnswerRetry(){const retryQuestions=state.wrongAnswers.map(entry=>entry.question);if(retryQuestions.length)setupBattle(retryQuestions);}
function finish(winner, reason='') {
  if(!state.running)return;
  state.running=false;
  clearInterval(state.timerId);
  announceEsportsMatch('victory', { winner: state[winner] ? state[winner].name : '資訊勇者' });
  const solo=state.mode==='solo', won=winner==='p1';
  
  if (solo && state.bossMode) {
    $('result-kicker').textContent=won?'BOSS DEFEATED':'BOSS ENRAGED';
    $('result-icon').textContent=won?'👹':'💀';
    $('result-title').textContent=won?'魔王討伐成功！':'挑戰失敗，再接再厲！';
    $('result-copy').textContent=won?'太厲害了！你運用卓越的資訊素養擊敗了終極魔王，並解鎖了魔王終結者徽章！':'終極魔王的防火牆太穩固了。別灰心，詳研錯題解析是下一次討伐魔王的最強武器！';
  } else {
    $('result-kicker').textContent=solo?(won?'MISSION COMPLETE':'再整理一下資訊力'):'DUEL COMPLETE';
    $('result-icon').textContent=solo?(won?'🏆':'🧩'):'⚔️';
    $('result-title').textContent=solo?(won?'任務成功！':'任務暫停，重新挑戰！'):`${state[winner].name} 獲勝！`;
    $('result-copy').textContent=solo?(won?`${reason?'時間到！':''}你用正確的資訊觀念守護了校園網路。`:'別灰心，每一題的說明都是下一次更強的技能。'):'兩位玩家都完成了資訊力挑戰，看看下方的個別表現吧！';
  }
  
  $('correct-count').textContent=state.playerStats.p1.correct;
  $('best-streak').textContent=state.playerStats.p1.bestStreak;
  $('time-left').textContent=Math.max(0,state.time);
  renderDuelSummary(winner);
  renderWrongAnswerReview();
  renderPrintMeta();
  updateRecords();
  $('result').classList.remove('hidden');
  playMusicScene(solo&&won?'victory':'retry',true);
  playTone(solo&&won,'ultimate');
  syncRecordToConsole();
}
function renderPrintMeta(){const now=new Date(), pad=n=>String(n).padStart(2,'0'), dateStr=`${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`, modeLabel=state.mode==='solo'?'單人闖關':'同桌對戰', names=state.mode==='solo'?state.p1.name:`${state.p1.name} vs ${state.p2.name}`; $('print-meta').textContent=`${unitNames[state.unit]} · ${modeLabel} · ${names} · 列印時間 ${dateStr}`; }
function playTone(good,level='light',streak=0){if(!state.sound)return;try{const ac=new(window.AudioContext||window.webkitAudioContext)(),o=ac.createOscillator(),g=ac.createGain();o.type=good?'sine':'sawtooth';const comboBoost=good?Math.min(streak,6)*18:0;o.frequency.value=(good?(level==='ultimate'?740:level==='heavy'?520:390):145)+comboBoost;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.06,ac.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.22);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.24);}catch(e){}}
function playUltimateReadyChime(){if(!state.sound)return;try{const ac=new(window.AudioContext||window.webkitAudioContext)(),o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(660,ac.currentTime);o.frequency.exponentialRampToValueAtTime(990,ac.currentTime+.18);g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.07,ac.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.5);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.52);}catch(e){}}

async function loadMusicManifest() {
  try { const response = await fetch('assets/audio/audio-manifest.json'); if (response.ok) { music.manifest = await response.json(); if (music.unlocked && music.enabled) playMusicScene(state.running?battleSceneKey():'lobby', true); } }
  catch (error) { console.info('Music manifest is not available yet.', error); }
}
function approvedTrack(scene) { const track = music.manifest?.tracks?.[scene]; return track?.status === 'approved' ? track : null; }
function battleSceneKey(){ const key=`battle-${state.character.id}`; return approvedTrack(key) ? key : 'battle'; }
function cpuBattleSceneKey(cpuId){ const key=`battle-${cpuId}`; return approvedTrack(key) ? key : null; }
function ultimateSceneKey(characterId){ const key=`ultimate-${characterId}`; return approvedTrack(key) ? key : 'ultimate'; }
function stopFallbackMusic() { if (music.fallbackTimer) window.clearInterval(music.fallbackTimer); music.fallbackTimer = null; }
function stopMusic() { stopFallbackMusic(); music.tracks.forEach(audio => audio.pause()); music.currentScene = null; }
function fallbackBeat(scene) {
  stopFallbackMusic(); if (!music.enabled) return;
  const patterns = { lobby:[262,330,392,523], battle:[220,294,330,440,330,294], victory:[523,659,784,1047], retry:[247,220,196] };
  const notes = patterns[scene] || patterns.battle; music.fallbackStep = 0;
  const pulse = () => { if (!music.enabled) return; try { const Ctx = window.AudioContext || window.webkitAudioContext; music.fallbackContext ||= new Ctx(); const ac = music.fallbackContext, osc = ac.createOscillator(), gain = ac.createGain(), note = notes[music.fallbackStep++ % notes.length]; osc.type = scene==='battle' ? 'square' : 'triangle'; osc.frequency.value = note; gain.gain.setValueAtTime(.0001, ac.currentTime); gain.gain.exponentialRampToValueAtTime(.022, ac.currentTime+.012); gain.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+.16); osc.connect(gain).connect(ac.destination); osc.start(); osc.stop(ac.currentTime+.18); } catch (error) {} };
  pulse(); music.fallbackTimer = window.setInterval(pulse, scene.startsWith('battle')?260:420);
}
function playMusicScene(scene, restart=false) {
  if (!music.enabled || !music.unlocked) return; const track = approvedTrack(scene); stopFallbackMusic();
  if (!track) { music.currentScene = scene; fallbackBeat(scene); return; }
  if (music.currentScene === scene && !restart) return; music.tracks.forEach(audio => { audio.pause(); audio.currentTime = 0; });
  let audio = music.tracks.get(scene); if (!audio) { audio = new Audio(track.path); audio.loop = Boolean(track.loop); audio.preload = 'auto'; audio.volume = track.volume ?? .34; music.tracks.set(scene, audio); }
  music.currentScene = scene; audio.currentTime = 0; audio.play().catch(() => fallbackBeat(scene));
}
function playMusicStinger(scene) { const track = approvedTrack(scene); if (!music.enabled || !track) return; const audio = new Audio(track.path); audio.volume = track.volume ?? .46; audio.play().catch(() => {}); }
function unlockMusic() { const wasLocked=!music.unlocked; music.unlocked=true; if (music.enabled && wasLocked) playMusicScene(state.running?battleSceneKey():'lobby', true); updateMusicButtons(); }
function updateMusicButtons(){ const on=music.enabled; const lobbyBtn=$('lobby-sound-btn'); if(lobbyBtn){lobbyBtn.textContent=on?'🎵 BGM 開啟':'🔕 BGM 關閉';lobbyBtn.setAttribute('aria-pressed',String(on));} const battleBtn=$('music-btn'); if(battleBtn){battleBtn.textContent=on?'🎵':'🔕';battleBtn.setAttribute('aria-pressed',String(on));} }
function toggleMusicMute(){ music.enabled=!music.enabled; if(!music.enabled)stopMusic(); else playMusicScene(state.running?battleSceneKey():'lobby',true); updateMusicButtons(); }
function showLobby() { state.running=false; clearInterval(state.timerId); stopMusic(); $('result').classList.add('hidden'); $('battle').classList.add('hidden'); $('lobby').classList.remove('hidden'); playMusicScene('lobby', true); }

document.addEventListener('click',(event)=>{const mode=event.target.closest('[data-mode]');if(mode){state.mode=mode.dataset.mode;choose('[data-mode]',state.mode,'mode');renderRoster();}const difficulty=event.target.closest('[data-difficulty]');if(difficulty){state.difficulty=difficulty.dataset.difficulty;choose('[data-difficulty]',state.difficulty,'difficulty');}const roundTime=event.target.closest('[data-round-time]');if(roundTime){state.roundTime=Number(roundTime.dataset.roundTime);choose('[data-round-time]',roundTime.dataset.roundTime,'roundTime');}const unit=event.target.closest('[data-unit]');if(unit){state.unit=unit.dataset.unit;choose('[data-unit]',state.unit,'unit');}const hero=event.target.closest('[data-hero]');if(hero){state.character=characters.find(c=>c.id===hero.dataset.hero);renderRoster();}const hero2=event.target.closest('[data-hero-p2]');if(hero2){state.character2=characters.find(c=>c.id===hero2.dataset.heroP2);renderRoster();}const move=event.target.closest('[data-move]');if(move)chooseMove(move.dataset.move);const answerBtn=event.target.closest('[data-answer]');if(answerBtn)answer(Number(answerBtn.dataset.answer));const competencyBtn=event.target.closest('[data-competency-retry]');if(competencyBtn)startCompetencyRetry(competencyBtn.dataset.competencyRetry);});
document.addEventListener('pointerdown',unlockMusic,{once:true,capture:true});document.addEventListener('keydown',unlockMusic,{once:true,capture:true});
$('lobby-sound-btn').addEventListener('click',function initialEnable(){ unlockMusic(); this.removeEventListener('click',initialEnable); this.addEventListener('click',toggleMusicMute); },{once:true});
$('music-btn').addEventListener('click',toggleMusicMute);

function updateTtsButton(){
  const on=state.ttsEnabled;
  const btn=$('lobby-tts-btn');
  if(btn){
    btn.textContent=on?'🗣️ 朗讀開啟':'🔇 朗讀關閉';
    btn.setAttribute('aria-pressed',String(on));
    btn.classList.toggle('active', on);
  }
}
if ($('lobby-tts-btn')) {
  $('lobby-tts-btn').addEventListener('click', () => {
    state.ttsEnabled = !state.ttsEnabled;
    updateTtsButton();
  });
  updateTtsButton();
}
function initCloudSync() {
  const loginBtn = $('cloud-login-btn');
  const logoutBtn = $('cloud-logout-btn');
  const profileEl = $('cloud-profile');
  const avatarEl = $('cloud-avatar');
  
  if (!loginBtn || !logoutBtn || !profileEl || !avatarEl) return;
  
  if (!supabaseClient) {
    loginBtn.style.display = 'none';
    return;
  }
  
  loginBtn.addEventListener('click', async () => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
    } catch (e) {
      console.error('OAuth 登入出錯', e);
    }
  });
  
  logoutBtn.addEventListener('click', async () => {
    try {
      await supabaseClient.auth.signOut();
      state.user = null;
      loginBtn.classList.remove('hidden');
      profileEl.classList.add('hidden');
      renderBestRecord();
      renderBadgeShelf();
    } catch (e) {
      console.error('登出出錯', e);
    }
  });
  
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      state.user = session.user;
      loginBtn.classList.add('hidden');
      profileEl.classList.remove('hidden');
      avatarEl.src = session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.email)}`;
      await syncFromCloud();
    } else {
      state.user = null;
      loginBtn.classList.remove('hidden');
      profileEl.classList.add('hidden');
    }
  });
}

$('launch-btn').addEventListener('click',()=>setupBattle());$('back-btn').addEventListener('click',showLobby);$('retry-btn').addEventListener('click',()=>setupBattle());$('retry-wrong-btn').addEventListener('click',startWrongAnswerRetry);$('print-report-btn').addEventListener('click',()=>window.print());$('reset-record-btn').addEventListener('click',resetRecords);$('lobby-btn').addEventListener('click',showLobby);$('sound-btn').addEventListener('click',()=>{state.sound=!state.sound;$('sound-btn').textContent=state.sound?'🔊':'🔇';$('sound-btn').setAttribute('aria-pressed',String(state.sound));});loadMusicManifest();renderRoster();renderBestRecord();renderBadgeShelf();initEdTechFeatures();initCloudSync();

// EdTech 課堂看板與自訂題庫功能實作
function syncRecordToConsole() {
  if (!state.gasUrl) return;
  const payload = {
    className: state.className,
    name: state.p1.name,
    team: state.p1.team || "",
    correct: state.playerStats.p1.correct,
    bestStreak: state.playerStats.p1.bestStreak,
    damage: state.playerStats.p1.damage,
    wrongCount: state.wrongAnswers.length,
    wrongList: state.wrongAnswers.map(w => ({
      q: w.question.q,
      a: w.question.a,
      correct: w.question.correct,
      userAnswer: w.selectedIndex,
      tip: w.question.tip
    }))
  };

  fetch(state.gasUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).then(() => {
    console.info('對戰成績已同步至課堂看板 🟢');
  }).catch(err => {
    console.error('同步看板失敗：', err);
  });
}

function initEdTechFeatures() {
  const params = new URLSearchParams(window.location.search);
  const b64Gas = params.get('gas');
  const cls = params.get('class');
  const teamsParam = params.get('teams');
  
  if (b64Gas) {
    try {
      state.gasUrl = atob(decodeURIComponent(b64Gas));
      localStorage.setItem('smes-battle-gas-url', state.gasUrl);
    } catch (e) {
      console.error('GAS URL 解碼失敗：', e);
    }
  } else {
    state.gasUrl = localStorage.getItem('smes-battle-gas-url') || '';
  }
  
  if (cls) {
    state.className = decodeURIComponent(cls);
    localStorage.setItem('smes-battle-class-name', state.className);
  } else {
    state.className = localStorage.getItem('smes-battle-class-name') || '501';
  }
  
  if (teamsParam) {
    state.teamMode = decodeURIComponent(teamsParam);
    localStorage.setItem('smes-battle-team-mode', state.teamMode);
  } else {
    state.teamMode = localStorage.getItem('smes-battle-team-mode') || 'none';
  }
  
  state.isConsoleConnected = Boolean(state.gasUrl);

  // 初始化大廳組別選單選項
  if (state.teamMode !== 'none') {
    const teams = state.teamMode === 'redblue' ? ['紅隊', '藍隊'] : ['第1組', '第2組', '第3組', '第4組', '第5組', '第6組'];
    const p1Select = $('p1-team-select');
    const p2Select = $('p2-team-select');
    if (p1Select && p2Select) {
      const optionsHtml = teams.map(t => `<option value="${t}">${t}</option>`).join('');
      p1Select.innerHTML = optionsHtml;
      p2Select.innerHTML = optionsHtml;
      
      p1Select.value = localStorage.getItem('smes-battle-p1-team') || teams[0];
      p2Select.value = localStorage.getItem('smes-battle-p2-team') || teams[0];
    }
  }
  
  // 載入座號姓名快取
  if ($('p1-name-input')) {
    $('p1-name-input').value = localStorage.getItem('smes-battle-p1-name') || '';
  }
  if ($('p2-name-input')) {
    $('p2-name-input').value = localStorage.getItem('smes-battle-p2-name') || '';
  }
  
  // 載入自訂題庫
  try {
    const custom = JSON.parse(localStorage.getItem('smes-custom-questions'));
    if (Array.isArray(custom)) {
      state.customQuestions = custom;
    }
  } catch (e) {}
  
  // 載入 Gemini API Key
  if ($('gemini-key-input')) {
    $('gemini-key-input').value = localStorage.getItem('smes-gemini-key') || '';
  }
  
  updateConsoleStatusUI();
  updateCustomUnitButton();
  initCustomQuizListeners();
  
  const bossParam = params.get('mode');
  if (bossParam === 'boss') {
    state.bossMode = true;
    localStorage.setItem('smes-battle-boss-mode', 'true');
  } else if (bossParam === 'normal') {
    state.bossMode = false;
    localStorage.setItem('smes-battle-boss-mode', 'false');
  } else {
    state.bossMode = localStorage.getItem('smes-battle-boss-mode') === 'true';
  }
  
  const bossToggle = $('boss-mode-toggle');
  if (bossToggle) {
    bossToggle.checked = state.bossMode;
    bossToggle.addEventListener('change', () => {
      state.bossMode = bossToggle.checked;
      localStorage.setItem('smes-battle-boss-mode', String(state.bossMode));
    });
  }
  
  if (state.bossMode) {
    const copyEl = document.querySelector('.hero-copy');
    if (copyEl) {
      copyEl.innerHTML = '👹 <b>全班 Raid Boss 戰開啟！</b>你的每一次正確答題傷害，都將累積並直接扣減大螢幕上巨型 Boss 的血量，一起集火守護網路世界吧！';
    }
  }
}

function updateConsoleStatusUI() {
  const el = $('console-status-badge');
  if (!el) return;
  if (state.isConsoleConnected) {
    el.textContent = `🟢 已連線至 [${state.className}] 班級看板`;
    el.className = 'console-status-badge connected';
  } else {
    el.textContent = `⚪ 自主練習`;
    el.className = 'console-status-badge';
  }
}

function updateCustomUnitButton() {
  const btn = $('custom-unit-btn');
  if (!btn) return;
  if (state.customQuestions && state.customQuestions.length > 0) {
    let subject = '自訂題庫';
    if (state.customQuestions[0] && state.customQuestions[0].customTitle) {
      subject = state.customQuestions[0].customTitle;
    }
    btn.innerHTML = `<span>✨</span>[自訂] ${subject}`;
    btn.classList.remove('hidden');
    unitNames.custom = `[自訂] ${subject}`;
  } else {
    btn.classList.add('hidden');
    if (state.unit === 'custom') {
      state.unit = 'mixed';
      choose('[data-unit]', 'mixed', 'unit');
    }
  }
}

function initCustomQuizListeners() {
  const modal = $('custom-quiz-modal');
  if (!modal) return;
  
  // 開關 Modal
  $('custom-quiz-btn').addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  $('modal-close-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Tab 切換
  modal.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-modal-tab');
      modal.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      modal.querySelectorAll('.modal-tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `modal-tab-${tab}`);
      });
    });
  });

  // JSON 匯入
  $('import-json-btn').addEventListener('click', () => {
    const raw = $('json-textarea').value.trim();
    if (!raw) return alert('請貼上 JSON 題目資料！');
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) throw new Error('題庫格式必須是 JSON 陣列！');
      saveCustomQuestions(data, '貼上之 JSON 題庫');
    } catch(e) {
      alert('解析失敗：' + e.message);
    }
  });

  // CSV 匯入
  $('import-csv-btn').addEventListener('click', () => {
    const fileInput = $('csv-file-input');
    const file = fileInput.files[0];
    if (!file) return alert('請選擇 CSV 檔案！');
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const text = e.target.result;
        const data = parseCSV(text);
        if (!data.length) throw new Error('未能成功解析任何題目，請檢查 CSV 欄位與編碼！');
        saveCustomQuestions(data, file.name.replace('.csv', ''));
      } catch(err) {
        alert('CSV 解析錯誤：' + err.message);
      }
    };
    reader.readAsText(file, 'utf-8');
  });

  // URL 載入
  $('import-url-btn').addEventListener('click', () => {
    const url = $('url-input').value.trim();
    if (!url) return alert('請輸入題庫 URL！');
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error('格式不符合 JSON 陣列！');
        saveCustomQuestions(data, '遠端 URL 題庫');
      })
      .catch(err => {
        alert('下載或解析失敗：' + err.message);
      });
  });

  // AI 智慧出題
  $('generate-ai-quiz-btn').addEventListener('click', async () => {
    const key = $('gemini-key-input').value.trim();
    const subject = $('ai-subject-input').value.trim();
    const count = parseInt($('ai-count-select').value) || 10;
    
    if (!key) return alert('請輸入您的 Gemini API Key！');
    if (!subject) return alert('請輸入出題主題！');
    
    localStorage.setItem('smes-gemini-key', key);
    
    const btn = $('generate-ai-quiz-btn');
    const originalText = btn.textContent;
    btn.textContent = '🧠 AI 出題中，請稍候約 5-10 秒...';
    btn.disabled = true;
    
    const prompt = getAiQuizPrompt(subject, count);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });
      
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error?.message || 'Gemini 呼叫失敗！');
      }
      
      const resData = await response.json();
      let rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      rawText = rawText.replace(/```json/i, '').replace(/```/g, '').trim();
      
      const quiz = JSON.parse(rawText);
      if (!Array.isArray(quiz)) throw new Error('AI 回傳格式不符合 JSON 陣列！');
      
      quiz.forEach(q => {
        q.unit = 'custom';
        q.customTitle = subject;
        q.tags = { grade: '三至六年級', competency: '自訂領域', misconception: '自訂迷思' };
      });
      
      saveCustomQuestions(quiz, subject);
      alert(`🎉 成功！AI 已為您生成 ${quiz.length} 題「${subject}」對戰題庫！`);
    } catch(err) {
      alert('AI 出題失敗：' + err.message);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  // 複製黃金 Prompt
  $('copy-gold-prompt-btn').addEventListener('click', () => {
    const subject = $('ai-subject-input').value.trim() || '自訂主題';
    const count = $('ai-count-select').value;
    const prompt = getAiQuizPrompt(subject, count);
    
    navigator.clipboard.writeText(prompt);
    alert('黃金 Prompt 已成功複製至剪貼簿！可直接貼給任何 AI 生成 JSON 後回來貼上。');
  });
}

function getAiQuizPrompt(subject, count) {
  return `你是一位專業的小學老師。請為「${subject}」單元生成符合「答題快打」對戰遊戲格式的對選題庫，一共需要生成 ${count} 題。
  
【難度分配要求】：
- 輕招 (level: 'light')：佔全部題數的 40% (基礎題)。
- 重招 (level: 'heavy')：佔全部題數 the 30% (進階題)。
- 戰術招 (level: 'tactical')：佔全部題數的 20% (觀念思維題)。
- 終極大絕 (level: 'ultimate')：佔全部題數的 10% (高難度挑戰題)。

【輸出格式】：
你必須且只能回傳一個乾淨的 JSON 陣列，不需要任何 markdown 包裝（如 \`\`\`json 標記）。
陣列中每個題目物件必須包含以下鍵值：
- unit: 必須固定為字串 "custom"
- customTitle: 必須固定為字串 "${subject}" (即您所出的單元名稱)
- level: 題目難度層次，字串 light、heavy、tactical 或 ultimate 之一
- q: 題目敘述文字
- a: 選項陣列，固定包含 4 個字串選項
- correct: 正確選項的索引 (0 到 3 之間的整數，代表選項 a 中的位置)
- tip: 給學生的錯題詳解說明與提示，不超過 40 個字

【JSON 結構範例】：
[
  {
    "unit": "custom",
    "customTitle": "${subject}",
    "level": "light",
    "q": "這是一題基礎題？",
    "a": ["選項一", "選項二", "選項三", "選項四"],
    "correct": 1,
    "tip": "這是這題的解析與教學提示。"
  }
]`;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  let customTitle = 'CSV匯入';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    // 排除標題列
    if (i === 0 && (fields[0].includes('主題') || fields[2].includes('題目'))) {
      continue;
    }
    
    if (fields.length >= 8) {
      const options = [fields[3], fields[4], fields[5], fields[6]].filter(Boolean);
      if (options.length < 2) continue;
      
      const qTitle = fields[0] || '自訂主題';
      customTitle = qTitle !== 'custom' ? qTitle : 'CSV題庫';
      
      result.push({
        unit: 'custom',
        customTitle: customTitle,
        level: fields[1] || 'light',
        q: fields[2],
        a: options,
        correct: parseInt(fields[7]) || 0,
        tip: fields[8] || '答題解析提示。'
      });
    }
  }
  
  result.forEach(q => {
    q.customTitle = customTitle;
  });
  
  return result;
}

function saveCustomQuestions(data, title) {
  data.forEach(q => {
    q.unit = 'custom';
    q.customTitle = title;
    q.tags = { grade: '三至六年級', competency: '自訂領域', misconception: '自訂複習' };
  });

  state.customQuestions = data;
  localStorage.setItem('smes-custom-questions', JSON.stringify(data));
  updateCustomUnitButton();
  
  state.unit = 'custom';
  choose('[data-unit]', 'custom', 'unit');
  
  $('custom-quiz-modal').classList.add('hidden');
  alert(`題庫「${title}」已成功匯入！現已切換至該題庫。`);
}

function spawn3DSparks(x, y, color, count, type = 'spark') {
  const container = $('battle-fx');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-3d-sparks';
  container.appendChild(canvas);

  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const particles = [];
  const particleCount = count || (45 + Math.floor(Math.random() * 15));
  const centerX = x;
  const centerY = y;
  const fov = 350;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    let speed = 2 + Math.random() * 6;
    if (type === 'slash') speed = 4 + Math.random() * 8;
    else if (type === 'shatter') speed = 1.5 + Math.random() * 5.5;

    let vx = Math.cos(angle) * speed * (0.8 + Math.random() * 0.4);
    let vy = (Math.sin(angle) * speed - (type === 'slash' ? 2 : 1 + Math.random() * 4)) * (0.8 + Math.random() * 0.4);
    let vz = type === 'slash' ? (-5 - Math.random() * 15) : (-3 - Math.random() * 10);
    
    if (type === 'shatter') {
      vx = (Math.random() - 0.5) * speed * 2.2;
      vy = (Math.random() - 0.5) * speed * 2 - 2;
      vz = -2 - Math.random() * 8;
    }

    const dx = type === 'slash' ? (Math.random() - 0.5) * 80 : 0;
    const dy = type === 'slash' ? (Math.random() - 0.5) * 80 : 0;
    const dz = type === 'slash' ? (Math.random() - 0.5) * 60 : 0;

    let size = 2.5 + Math.random() * 3.5;
    if (type === 'slash') size = 1.5 + Math.random() * 2.5;
    else if (type === 'shatter') size = 6 + Math.random() * 7;

    let life = 0.9 + Math.random() * 0.5;
    if (type === 'slash') life = 0.6 + Math.random() * 0.4;
    else if (type === 'shatter') life = 0.7 + Math.random() * 0.5;

    particles.push({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: 0,
      vx,
      vy,
      vz,
      dx,
      dy,
      dz,
      size,
      life,
      maxLife: life,
      color: color || '#ff5a79',
      rotation: type === 'shatter' ? Math.random() * Math.PI * 2 : 0,
      rotSpeed: type === 'shatter' ? (Math.random() - 0.5) * 0.25 : 0,
      charType: type === 'shatter' ? (Math.random() < 0.55 ? 'block' : ['ERR', 'BUG', '💀', '⚡', '⚠', '0', '1'][Math.floor(Math.random() * 7)]) : null
    });
  }

  let animationId;
  const gravity = type === 'slash' ? 0.05 : 0.12;

  function render() {
    ctx.clearRect(0, 0, rect.width, rect.height);
    let activeParticles = 0;

    particles.forEach(p => {
      if (p.life <= 0) return;

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.vy += gravity;

      p.life -= 0.016;
      activeParticles++;

      if (p.z <= -fov) {
        p.life = 0;
        return;
      }

      const scale = fov / (fov + p.z);
      const screenX = centerX + p.x * scale;
      const screenY = centerY + p.y * scale;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;

      if (type === 'slash') {
        const scale2 = fov / (fov + p.z + p.dz);
        const screenX2 = centerX + (p.x + p.dx) * scale2;
        const screenY2 = centerY + (p.y + p.dy) * scale2;

        const lineWidth = p.size * scale;
        if (lineWidth > 35 || screenX < -150 || screenX > rect.width + 150 || screenY < -150 || screenY > rect.height + 150) {
          p.life = 0;
          return;
        }

        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX2, screenY2);
        
        ctx.strokeStyle = p.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.shadowBlur = Math.max(3, 10 * scale);
        ctx.shadowColor = p.color;
        ctx.stroke();
      } else if (type === 'shatter') {
        const side = p.size * scale;
        if (side > 90 || screenX < -120 || screenX > rect.width + 120 || screenY < -120 || screenY > rect.height + 120) {
          p.life = 0;
          return;
        }
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = Math.max(2, 8 * scale);
        ctx.shadowColor = p.color;
        
        if (p.charType === 'block') {
          ctx.fillRect(-side / 2, -side / 2, side, side);
        } else {
          ctx.font = `900 ${side * 1.3}px 'Outfit', 'Inter', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.charType, 0, 0);
        }
        ctx.restore();
      } else {
        const radius = p.size * scale;
        if (radius > 80 || screenX < -100 || screenX > rect.width + 100 || screenY < -100 || screenY > rect.height + 100) {
          p.life = 0;
          return;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = Math.max(2, 6 * scale);
        ctx.shadowColor = p.color;
        ctx.fill();
      }
    });

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    if (activeParticles > 0 && canvas.parentNode) {
      animationId = requestAnimationFrame(render);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    cancelAnimationFrame(animationId);
    if (canvas.parentNode) {
      canvas.remove();
    }
  }

  setTimeout(cleanup, 2000);
  animationId = requestAnimationFrame(render);
}

/* 天賦樹與圖鑑系統 (P1-1 & P1-3) 及 TTS/注音 (P0-9) */
const TALENTS_KEY = 'smes-quiz-talents';
function loadTalents() {
  try {
    const saved = JSON.parse(localStorage.getItem(TALENTS_KEY));
    if (saved && typeof saved === 'object') return { shield_wall: false, swift_decoder: false, critical_combo: false, energy_overdrive: false, ...saved };
  } catch(e) {}
  return { shield_wall: false, swift_decoder: false, critical_combo: false, energy_overdrive: false };
}

function saveTalents(talents) {
  try {
    localStorage.setItem(TALENTS_KEY, JSON.stringify(talents));
  } catch(e) {}
}

state.talents = loadTalents();

function renderTalentsUI() {
  const pointsHud = $('talent-points-count');
  const unlockedHud = $('talents-unlocked-count');
  const records = loadRecords();
  const totalPoints = Math.max(1, Math.floor((records.battles || 0) / 2) + (records.badges ? records.badges.length : 0));
  const unlocked = Object.values(state.talents).filter(Boolean).length;
  const availablePoints = Math.max(0, totalPoints - unlocked);

  if (pointsHud) pointsHud.textContent = availablePoints;
  if (unlockedHud) unlockedHud.textContent = `${unlocked} / 4`;

  document.querySelectorAll('.talent-card').forEach(card => {
    const key = card.dataset.talent;
    const btn = card.querySelector('.talent-toggle-btn');
    const isUnlocked = state.talents[key];

    if (isUnlocked) {
      card.style.borderColor = '#10b981';
      card.style.background = 'rgba(16, 185, 129, 0.15)';
      if (btn) {
        btn.textContent = '已解鎖 ✓';
        btn.style.background = '#059669';
      }
    } else {
      card.style.borderColor = '#334155';
      card.style.background = '#0c2b48';
      if (btn) {
        btn.textContent = availablePoints > 0 ? '解鎖 (1點)' : '點數不足';
        btn.style.background = availablePoints > 0 ? '#10b981' : '#475569';
      }
    }
  });
}

function toggleTalent(key) {
  const records = loadRecords();
  const totalPoints = Math.max(1, Math.floor((records.battles || 0) / 2) + (records.badges ? records.badges.length : 0));
  const unlocked = Object.values(state.talents).filter(Boolean).length;
  const availablePoints = Math.max(0, totalPoints - unlocked);

  if (state.talents[key]) {
    state.talents[key] = false;
  } else if (availablePoints > 0) {
    state.talents[key] = true;
  } else {
    alert('天賦點數不足！請多完成挑戰或解鎖成就徽章來獲得點數！');
    return;
  }
  saveTalents(state.talents);
  renderTalentsUI();
}

function renderGalleryUI() {
  const grid = $('gallery-grid');
  if (!grid) return;
  const allProfiles = [...characters, ...cpuEnemies];
  grid.innerHTML = allProfiles.map(p => `
    <div class="gallery-card" style="background:#0c2b48; border:1px solid #38bdf8; border-radius:12px; padding:10px; text-align:center; position:relative; overflow:hidden;">
      <div style="font-size:36px; margin-bottom:4px;">${p.icon || '🤖'}</div>
      <b style="color:#fff; font-size:13px; display:block;">${p.name}</b>
      <small style="color:#38bdf8; font-size:10px; display:block; margin-top:2px;">${p.skill || '獨門招式'}</small>
      <button class="gallery-preview-btn" onclick="playTone(true, 'light', 1)" style="margin-top:6px; background:rgba(56,189,248,0.2); border:1px solid #38bdf8; color:#fff; padding:2px 8px; border-radius:10px; font-size:10px; cursor:pointer;">試聽招式</button>
    </div>
  `).join('');
}

/* 語音朗讀 (TTS) 與無障礙注音 (P0-9) */
function speakQuestionText() {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器不支援 Web Speech 語音朗讀功能');
    return;
  }
  window.speechSynthesis.cancel();
  const q = state.current ? state.current.q : (state.questions ? state.questions[state.qIndex] : null);
  if (!q) return;
  const optionsText = q.a.map((opt, idx) => `選項 ${['A','B','C','D'][idx]}：${opt}`).join('。');
  const fullText = `題目：${q.q}。${optionsText}`;
  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = 'zh-TW';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

function toggleZhuyinMode() {
  state.zhuyinEnabled = !state.zhuyinEnabled;
  const btn = $('question-zhuyin-btn');
  const card = $('question-card');
  if (btn) {
    btn.textContent = state.zhuyinEnabled ? 'ㄅ注音:開' : 'ㄅ注音';
    btn.style.background = state.zhuyinEnabled ? '#8b5cf6' : 'rgba(139,92,246,0.2)';
  }
  if (card) {
    card.classList.toggle('zhuyin-mode', state.zhuyinEnabled);
  }
}

// 綁定大廳天賦與圖鑑彈窗事件
document.addEventListener('DOMContentLoaded', () => {
  const talentBtn = $('talent-btn');
  const galleryBtn = $('gallery-btn');
  const talentModal = $('talent-modal');
  const galleryModal = $('gallery-modal');

  if (talentBtn && talentModal) {
    talentBtn.addEventListener('click', () => {
      renderTalentsUI();
      talentModal.classList.remove('hidden');
    });
  }
  if ($('close-talent-modal') && talentModal) {
    $('close-talent-modal').addEventListener('click', () => talentModal.classList.add('hidden'));
  }
  if (galleryBtn && galleryModal) {
    galleryBtn.addEventListener('click', () => {
      renderGalleryUI();
      galleryModal.classList.remove('hidden');
    });
  }
  if ($('close-gallery-modal') && galleryModal) {
    $('close-gallery-modal').addEventListener('click', () => galleryModal.classList.add('hidden'));
  }

  document.querySelectorAll('.talent-card').forEach(card => {
    card.addEventListener('click', () => toggleTalent(card.dataset.talent));
  });

  const ttsBtn = $('question-tts-btn');
  const zhuyinBtn = $('question-zhuyin-btn');
  if (ttsBtn) ttsBtn.addEventListener('click', speakQuestionText);
  if (zhuyinBtn) zhuyinBtn.addEventListener('click', toggleZhuyinMode);

  // P0-18 頒獎台與證書 Event Bindings
  const podiumBtn = $('podium-btn');
  const podiumModal = $('mvp-podium-modal');
  const certModal = $('certificate-modal');

  if (podiumBtn && podiumModal) {
    podiumBtn.addEventListener('click', () => {
      renderPodiumUI();
      podiumModal.classList.remove('hidden');
    });
  }
  if ($('close-podium-btn') && podiumModal) {
    $('close-podium-btn').addEventListener('click', () => podiumModal.classList.add('hidden'));
  }
  if ($('open-cert-btn') && certModal) {
    $('open-cert-btn').addEventListener('click', () => {
      renderCertificateUI();
      if (podiumModal) podiumModal.classList.add('hidden');
      certModal.classList.remove('hidden');
    });
  }
  if ($('close-cert-btn') && certModal) {
    $('close-cert-btn').addEventListener('click', () => certModal.classList.add('hidden'));
  }
  if ($('do-print-cert-btn')) {
    $('do-print-cert-btn').addEventListener('click', () => window.print());
  }
});

// 🎙️ P0-17：全班沉浸式 AI 戰況主播語音即時播報
function announceEsportsMatch(event, detail = {}) {
  if (!('speechSynthesis' in window)) return;
  
  const textMap = {
    first_blood: '🔥 率先發動打擊！拿下第一分！',
    streak_3: '🔥 三連爆擊！手感發燙！',
    streak_5: '⚡ 五連神級爆擊！全場震撼！',
    clash: '⚔️ 雙方同時開大！進入極限拼刀對決模式！',
    reversal: '🛡️ 絕境大逆轉！鎖血反擊！',
    victory: `👑 比賽結束！恭喜 ${detail.winner || '玩家'} 贏得本場競賽！`
  };

  const text = textMap[event];
  if (!text) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.15;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } catch(e) {
    console.warn('AI 主播廣播發聲失敗:', e);
  }
}

// ⚔️ P0-16：雙人對戰拼刀對決模式 (Clash Mode)
let clashState = { active: false, p1Val: 50, timerId: null, timeLeft: 8 };

function triggerClashMode() {
  if (clashState.active) return;
  clashState.active = true;
  clashState.p1Val = 50;
  clashState.timeLeft = 8;

  const overlay = $('clash-overlay');
  if (overlay) overlay.classList.remove('hidden');

  announceEsportsMatch('clash');

  clearInterval(clashState.timerId);
  clashState.timerId = setInterval(() => {
    clashState.timeLeft--;
    if ($('clash-time')) $('clash-time').textContent = clashState.timeLeft;
    
    if (clashState.timeLeft <= 0) {
      clearInterval(clashState.timerId);
      resolveClashResult();
    }
  }, 1000);
}

function updateClashBar(p1Delta) {
  if (!clashState.active) return;
  clashState.p1Val = Math.min(90, Math.max(10, clashState.p1Val + p1Delta));
  const bar1 = $('clash-bar-p1');
  const spark = $('clash-spark-head');
  if (bar1) bar1.style.width = `${clashState.p1Val}%`;
  if (spark) spark.style.left = `${clashState.p1Val}%`;
}

function resolveClashResult() {
  clashState.active = false;
  const overlay = $('clash-overlay');
  if (overlay) overlay.classList.add('hidden');

  const winner = clashState.p1Val >= 50 ? 'p1' : 'p2';
  const winnerActor = state[winner];
  const loserActor = state[winner === 'p1' ? 'p2' : 'p1'];

  const dmg = 85;
  loserActor.health = Math.max(0, loserActor.health - dmg);
  
  spawn3DSparks(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24', 85, 'shatter');
  announceEsportsMatch('reversal', { winner: winnerActor.name });
  updateUI();
}

// 🏆 P0-18：MVP 3D 金銀銅頒獎台與小勇者證書
function renderPodiumUI() {
  const p1Name = state.p1 ? state.p1.name : '玩家 1';
  const p2Name = state.p2 ? state.p2.name : (state.mode === 'solo' ? '駕駛艙 AI' : '玩家 2');
  
  if ($('podium-p1-name')) $('podium-p1-name').textContent = p1Name;
  if ($('podium-p2-name')) $('podium-p2-name').textContent = p2Name;
  if ($('podium-p3-name')) $('podium-p3-name').textContent = '挑戰怪獸';
}

function renderCertificateUI() {
  const name = state.p1 ? state.p1.name : '資訊勇者';
  const total = state.answers ? state.answers.length : 1;
  const correct = state.answers ? state.answers.filter(a => a.correct).length : 1;
  const acc = Math.round((correct / Math.max(1, total)) * 100);
  
  if ($('cert-student-name')) $('cert-student-name').textContent = name;
  if ($('cert-diff')) $('cert-diff').textContent = state.difficulty === 'hard' ? '極限霸主' : (state.difficulty === 'easy' ? '基礎關卡' : '普通挑戰');
  if ($('cert-acc')) $('cert-acc').textContent = `${acc}%`;
  if ($('cert-streak')) $('cert-streak').textContent = `${state.p1.bestStreak || 0} 連爆擊`;
  
  let title = '資訊科技小達人';
  if (acc === 100) title = '神級資安防禦大師';
  else if (state.p1.bestStreak >= 5) title = '連擊破壞神';
  if ($('cert-title')) $('cert-title').textContent = title;

  const now = new Date();
  const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
  if ($('cert-date')) $('cert-date').textContent = dateStr;
}
