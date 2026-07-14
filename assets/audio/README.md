# Suno 音樂包放置說明

遊戲已內建音樂導演：大廳、對戰、終極技能、勝利與重新挑戰會切換對應音軌。尚未放入經審核的 Suno 音檔時，會安全地改用瀏覽器合成節奏與既有按鍵音效，不會請求不存在的 MP3。

目前已核可並隨專案提供：

- `smes-it-battle.mp3` — Suno v5.5「Pixel Class Clash」，34.224 秒，對戰循環 BGM。
- `smes-it-ultimate.mp3` — Suno v5.5「Quiz Combo Stinger」，9 秒，大絕招三連數位衝擊與馬林巴收尾效果音。
- `smes-it-victory.mp3` — Suno v5.5「Mission Complete Parade」，43.392 秒，任務成功效果音。

## 製作與放置

1. 依 `audio-manifest.json` 的 `sunoPrompt` 在 Suno 製作，選擇 **Instrumental**。
2. 下載老師帳號可用於本遊戲發布的 MP3，並依下列檔名放入本資料夾：
   - `smes-it-lobby.mp3`
   - `smes-it-battle.mp3`
   - `smes-it-ultimate.mp3`
   - `smes-it-victory.mp3`
   - `smes-it-retry.mp3`
3. 以 PowerShell 記錄檔案指紋：`Get-FileHash .\assets\audio\smes-it-battle.mp3 -Algorithm SHA256`
4. 在 `audio-manifest.json` 對應曲目補上 `sha256`，並將 `status` 改為 `approved`。

不要將 Suno 網頁預覽網址直接寫進遊戲；發布版一律使用本資料夾內經審核的 MP3。

## 角色專屬戰鬥音樂

除了共用的 `battle` 場景音軌，遊戲支援每位玩家角色各自的專屬戰鬥 BGM，用 `battle-{角色id}` 當 manifest 的 key（例如 `battle-coder`）。`game.js` 的 `battleSceneKey()` 會優先找選定角色對應的 `battle-{id}` 是否為 `approved` 狀態，沒有的話自動退回共用的 `battle` 音軌，不會出錯或缺音樂。

目前狀態：8 位玩家角色全部已核可上線。

- `battle-coder`（程式勇者）— `assets/audio/battle-coder.mp3`
- `battle-guardian`（網安守護者）— `assets/audio/battle-guardian.mp3`
- `battle-data`（資料魔法師）— `assets/audio/battle-data.mp3`
- `battle-creator`（創意設計師）— `assets/audio/battle-creator.mp3`
- `battle-ai-explorer`（AI 探險家）— `assets/audio/battle-ai-explorer.mp3`
- `battle-green-engineer`（綠能工程師）— `assets/audio/battle-green-engineer.mp3`
- `battle-robotics-ace`（機器人操控師）— `assets/audio/battle-robotics-ace.mp3`
- `battle-cloud-ranger`（雲端航海家）— `assets/audio/battle-cloud-ranger.mp3`

## CPU 敵人專屬戰鬥音樂

CPU 敵人也全部已核可上線，用 `battle-{敵人id}` 當 manifest 的 key。單人闖關時，輪到 CPU 出招時會切到牠的專屬音軌，換回玩家回合時再切回玩家角色的戰鬥音樂（`setTurn()` 內以 `cpuBattleSceneKey()` 判斷）。

- `battle-firewall`（防火牆怪）— `assets/audio/battle-firewall.mp3`
- `battle-noise-beast`（雜訊干擾獸）— `assets/audio/battle-noise-beast.mp3`
- `battle-bug-phantom`（漏洞幻影）— `assets/audio/battle-bug-phantom.mp3`
- `battle-phishing-siren`（釣魚海妖）— `assets/audio/battle-phishing-siren.mp3`
- `battle-cache-golem`（快取石巨人）— `assets/audio/battle-cache-golem.mp3`
- `battle-glitch-dragon`（像素故障龍）— `assets/audio/battle-glitch-dragon.mp3`
- `battle-malware-mimic`（惡意偽裝怪）— `assets/audio/battle-malware-mimic.mp3`
- `battle-bot-swarm`（機器人蜂群）— `assets/audio/battle-bot-swarm.mp3`

## 大絕招專屬音效

除了共用的 `ultimate` 音效，每位玩家角色也有專屬的大絕招 stinger，用 `ultimate-{角色id}` 當 key。`game.js` 的 `ultimateSceneKey()` 會優先找對應角色的專屬音效，沒有的話自動退回共用的 `ultimate` 音效。

- `ultimate-coder`、`ultimate-guardian`、`ultimate-data`、`ultimate-creator`、`ultimate-ai-explorer`、`ultimate-green-engineer`、`ultimate-robotics-ace`、`ultimate-cloud-ranger` — 皆已核可上線。

## 音檔長度正規化

過長的 Suno 生成結果（超過 45 秒）一律用 ffmpeg 裁剪並加 4 秒淡出，統一循環長度，並在 manifest 對應條目記錄 `trimmedFromSeconds` 與 `trimNote` 留存審核紀錄。指令範例：

```
ffmpeg -y -v error -i "input.mp3" -t 45 -af "afade=t=out:st=41:d=4" -codec:a libmp3lame -q:a 2 "output.mp3"
```
