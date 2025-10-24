// ストップウォッチの変数
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

// DOM要素の取得
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

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

// スタートボタンのイベント
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;

        // ボタンの状態を更新
        startBtn.disabled = true;
        stopBtn.disabled = false;
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
    }
});

// リセットボタンのイベント
resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    display.textContent = '00:00:00.00';

    // ボタンの状態を更新
    startBtn.disabled = false;
    stopBtn.disabled = true;
});
