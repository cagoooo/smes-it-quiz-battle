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

目前狀態：

- `battle-coder`（程式勇者）— 已核可，`assets/audio/battle-coder.mp3`
- `battle-guardian`／`battle-data`／`battle-creator`／`battle-ai-explorer`／`battle-green-engineer`／`battle-robotics-ace`／`battle-cloud-ranger` — manifest 已預留 `sunoPrompt`，狀態為 `pending`，之後依序在 Suno 生成、下載、算雜湊、改成 `approved` 即可上線，不需要改程式碼。
