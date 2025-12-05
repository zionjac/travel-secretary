# 🌍 旅遊秘書 V8 - GitHub 自動更新版

> 一個功能豐富的 PWA 旅遊助手，內建金融追蹤功能，資料透過 GitHub Actions 每小時自動更新。

## ✨ 功能特色

### 🎯 旅遊功能
- 📅 行程規劃
- 💰 記帳分帳
- 📸 打卡拍照
- 📷 拍立得相機（7種花邊）
- 🏆 成就徽章
- 🎯 旅遊 Bingo
- 🎰 決定輪盤

### 💹 金融追蹤（自動更新）
| 功能 | 資料來源 | 更新頻率 |
|:---|:---|:---|
| 📈 台股報價 | 台灣證券交易所 | 每小時 |
| 💹 匯率換算 | 台灣銀行牌告 | 每小時 |
| 🎱 彩券開獎 | 台灣彩券 | 每小時 |
| 🪙 加密貨幣 | CoinGecko | 每小時 |

## 🚀 部署方式

### 1️⃣ Fork 這個專案

### 2️⃣ 啟用 GitHub Actions
到你的 repo → Settings → Actions → General
- 確認 "Allow all actions" 已勾選
- 確認 "Read and write permissions" 已啟用

### 3️⃣ 啟用 GitHub Pages
到你的 repo → Settings → Pages
- Source 選擇 "Deploy from a branch"
- Branch 選擇 "main" 和 "/ (root)"
- 按 Save

### 4️⃣ 手動觸發第一次更新
到你的 repo → Actions → "更新金融資料"
- 點 "Run workflow"
- 等待完成後，data/ 資料夾會自動更新

### 5️⃣ 完成！
你的網站會在 `https://你的帳號.github.io/你的repo名稱/`

## 📁 檔案結構

```
travel-secretary-v8/
├── index.html              # 主程式
├── data/
│   ├── stocks.json         # 股票資料 (每小時自動更新)
│   ├── exchange.json       # 匯率資料 (每小時自動更新)
│   ├── lottery.json        # 彩券開獎 (每小時自動更新)
│   └── crypto.json         # 加密貨幣 (每小時自動更新)
├── scripts/
│   └── fetch-data.js       # 資料抓取腳本
├── .github/
│   └── workflows/
│       └── update-data.yml # GitHub Actions 設定
└── README.md
```

## ⚙️ GitHub Actions 說明

`update-data.yml` 會：
1. 每小時自動執行（台灣時間整點）
2. 執行 `scripts/fetch-data.js` 抓取最新資料
3. 將更新後的 JSON 檔案 commit 回 repo
4. GitHub Pages 會自動重新部署

### 手動觸發更新
Actions → "更新金融資料" → Run workflow

## 📊 資料格式

### stocks.json
```json
{
  "updateTime": "ISO 時間",
  "updateTimeLocal": "台灣時間",
  "stocks": [
    { "id": "2330", "name": "台積電", "price": 1095, "change": "15.00", "changePercent": "1.39" }
  ]
}
```

### exchange.json
```json
{
  "updateTime": "ISO 時間",
  "baseCurrency": "TWD",
  "rates": {
    "USD": { "code": "USD", "name": "美元", "flag": "🇺🇸", "spotBuy": 31.75, "spotSell": 31.85 }
  }
}
```

### lottery.json
```json
{
  "lotto649": { "name": "大樂透", "numbers": [3, 12, 24, 31, 38, 45], "special": 17 },
  "superLotto": { "name": "威力彩", "firstArea": [5, 11, 19, 27, 32, 38], "secondArea": 6 }
}
```

### crypto.json
```json
{
  "cryptos": [
    { "id": "bitcoin", "symbol": "BTC", "name": "Bitcoin", "icon": "₿", "price": 3150000, "change24h": 2.35 }
  ]
}
```

## 📱 PWA 支援

可以「加到主畫面」當成 App 使用：
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ iPad (含 PWA 相機備用方案)

## 🔧 自訂修改

### 新增追蹤股票
編輯 `scripts/fetch-data.js` 的 `stockList` 陣列

### 修改更新頻率
編輯 `.github/workflows/update-data.yml` 的 cron 設定

```yaml
schedule:
  - cron: '0 * * * *'   # 每小時
  - cron: '*/30 * * * *' # 每 30 分鐘
  - cron: '0 */2 * * *'  # 每 2 小時
```

## 📄 授權

MIT License

---

Made with ❤️ for travelers
