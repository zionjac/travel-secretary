/**
 * 金融資料抓取腳本
 * 用於 GitHub Actions 定時抓取台灣官方金融資料
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// 確保資料夾存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ============================================
// 📈 台灣證交所股票資料
// ============================================
async function fetchStocks() {
    console.log('📈 抓取台股資料...');
    
    // 熱門股票清單 (100 檔)
    const stockList = [
        // 半導體 (6)
        { id: '2330', name: '台積電', market: 'tse', category: '半導體' },
        { id: '2303', name: '聯電', market: 'tse', category: '半導體' },
        { id: '3711', name: '日月光投控', market: 'tse', category: '半導體' },
        { id: '2344', name: '華邦電', market: 'tse', category: '半導體' },
        { id: '3260', name: '威剛', market: 'otc', category: '記憶體' },
        { id: '6770', name: '力積電', market: 'tse', category: '半導體' },
        { id: '5347', name: '世界', market: 'tse', category: '半導體' },
        // IC 設計 (8)
        { id: '2454', name: '聯發科', market: 'tse', category: 'IC設計' },
        { id: '2379', name: '瑞昱', market: 'tse', category: 'IC設計' },
        { id: '3034', name: '聯詠', market: 'tse', category: 'IC設計' },
        { id: '3443', name: '創意', market: 'tse', category: 'IC設計' },
        { id: '5274', name: '信驊', market: 'otc', category: 'IC設計' },
        { id: '6415', name: '矽力-KY', market: 'otc', category: 'IC設計' },
        { id: '3661', name: '世芯-KY', market: 'otc', category: 'IC設計' },
        { id: '6531', name: '愛普', market: 'tse', category: 'IC設計' },
        // 電子代工 (7)
        { id: '2317', name: '鴻海', market: 'tse', category: '電子代工' },
        { id: '2382', name: '廣達', market: 'tse', category: '電子代工' },
        { id: '3231', name: '緯創', market: 'tse', category: '電子代工' },
        { id: '2356', name: '英業達', market: 'tse', category: '電子代工' },
        { id: '2324', name: '仁寶', market: 'tse', category: '電子代工' },
        { id: '2353', name: '宏碁', market: 'tse', category: '電子代工' },
        { id: '4938', name: '和碩', market: 'tse', category: '電子代工' },
        // 電子零件/光學/電腦 (9)
        { id: '2308', name: '台達電', market: 'tse', category: '電子零件' },
        { id: '2327', name: '國巨', market: 'tse', category: '被動元件' },
        { id: '2301', name: '光寶科', market: 'tse', category: '電子' },
        { id: '3008', name: '大立光', market: 'tse', category: '光學' },
        { id: '2357', name: '華碩', market: 'tse', category: '電腦' },
        { id: '2395', name: '研華', market: 'tse', category: '工業電腦' },
        { id: '3017', name: '奇鋐', market: 'tse', category: '散熱' },
        { id: '2345', name: '智邦', market: 'tse', category: '網通' },
        { id: '2474', name: '可成', market: 'tse', category: '機殼' },
        // 伺服器/電源 (4)
        { id: '6669', name: '緯穎', market: 'tse', category: '伺服器' },
        { id: '3706', name: '神達', market: 'tse', category: '伺服器' },
        { id: '6409', name: '旭隼', market: 'tse', category: '電源' },
        { id: '3665', name: '貿聯-KY', market: 'tse', category: '連接器' },
        // PCB (4)
        { id: '3037', name: '欣興', market: 'tse', category: 'PCB' },
        { id: '2368', name: '金像電', market: 'tse', category: 'PCB' },
        { id: '4958', name: '臻鼎-KY', market: 'tse', category: 'PCB' },
        { id: '8046', name: '南電', market: 'tse', category: 'PCB' },
        // 金融股 (12)
        { id: '2881', name: '富邦金', market: 'tse', category: '金融' },
        { id: '2882', name: '國泰金', market: 'tse', category: '金融' },
        { id: '2891', name: '中信金', market: 'tse', category: '金融' },
        { id: '2884', name: '玉山金', market: 'tse', category: '金融' },
        { id: '2886', name: '兆豐金', market: 'tse', category: '金融' },
        { id: '2887', name: '台新金', market: 'tse', category: '金融' },
        { id: '2892', name: '第一金', market: 'tse', category: '金融' },
        { id: '2885', name: '元大金', market: 'tse', category: '金融' },
        { id: '2883', name: '開發金', market: 'tse', category: '金融' },
        { id: '2890', name: '永豐金', market: 'tse', category: '金融' },
        { id: '2880', name: '華南金', market: 'tse', category: '金融' },
        { id: '5880', name: '合庫金', market: 'tse', category: '金融' },
        // 電信 (3)
        { id: '2412', name: '中華電', market: 'tse', category: '電信' },
        { id: '4904', name: '遠傳', market: 'tse', category: '電信' },
        { id: '3045', name: '台灣大', market: 'tse', category: '電信' },
        // 塑化四寶 (4)
        { id: '1301', name: '台塑', market: 'tse', category: '塑化' },
        { id: '1303', name: '南亞', market: 'tse', category: '塑化' },
        { id: '1326', name: '台化', market: 'tse', category: '塑化' },
        { id: '6505', name: '台塑化', market: 'tse', category: '塑化' },
        // 傳產 (12)
        { id: '2002', name: '中鋼', market: 'tse', category: '鋼鐵' },
        { id: '2015', name: '豐興', market: 'tse', category: '鋼鐵' },
        { id: '1402', name: '遠東新', market: 'tse', category: '紡織' },
        { id: '1101', name: '台泥', market: 'tse', category: '水泥' },
        { id: '1102', name: '亞泥', market: 'tse', category: '水泥' },
        { id: '1216', name: '統一', market: 'tse', category: '食品' },
        { id: '2912', name: '統一超', market: 'tse', category: '零售' },
        { id: '1227', name: '佳格', market: 'tse', category: '食品' },
        { id: '1229', name: '聯華', market: 'tse', category: '食品' },
        { id: '2207', name: '和泰車', market: 'tse', category: '汽車' },
        { id: '2201', name: '裕隆', market: 'tse', category: '汽車' },
        { id: '2105', name: '正新', market: 'tse', category: '輪胎' },
        // 航運/航空 (5)
        { id: '2603', name: '長榮', market: 'tse', category: '航運' },
        { id: '2609', name: '陽明', market: 'tse', category: '航運' },
        { id: '2615', name: '萬海', market: 'tse', category: '航運' },
        { id: '2618', name: '長榮航', market: 'tse', category: '航空' },
        { id: '2610', name: '華航', market: 'tse', category: '航空' },
        // 租賃/營建 (4)
        { id: '9941', name: '裕融', market: 'tse', category: '租賃' },
        { id: '5871', name: '中租-KY', market: 'tse', category: '租賃' },
        { id: '9945', name: '潤泰新', market: 'tse', category: '營建' },
        { id: '2542', name: '興富發', market: 'tse', category: '營建' },
        // 電機 (2)
        { id: '1504', name: '東元', market: 'tse', category: '電機' },
        { id: '1503', name: '士電', market: 'tse', category: '電機' },
        // 生技 (4)
        { id: '6446', name: '藥華藥', market: 'tse', category: '生技' },
        { id: '4743', name: '合一', market: 'otc', category: '生技' },
        { id: '6472', name: '保瑞', market: 'otc', category: '生技' },
        { id: '1795', name: '美時', market: 'tse', category: '生技' },
        // ETF (14)
        { id: '0050', name: '元大台灣50', market: 'tse', category: 'ETF' },
        { id: '0056', name: '元大高股息', market: 'tse', category: 'ETF' },
        { id: '00878', name: '國泰永續高股息', market: 'tse', category: 'ETF' },
        { id: '00919', name: '群益台灣精選高息', market: 'tse', category: 'ETF' },
        { id: '00929', name: '復華台灣科技優息', market: 'tse', category: 'ETF' },
        { id: '00940', name: '元大台灣價值高息', market: 'tse', category: 'ETF' },
        { id: '006208', name: '富邦台50', market: 'tse', category: 'ETF' },
        { id: '00713', name: '元大台灣高息低波', market: 'tse', category: 'ETF' },
        { id: '00881', name: '國泰台灣5G+', market: 'tse', category: 'ETF' },
        { id: '00900', name: '富邦特選高股息30', market: 'tse', category: 'ETF' },
        { id: '00679B', name: '元大美債20年', market: 'tse', category: 'ETF' },
        { id: '00687B', name: '國泰20年美債', market: 'tse', category: 'ETF' },
        { id: '00757', name: '統一FANG+', market: 'tse', category: 'ETF' },
        { id: '00830', name: '國泰費城半導體', market: 'tse', category: 'ETF' }
    ];
    
    try {
        // 組合查詢字串
        const tseStocks = stockList.filter(s => s.market === 'tse').map(s => `tse_${s.id}.tw`);
        const otcStocks = stockList.filter(s => s.market === 'otc').map(s => `otc_${s.id}.tw`);
        const queryStr = [...tseStocks, ...otcStocks].join('|');
        
        const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${queryStr}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = await response.json();
        
        if (data && data.msgArray) {
            const stocks = data.msgArray.map(item => {
                const stockInfo = stockList.find(s => s.id === item.c);
                return {
                    id: item.c,
                    name: stockInfo?.name || item.n,
                    category: stockInfo?.category || '其他',
                    price: parseFloat(item.z) || parseFloat(item.y) || 0,
                    change: item.z && item.y ? (parseFloat(item.z) - parseFloat(item.y)).toFixed(2) : '0',
                    changePercent: item.z && item.y ? (((parseFloat(item.z) - parseFloat(item.y)) / parseFloat(item.y)) * 100).toFixed(2) : '0',
                    open: parseFloat(item.o) || 0,
                    high: parseFloat(item.h) || 0,
                    low: parseFloat(item.l) || 0,
                    volume: parseInt(item.v) || 0,
                    time: item.t || ''
                };
            });
            
            const result = {
                updateTime: new Date().toISOString(),
                updateTimeLocal: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                stocks: stocks
            };
            
            fs.writeFileSync(path.join(DATA_DIR, 'stocks.json'), JSON.stringify(result, null, 2));
            console.log(`✅ 股票資料更新完成，共 ${stocks.length} 檔`);
            return result;
        }
    } catch (error) {
        console.error('❌ 股票資料抓取失敗:', error.message);
    }
    
    return null;
}

// ============================================
// 💹 台灣銀行匯率
// ============================================
async function fetchExchangeRates() {
    console.log('💹 抓取台銀匯率...');
    
    try {
        const url = 'https://rate.bot.com.tw/xrt/flcsv/0/day';
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        // 解析 CSV
        const rates = {};
        const currencyNames = {
            'USD': { name: '美元', flag: '🇺🇸' },
            'JPY': { name: '日圓', flag: '🇯🇵' },
            'EUR': { name: '歐元', flag: '🇪🇺' },
            'CNY': { name: '人民幣', flag: '🇨🇳' },
            'HKD': { name: '港幣', flag: '🇭🇰' },
            'GBP': { name: '英鎊', flag: '🇬🇧' },
            'AUD': { name: '澳幣', flag: '🇦🇺' },
            'CAD': { name: '加幣', flag: '🇨🇦' },
            'SGD': { name: '新加坡幣', flag: '🇸🇬' },
            'CHF': { name: '瑞士法郎', flag: '🇨🇭' },
            'KRW': { name: '韓元', flag: '🇰🇷' },
            'THB': { name: '泰銖', flag: '🇹🇭' },
            'VND': { name: '越南盾', flag: '🇻🇳' },
            'MYR': { name: '馬來幣', flag: '🇲🇾' },
            'PHP': { name: '菲律賓乺', flag: '🇵🇭' },
            'IDR': { name: '印尼盾', flag: '🇮🇩' },
            'NZD': { name: '紐西蘭幣', flag: '🇳🇿' },
            'SEK': { name: '瑞典乺', flag: '🇸🇪' },
            'ZAR': { name: '南非幣', flag: '🇿🇦' }
        };
        
        // 跳過標題行，解析資料
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length >= 5) {
                // 台銀 CSV 格式: 幣別, 現金買入, 現金賣出, 即期買入, 即期賣出
                const currencyFull = cols[0].trim();
                
                // 嘗試匹配幣別代碼
                for (const [code, info] of Object.entries(currencyNames)) {
                    if (currencyFull.includes(code) || currencyFull.includes(info.name)) {
                        rates[code] = {
                            code: code,
                            name: info.name,
                            flag: info.flag,
                            cashBuy: parseFloat(cols[1]) || 0,
                            cashSell: parseFloat(cols[2]) || 0,
                            spotBuy: parseFloat(cols[3]) || 0,
                            spotSell: parseFloat(cols[4]) || 0
                        };
                        break;
                    }
                }
            }
        }
        
        // 如果 CSV 解析失敗，使用備用方案
        if (Object.keys(rates).length === 0) {
            console.log('⚠️ CSV 解析失敗，使用備用匯率...');
            // 備用匯率 (大約值)
            const backupRates = {
                'USD': { cashBuy: 31.5, cashSell: 32.2, spotBuy: 31.8, spotSell: 31.9 },
                'JPY': { cashBuy: 0.208, cashSell: 0.218, spotBuy: 0.212, spotSell: 0.215 },
                'EUR': { cashBuy: 33.5, cashSell: 34.8, spotBuy: 34.0, spotSell: 34.3 },
                'CNY': { cashBuy: 4.3, cashSell: 4.5, spotBuy: 4.38, spotSell: 4.42 },
                'HKD': { cashBuy: 3.95, cashSell: 4.15, spotBuy: 4.05, spotSell: 4.1 },
                'GBP': { cashBuy: 39.5, cashSell: 41.5, spotBuy: 40.2, spotSell: 40.6 },
                'AUD': { cashBuy: 20.5, cashSell: 21.5, spotBuy: 20.8, spotSell: 21.1 },
                'KRW': { cashBuy: 0.0225, cashSell: 0.0245, spotBuy: 0.0232, spotSell: 0.0238 },
                'THB': { cashBuy: 0.88, cashSell: 0.98, spotBuy: 0.92, spotSell: 0.95 },
                'VND': { cashBuy: 0.00115, cashSell: 0.00135, spotBuy: 0.00122, spotSell: 0.00128 },
                'SGD': { cashBuy: 23.2, cashSell: 24.2, spotBuy: 23.6, spotSell: 23.9 }
            };
            
            for (const [code, rate] of Object.entries(backupRates)) {
                const info = currencyNames[code];
                if (info) {
                    rates[code] = {
                        code: code,
                        name: info.name,
                        flag: info.flag,
                        ...rate
                    };
                }
            }
        }
        
        const result = {
            updateTime: new Date().toISOString(),
            updateTimeLocal: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            baseCurrency: 'TWD',
            rates: rates
        };
        
        fs.writeFileSync(path.join(DATA_DIR, 'exchange.json'), JSON.stringify(result, null, 2));
        console.log(`✅ 匯率資料更新完成，共 ${Object.keys(rates).length} 種貨幣`);
        return result;
        
    } catch (error) {
        console.error('❌ 匯率資料抓取失敗:', error.message);
    }
    
    return null;
}

// ============================================
// 🎱 台灣彩券開獎號碼
// ============================================
async function fetchLottery() {
    console.log('🎱 更新彩券資訊...');
    
    try {
        // 台灣彩券沒有公開 API，僅提供開獎時間資訊
        const result = {
            updateTime: new Date().toISOString(),
            updateTimeLocal: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            schedule: {
                lotto649: { name: '大樂透', drawDays: '週二、五', drawTime: '20:30' },
                superLotto: { name: '威力彩', drawDays: '週一、四', drawTime: '20:30' },
                daily539: { name: '今彩539', drawDays: '每天', drawTime: '21:00' },
                bingo: { name: '賓果賓果', drawDays: '每天', drawTime: '每5分鐘' }
            },
            officialWebsite: 'https://www.taiwanlottery.com/',
            note: '請至台灣彩券官網查詢最新開獎號碼'
        };
        
        fs.writeFileSync(path.join(DATA_DIR, 'lottery.json'), JSON.stringify(result, null, 2));
        console.log('✅ 彩券資訊更新完成');
        return result;
        
    } catch (error) {
        console.error('❌ 彩券資訊更新失敗:', error.message);
    }
    
    return null;
}

// ============================================
// 🪙 加密貨幣 (CoinGecko)
// ============================================
async function fetchCrypto() {
    console.log('🪙 抓取加密貨幣...');
    
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=twd&ids=bitcoin,ethereum,binancecoin,solana,dogecoin,cardano,ripple,polkadot,avalanche-2,chainlink&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        const icons = {
            'bitcoin': '₿',
            'ethereum': 'Ξ',
            'binancecoin': '🔶',
            'solana': '◎',
            'dogecoin': '🐕',
            'cardano': '₳',
            'ripple': '✕',
            'polkadot': '●',
            'avalanche-2': '🔺',
            'chainlink': '⬡'
        };
        
        const cryptos = data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            icon: icons[coin.id] || '🪙',
            price: coin.current_price,
            priceUsd: coin.current_price / 31.5, // 約略換算
            change24h: coin.price_change_percentage_24h,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            high24h: coin.high_24h,
            low24h: coin.low_24h
        }));
        
        const result = {
            updateTime: new Date().toISOString(),
            updateTimeLocal: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            currency: 'TWD',
            cryptos: cryptos
        };
        
        fs.writeFileSync(path.join(DATA_DIR, 'crypto.json'), JSON.stringify(result, null, 2));
        console.log(`✅ 加密貨幣資料更新完成，共 ${cryptos.length} 種`);
        return result;
        
    } catch (error) {
        console.error('❌ 加密貨幣資料抓取失敗:', error.message);
        
        // 寫入備用資料
        const backupData = {
            updateTime: new Date().toISOString(),
            updateTimeLocal: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            currency: 'TWD',
            cryptos: [
                { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', price: 3150000, change24h: 0 },
                { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', price: 98000, change24h: 0 },
                { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', price: 5800, change24h: 0 },
                { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', price: 12, change24h: 0 }
            ],
            note: '使用備用資料'
        };
        
        fs.writeFileSync(path.join(DATA_DIR, 'crypto.json'), JSON.stringify(backupData, null, 2));
        return backupData;
    }
}

// ============================================
// 🚀 執行所有抓取任務
// ============================================
async function main() {
    console.log('');
    console.log('========================================');
    console.log('🚀 開始抓取金融資料');
    console.log(`⏰ ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
    console.log('========================================');
    console.log('');
    
    await fetchStocks();
    await fetchExchangeRates();
    await fetchLottery();
    await fetchCrypto();
    
    console.log('');
    console.log('========================================');
    console.log('✅ 所有資料抓取完成！');
    console.log('========================================');
}

main().catch(console.error);
