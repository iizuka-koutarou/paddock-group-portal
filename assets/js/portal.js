const state = {
  clockIn: localStorage.getItem("paddock_clock_in") || "",
  clockOut: localStorage.getItem("paddock_clock_out") || "",
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const customerMessages = {
  morning: [
    "今日も笑顔でお客様をお迎えしましょう。",
    "朝一番の明るい挨拶が、お客様の安心につながります。",
    "ご来店いただくお客様に、気持ちの良い一日をお届けしましょう。"
  ],
  noon: [
    "ご来店いただく一人ひとりのお客様との時間を大切にしましょう。",
    "忙しい時間帯こそ、落ち着いたご案内を心掛けましょう。",
    "お客様の小さな不安にも、丁寧に耳を傾けましょう。"
  ],
  evening: [
    "一日の締めくくりまで、丁寧な対応を心掛けましょう。",
    "夕方のご来店にも、変わらない笑顔でお迎えしましょう。",
    "最後のお見送りまで、PADDOCKらしい心配りを大切に。"
  ],
  night: [
    "今日も一日お疲れ様でした。明日も気持ちよくお迎えしましょう。",
    "閉店前も、最後まで丁寧な対応を心掛けましょう。",
    "明日のお客様対応につながる準備を整えておきましょう。"
  ],
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeParts(date = new Date()) {
  return {
    h: pad(date.getHours()),
    m: pad(date.getMinutes()),
    s: pad(date.getSeconds()),
  };
}

function nowTime() {
  const { h, m, s } = getTimeParts();
  return `${h}:${m}:${s}`;
}

function formatDate(date = new Date()) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`;
}

function getTimePeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "noon";
  if (hour >= 17 && hour < 23) return "evening";
  return "night";
}

function getGreeting(period) {
  switch (period) {
    case "morning":
      return "おはようございます。";
    case "noon":
      return "こんにちは。";
    case "evening":
      return "お疲れ様です。";
    default:
      return "遅くまでお疲れ様です。";
  }
}

function getSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}

function getSeasonalMessage(date = new Date()) {
  const period = getTimePeriod(date);
  const season = getSeason(date);
  const baseMessages = customerMessages[period];
  const base = baseMessages[date.getDate() % baseMessages.length];

  const seasonal = {
    spring: "新しい出会いの季節です。第一印象を大切にしましょう。",
    summer: "暑い季節です。冷たいお飲み物のお声掛けを忘れずに。",
    autumn: "ツーリングの話題が増える季節です。お客様との会話を楽しみましょう。",
    winter: "寒い中ご来店いただくお客様へ、温かいおもてなしを心掛けましょう。",
  };

  if (date.getDate() % 2 === 0) return seasonal[season];
  return base;
}

function updateClock() {
  const now = new Date();
  const period = getTimePeriod(now);

  const currentTime = document.getElementById("currentTime");
  const currentDate = document.getElementById("currentDate");
  const greetingText = document.getElementById("greetingText");
  const serviceMessage = document.getElementById("serviceMessage");
  const dailyMessage = document.getElementById("dailyMessage");

  if (currentTime) currentTime.textContent = nowTime();
  if (currentDate) currentDate.textContent = formatDate(now);
  if (greetingText) greetingText.textContent = getGreeting(period);
  if (serviceMessage) serviceMessage.textContent = getSeasonalMessage(now);
  if (dailyMessage) dailyMessage.textContent = getSeasonalMessage(now);

  renderAttendance();
}

function parseDateTime(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatStoredTime(value) {
  const d = parseDateTime(value);
  if (!d) return "--:--:--";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}時間${pad(m)}分${pad(s)}秒`;
}

function setStatusBadge(statusText, className) {
  const status = document.getElementById("workStatus");
  if (!status) return;
  status.textContent = statusText;
  status.className = `status-badge ${className || ""}`.trim();
}

function renderAttendance() {
  const clockInTime = document.getElementById("clockInTime");
  const clockOutTime = document.getElementById("clockOutTime");
  const workDuration = document.getElementById("workDuration");
  const clockInLabel = document.getElementById("clockInLabel");
  const clockOutLabel = document.getElementById("clockOutLabel");
  const workDurationLabel = document.getElementById("workDurationLabel");
  const clockInButton = document.querySelector(".btn-start");
  const clockOutButton = document.querySelector(".btn-end");

  const start = parseDateTime(state.clockIn);
  const end = parseDateTime(state.clockOut);

  if (clockInTime) clockInTime.textContent = start ? formatStoredTime(state.clockIn) : "--:--:--";
  if (clockOutTime) clockOutTime.textContent = end ? formatStoredTime(state.clockOut) : "--:--:--";

  if (clockInLabel) clockInLabel.textContent = start ? "出社済み" : "未打刻";
  if (clockOutLabel) clockOutLabel.textContent = end ? "退勤済み" : "未退勤";

  if (start && end) {
    if (workDuration) workDuration.textContent = formatDuration(end - start);
    if (workDurationLabel) workDurationLabel.textContent = "確定";
    setStatusBadge("退勤済み", "is-done");
    if (clockInButton) clockInButton.disabled = true;
    if (clockOutButton) clockOutButton.disabled = true;
  } else if (start) {
    if (workDuration) workDuration.textContent = formatDuration(new Date() - start);
    if (workDurationLabel) workDurationLabel.textContent = "勤務中";
    setStatusBadge("勤務中", "is-working");
    if (clockInButton) clockInButton.disabled = true;
    if (clockOutButton) clockOutButton.disabled = false;
  } else {
    if (workDuration) workDuration.textContent = "00時間00分00秒";
    if (workDurationLabel) workDurationLabel.textContent = "未確定";
    setStatusBadge("未打刻", "");
    if (clockInButton) clockInButton.disabled = false;
    if (clockOutButton) clockOutButton.disabled = true;
  }
}

function clockIn() {
  if (state.clockIn) return;
  const now = new Date().toISOString();
  state.clockIn = now;
  state.clockOut = "";
  localStorage.setItem("paddock_clock_in", state.clockIn);
  localStorage.removeItem("paddock_clock_out");
  renderAttendance();
}

function clockOut() {
  if (!state.clockIn || state.clockOut) {
    return;
  }
  state.clockOut = new Date().toISOString();
  localStorage.setItem("paddock_clock_out", state.clockOut);
  renderAttendance();
}

function openCorrection() {
  document.getElementById("correctionModal").classList.add("is-open");
}

function closeCorrection() {
  document.getElementById("correctionModal").classList.remove("is-open");
}

function submitCorrection() {
  const value = document.getElementById("correctionValue").value.trim();
  const reason = document.getElementById("correctionReason").value.trim();

  if (!value || !reason) {
    alert("訂正内容と理由を入力してください。");
    return;
  }

  const text = `申請内容：${value} / 理由：${reason}`;
  localStorage.setItem("paddock_correction_request", text);

  const correctionText = document.getElementById("correctionText");
  if (correctionText) correctionText.textContent = text;

  closeCorrection();
  alert("訂正申請を送信しました。管理者画面で確認できます。");
}

function resetDemo() {
  if (!confirm("デモ用データを初期化しますか？")) return;
  localStorage.removeItem("paddock_clock_in");
  localStorage.removeItem("paddock_clock_out");
  localStorage.removeItem("paddock_correction_request");
  state.clockIn = "";
  state.clockOut = "";
  const correctionText = document.getElementById("correctionText");
  if (correctionText) correctionText.textContent = "現在、申請はありません。";
  renderAttendance();
}

function weatherIcon(telop = "") {
  if (telop.includes("雷")) return "⛈";
  if (telop.includes("雨")) return "☔";
  if (telop.includes("雪")) return "☃";
  if (telop.includes("くも") || telop.includes("曇")) return "☁";
  if (telop.includes("晴")) return "☀";
  return "○";
}

function renderWeatherFallback() {
  const days = [
    { date: "6/28", day: "土", telop: "雨" },
    { date: "6/29", day: "日", telop: "くもり" },
    { date: "6/30", day: "月", telop: "晴れ" },
    { date: "7/1", day: "火", telop: "くもり" },
    { date: "7/2", day: "水", telop: "雨" },
    { date: "7/3", day: "木", telop: "晴れ" },
    { date: "7/4", day: "金", telop: "くもり" },
  ];
  renderWeatherDays(days);
  const updated = document.getElementById("weatherUpdated");
  if (updated) updated.textContent = "天気情報を取得できない場合はサンプル表示になります。";
}

function renderWeatherDays(days) {
  const wrap = document.getElementById("weeklyWeather");
  if (!wrap) return;
  wrap.innerHTML = days.slice(0, 7).map((item) => `
    <div class="weather-day">
      <time>${item.date}<br>（${item.day}）</time>
      <span class="weather-icon">${weatherIcon(item.telop)}</span>
      <span class="weather-telop">${item.telop}</span>
      ${item.temp ? `<small>${item.temp}</small>` : ""}
    </div>
  `).join("");
}

async function loadJmaWeather() {
  const updated = document.getElementById("weatherUpdated");

  try {
    const response = await fetch("https://www.jma.go.jp/bosai/forecast/data/forecast/220000.json", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("weather fetch failed");

    const data = await response.json();
    const areaSeries = data?.[0]?.timeSeries?.[0];
    const timeDefines = areaSeries?.timeDefines || [];
    const shizuokaArea = areaSeries?.areas?.find((area) => area.area?.name?.includes("中部")) || areaSeries?.areas?.[0];
    const weatherCodes = shizuokaArea?.weatherCodes || [];
    const weatherText = shizuokaArea?.weathers || [];

    const days = timeDefines.map((time, index) => {
      const date = new Date(time);
      const telop = weatherText[index] || codeToTelop(weatherCodes[index]) || "情報確認";
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        day: WEEKDAYS[date.getDay()],
        telop,
      };
    });

    if (days.length) {
      renderWeatherDays(days);
      if (updated) updated.textContent = `更新日時：${formatDate(new Date())} ${nowTime()} / 気象庁データ`;
    } else {
      renderWeatherFallback();
    }
  } catch (error) {
    renderWeatherFallback();
  }
}

function codeToTelop(code) {
  const map = {
    "100": "晴れ",
    "101": "晴れ時々くもり",
    "110": "晴れのちくもり",
    "200": "くもり",
    "201": "くもり時々晴れ",
    "210": "くもりのち晴れ",
    "300": "雨",
    "301": "雨時々晴れ",
    "302": "雨時々止む",
    "400": "雪",
  };
  return map[String(code)] || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCorrection = localStorage.getItem("paddock_correction_request");
  if (savedCorrection) {
    const correctionText = document.getElementById("correctionText");
    if (correctionText) correctionText.textContent = savedCorrection;
  }

  updateClock();
  setInterval(updateClock, 1000);
  loadJmaWeather();
});
