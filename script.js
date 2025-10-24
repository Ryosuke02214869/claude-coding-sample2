// ストップウォッチの変数
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let laps = [];
let lapCounter = 0;

// DOM要素の取得
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsContainer = document.getElementById('lapsContainer');
const lapsList = document.getElementById('lapsList');

// 時間をフォーマットする関数
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// ディスプレイを更新する関数
function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    display.textContent = formatTime(elapsedTime);
}

// ラップタイムを追加する関数
function addLap() {
    lapCounter++;
    const lapTime = elapsedTime;
    laps.push({ number: lapCounter, time: lapTime });

    // ラップタイムのリストを更新
    renderLaps();

    // ラップコンテナを表示
    if (laps.length > 0) {
        lapsContainer.classList.add('show');
    }
}

// ラップタイムのリストを表示する関数
function renderLaps() {
    lapsList.innerHTML = '';

    if (laps.length === 0) {
        lapsContainer.classList.remove('show');
        return;
    }

    // 最速と最遅のラップを見つける（2つ以上のラップがある場合）
    let fastestIndex = -1;
    let slowestIndex = -1;

    if (laps.length > 1) {
        let minTime = Infinity;
        let maxTime = -Infinity;

        laps.forEach((lap, index) => {
            if (lap.time < minTime) {
                minTime = lap.time;
                fastestIndex = index;
            }
            if (lap.time > maxTime) {
                maxTime = lap.time;
                slowestIndex = index;
            }
        });
    }

    // ラップタイムを逆順で表示（最新が上）
    [...laps].reverse().forEach((lap, index) => {
        const originalIndex = laps.length - 1 - index;
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';

        // 最速・最遅のクラスを追加
        if (originalIndex === fastestIndex) {
            lapItem.classList.add('fastest');
        }
        if (originalIndex === slowestIndex) {
            lapItem.classList.add('slowest');
        }

        lapItem.innerHTML = `
            <span class="lap-number">ラップ ${lap.number}</span>
            <span class="lap-time">${formatTime(lap.time)}</span>
        `;

        lapsList.appendChild(lapItem);
    });
}

// スタートボタンのイベント
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;

        // ボタンの状態を更新
        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
    }
});

// ストップボタンのイベント
stopBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;

        // ボタンの状態を更新
        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true;
    }
});

// ラップボタンのイベント
lapBtn.addEventListener('click', () => {
    if (isRunning) {
        addLap();
    }
});

// リセットボタンのイベント
resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    display.textContent = '00:00:00.00';

    // ラップタイムをクリア
    laps = [];
    lapCounter = 0;
    renderLaps();

    // ボタンの状態を更新
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
});

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    // エンターキーでスタート/ストップ
    if (e.key === 'Enter') {
        e.preventDefault();
        if (isRunning) {
            // ストップ処理
            stopBtn.click();
        } else {
            // スタート処理
            startBtn.click();
        }
    }

    // スペースキーでラップ記録
    if (e.key === ' ') {
        e.preventDefault();
        if (isRunning) {
            lapBtn.click();
        }
    }

    // バックスペースキーでリセット
    if (e.key === 'Backspace') {
        e.preventDefault();
        resetBtn.click();
    }
});
